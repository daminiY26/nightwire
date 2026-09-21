import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Separator } from "@nightwire/ui";
import { Logo } from "./logo";

/**
 * The dashboard + chat shell approved in the Session 1 design checkpoint.
 * This is structural only — no signal-card data, no chat wiring. Those are
 * Session 2's job (Information Extraction & Signal Generation). Everything
 * here is a real, working empty state, not a fake filled-in demo screen —
 * see docs/design/preview.html for what the filled state is designed to
 * look like once that data exists.
 */
export function DeskShell({ userEmail }: { userEmail: string }) {
  return (
    <div className="grid h-screen grid-cols-[220px_1fr_320px] bg-dusk-ledger text-paper-fog">
      {/* Desk log rail */}
      <aside className="flex flex-col border-r border-slate-wire p-4">
        <Logo className="mb-6 h-6 w-auto text-paper-fog" />
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-paper-fog/50">
          Desk log
        </p>
        <div className="flex flex-1 flex-col items-start gap-2">
          <p className="text-sm text-paper-fog/60">
            No watches yet. Research calls you save will show up here.
          </p>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-2 text-xs text-paper-fog/60">
          <span className="truncate">{userEmail}</span>
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Center ledger */}
      <main className="flex flex-col overflow-y-auto p-6">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-wide text-paper-fog/50">
            Active thesis
          </p>
          <h1 className="font-display text-2xl italic text-paper-fog/90">
            Ask the desk a research question to open one.
          </h1>
        </div>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No signals on the ledger yet</CardTitle>
            <CardDescription>
              Signal cards — the gap detected, the confidence, and the source trail behind
              it — render here once news-briefing and macro-analyst are wired up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Session 2 wires this up</Badge>
          </CardContent>
        </Card>
      </main>

      {/* Chat / LUI panel */}
      <aside className="flex flex-col border-l border-slate-wire p-4">
        <p className="mb-4 font-mono text-xs uppercase tracking-wide text-paper-fog/50">
          Chat
        </p>
        <div className="flex flex-1 flex-col justify-end gap-3">
          <p className="text-sm text-paper-fog/60">
            The LUI connects here in Session 2 — this panel is structural only for now.
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Input placeholder="Ask a research question…" disabled />
          <Button disabled>Send</Button>
        </div>
      </aside>
    </div>
  );
}
