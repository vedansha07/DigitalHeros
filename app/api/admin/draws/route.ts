import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { generateRandomDraw, generateAlgorithmicDraw } from '@/lib/draw/engine';

export async function GET() {
   try {
       await requireAdmin();
       const supabase = createClient();
       const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
       return NextResponse.json({ draws });
   } catch (e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}

export async function POST(req: Request) {
   try {
       await requireAdmin();
       const supabase = createClient();
       const { drawMonth, drawType, algoWeight } = await req.json();

       const { data: lastDraw } = await supabase.from('draws').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(1).single();
       
       let rolloverAmount = 0;
       if (lastDraw) {
           const { count } = await supabase.from('draw_results').select('*', { count: 'exact' }).eq('draw_id', lastDraw.id).eq('match_type', '5_match');
           if (count === 0) {
               rolloverAmount = (lastDraw.total_prize_pool * 0.40) + lastDraw.jackpot_rollover_amount;
           }
       }

       const { data: activeUsers } = await supabase.from('users').select('id, subscription_plan, charity_contribution_percentage').eq('subscription_status', 'active');
       
       let netPool = 0;
       for (const u of activeUsers || []) {
           const gross = u.subscription_plan === 'yearly' ? (96/12) : 10;
           const charity = gross * ((u.charity_contribution_percentage || 10) / 100);
           netPool += (gross - charity);
       }
       netPool = Math.floor(netPool * 100) / 100;

       let drawnNumbers: number[] = [];
       if (drawType === 'random') {
           drawnNumbers = generateRandomDraw();
       } else {
           const { data: allScores } = await supabase.from('golf_scores').select('score');
           const freqs: Record<number, number> = {};
           for(const s of allScores || []) {
               freqs[s.score] = (freqs[s.score] || 0) + 1;
           }
           drawnNumbers = generateAlgorithmicDraw(freqs, algoWeight!);
       }

       const { data: newDraw, error } = await supabase.from('draws').insert({
           draw_month: drawMonth,
           draw_type: drawType,
           algorithmic_weight: algoWeight,
           drawn_numbers: drawnNumbers,
           status: 'draft',
           jackpot_rollover_amount: rolloverAmount,
           total_prize_pool: netPool
       }).select().single();
       
       if (error) return NextResponse.json({ error: error.message }, { status: 500 });

       const entriesToInsert = [];
       for (const u of activeUsers || []) {
           const { data: userScores } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).order('score_date', { ascending: false }).limit(5);
           if (userScores && userScores.length > 0) {
               entriesToInsert.push({
                   draw_id: newDraw.id,
                   user_id: u.id,
                   score_snapshot: userScores.map(s => s.score)
               });
           }
       }
       
       if (entriesToInsert.length > 0) {
           await supabase.from('draw_entries').insert(entriesToInsert);
       }

       return NextResponse.json({ draw: newDraw });
   } catch (e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
