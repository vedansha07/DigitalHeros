import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    const { dbUser } = await requireAuth();
    
    if (!dbUser.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 400 });
    }

    const subs = await stripe.subscriptions.list({ 
      customer: dbUser.stripe_customer_id, 
      status: 'active' 
    });

    if (subs.data.length === 0) {
      return NextResponse.json({ error: 'You do not have an active subscription to cancel.' }, { status: 400 });
    }

    // Cancel the active subscription (immediately or at period end based on your business logic)
    // Here we cancel at period end so they keep access until the renewal date.
    await stripe.subscriptions.update(subs.data[0].id, {
      cancel_at_period_end: true,
    });
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
