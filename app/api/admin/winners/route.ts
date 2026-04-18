import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        await requireAdmin();
        const supabase = createClient();
        
        const { data: winners, error } = await supabase
            .from('draw_results')
            .select(`
                *,
                draws ( draw_month ),
                users ( full_name, email ),
                winner_verifications ( id, admin_status, admin_notes, proof_url )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ winners });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
