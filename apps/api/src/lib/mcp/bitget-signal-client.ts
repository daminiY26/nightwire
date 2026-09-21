import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * Connects to Bitget's public bitget-signal MCP server.
 *
 * IMPORTANT — read before touching this file: `bitget-signal` (the 5
 * research skills: macro-analyst, market-intel, news-briefing,
 * sentiment-analyst, technical-analysis) is a DIFFERENT MCP server from
 * `bitget-mcp-server` (Bitget Agent Hub's trading tools). The trading
 * server runs locally via stdio and needs account auth. bitget-signal is
 * described by Bitget/glama.ai as "backed by Bitget's official public MCP
 * data service" and installed via `npx @bitget-ai/bitget-signal --target
 * <tool>`, which registers it as an HTTP-transport server — no account, no
 * API key. Session 2's report incorrectly assumed bitget-signal itself was
 * stdio-only; that was conflating the two servers. Corrected here.
 *
 * What's still unverified: the exact HTTP endpoint URL. Bitget's installer
 * writes it into the target tool's MCP config (e.g. Claude Code's config)
 * at install time rather than publishing it as a static doc URL, and nothing
 * reachable by search in this session's research surfaced the literal URL.
 * To get it: run `npx @bitget-ai/bitget-signal --target claude` (or
 * --target codex) once on a machine with network access, then read the
 * registered server URL back out of that tool's MCP config file, and put
 * it in BITGET_SIGNAL_MCP_URL. This module refuses to guess a URL.
 */

let cachedClient: Client | null = null;

export async function getBitgetSignalClient(): Promise<Client> {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.BITGET_SIGNAL_MCP_URL;
  if (!url) {
    throw new Error(
      "BITGET_SIGNAL_MCP_URL is not set. Run `npx @bitget-ai/bitget-signal --target claude` " +
        "once on a machine with network access, copy the server URL it registers, and set it " +
        "as BITGET_SIGNAL_MCP_URL — see apps/api/.env.example."
    );
  }

  const client = new Client({ name: "nightwire-api", version: "0.1.0" });
  const transport = new StreamableHTTPClientTransport(new URL(url));

  await client.connect(transport);
  cachedClient = client;
  return client;
}

export interface McpToolSummary {
  name: string;
  description: string;
  inputSchema: unknown;
}

export async function listBitgetSignalTools(): Promise<McpToolSummary[]> {
  const client = await getBitgetSignalClient();
  const { tools } = await client.listTools();

  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? "",
    inputSchema: tool.inputSchema,
  }));
}

/**
 * Calls one bitget-signal tool and flattens its result to plain text.
 * Throws on tool error rather than swallowing it — the orchestrator decides
 * how to present a failed tool call to the model, this function shouldn't.
 */
export async function callBitgetSignalTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  const client = await getBitgetSignalClient();
  const result = await client.callTool({ name, arguments: args });

  const content = Array.isArray(result.content) ? result.content : [];
  const text = content
    .map((block) => ("text" in block ? block.text : JSON.stringify(block)))
    .join("\n");

  if (result.isError) {
    throw new Error(`bitget-signal tool "${name}" returned an error: ${text}`);
  }

  return text;
}
