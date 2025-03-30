"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, FileText, Award, Mail } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface JobMetrics {
  running_jobs_count: number;
  total_entries_processed: number;
  max_entries_job: {
    id: number;
    name: string;
    entries_processed: number;
    type?: string;
  } | null;
  recent_jobs_count: number;
}

// Animation component for numbers
function AnimatedCounter({ value, isLoading }: { value: number, isLoading: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading || value === undefined || value === null) return;
    
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    const startValue = 0;
    const endValue = value;
    const duration = 2000; // 2 seconds
    const frameDuration = 20; // 50 fps
    const totalFrames = duration / frameDuration;
    let currentFrame = 0;

    // Animation step function
    const animate = () => {
      currentFrame++;
      // Easing function for smooth animation
      const progress = currentFrame / totalFrames;
      const currentValue = Math.round(startValue + (endValue - startValue) * progress);
      
      setDisplayValue(currentValue);
      
      if (currentFrame < totalFrames) {
        animationRef.current = setTimeout(animate, frameDuration);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [value, isLoading]);

  return isLoading ? "..." : displayValue.toLocaleString();
}

export default function StatsPage() {
  const { user, loading } = useAuth({ redirectTo: "/auth" });
  const [metrics, setMetrics] = useState<JobMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          setError("Authentication error: Could not retrieve session");
          setIsLoading(false);
          return;
        }
        
        const accessToken = session.access_token;
        console.log("Got access token from session");
        
        console.log("Fetching metrics from /api/stats");
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch metrics: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Metrics data:", data);
        setMetrics(data);
      } catch (err: unknown) {
        console.error('Error fetching metrics:', err);
        setError(`Failed to load dashboard metrics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }

    if (!loading) {
      console.log("Fetching metrics...");
      fetchMetrics();
    }
  }, [loading]);

  return (
    <div className="flex gap-8 min-h-screen bg-background">
      <div className="w-[250px] shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-12">
        <Breadcrumb className="">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

          {error && (
            <div className="text-center py-8 text-red-500">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Live Jobs */}
            <Card className="border border-border shadow-sm bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">Live Jobs</CardTitle>
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">
                  <AnimatedCounter value={metrics?.running_jobs_count || 0} isLoading={isLoading} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Active jobs in the system
                </p>
              </CardContent>
            </Card>

            {/* Recent Jobs */}
            <Card className="border border-border shadow-sm bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  Recent Jobs
                </CardTitle>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">
                  <AnimatedCounter value={metrics?.recent_jobs_count || 0} isLoading={isLoading} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Created in the last 30 days
                </p>
              </CardContent>
            </Card>

            {/* Entries Processed */}
            <Card className="border border-border shadow-sm bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  Entries Processed
                </CardTitle>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">
                  <AnimatedCounter 
                    value={metrics?.total_entries_processed !== undefined && 
                           metrics?.total_entries_processed !== null ? 
                           metrics.total_entries_processed : 0} 
                    isLoading={isLoading} 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total entries processed by running jobs
                </p>
              </CardContent>
            </Card>

            {/* Top Job */}
            <Card className="border border-border shadow-sm bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">Top Job</CardTitle>
                <Award className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">
                  {isLoading ? "..." : metrics?.max_entries_job?.name || "No jobs yet"}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {metrics?.max_entries_job ? 
                    <span>Processed <AnimatedCounter value={metrics.max_entries_job.entries_processed} isLoading={isLoading} /> entries</span> : 
                    "Create your first job to see stats"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-6 mb-10">
            <Link href="/dashboard/myjobs" className="flex-1 w-full">
              <Button className="w-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Briefcase className="mr-3 h-5 w-5" />
                My Jobs
              </Button>
            </Link>
            <Link href="/dashboard/create" className="flex-1 w-full">
              <Button className="w-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-3 h-5 w-5" />
                Create Job
              </Button>
            </Link>
            <Link href="/dashboard/logs" className="flex-1 w-full">
              <Button className="w-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <FileText className="mr-3 h-5 w-5" />
                Job Logs
              </Button>
            </Link>
          </div>

          {/* Contact Developer */}
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="flex items-center border shadow-sm px-6 py-5 text-lg"
            >
              <Mail className="mr-3 h-5 w-5" />
              Contact the Developer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
