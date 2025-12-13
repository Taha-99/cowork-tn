import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});

// Protected routes configuration
const PROTECTED_ROUTES = {
  "/super-admin": ["super_admin"],
  "/app": ["super_admin", "admin"],
  "/my": ["super_admin", "admin", "coworker"],
};

// Public routes (no auth required)
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Extract locale from path
  const localeMatch = pathname.match(/^\/(fr|ar)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;
  const pathWithoutLocale = pathname.replace(/^\/(fr|ar)/, "") || "/";
  
  // First, run the i18n middleware
  let response = intlMiddleware(request);
  
  // Check if this is the landing page
  const isLandingPage = pathWithoutLocale === "/";
  
  // Check if this is a public route (excluding landing page for authenticated users)
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
  );
  
  // For landing page, we need to check auth to redirect authenticated users
  if (isLandingPage) {
    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user && !error) {
      // Get user profile to determine role
      const { data: profiles } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id);
      
      const profile = profiles && profiles.length > 0 ? profiles[0] : null;
      const userRole = profile?.role || "coworker";
      
      // Redirect based on role
      let redirectPath;
      switch (userRole) {
        case "super_admin":
          redirectPath = `/${locale}/super-admin`;
          break;
        case "admin":
          redirectPath = `/${locale}/app`;
          break;
        default:
          redirectPath = `/${locale}/my`;
      }
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // If not authenticated, allow access to landing page
    return response;
  }
  
  // For other public routes, allow access
  if (isPublicRoute) {
    return response;
  }
  
  // Check if this is a protected route
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathWithoutLocale.startsWith(route)
  );
  
  if (!protectedRoute) {
    // Not a protected route, allow access
    return response;
  }
  
  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  
  // Get current user (this refreshes the session if needed)
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    // Redirect to login if not authenticated
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  
  // Get user profile to check role
  const { data: profiles } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id);
  
  const profile = profiles && profiles.length > 0 ? profiles[0] : null;
  const userRole = profile?.role || "coworker";
  const allowedRoles = PROTECTED_ROUTES[protectedRoute];
  
  // Check if user has permission for this route
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    let redirectPath;
    switch (userRole) {
      case "super_admin":
        redirectPath = `/${locale}/super-admin`;
        break;
      case "admin":
        redirectPath = `/${locale}/app`;
        break;
      default:
        redirectPath = `/${locale}/my`;
    }
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  return response;
}

export const config = {
  matcher: ["/", "/(ar|fr)/:path*"],
};
