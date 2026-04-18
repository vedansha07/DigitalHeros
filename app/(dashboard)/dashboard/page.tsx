import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

// Ensure this route does not heavily cache
export const dynamic = 'force-dynamic';

export default async function DashboardMainPage() {
    const { dbUser } = await requireAuth();
    const supabase = createClient();

    const { data: scores } = await supabase.from('golf_scores')
        .select('*')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: true });

    const { data: nextDraw } = await supabase.from('draws')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    let charity = null;
    if (dbUser.selected_charity_id) {
        const { data } = await supabase.from('charities')
            .select('name, logo_url')
            .eq('id', dbUser.selected_charity_id)
            .single();
        charity = data;
    }

    const { data: winnings } = await supabase.from('draw_results')
        .select('*, draws(draw_month)')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: false })
        .limit(3);

    // Pass the raw data down to the motion wrapper
    return <DashboardOverviewClient 
        dbUser={dbUser} 
        scores={scores || []} 
        nextDraw={nextDraw} 
        charity={charity} 
        winnings={winnings || []} 
    />;
}
