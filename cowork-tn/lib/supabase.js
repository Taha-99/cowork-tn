import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient;

function assertPublicKeys() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase public env vars are missing. Check .env.local");
  }
}

export function getSupabaseClient() {
  assertPublicKeys();
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

export async function getWorkspaceMembers(spaceId) {
  if (!spaceId) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `id, full_name, email, phone, company, subscription_plan, credits, qr_code, space_id`
    )
    .eq("space_id", spaceId)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Failed to load members", error);
    throw error;
  }

  return data ?? [];
}
