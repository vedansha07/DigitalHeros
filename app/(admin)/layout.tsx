import Sidebar from '@/components/layout/Sidebar';
import { requireAdmin } from '@/lib/supabase/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();
    
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-accent/30">
            <Sidebar isAdmin={true} />
            <main className="flex-1 md:ml-72 pb-20 md:pb-0 overflow-x-hidden relative min-h-screen">
                <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
