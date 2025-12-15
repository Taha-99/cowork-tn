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

    // Check if member with email already exists in this space
    const { data: existingMember } = await supabase
      .from("members")
      .select("id")
      .eq("email", email)
      .eq("space_id", space_id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "Member already exists in this space" },
        { status: 409 }
      );
    }

    // Create new member (note: we use the members table, not profiles)
    // Members table has all the fields we need and doesn't require auth.users
    const { data, error } = await supabase
      .from("members")
      .insert([
        {
          email,
          full_name,
          phone: phone || null,
          space_id,
          plan: role === "admin" ? "unlimited" : "day_pass",
          status: "active",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating member:", error);
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

    // Get all members for the space (from members table)
    const { data, error } = await supabase
      .from("members")
      .select("id, full_name, email, plan, status, phone, created_at")
      .eq("space_id", spaceId)
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
