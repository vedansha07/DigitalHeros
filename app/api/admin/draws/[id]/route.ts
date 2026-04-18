import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
   try {
       await requireAdmin();
       const supabase = createClient();
       const { data: draw } = await supabase.from('draws').select('*').eq('id', params.id).single();
       const { data: results } = await supabase.from('draw_results').select('*, users(full_name, email)').eq('draw_id', params.id);
       return NextResponse.json({ draw, results });
   } catch (e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
