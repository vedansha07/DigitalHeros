import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import CharitySettingsClient from './CharitySettingsClient';

export default async function DashboardCharityPage() {
    const { dbUser } = await requireAuth();
    const supabase = createClient();
    const { data: charities } = await supabase.from('charities').select('id, name').order('name');

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-primary mb-2">Charity Settings</h1>
            <p className="text-gray-600 mb-8">Support your favorite cause automatically. Your chosen charity receives your specified percentage every time your subscription renews.</p>
            <CharitySettingsClient dbUser={dbUser} charities={charities || []} />
        </div>
    )
}
