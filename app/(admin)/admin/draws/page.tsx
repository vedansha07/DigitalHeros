import { requireAdmin } from '@/lib/supabase/auth';
import AdminDrawsClient from './AdminDrawsClient';
import BackButton from '@/components/ui/BackButton';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const dynamic = 'force-dynamic';

export default async function AdminDrawsPage() {
    await requireAdmin();
    return (
        <div>
            <BackButton href="/admin" label="Back to Overview" />
            <Breadcrumb crumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Draw Engine' }]} />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">Draw Engine</h1>
                <p className="text-muted text-sm font-medium mt-1.5">Create, simulate, and publish monthly prize draws.</p>
            </div>
            <AdminDrawsClient />
        </div>
    )
}
