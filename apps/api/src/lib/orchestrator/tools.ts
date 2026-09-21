import type Anthropic from "@anthropic-ai/sdk";

/**
 * Not an MCP tool — this one is local to our orchestration loop. It's how
 * we get a structured SignalCard back out of Claude instead of parsing
 * free text. The system prompt (see research-agent.ts) instructs the model
 * to call this exactly once, after using whatever bitget-signal tools it
 * needs.
 */
export const EMIT_SIGNAL_CARD_TOOL: Anthropic.Tool = {
  name: "emit_signal_card",
  description:
    "Report your final research finding. Call this exactly once, after gathering evidence " +
    "from the available research tools (or after confirming none of them returned anything " +
    "usable). Every sourceTrail entry's toolName must be the literal name of a tool you " +
    "actually called in this conversation — never invent one.",
  input_schema: {
    type: "object",
    properties: {
      headline: {
        type: "string",
        description: "Short headline naming the gap or finding (one sentence).",
      },
      gapSummary: {
        type: "string",
        description:
          "1-3 sentences on the gap between the research question's implied thesis and the evidence you found.",
      },
      confidence: {
        type: "string",
        enum: ["low", "medium", "high"],
        description:
          "low if evidence was thin or contradictory, high if multiple tools agree clearly.",
      },
      sourceTrail: {
        type: "array",
        items: {
          type: "object",
          properties: {
            toolName: {
              type: "string",
              description: "The literal name of the tool call that produced this evidence.",
            },
            summary: {
              type: "string",
              description: "One sentence describing what this specific piece of evidence showed.",
            },
            supportsThesis: {
              type: "boolean",
              description:
                "true if this evidence supports the question's implied thesis, false if it cuts against it.",
            },
          },
          required: ["toolName", "summary", "supportsThesis"],
        },
      },
    },
    required: ["headline", "gapSummary", "confidence", "sourceTrail"],
  },
};

export interface EmitSignalCardInput {
  headline: string;
  gapSummary: string;
  confidence: "low" | "medium" | "high";
  sourceTrail: Array<{
    toolName: string;
    summary: string;
    supportsThesis: boolean;
  }>;
}
