import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    const authToken = request.headers.get("Authorization")?.split(" ")[1];

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
    const { data: job, error: jobError } = await supabase
      .from("indexer_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", usersData.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: "Job not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    const { error: logsDeleteError } = await supabase
      .from("logs")
      .delete()
      .eq("job_id", jobId);

    if (logsDeleteError) {
      console.error("Error deleting job logs:", logsDeleteError);
      return NextResponse.json(
        { error: "Failed to delete job logs" },
        { status: 500 }
      );
    }
   
    try {
      const SERVER_URL = process.env.SERVER_URL!;
      const response = await fetch(`${SERVER_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`Error deleting job on server: ${response.status} ${response.statusText}`);
      }
    } catch (serverError) {
      console.error("Error connecting to server:", serverError);
    }

    const { error: deleteError } = await supabase
      .from("indexer_jobs")
      .delete()
      .eq("id", jobId);

    if (deleteError) {
      console.error("Error deleting job:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete indexer job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authToken = request.headers.get("Authorization")?.split(" ")[1];

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

    const jobId = parseInt(id);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid Job ID" },
        { status: 400 }
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

    // Fetch the job with the given job ID and user ID
    const { data: job, error: jobError } = await supabase
      .from("indexer_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", usersData.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: job });
  } catch (error) {
    console.error("Error in GET /api/jobs/[id]:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the job" },
      { status: 500 }
    );
  }
}