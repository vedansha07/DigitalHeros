import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { createCheckoutSession } from '@/lib/stripe/api';

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    // Use getCurrentUser instead of requireAuth so we can return a proper 401
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated. Please sign in.' }, { status: 401 });
    }

    const { authUser, dbUser } = user;

    if (dbUser?.subscription_status === 'active') {
      return NextResponse.json({ error: 'You already have an active subscription.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession(
      dbUser?.id ?? authUser.id,
      authUser.email!,
      dbUser?.stripe_customer_id ?? null,
      priceId,
      origin
    );

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
