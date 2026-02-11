"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    router.push("/");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    if (mode === "signin") {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
      } else {
        router.push("/");
      }
    } else {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
      } else {
        setMessage("Check your email to confirm your account.");
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-zinc-100">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting
            ? "..."
            : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-400">
        {mode === "signin" ? (
          <>
            Need an account?{" "}
            <button
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
              className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
