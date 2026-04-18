import { requireAdmin } from '@/lib/supabase/auth';
import AdminWinnersClient from './AdminWinnersClient';
import BackButton from '@/components/ui/BackButton';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default async function AdminWinnersPage() {
    await requireAdmin();
    return (
        <div>
            <BackButton href="/admin" label="Back to Overview" />
            <Breadcrumb crumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Winners' }]} />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">Prize Verifications</h1>
                <p className="text-muted text-sm font-medium mt-1.5">Review scorecards, approve payouts, and mark prizes as paid.</p>
            </div>
            <AdminWinnersClient />
        </div>
    )
}
