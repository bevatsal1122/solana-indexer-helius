"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signUpUser, signInUser } from "@/lib/supabaseAdmin";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signUpUser(email, password);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast({
        title: "Account created successfully, you can now sign in.",
        theme: "light",
      });
    } catch (error: any) {
      toast({
        title: error.message,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signInUser(email, password);

      if (!response.success) {
        throw new Error(response.error);
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.log("at frontend", error);
      toast({
        title: error.message,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          Solana Indexer | By bevatsal1122
        </h2>
        <form className="space-y-4">
          <div className="mb-10 space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full h-10"
              onClick={handleSignIn}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              className="w-full h-10"
              variant="outline"
              onClick={handleSignUp}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
