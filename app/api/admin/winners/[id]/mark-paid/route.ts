import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email';

export async function PATCH(req: Request, { params }: { params: { id: string } }) { 
    try {
        await requireAdmin();
        const supabase = createClient();
        
        const { error } = await supabase.from('draw_results').update({ payment_status: 'paid' }).eq('id', params.id);
        if (error) throw error;

        const { data: result } = await supabase.from('draw_results').select('users(email)').eq('id', params.id).single();

        if (result?.users?.email) {
            await resend.emails.send({
                from: 'Digital Heros <noreply@digitalheros.app>',
                to: result.users.email,
                subject: 'Your Prize Has Been Sent',
                text: `Great news! We have processed the payment for your recent charity draw win. Be on the lookout for the funds.`
            });
        }

        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
