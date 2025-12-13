import { getSupabaseClient } from "./supabase";

// Role constants
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  COWORKER: "coworker",
};

// Role hierarchy for permission checks
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.ADMIN]: 2,
  [ROLES.COWORKER]: 1,
};

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  // Fetch user profile with role
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id);

  if (profileError) {
    return { user: data.user, profile: null, error: null };
  }

  const profile = profiles && profiles.length > 0 ? profiles[0] : null;
  return { user: data.user, profile, error: null };
}

/**
 * Sign up a new user
 */
export async function signUp(email, password, metadata = {}) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error: error?.message || null };
}

/**
 * Get current user with profile
 */
export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, profile: null, error: error?.message || null };
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id);

  if (profileError) {
    return { user, profile: null, error: null };
  }

  const profile = profiles && profiles.length > 0 ? profiles[0] : null;
  return { user, profile, error: null };
}

/**
 * Create a profile for a user
 */
export async function createProfile(userId, profileData) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      ...profileData,
    })
    .select()
    .single();

  return { profile: data, error: error?.message || null };
}

/**
 * Update user profile
 */
export async function updateProfile(userId, updates) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { profile: data, error: error?.message || null };
}

/**
 * Check if user has required role
 */
export function hasRole(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Get redirect path based on role
 */
export function getRedirectPath(role, locale = "fr") {
  // Use the role as-is if provided, otherwise default to coworker
  // Check explicitly for null/undefined, not falsy values (empty string could be valid)
  const normalizedRole = (role === null || role === undefined) ? ROLES.COWORKER : role;
  
  // Check for super_admin first (exact match)
  if (normalizedRole === ROLES.SUPER_ADMIN || normalizedRole === "super_admin") {
    return `/${locale}/super-admin`;
  }
  
  // Check for admin
  if (normalizedRole === ROLES.ADMIN || normalizedRole === "admin") {
    return `/${locale}/app`;
  }
  
  // Check for coworker
  if (normalizedRole === ROLES.COWORKER || normalizedRole === "coworker") {
    return `/${locale}/my`;
  }
  
  // Default fallback
  return `/${locale}/login`;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  const supabase = getSupabaseClient();
  return supabase.auth.onAuthStateChange(callback);
}
