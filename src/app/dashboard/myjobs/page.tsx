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
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Eye } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

type Job = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  type: string;
  created_at: string;
  db_host: string;
  db_name: string;
  db_port: string;
  db_user: string;
  db_password: string;
  entries_processed?: number;
};

export default function MyJobs() {
  const { user, loading: authLoading } = useAuth({ redirectTo: "/auth" });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const token = await supabase.auth.getSession();

      const response = await fetch("/api/jobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.data.session?.access_token}`,
        },
      });

      console.log(response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch jobs");
      }

      setJobs(data.data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      const token = await supabase.auth.getSession();

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.data.session?.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job");
      }

      // Remove the deleted job from the state
      setJobs(jobs.filter((job) => job.id !== jobId));

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
      });
    }
  };

  // Show details of the job in a modal
  const showDetails = (job: Job) => {
    setSelectedJob(job);
  };

  useEffect(() => {
    if (user && !authLoading) {
      setIsLoading(true);
      fetchJobs();

      // Set up polling every 5 seconds
      const intervalId = setInterval(() => {
        fetchJobs();
      }, 5000);

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

  // Format for showing masked password
  const maskPassword = (password: string) => {
    if (!password) return "";
    return "•".repeat(Math.min(password.length, 10));
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
              <BreadcrumbPage>My Jobs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <h1 className="text-4xl font-bold mb-10">My Jobs</h1>

          {isLoading ? (
            <div className="relative w-full h-148 flex">
              <div className="absolute inset-0 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No jobs found. Create one from the dashboard.
              </p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/create">Create Job</a>
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption className="text-muted-foreground m-4">
                List of your indexer jobs
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>DB Info</TableHead>
                  <TableHead>Monthly Entries</TableHead>
                  <TableHead>Job Status</TableHead>
                  <TableHead>Creation Date</TableHead>
                  <TableHead className="w-[120px]">Job Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>{job.type.toUpperCase()}</TableCell>
                    <TableCell>
                      {job.db_host}/{job.db_name}
                    </TableCell>
                    <TableCell>
                      {job.entries_processed?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          job.status === "starting"
                            ? "bg-yellow-300 text-yellow-900"
                            : job.status === "running"
                            ? "bg-green-300 text-green-900"
                            : job.status === "failed"
                            ? "bg-red-300 text-red-900"
                            : "bg-blue-300 text-blue-900"
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(job.created_at)}</TableCell>
                    <TableCell className="text-right w-[120px]">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => showDetails(job)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{job.name}</DialogTitle>
                              <DialogDescription>
                                {job.description || "No description provided"}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Status:
                                </span>
                                <span className="col-span-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      job.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : job.status === "running"
                                        ? "bg-blue-100 text-blue-800"
                                        : job.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {job.status.charAt(0).toUpperCase() +
                                      job.status.slice(1)}
                                  </span>
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Job Type:
                                </span>
                                <span className="col-span-3">{job.type}</span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Created:
                                </span>
                                <span className="col-span-3">
                                  {formatDate(job.created_at)}
                                </span>
                              </div>

                              <div className="border-t my-2"></div>
                              <h3 className="text-md font-medium">
                                Database Configuration
                              </h3>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Host:
                                </span>
                                <span className="col-span-3">
                                  {job.db_host}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Port:
                                </span>
                                <span className="col-span-3">
                                  {job.db_port}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Database:
                                </span>
                                <span className="col-span-3">
                                  {job.db_name}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Username:
                                </span>
                                <span className="col-span-3">
                                  {job.db_user}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Password:
                                </span>
                                <span className="col-span-3 font-mono">
                                  {maskPassword(job.db_password)}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right font-medium">
                                  Connection URL:
                                </span>
                                <span className="col-span-3 text-xs break-all font-mono">
                                  postgres://{job.db_user}:
                                  {maskPassword(job.db_password)}@{job.db_host}:
                                  {job.db_port}/{job.db_name}
                                </span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="secondary" size="sm" asChild>
                          <a href={`/dashboard/logs/${job.id}`}>
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
