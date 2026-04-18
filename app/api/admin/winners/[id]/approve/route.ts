import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const supabase = createClient();
        
        const { error } = await supabase.from('winner_verifications').update({ admin_status: 'approved' }).eq('id', params.id);
        if (error) throw error;

        const { data: verif } = await supabase.from('winner_verifications').select('result_id').eq('id', params.id).single();
        const { data: result } = await supabase.from('draw_results').select('users(email)').eq('id', verif.result_id).single();

        if (result?.users?.email) {
            await resend.emails.send({
                from: 'Digital Heros <noreply@digitalheros.app>',
                to: result.users.email,
                subject: 'Your Win is Verified!',
                text: 'Your uploaded score proof has been approved. Your payout will be sent to you shortly.'
            });
        }

        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
