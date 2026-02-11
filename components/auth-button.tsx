"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "./auth-provider";

export function AuthButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400 hidden sm:inline">{user.email}</span>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </Link>
  );
}
