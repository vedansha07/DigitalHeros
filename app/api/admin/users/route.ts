import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        await requireAdmin();
        const supabase = createClient();
        
        const { data: users, error } = await supabase.from('users').select(`
            *,
            golf_scores ( id )
        `).order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return NextResponse.json({ users });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
