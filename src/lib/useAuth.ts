"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";
import { getUserByToken } from "./supabaseAdmin";
import { getAuthCookie, removeAuthCookie } from "./cookies";

export function useAuth({ redirectTo }: { redirectTo?: string } = {}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        
        const token = getAuthCookie();
        
        if (token) {
          const { success, data } = await getUserByToken(token);
          
          if (success && data?.user) {
            setUser(data.user);
            return;
          } else {
            removeAuthCookie();
          }
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("session", session);
          setUser(session.user);
          return;
        }
        
        // If no valid authentication, redirect
        if (redirectTo) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Auth error:", error);
        removeAuthCookie();
        
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          removeAuthCookie();
          setUser(null);
          if (redirectTo) {
            router.push(redirectTo);
          }
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [redirectTo, router]);

  return { user, loading };
} 