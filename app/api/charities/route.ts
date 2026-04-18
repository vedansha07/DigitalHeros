import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/auth';

export async function GET() {
    const supabase = createClient();
    const { data: charities, error } = await supabase.from('charities').select('*').order('name');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ charities });
}

export async function POST(req: Request) {
    try {
        await requireAdmin();
        const data = await req.json();
        const supabase = createClient();
        const { data: charity, error } = await supabase.from('charities').insert(data).select().single();
        if (error) throw error;
        return NextResponse.json({ charity });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
