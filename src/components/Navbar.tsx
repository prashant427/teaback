"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import type { User } from "next-auth";
import { LayoutDashboard, LogOut } from "lucide-react";

import Brand from "@/components/Brand";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user as User | undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Brand href="/" />

        <nav className="flex items-center gap-1.5 sm:gap-2">
          {status === "loading" ? (
            <div
              className="h-8 w-28 animate-pulse rounded-md bg-muted"
              aria-hidden
            />
          ) : session ? (
            <>
              <span className="mr-1 hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 sm:inline-flex">
                <span className="size-1.5 rounded-full bg-foreground" />
                <span className="max-w-32 truncate font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  @{user?.username || "guest"}
                </span>
              </span>

              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
