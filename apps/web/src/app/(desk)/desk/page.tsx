import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeskShell } from "@/components/desk-shell";

export default async function DeskPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DeskShell userEmail={user.email ?? "unknown"} />;
}
