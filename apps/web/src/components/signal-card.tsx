import type { SignalCard, SourceTrailEntry } from "@nightwire/types";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nightwire/ui";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  "news-briefing": "news-briefing",
  "macro-analyst": "macro-analyst",
  finnhub: "finnhub",
  manual: "manual",
  fixture: "fixture",
};

/**
 * "live" entries carry the real MCP tool name in toolName rather than a
 * fixed SourceKind, since the exact tool names bitget-signal exposes
 * weren't independently confirmed at build time (see SESSION_REPORT.md,
 * Session 3). Falls back to the coarse label for everything else.
 */
function sourceLabel(entry: SourceTrailEntry): string {
  if (entry.source === "live" && entry.toolName) {
    return entry.toolName;
  }
  return SOURCE_LABEL[entry.source] ?? entry.source;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function SignalCardView({ card }: { card: SignalCard }) {
  const verifiedCount = card.sourceTrail.filter((e) => e.supportsThesis).length;
  const againstCount = card.sourceTrail.filter((e) => !e.supportsThesis).length;
  const isFixture = card.sourceTrail.every((e) => e.source === "fixture");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{card.headline}</CardTitle>
        <CardDescription>{card.gapSummary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <Badge>Gap detected</Badge>
          {verifiedCount > 0 && <Badge variant="verified">{verifiedCount} verified</Badge>}
          {againstCount > 0 && <Badge variant="contradicting">{againstCount} against thesis</Badge>}
          {isFixture && (
            <Badge variant="outline" title="Session 2 fixture data — not a live source yet">
              fixture data
            </Badge>
          )}
        </div>

        <div className="border-t border-dashed border-slate-wire pt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-paper-fog/40">
            Source trail
          </p>
          <ul className="flex flex-col gap-1.5">
            {card.sourceTrail.map((entry) => (
              <li key={entry.id} className="flex gap-2.5 font-mono text-xs">
                <span className="shrink-0 text-paper-fog/40">{formatTime(entry.timestamp)}</span>
                <span
                  className={cn(
                    "shrink-0",
                    entry.supportsThesis ? "text-ledger-teal" : "text-wire-red"
                  )}
                >
                  {sourceLabel(entry)}
                </span>
                <span className="text-paper-fog/80">{entry.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
