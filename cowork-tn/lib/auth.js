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
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return { user: data.user, profile: null, error: null };
  }

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return `/${locale}/super-admin`;
    case ROLES.ADMIN:
      return `/${locale}/app`;
    case ROLES.COWORKER:
      return `/${locale}/my`;
    default:
      return `/${locale}/login`;
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  const supabase = getSupabaseClient();
  return supabase.auth.onAuthStateChange(callback);
}
