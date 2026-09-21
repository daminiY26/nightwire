"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@nightwire/ui";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <Logo className="mb-2 h-7 w-auto text-paper-fog" />
          <CardTitle>Check your inbox</CardTitle>
          <CardDescription>
            Confirm {email} to open your desk. Depends on your Supabase project&apos;s
            email settings — see .env.example.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Logo className="mb-2 h-7 w-auto text-paper-fog" />
        <CardTitle>Set up your desk</CardTitle>
        <CardDescription>One account, one research workbench.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="you@desk.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-sm text-wire-red">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-paper-fog/60">
          Already have a desk?{" "}
          <Link href="/sign-in" className="text-lamp-amber hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
