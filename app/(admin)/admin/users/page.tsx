import { requireAdmin } from '@/lib/supabase/auth';
import AdminUsersClient from './AdminUsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    await requireAdmin();
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-primary mb-2">User Directory</h1>
            <p className="text-gray-600 font-medium mb-8">Manage platform users, view their real-time output matrices, and manually override connectivity states.</p>
            <AdminUsersClient />
        </div>
    )
}
