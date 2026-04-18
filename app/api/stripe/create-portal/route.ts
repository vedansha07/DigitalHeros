import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { dbUser } = await requireAuth();
    
    if (!dbUser.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer associated with this account.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripe_customer_id,
      return_url: `${origin}/dashboard/subscription`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
