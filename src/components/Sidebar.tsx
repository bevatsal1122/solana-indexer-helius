"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, X, LogOut, Activity, Plus, FileText, LayoutDashboard, Database } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOutUser } from "@/lib/supabase";
import { toast } from "sonner";
import { removeAuthCookie } from "@/lib/cookies";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Remove the auth cookie first
      removeAuthCookie();
      
      // Then sign out from Supabase
      const { success, error } = await signOutUser();
      
      if (success) {
        // Force a hard refresh to clear any cached state
        window.location.href = "/";
      } else {
        console.error(error);
        toast.error(error || "Failed to sign out");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
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
          "fixed left-0 top-0 z-40 h-full w-66 bg-sidebar border-sidebar-border transition-all duration-300 ease-in-out shadow-lg",
          !isOpen && "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full p-6 pl-4">
          <div className="space-y-16 flex-1">
            {/* Header with logo/brand */}
            <div className="flex items-center space-x-3 mt-6">
              <Activity className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-primary">
                Solana Indexer
              </h2>
            </div>

            {/* Navigation Section */}
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard" className="w-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.05] group",
                    pathname === "/dashboard" && "bg-gradient-to-r from-primary/5 to-primary/10 scale-[1.02]"
                  )}
                  size="lg"
                >
                  <LayoutDashboard className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/myjobs">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.05] group",
                    pathname === "/dashboard/myjobs" && "bg-gradient-to-r from-primary/5 to-primary/10 scale-[1.02]"
                  )}
                  size="lg"
                >
                  <Database className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                  My Indexer Jobs
                </Button>
              </Link>

              <Link href="/dashboard/create">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.05] group",
                    pathname === "/dashboard/create" && "bg-gradient-to-r from-primary/5 to-primary/10 scale-[1.02]"
                  )}
                  size="lg"
                >
                  <Plus className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                  Create New Job
                </Button>
              </Link>

              <Link href="/dashboard/logs">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.05] group",
                    pathname === "/dashboard/logs" && "bg-gradient-to-r from-primary/5 to-primary/10 scale-[1.02]"
                  )}
                  size="lg"
                >
                  <FileText className="mr-3 h-5 w-5 group-hover:text-primary transition-colors"/>
                  My Job Logs
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-destructive/5 hover:to-destructive/10 hover:scale-[1.05] group"
                size="lg"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5 group-hover:text-destructive transition-colors" />
                <span className="group-hover:text-destructive transition-colors">
                  Log Out
                </span>
              </Button>
            </div>
          </div>

          {/* <div className="pt-4 border-t border-sidebar-border">
            <span className="text-md text-sidebar-foreground font-semibold">
              Developed by bevatsal1122
            </span>
          </div> */}
        </div>
      </div>
    </>
  );
}
