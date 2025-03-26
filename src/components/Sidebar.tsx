"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, X, LogOut, Activity, Plus, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/supabaseAdmin";
import { toast } from "sonner";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    const { success, error } = await signOutUser();
    if (success) {
      router.push("/");
    } else {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MenuIcon />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 bg-background/95 backdrop-blur-sm border-r transition-all duration-300 ease-in-out shadow-lg",
          !isOpen && "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="space-y-8 flex-1">
            {/* Header with logo/brand */}
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Solana Indexer</h2>
            </div>

            {/* Navigation Section */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground px-3 mb-2">
                MAIN MENU
              </p>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02] group"
                size="lg"
              >
                  <Activity className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                  My Indexers
                </Button>
              </Link>

              <Link href="/dashboard/create">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02] group"
                  size="lg"
              >
                <Plus className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                Add Indexer
              </Button>
              </Link>

              <Link href="/dashboard/indexer-logs">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02] group"
                  size="lg"
              >
                <FileText className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                  Indexer Logs
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer with logout */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-destructive/5 hover:to-destructive/10 hover:scale-[1.02] group"
              size="lg"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:text-destructive transition-colors" />
              <span className="group-hover:text-destructive transition-colors">Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
