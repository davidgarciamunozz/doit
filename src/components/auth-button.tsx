"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { useAuthContext } from "./auth-provider";

export function AuthButton() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return user ? (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"default"}>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"doit_green"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
