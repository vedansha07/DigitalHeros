import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request) {
    try {
        const { dbUser } = await requireAuth();
        const { selected_charity_id, charity_contribution_percentage } = await req.json();

        const pct = parseInt(charity_contribution_percentage) || 10;
        
        if (pct < 10 || pct > 100) {
            return NextResponse.json({ error: 'Invalid contribution percentage. Must be between 10% and 100%.' }, { status: 400 });
        }

        const updateData: any = { charity_contribution_percentage: pct };
        if (selected_charity_id !== undefined) {
             updateData.selected_charity_id = selected_charity_id;
        }

        const supabase = createClient();
        const { error } = await supabase.from('users').update(updateData).eq('id', dbUser.id);
        
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
