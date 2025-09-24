"use client";

import type React from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect URL from search params, default to dashboard
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Redirect to the intended page or dashboard
      router.push(redirectTo);
      router.refresh(); // Refresh to update the auth state
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-600">
              Enter your email below to sign in to your account
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-normal">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 pb-2 focus:border-gray-600 focus:ring-0 shadow-none"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-normal">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 pb-2 focus:border-gray-600 focus:ring-0 shadow-none"
                  required
                />
              </div>
            </div>

            <div className="text-left">
              <Link
                href="/auth/forgot-password"
                className="text-gray-600 hover:text-gray-800 text-sm underline"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#D3F36B] hover:bg-lime-300 text-gray-900 font-medium py-3 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link
              href="/auth/sign-up"
              className="text-gray-900 underline hover:text-gray-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Brand/Logo */}
      <div className="flex-1 bg-[#D3F36B] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            {/* Logo image */}
            <Image
              src="/brand/hero-logo.png"
              alt="Crumbly"
              width={400}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
