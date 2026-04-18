import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import AdminReportsClient from './AdminReportsClient';
import BackButton from '@/components/ui/BackButton';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
    await requireAdmin();
    const supabase = createClient();

    const { data: users } = await supabase.from('users').select('created_at').order('created_at', { ascending: true });
    const { data: draws } = await supabase.from('draws').select('draw_month, total_prize_pool').eq('status', 'published').order('created_at', { ascending: true });
    const { data: charities } = await supabase.from('charities').select('id, name');
    const { data: contributions } = await supabase.from('charity_contributions').select('charity_id, amount');

    const { data: allDraws } = await supabase.from('draws').select(`
        id,
        draw_month,
        draw_results (match_type)
    `).eq('status', 'published');

    return (
        <div>
            <BackButton href="/admin" label="Back to Overview" />
            <Breadcrumb crumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]} />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">Analytics</h1>
                <p className="text-muted text-sm font-medium mt-1.5">Platform growth, prize distribution, and charity contribution reports.</p>
            </div>
            <AdminReportsClient
                users={users || []}
                draws={draws || []}
                charities={charities || []}
                contributions={contributions || []}
                allDraws={allDraws || []}
            />
        </div>
    )
}
