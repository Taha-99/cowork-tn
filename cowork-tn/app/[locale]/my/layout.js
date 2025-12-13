import { CoworkerShell } from "@/components/coworker-shell";

export default async function CoworkerLayout({ children, params }) {
  const { locale } = await params;

  // Mock user data (will be replaced with Supabase auth)
  const mockUser = {
    id: "user-1",
    full_name: "Ahmed Ben Ali",
    email: "ahmed@example.com",
    avatar_url: null,
  };

  return (
    <CoworkerShell locale={locale} user={mockUser}>
      {children}
    </CoworkerShell>
  );
}
