import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email';

export async function POST(req: Request, { params }: { params: { resultId: string } }) {
    try {
        const { authUser, dbUser } = await requireAuth();
        const { proof_url } = await req.json();
        const supabase = createClient();

        const { data: result } = await supabase.from('draw_results').select('*').eq('id', params.resultId).eq('user_id', dbUser.id).single();
        if (!result) return NextResponse.json({ error: 'Result not found or unauthorized' }, { status: 404 });

        let isReupload = false;
        const { data: existing } = await supabase.from('winner_verifications').select('*').eq('result_id', params.resultId).maybeSingle();
        
        if (existing) {
            isReupload = true;
            await supabase.from('winner_verifications').update({
                proof_url,
                admin_status: 'pending',
                admin_notes: null
            }).eq('id', existing.id);
        } else {
            await supabase.from('winner_verifications').insert({
                result_id: params.resultId,
                proof_url,
                admin_status: 'pending'
            });
        }

        await resend.emails.send({
            from: 'Digital Heros <noreply@digitalheros.app>',
            to: 'admin@digitalheros.app',
            subject: isReupload ? 'Winner Proof Re-uploaded' : 'New Winner Proof Uploaded',
            text: `User ${authUser.email} has uploaded a proof for their match in draw result ${params.resultId}. Please review in the admin panel.`
        });

        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
