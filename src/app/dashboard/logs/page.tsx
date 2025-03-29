"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type Job = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  type: string;
  created_at: string;
  db_host: string;
  db_name: string;
};

type LogEntry = {
  id: number;
  job_id: number;
  message: string;
  level: "info" | "warning" | "error" | "debug";
  timestamp: string;
};

export default function JobLogs() {
  const { user, loading: authLoading } = useAuth({ redirectTo: "/auth" });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return;
      }
      
      const response = await fetch("/api/jobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        setJobs(data.data);
        // Check if any job has failed status
        setHasErrors(data.data.some((job: Job) => job.status === "failed"));
      } else {
        console.error("Failed to fetch jobs:", data.error);
        toast({
          title: "Error fetching jobs",
          description: data.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
      });
    }
  };

  // Mock fetch logs function - in a real app, you'd have an API endpoint for this
  const fetchLogs = async () => {
    // Mock logs data for demonstration
    // In a real app, you would fetch this from your API
    const mockLogs: LogEntry[] = [
      {
        id: 1,
        job_id: 1,
        message: "Indexer job started",
        level: "info",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        job_id: 1,
        message: "Connected to database successfully",
        level: "info",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 3,
        job_id: 1,
        message: "Warning: Slow query detected",
        level: "warning",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 4,
        job_id: 1,
        message: "Indexed 1000 records",
        level: "info",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        id: 5,
        job_id: 1,
        message: "Error: Failed to connect to external API",
        level: "error",
        timestamp: new Date(Date.now() - 3200000).toISOString(),
      },
      {
        id: 6,
        job_id: 1,
        message: "Job completed with errors",
        level: "info",
        timestamp: new Date(Date.now() - 3100000).toISOString(),
      },
    ];
    
    setLogs(mockLogs);
  };

  useEffect(() => {
    if (user && !authLoading) {
      setIsLoading(true);
      Promise.all([fetchJobs(), fetchLogs()])
        .finally(() => setIsLoading(false));
        
      // Set up polling every 10 seconds
      const intervalId = setInterval(() => {
        Promise.all([fetchJobs(), fetchLogs()]);
      }, 10000);
      
      // Clean up the interval when component unmounts
      return () => clearInterval(intervalId);
    }
  }, [user, authLoading]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex gap-8 min-h-screen">
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
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Indexer Job Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <div className="flex items-center mb-6">
            <h1 className="text-4xl font-bold">My Indexer Job Logs</h1>
            <div className="ml-4 flex items-center">
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Updating...</span>
                </div>
              ) : hasErrors ? (
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-500 font-medium">Issues Detected</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-500 font-medium">All Systems Operational</span>
                </div>
              )}
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Job Status Summary</CardTitle>
              <CardDescription>Overview of all your indexer jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {jobs.length > 0 ? (
                  <>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>{jobs.filter(job => job.status === "starting").length} Starting</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>{jobs.filter(job => job.status === "running").length} Running</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span>{jobs.filter(job => job.status === "failed").length} Failed</span>
                    </div>
                  </>
                ) : (
                  <span className="text-muted-foreground">No jobs found</span>
                )}
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4">Recent Logs</h2>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No logs found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getLogLevelStyle(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
