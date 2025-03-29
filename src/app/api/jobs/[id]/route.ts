import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id, 10);
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

    // Check if the job exists and belongs to the user
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

    // Delete the job
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