import Sidebar from '@/components/layout/Sidebar';
import { requireAuth } from '@/lib/supabase/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await requireAuth();
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans selection:bg-accent/30">
            <Sidebar isAdmin={false} />
            <main className="flex-1 md:ml-72 bg-gray-50 pb-20 md:pb-0 overflow-x-hidden relative min-h-screen">
                <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
