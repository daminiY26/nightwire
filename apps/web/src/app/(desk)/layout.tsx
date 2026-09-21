import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware.ts already redirects unauthenticated
  // requests, but a layout-level check keeps this route group correct even
  // if the middleware matcher is ever narrowed in a later session.
  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
