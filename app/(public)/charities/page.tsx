import { createClient } from '@/lib/supabase/server';
import CharityListClient from './CharityListClient';

export default async function CharitiesPage() {
    const supabase = createClient();
    const { data: charities } = await supabase.from('charities').select('*').order('name');
    
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-primary mb-2">Our Charity Partners</h1>
            <p className="text-gray-600 mb-10 max-w-2xl">Discover the incredible organizations we support. You can choose any of these partners to receive a portion of your monthly subscription or donate to them directly.</p>
            <CharityListClient initialCharities={charities || []} />
        </div>
    )
}
