"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, X, LogOut, Activity, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
          "fixed left-0 top-0 z-40 h-full w-72 bg-background border-r transition-transform duration-200 ease-in-out shadow-lg",
          !isOpen && "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="space-y-6 flex-1">
            <h2 className="text-2xl font-bold mb-8 text-primary">Dashboard</h2>

            {/* Add Indexer Button */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02]"
                size="lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                My Indexers
              </Button>
            </div>

            {/* Add Indexer Button */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02]"
                size="lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Indexer
              </Button>
            </div>

            {/* Indexer Logs */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:scale-[1.02]"
                size="lg"
              >
                <FileText className="mr-3 h-5 w-5" />
                Indexer Logs
              </Button>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-destructive/5 hover:to-destructive/10 hover:scale-[1.02]"
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
}
