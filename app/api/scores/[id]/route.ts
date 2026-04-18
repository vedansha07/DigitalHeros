import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
   try {
       const { dbUser } = await requireAuth();
       const { score, score_date } = await req.json();
       const supabase = createClient();

       if (score < 1 || score > 45) return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 });

       const { error } = await supabase.from('golf_scores').update({
           score: parseInt(score),
           score_date
       }).eq('id', params.id).eq('user_id', dbUser.id);
       
       if (error) {
           if (error.code === '23505') return NextResponse.json({ error: 'A score for this date already exists.' }, { status: 400 });
           return NextResponse.json({ error: error.message }, { status: 500 });
       }

       return NextResponse.json({ success: true });
   } catch(e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   try {
       const { dbUser } = await requireAuth();
       const supabase = createClient();

       const { error } = await supabase.from('golf_scores').delete().eq('id', params.id).eq('user_id', dbUser.id);
       if (error) return NextResponse.json({ error: error.message }, { status: 500 });

       return NextResponse.json({ success: true });
   } catch(e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
