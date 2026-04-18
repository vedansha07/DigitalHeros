import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

export const dynamic = 'force-dynamic';

export default async function DashboardMainPage() {
    const { dbUser } = await requireAuth();
    const supabase = createClient();

    // Fetch data in parallel — all queries safe even if empty
    const [scoresRes, drawRes, winningsRes] = await Promise.all([
        supabase.from('golf_scores')
            .select('*')
            .eq('user_id', dbUser.id)
            .order('created_at', { ascending: true }),
        supabase.from('draws')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase.from('draw_results')
            .select('*, draws(draw_month)')
            .eq('user_id', dbUser.id)
            .order('created_at', { ascending: false })
            .limit(3),
    ]);

    let charity = null;
    if (dbUser.selected_charity_id) {
        const { data } = await supabase.from('charities')
            .select('name, logo_url')
            .eq('id', dbUser.selected_charity_id)
            .single();
        charity = data;
    }

    return (
        <DashboardOverviewClient
            dbUser={dbUser}
            scores={scoresRes.data || []}
            nextDraw={drawRes.data ?? null}
            charity={charity}
            winnings={winningsRes.data || []}
        />
    );
}
