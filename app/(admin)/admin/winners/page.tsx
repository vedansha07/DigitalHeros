import { requireAdmin } from '@/lib/supabase/auth';
import AdminWinnersClient from './AdminWinnersClient';

export default async function AdminWinnersPage() {
    await requireAdmin();
    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-extrabold text-primary mb-2">Prize Winner Verifications</h1>
            <p className="text-gray-600 font-medium mb-8">Review uploaded photographic evidence, approve payouts, and execute fund dispatches securely.</p>
            <AdminWinnersClient />
        </div>
    )
}
