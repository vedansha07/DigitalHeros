import Sidebar from "@/components/layout/Sidebar";
import { requireAuth } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-surface-subtle flex font-sans">
      <Sidebar isAdmin={false} />
      {/* Push content right of the desktop sidebar */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden">
        {/* Mobile topbar spacer */}
        <div className="h-14 md:hidden" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
