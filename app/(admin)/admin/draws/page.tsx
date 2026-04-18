import { requireAdmin } from '@/lib/supabase/auth';
import AdminDrawsClient from './AdminDrawsClient';

export const dynamic = 'force-dynamic';

export default async function AdminDrawsPage() {
    await requireAdmin();
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-primary mb-2">Draw Engine Interface</h1>
            <p className="text-gray-600 font-medium mb-8">Execute and publish algorithmic platform draws. Simulate output permutations prior to ledger commitment.</p>
            <AdminDrawsClient />
        </div>
    )
}
