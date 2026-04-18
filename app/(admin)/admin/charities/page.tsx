import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import AdminCharityClient from './AdminCharityClient';
import BackButton from '@/components/ui/BackButton';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default async function AdminCharitiesPage() {
    await requireAdmin();
    const supabase = createClient();
    const { data: charities } = await supabase.from('charities').select('*').order('name');

    return (
        <div>
            <BackButton href="/admin" label="Back to Overview" />
            <Breadcrumb crumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Charities' }]} />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">Charity Catalog</h1>
                <p className="text-muted text-sm font-medium mt-1.5">Add, edit, and feature partner charities.</p>
            </div>
            <AdminCharityClient initialCharities={charities || []} />
        </div>
    )
}
