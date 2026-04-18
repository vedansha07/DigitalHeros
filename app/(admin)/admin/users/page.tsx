import { requireAdmin } from '@/lib/supabase/auth';
import AdminUsersClient from './AdminUsersClient';
import BackButton from '@/components/ui/BackButton';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    await requireAdmin();
    return (
        <div>
            <BackButton href="/admin" label="Back to Overview" />
            <Breadcrumb crumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">User Directory</h1>
                <p className="text-muted text-sm font-medium mt-1.5">Manage platform users and subscription states.</p>
            </div>
            <AdminUsersClient />
        </div>
    )
}
