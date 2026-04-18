import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import AdminCharityClient from './AdminCharityClient';

export default async function AdminCharitiesPage() {
    await requireAdmin();
    const supabase = createClient();
    const { data: charities } = await supabase.from('charities').select('*').order('name');

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-primary mb-8">Manage Charities</h1>
            <AdminCharityClient initialCharities={charities || []} />
        </div>
    )
}
