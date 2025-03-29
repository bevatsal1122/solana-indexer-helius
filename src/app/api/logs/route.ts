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
    const jobIds = jobs.map((job) => job.id);

    // Get logs for these jobs
    const { data: logs, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false })
      .limit(200);

    if (logsError) {
      console.error("Error fetching logs:", logsError);
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
