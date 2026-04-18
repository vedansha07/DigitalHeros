import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { processDrawResults } from '@/lib/draw/engine';

import { resend } from '@/lib/email';

export async function POST(req: Request, { params }: { params: { id: string } }) {
   try {
       await requireAdmin();
       const supabase = createClient();
       
       const { data: draw } = await supabase.from('draws').select('status').eq('id', params.id).single();
       if (draw?.status === 'published') return NextResponse.json({ error: 'Draw already published' }, { status: 400 });

       const summary = await processDrawResults(params.id, supabase, true);

       // Notify winners
       const { data: results } = await supabase.from('draw_results').select('*, users(email)').eq('draw_id', params.id);
       for (const r of results || []) {
           if (r.users?.email && r.prize_amount > 0) {
               await resend.emails.send({
                   from: 'Digital Heros <noreply@digitalheros.app>',
                   to: r.users.email,
                   subject: 'Congratulations! You won the Charity Draw!',
                   text: `You have won a prize of £${r.prize_amount.toFixed(2)} in the latest charity draw! Please log into your dashboard and upload proof of your score to claim your prize.`
               });
           }
       }

       return NextResponse.json({ success: true, summary });
   } catch(e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
