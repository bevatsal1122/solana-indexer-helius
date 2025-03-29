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
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Job = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  db_host: string;
  db_name: string;
};

type LogEntry = {
  id: number;
  job_id: number;
  message: string;
  tag: string;
  created_at: string;
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

  const fetchLogs = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return;
      }
      
      const response = await fetch("/api/logs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      const data = await response.json();

      console.log(data);
      
      if (response.ok && data.data) {
        setLogs(data.data);
      } else {
        console.error("Failed to fetch logs:", data.error);
        toast({
          title: "Error fetching logs",
          description: data.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch logs",
      });
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      setIsLoading(true);
      Promise.all([fetchJobs(), fetchLogs()])
        .finally(() => setIsLoading(false));
        
      const intervalId = setInterval(() => {
        Promise.all([fetchJobs(), fetchLogs()]);
      }, 3000);
      
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

  const getLogLevelStyle = (tag: string | undefined) => {
    const tagLower = tag?.toLowerCase() || '';
    
    if (tagLower.includes('error')) return "text-red-600";
    if (tagLower.includes('warn')) return "text-yellow-600";
    if (tagLower.includes('info')) return "text-green-600";
    return "text-blue-600";
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
              <div className="flex space-x-4 mb-4">
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
              
              {jobs.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div>Job Name</div>
                    <div>Status</div>
                    <div>Created</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y">
                    {jobs.slice(0, 5).map(job => (
                      <div key={job.id} className="grid grid-cols-4 gap-4 p-3 text-sm items-center">
                        <div className="font-medium truncate">{job.name}</div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            job.status === "running" ? "bg-green-100 text-green-800" : 
                            job.status === "failed" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{formatDate(job.created_at)}</div>
                        <div>
                          <Link href={`/dashboard/logs/${job.id}`} className="text-primary hover:underline">
                            View Logs
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {logs.map((log) => {
                const job = jobs.find(j => j.id === log.job_id);
                const isError = log.tag?.toLowerCase().includes('error');
                return (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(log.created_at)}
                      </span>
                      {job && (
                        <Link href={`/dashboard/logs/${log.job_id}`} className="text-xs bg-primary/10 px-2 py-0.5 rounded hover:bg-primary/20 transition-colors">
                          Job #{log.job_id}: {job.name}
                        </Link>
                      )}
                    </div>
                    {log.tag && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getLogLevelStyle(log.tag)}`}>
                        {log.tag.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${getLogLevelStyle(log.tag)}`}>{log.message}</p>
                  
                  {isError && (
                    <div className="mt-3 flex justify-end">
                      <Link href={`/dashboard/logs/${log.job_id}`}>
                        <Button size="sm" variant="secondary" className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          View All Logs for Job #{log.job_id}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )})}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
