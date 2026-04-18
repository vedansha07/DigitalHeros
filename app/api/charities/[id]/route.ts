import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: charity, error } = await supabase.from('charities').select('*').eq('id', params.id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ charity });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const data = await req.json();
        const supabase = createClient();
        const { data: charity, error } = await supabase.from('charities').update(data).eq('id', params.id).select().single();
        if (error) throw error;
        return NextResponse.json({ charity });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const supabase = createClient();
        
        // Block deletion if actively used
        const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('selected_charity_id', params.id);
        if (count && count > 0) {
            return NextResponse.json({ error: 'Cannot delete charity because users have currently selected it.' }, { status: 400 });
        }

        const { error } = await supabase.from('charities').delete().eq('id', params.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
