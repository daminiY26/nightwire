import { randomUUID } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import type { SignalCard, SourceTrailEntry, Watch } from "@nightwire/types";
import { callBitgetSignalTool, listBitgetSignalTools } from "../mcp/bitget-signal-client.js";
import { EMIT_SIGNAL_CARD_TOOL, type EmitSignalCardInput } from "./tools.js";

const MODEL = "claude-sonnet-5";
const MAX_TURNS = 8;

const SYSTEM_PROMPT = `You are the research engine behind Nightwire, an AI trading desk. A trader has \
asked a research question that implies a thesis. Your job: use the available research tools to \
check whether current information supports or contradicts that thesis, then call \
emit_signal_card exactly once to report what you found.

Rules:
- Call at least one research tool before emit_signal_card, unless every available tool call fails.
- Never state something as evidence unless a tool call actually returned it in this conversation.
- If tools disagree, say so plainly in gapSummary rather than picking a side — the disagreement is often the finding.
- If nothing useful comes back from any tool, still call emit_signal_card: confidence "low", and say so in gapSummary. Do not fabricate a confident answer to avoid an unsatisfying one.`;

interface ToolCallLogEntry {
  toolName: string;
  calledAt: string;
}

function toAnthropicTool(mcpTool: { name: string; description: string; inputSchema: unknown }): Anthropic.Tool {
  return {
    name: mcpTool.name,
    description: mcpTool.description,
    // MCP's inputSchema is already JSON Schema shaped like Anthropic expects;
    // it comes through as `unknown` because the MCP SDK doesn't type it
    // more strictly than that either. Cast, don't reshape.
    input_schema: mcpTool.inputSchema as Anthropic.Tool.InputSchema,
  };
}

/**
 * Matches an emitted sourceTrail entry's claimed toolName against tools we
 * actually called this run. Returns null if there's no match — meaning the
 * model cited a tool it never invoked. Callers must drop entries that come
 * back null rather than trusting the model's say-so; see runResearchAgent.
 */
function findActualCall(toolName: string, log: ToolCallLogEntry[]): ToolCallLogEntry | null {
  const matches = log.filter((entry) => entry.toolName.toLowerCase() === toolName.toLowerCase());
  return matches.at(-1) ?? null;
}

export async function runResearchAgent(
  question: string
): Promise<{ watch: Watch; signalCards: SignalCard[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set — see apps/api/.env.example.");
  }

  const anthropic = new Anthropic({ apiKey });
  const mcpTools = await listBitgetSignalTools();
  const tools: Anthropic.Tool[] = [...mcpTools.map(toAnthropicTool), EMIT_SIGNAL_CARD_TOOL];

  const toolCallLog: ToolCallLogEntry[] = [];
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  let emitted: EmitSignalCardInput | null = null;

  for (let turn = 0; turn < MAX_TURNS && !emitted; turn++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1536,
      system: SYSTEM_PROMPT,
      messages,
      tools,
    });

    if (response.stop_reason !== "tool_use") {
      // Model stopped without calling emit_signal_card — nudge once more
      // rather than failing outright; the loop's turn cap still bounds this.
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: "Call emit_signal_card now with what you've found so far.",
      });
      continue;
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;

      if (block.name === "emit_signal_card") {
        emitted = block.input as EmitSignalCardInput;
        continue;
      }

      const calledAt = new Date().toISOString();
      try {
        const resultText = await callBitgetSignalTool(
          block.name,
          block.input as Record<string, unknown>
        );
        toolCallLog.push({ toolName: block.name, calledAt });
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: resultText });
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: err instanceof Error ? err.message : String(err),
          is_error: true,
        });
      }
    }

    if (emitted) break;

    messages.push({ role: "user", content: toolResults });
  }

  if (!emitted) {
    throw new Error(
      `Research agent did not converge within ${MAX_TURNS} turns for question: "${question}"`
    );
  }

  // Anti-fabrication check: drop any cited source whose toolName doesn't
  // match a tool we actually called this run.
  const sourceTrail: SourceTrailEntry[] = [];
  let droppedUncorroborated = 0;

  for (const entry of emitted.sourceTrail) {
    const actualCall = findActualCall(entry.toolName, toolCallLog);
    if (!actualCall) {
      droppedUncorroborated++;
      console.warn(
        `Dropping sourceTrail entry citing "${entry.toolName}" — no matching tool call this run.`
      );
      continue;
    }

    sourceTrail.push({
      id: randomUUID(),
      source: "live",
      toolName: entry.toolName,
      timestamp: actualCall.calledAt,
      summary: entry.summary,
      supportsThesis: entry.supportsThesis,
    });
  }

  const now = new Date().toISOString();
  const watch: Watch = {
    id: randomUUID(),
    label: question.length > 60 ? `${question.slice(0, 57)}...` : question,
    thesisQuestion: question,
    createdAt: now,
  };

  const allEvidenceUncorroborated = emitted.sourceTrail.length > 0 && sourceTrail.length === 0;

  const signalCard: SignalCard = {
    id: randomUUID(),
    watchId: watch.id,
    headline: emitted.headline,
    gapSummary: allEvidenceUncorroborated
      ? `${emitted.gapSummary} (Note: the model cited ${droppedUncorroborated} source(s) that don't match any tool actually called this run — dropped, confidence lowered.)`
      : emitted.gapSummary,
    confidence: allEvidenceUncorroborated ? "low" : emitted.confidence,
    sourceTrail,
    createdAt: now,
    updatedAt: now,
  };

  return { watch, signalCards: [signalCard] };
}
