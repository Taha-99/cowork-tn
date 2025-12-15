import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = getSupabaseServiceRole();
    const body = await request.json();
    
    const { email, full_name, phone, role, space_id } = body;

    // Validate required fields
    if (!email || !full_name || !space_id) {
      return NextResponse.json(
        { error: "Missing required fields: email, full_name, space_id" },
        { status: 400 }
      );
    }

    // Check if user with email already exists in this space
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .eq("space_id", space_id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "User already exists in this space" },
        { status: 409 }
      );
    }

    // Create new profile
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          email,
          full_name,
          phone: phone || null,
          role: role || "member",
          space_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const supabase = getSupabaseServiceRole();
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("space_id");

    if (!spaceId) {
      return NextResponse.json(
        { error: "Missing space_id parameter" },
        { status: 400 }
      );
    }

    // Get all members for the space
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, phone, avatar_url, created_at, last_sign_in_at")
      .eq("space_id", spaceId)
      .neq("role", "super_admin")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
