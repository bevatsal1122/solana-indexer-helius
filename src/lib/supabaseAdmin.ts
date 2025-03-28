"use server";

import { createClient } from "@supabase/supabase-js";
import { AuthResponse } from "./types";
import { Database } from "./database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_KEY");
}

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function signUpUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.code === "email_already_exists") {
        throw new Error(
          "Email already exists, please sign in or use a different email."
        );
      }

      if (error.code === "over_email_send_rate_limit") {
        throw new Error(
          "Email send rate limit exceeded, please try again later."
        );
      }

      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.message.charAt(0).toUpperCase() +
        error.message.slice(1).replace("_", " "),
    };
  }
}

export async function signInUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code === "invalid_credentials") {
        throw new Error("Invalid credentials, please try again.");
      }

      if (error.code === "user_not_found") {
        throw new Error("User not found, please sign up first.");
      }

      if (error.code === "email_not_confirmed") {
        throw new Error(
          "Email not confirmed, please check your email for a confirmation link and try again."
        );
      }

      if (error.code === "validation_failed") {
        throw new Error("Missing email or password, please try again.");
      }

      throw error;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabaseAdmin.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    // Extract the access token for cookie storage
    const accessToken = session?.access_token;

    return {
      success: true,
      data,
      session,
      accessToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.message.charAt(0).toUpperCase() +
        error.message.slice(1).replace("_", " "),
    };
  }
}

export async function getLoggedInUser(): Promise<AuthResponse> {
  try {
    // Try to get user from server-side
    const { data, error } = await supabaseAdmin.auth.getUser();

    if (error) {
      console.error("Error getting user:", error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User not found");
    }

    // Store user details in users table
    const { error: upsertError } = await supabaseAdmin.from("users").upsert(
      {
        auth_id: data.user.id,
        email_id: data.user.email,
      },
      {
        onConflict: "auth_id",
      }
    );

    if (upsertError) {
      console.error("Error updating users table:", upsertError);
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Auth error:", error.message);
    return {
      success: false,
      error:
        error.message.charAt(0).toUpperCase() +
        error.message.slice(1).replace("_", " "),
    };
  }
}

export async function signOutUser() {
  try {
    // Sign out from server-side
    const { error: serverError } = await supabaseAdmin.auth.signOut();

    if (serverError) {
      console.error("Server-side sign out error:", serverError.message);
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Sign out error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Add a function to get user by token
export async function getUserByToken(token: string): Promise<AuthResponse> {
  try {
    // Set the auth token in the supabase client
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error("Error getting user by token:", error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Auth token error:", error.message);
    return {
      success: false,
      error:
        error.message.charAt(0).toUpperCase() +
        error.message.slice(1).replace("_", " "),
    };
  }
}
