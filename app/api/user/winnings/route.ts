import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const { dbUser } = await requireAuth();
        const supabase = createClient();
        
        const { data: winnings, error } = await supabase
            .from('draw_results')
            .select(`
                *,
                draws ( draw_month, total_prize_pool ),
                winner_verifications ( id, admin_status, admin_notes, proof_url )
            `)
            .eq('user_id', dbUser.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ winnings });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
