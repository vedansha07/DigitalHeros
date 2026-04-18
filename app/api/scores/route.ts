import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
   try {
       const { dbUser } = await requireAuth();
       const supabase = createClient();
       const { data: scores, error } = await supabase.from('golf_scores').select('*').eq('user_id', dbUser.id).order('score_date', { ascending: false });
       if (error) throw error;
       return NextResponse.json({ scores });
   } catch(e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}

export async function POST(req: Request) {
   try {
       const { dbUser } = await requireAuth();
       const { score, score_date } = await req.json();
       
       if (score < 1 || score > 45) return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 });
       if (!score_date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

       const supabase = createClient();
       const { error } = await supabase.from('golf_scores').insert({
           user_id: dbUser.id,
           score: parseInt(score),
           score_date
       });

       if (error) {
           if (error.code === '23505') return NextResponse.json({ error: 'A score for this date already exists.' }, { status: 400 });
           return NextResponse.json({ error: error.message }, { status: 500 });
       }

       const { data: updated } = await supabase.from('golf_scores').select('*').eq('user_id', dbUser.id).order('score_date', { ascending: false });
       return NextResponse.json({ scores: updated });
   } catch (e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
