import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const data = await req.json();
        const supabase = createClient();
        
        const { error } = await supabase.from('users').update({
            full_name: data.full_name,
            subscription_status: data.subscription_status
        }).eq('id', params.id);
        
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const supabase = createClient();
        const { data: user, error } = await supabase.from('users').select('*').eq('id', params.id).single();
        if (error) throw error;
        const { data: scores } = await supabase.from('golf_scores').select('*').eq('user_id', params.id).order('created_at', { ascending: false });

        return NextResponse.json({ user, scores: scores || [] });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
