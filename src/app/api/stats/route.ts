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
      
      // 1. Count running jobs
      const { count: runningJobsCount, error: countError } = await supabase
        .from("indexer_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "running");
        
      if (countError) {
        console.error("Error counting running jobs:", countError);
        return NextResponse.json(
          { error: "Failed to count running jobs" },
          { status: 500 }
        );
      }
      
      // 2. Sum of entries_processed for running jobs
      const { data: sumData, error: sumError } = await supabase
        .from("indexer_jobs")
        .select("entries_processed")
        .eq("user_id", userId)
        // .eq("status", "running");
        
      if (sumError) {
        console.error("Error getting entries_processed sum:", sumError);
        return NextResponse.json(
          { error: "Failed to calculate entries processed sum" },
          { status: 500 }
        );
      }

      console.log("Sum data:", sumData);
      
      // Add debugging log to see what data we're getting
      console.log("Entries processed data:", sumData);
      
      // Fix calculation to ensure we handle null/undefined values safely
      const totalEntriesProcessed = sumData.reduce(
        (sum, job) => {
          // Log individual job entries for debugging
          console.log(`Job entries_processed: ${job.entries_processed}`);
          // Make sure job.entries_processed is a number or default to 0
          const entries = typeof job.entries_processed === 'number' ? job.entries_processed : 0;
          return sum + entries;
        }, 
        0
      );
      
      console.log("Total entries calculated:", totalEntriesProcessed);
      
      // 3. Job with maximum entries_processed
      const { data: maxJob, error: maxJobError } = await supabase
        .from("indexer_jobs")
        .select("*")
        .eq("user_id", userId)
        .order("entries_processed", { ascending: false })
        .limit(1)
        .single();
        
      if (maxJobError && maxJobError.code !== "PGRST116") { // Ignore error if no results
        console.error("Error getting max job:", maxJobError);
        return NextResponse.json(
          { error: "Failed to find job with maximum entries processed" },
          { status: 500 }
        );
      }
      
      // 4. Jobs created within last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentJobs, error: recentJobsError } = await supabase
        .from("indexer_jobs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", thirtyDaysAgo.toISOString());
        
      if (recentJobsError) {
        console.error("Error getting recent jobs:", recentJobsError);
        return NextResponse.json(
          { error: "Failed to fetch recent jobs" },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        running_jobs_count: runningJobsCount || 0,
        total_entries_processed: totalEntriesProcessed,
        max_entries_job: maxJob || null,
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