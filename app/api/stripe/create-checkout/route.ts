import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { createCheckoutSession } from '@/lib/stripe/api';

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();
    const { authUser, dbUser } = await requireAuth();
    
    // Basic verification against duplicate subscriptions if already active
    // Subscriptions logic allows upgrade/downgrade through portal, 
    // so checkout shouldn't trigger if already active (unless lapsed)
    if (dbUser.subscription_status === 'active') {
      return NextResponse.json({ error: 'You already have an active subscription.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await createCheckoutSession(
      dbUser.id, 
      authUser.email!, 
      dbUser.stripe_customer_id, 
      priceId, 
      origin
    );
    
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
