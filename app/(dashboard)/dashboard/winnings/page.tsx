import { requireAuth } from '@/lib/supabase/auth';
import UserWinningsClient from './UserWinningsClient';

export default async function WinningsPage() {
    await requireAuth();
    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-extrabold text-primary mb-2">My Prize Winnings</h1>
            <p className="text-gray-600 font-medium mb-10 max-w-2xl">Upload photographic evidence of your final certified score sheet to claim your prizes. Admin reviews typically complete within 24 hours.</p>
            <UserWinningsClient />
        </div>
    )
}
