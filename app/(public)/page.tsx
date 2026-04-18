import { createClient } from '@/lib/supabase/server';
import PublicHomeClient from './PublicHomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const supabase = createClient();

    const { data: featuredCharity } = await supabase.from('charities').select('*').eq('is_featured', true).limit(1).single();

    const { data: pendingDraw } = await supabase.from('draws').select('draw_month, total_prize_pool').eq('status', 'draft').order('created_at', { ascending: false }).limit(1).maybeSingle();

    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active');
    
    const { data: contributions } = await supabase.from('charity_contributions').select('amount');
    const totalDonated = contributions?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    return <PublicHomeClient 
        featuredCharity={featuredCharity} 
        pendingDraw={pendingDraw}
        usersCount={usersCount || 0}
        totalDonated={totalDonated}
    />
}
