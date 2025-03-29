import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
      const authToken = req.headers.get("Authorization")?.split(" ")[1];
  
      if (!authToken) {
        return NextResponse.json(
          { error: "Unauthorized: Authentication required" },
          { status: 401 }
        );
      }
  
      // Get the user from the token
      const { data: userData, error: userError } = await supabase.auth.getUser(
        authToken
      );
  
      if (userError || !userData.user) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid authentication token" },
          { status: 401 }
        );
      }
  
      // Get user ID from users table using auth_id
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", userData.user.id)
        .single();
  
      if (usersError || !usersData) {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        );
      }

      const userId = usersData.id;
      
      // Get all jobs for this user in a single query
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: allJobs, error: jobsError } = await supabase
        .from("indexer_jobs")
        .select("*")
        .eq("user_id", userId);
        
      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        return NextResponse.json(
          { error: "Failed to fetch jobs data" },
          { status: 500 }
        );
      }
      
      // Calculate all statistics from the fetched data
      const runningJobs = allJobs.filter(job => job.status === "running");
      const runningJobsCount = runningJobs.length;
      
      const totalEntriesProcessed = allJobs.reduce((sum, job) => {
        const entries = typeof job.entries_processed === 'number' ? job.entries_processed : 0;
        return sum + entries;
      }, 0);
      
      // Find job with maximum entries_processed
      let maxJob = null;
      if (allJobs.length > 0) {
        maxJob = allJobs.reduce((max, job) => {
          const currentEntries = typeof job.entries_processed === 'number' ? job.entries_processed : 0;
          const maxEntries = typeof max.entries_processed === 'number' ? max.entries_processed : 0;
          return currentEntries > maxEntries ? job : max;
        }, allJobs[0]);
      }
      
      // Filter recent jobs (last 30 days)
      const recentJobs = allJobs.filter(job => 
        new Date(job.created_at) >= thirtyDaysAgo
      );
      
      return NextResponse.json({
        running_jobs_count: runningJobsCount,
        total_entries_processed: totalEntriesProcessed,
        max_entries_job: maxJob,
        recent_jobs_count: recentJobs.length,
        recent_jobs: recentJobs
      }, { status: 200 });
      
    } catch (error) {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }