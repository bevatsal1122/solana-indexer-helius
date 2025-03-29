import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/cookies";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Job Types: starting, running, failed

// Validation schema for request body
const jobSchema = z.object({
  name: z.string().min(1, "Job name is required"),
  description: z.string().optional().nullable(),
  db_host: z.string().min(1, "Database host is required"),
  db_port: z.string().min(1, "Database port is required"),
  db_name: z.string().min(1, "Database name is required"),
  db_user: z.string().min(1, "Database user is required"),
  db_password: z.string().min(1, "Database password is required"),
  type: z.string(),
});

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
      .select("*")
      .eq("user_id", usersData.id)
      .order("created_at", { ascending: false });

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      return NextResponse.json(
        { error: "Failed to fetch indexer jobs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: jobs }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      authToken
    );

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid authentication token" },
        { status: 401 }
      );
    }

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

    const body = await req.json();

    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const jobData = result.data;

    const { data, error } = await supabase
      .from("indexer_jobs")
      .insert({
        ...jobData,
        user_id: usersData.id,
        status: "starting",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating indexer job:", error);
      return NextResponse.json(
        { error: "Failed to create indexer job" },
        { status: 500 }
      );
    }

    const serverUrl = process.env.SERVER_URL;
    if (!serverUrl) {
      console.error("SERVER_URL is not set in environment variables");
      return NextResponse.json(
        { error: "Server URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(serverUrl + "/jobs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId: data.id }),
    });

    console.log("Response:", response);

    if (!response.ok) {
      console.error("Failed to send job to backend:", response.statusText);
      return NextResponse.json(
        { error: "Failed to process job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
