import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { processDrawResults } from '@/lib/draw/engine';

export async function POST(req: Request, { params }: { params: { id: string } }) {
   try {
       await requireAdmin();
       const supabase = createClient();
       const summary = await processDrawResults(params.id, supabase, false);
       return NextResponse.json({ summary });
   } catch(e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
   }
}
