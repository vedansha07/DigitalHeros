import Sidebar from "@/components/layout/Sidebar";
import { requireAuth } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-cream flex font-sans">
      <Sidebar isAdmin={false} />
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden">
        {/* Mobile topbar spacer */}
        <div className="h-14 md:hidden" />
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
