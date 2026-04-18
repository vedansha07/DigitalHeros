import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const { reason } = await req.json();
        const supabase = createClient();
        
        const { error } = await supabase.from('winner_verifications').update({ admin_status: 'rejected', admin_notes: reason }).eq('id', params.id);
        if (error) throw error;

        const { data: verif } = await supabase.from('winner_verifications').select('result_id').eq('id', params.id).single();
        const { data: result } = await supabase.from('draw_results').select('users(email)').eq('id', verif.result_id).single();

        if (result?.users?.email) {
            await resend.emails.send({
                from: 'Digital Heros <noreply@digitalheros.app>',
                to: result.users.email,
                subject: 'Proof Verification Rejected',
                text: `Your uploaded proof was rejected for the following reason:\n\n${reason}\n\nPlease log into your dashboard and re-upload the correct proof.`
            });
        }

        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
