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
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "../logs.css"; // Import CSS file for animations

type Job = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  db_host: string;
  db_name: string;
  db_port: string;
  db_password: string;
};

type LogEntry = {
  id: number;
  job_id: number;
  message: string;
  tag: string;
  created_at: string;
};

export default function JobDetailLogs() {
  const { user, loading: authLoading } = useAuth({ redirectTo: "/auth" });
  const [job, setJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [logTagFilter, setLogTagFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const params = useParams();
  const jobId = params.id as string;
  const [showPassword, setShowPassword] = useState(false);
  const passwordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [newLogIds, setNewLogIds] = useState<number[]>([]);

  const fetchJob = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return;
      }
      
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        setJob(data.data);
      } else {
        console.error("Failed to fetch job:", data.error);
        toast({
          title: "Error fetching job",
          description: data.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job",
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return;
      }
      
      const response = await fetch(`/api/logs?jobId=${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        // Check if this is initial load or a refresh
        const isInitialLoad = logs.length === 0;
        
        // Find new log IDs by comparing with the current logs
        const currentLogIds = new Set(logs.map(log => log.id));
        const newLogs = data.data.filter((log: LogEntry) => !currentLogIds.has(log.id));
        
        // Only update newLogIds if there are actually new logs AND it's not the initial load
        if (newLogs.length > 0 && !isInitialLoad) {
          setNewLogIds(newLogs.map((log: LogEntry) => log.id));
          console.log(`Found ${newLogs.length} new logs for job #${jobId}`);
        }
        
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
    if (user && !authLoading && jobId) {
      setIsLoading(true);
      Promise.all([fetchJob(), fetchLogs()])
        .finally(() => setIsLoading(false));
        
      // Set up polling every 3 seconds
      const intervalId = setInterval(() => {
        Promise.all([fetchJob(), fetchLogs()]);
      }, 3000);
      
      // Clean up the interval when component unmounts
      return () => clearInterval(intervalId);
    }
  }, [user, authLoading, jobId]);

  // Filter logs when log tag filter or logs change
  useEffect(() => {
    if (logTagFilter === "all") {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => {
        const tagLower = log.tag?.toLowerCase() || "";
        return tagLower.includes(logTagFilter.toLowerCase());
      }));
    }
  }, [logs, logTagFilter]);

  const revealPassword = () => {
    setShowPassword(true);
    
    // Clear any existing timer
    if (passwordTimerRef.current) {
      clearTimeout(passwordTimerRef.current);
    }
    
    // Set new timer to hide password after 5 seconds
    passwordTimerRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 5000);
  };
  
  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (passwordTimerRef.current) {
        clearTimeout(passwordTimerRef.current);
      }
    };
  }, []);

  // Effect to animate existing logs down when new logs are added
  useEffect(() => {
    if (newLogIds.length === 0) return;
    
    // Simply add a class to the container to trigger CSS animations
    const container = document.querySelector('.logs-container');
    if (!container) return;
    
    // Remove and add class to restart animation
    container.classList.remove('new-logs-added');
    
    // Force reflow
    void (container as HTMLElement).offsetHeight;
    
    // Add animation class
    container.classList.add('new-logs-added');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      container.classList.remove('new-logs-added');
      // Clear newLogIds after animation is complete
      setNewLogIds([]);
    }, 800); // Increased to account for staggered animations
  }, [newLogIds]);

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

  // Animation container style
  const logContainerStyles = {
    overflow: 'hidden',
    position: 'relative' as const,
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
              <BreadcrumbLink href="/dashboard/logs">Logs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Job {jobId} Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <div className="flex items-center mb-6">
            <h1 className="text-4xl font-bold">
              {job ? `Logs for ${job.name}` : `Job #${jobId} Logs`}
            </h1>
            <div className="ml-4 flex items-center">
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Updating...</span>
                </div>
              ) : job ? (
                <div className="flex items-center">
                  {job.status === "failed" ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-500 font-medium">Failed</span>
                    </>
                  ) : job.status === "running" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-500 font-medium">Running</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-500 font-medium">Starting</span>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {job && (
            <div className="mb-6 p-4 border rounded-lg bg-accent/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(job.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Host</p>
                  <p className="font-medium">{job.db_host}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Port</p>
                  <p className="font-medium">{job.db_port}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Name</p>
                  <p className="font-medium">{job.db_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Password</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium font-mono">
                      {showPassword ? job.db_password : "••••••••••••"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={revealPassword}
                      className="h-7 px-2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {showPassword && (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        Hiding in 5s
                      </span>
                    )}
                  </div>
                </div>
                {job.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{job.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Logs</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <Select value={logTagFilter} onValueChange={setLogTagFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Logs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {logs.length === 0 ? "No logs found for this job." : "No logs match the selected filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 logs-container" style={logContainerStyles}>
              {filteredLogs.map((log) => {
                const isNew = newLogIds.includes(log.id);
                
                return (
                  <div 
                    key={log.id} 
                    className={`border rounded-lg p-4 hover:bg-accent/50 log-item ${isNew ? 'new-log' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(log.created_at)}
                      </span>
                      {log.tag && (
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getLogLevelStyle(log.tag)}`}>
                          {log.tag}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${getLogLevelStyle(log.tag)}`}>{log.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 