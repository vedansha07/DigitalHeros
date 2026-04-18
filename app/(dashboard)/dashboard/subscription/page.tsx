import { requireAuth } from '@/lib/supabase/auth';
import SubscriptionManager from './SubscriptionManager';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardSubscriptionPage() {
  const { authUser, dbUser } = await requireAuth();

  const supabase = createClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', dbUser.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">Manage Subscription</h1>
      
      {!subscription ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">You do not currently have a subscription history.</p>
          <a href="/subscribe" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
            View Plans
          </a>
        </div>
      ) : (
        <SubscriptionManager subscription={subscription} dbUser={dbUser} />
      )}
    </div>
  )
}
