import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import AdminOverviewClient from '@/components/admin/AdminOverviewClient';

export const dynamic = 'force-dynamic';

export default async function AdminMainPage() {
    await requireAdmin();
    const supabase = createClient();

    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: activeCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active');
    
    const { data: draws } = await supabase.from('draws').select('total_prize_pool');
    const totalPrizePool = draws?.reduce((acc, curr) => acc + (curr.total_prize_pool || 0), 0) || 0;

    const { data: contributions } = await supabase.from('charity_contributions').select('amount');
    const totalCharity = contributions?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    const { data: recentActivity } = await supabase.from('golf_scores')
        .select('id, created_at, score, users(full_name)')
        .order('created_at', { ascending: false })
        .limit(8);

    return <AdminOverviewClient 
        stats={{ userCount: userCount || 0, activeCount: activeCount || 0, totalPrizePool, totalCharity }} 
        recentActivity={recentActivity || []} 
    />;
}
