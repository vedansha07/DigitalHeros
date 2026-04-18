import { createClient } from '@/lib/supabase/server';
import CharityProfileClient from './CharityProfileClient';
import { getCurrentUser } from '@/lib/supabase/auth';

export default async function CharityProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: charity } = await supabase.from('charities').select('*').eq('id', params.id).single();
    
    if (!charity) return <div className="py-20 text-center">Charity not found.</div>;
    
    const user = await getCurrentUser();

    return <CharityProfileClient charity={charity} isSubscribed={!!user?.dbUser} />
}
