import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import AdminReportsClient from './AdminReportsClient';

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
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-primary mb-2">Analytics & Reporting</h1>
            <p className="text-gray-600 font-medium mb-8">Visualize application growth, prize dispersion, and philanthropic output natively.</p>
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
