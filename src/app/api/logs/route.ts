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

    // Check if a specific job ID is requested
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    
    // Get all jobs for this user
    let jobIdsQuery;
    if (jobId) {
      // If specific job ID is requested, validate that it belongs to the user
      const jobIdNum = parseInt(jobId);
      if (isNaN(jobIdNum)) {
        return NextResponse.json(
          { error: "Invalid job ID" },
          { status: 400 }
        );
      }
      
      const { data: job, error: jobError } = await supabase
        .from("indexer_jobs")
        .select("id")
        .eq("id", jobIdNum)
        .eq("user_id", usersData.id)
        .single();
        
      if (jobError || !job) {
        return NextResponse.json(
          { error: "Job not found or access denied" },
          { status: 404 }
        );
      }
      
      jobIdsQuery = [jobIdNum];
    } else {
      // Get all jobs for this user
      const { data: jobs, error: jobsError } = await supabase
        .from("indexer_jobs")
        .select("id")
        .eq("user_id", usersData.id);

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        return NextResponse.json(
          { error: "Failed to fetch indexer jobs" },
          { status: 500 }
        );
      }

      if (!jobs || jobs.length === 0) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      
      // Extract job IDs
      jobIdsQuery = jobs.map((job) => job.id);
    }

    // Get logs for these jobs
    const { data: logs, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .in("job_id", jobIdsQuery)
      .order("created_at", { ascending: false })
      .limit(200);

    if (logsError) {
      console.error("Error fetching logs:", logsError);
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/logs:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching logs" },
      { status: 500 }
    );
  }
}
