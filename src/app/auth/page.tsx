"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signUpUser, signInUser, getUserByToken } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { setAuthCookie, getAuthCookie } from "@/lib/cookies";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      // Check if we have a token in cookies
      const token = getAuthCookie();
      
      console.log("token", token);
      
      if (token) {
        try {
          // Verify that we can actually get the user data
          const { success, data } = await getUserByToken(token);
          
          if (success && data?.user) {
            console.log("user", data.user);
            router.push("/dashboard");
            return;
          }
          // We'll continue to check the session below

          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            console.log("session", session);
            router.push("/dashboard");
            return;
          }
        } catch (error) {
          console.error("Error verifying user token:", error);
          // If error occurred, we'll continue to check the session below
        }
      }
      
    };

    checkSession();
  }, [router]);

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
      });
    } catch (error: any) {
      toast({
        title: error.message,
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

      if (response.accessToken) {
        // Store the access token in cookies
        setAuthCookie(response.accessToken);
      }

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 bg-card/50 backdrop-blur-sm hover:bg-primary/5 transition-colors">
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md p-8 bg-card text-card-foreground">
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
                className="h-10 bg-input text-foreground"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-input text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSignIn}
              disabled={loading || !email || !password}
            >
              Sign In
            </Button>
            <Button
              className="w-full h-10 border-primary hover:bg-accent hover:text-accent-foreground"
              variant="outline"
              onClick={handleSignUp}
              disabled={loading || !email || !password}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
