import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { authUser, dbUser } = await requireAuth();
        const { charityId, amount } = await req.json();

        if (!charityId || !amount || parseFloat(amount) <= 0) {
            return NextResponse.json({ error: 'Valid charity ID and amount are required' }, { status: 400 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: dbUser.stripe_customer_id || undefined,
            customer_email: dbUser.stripe_customer_id ? undefined : authUser.email,
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `Independent Charity Donation`,
                        description: `One-time direct donation via Digital Heros`,
                    },
                    unit_amount: Math.round(parseFloat(amount) * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/charities/${charityId}?success=true`,
            cancel_url: `${origin}/charities/${charityId}?canceled=true`,
            metadata: {
                payment_type: 'independent_donation',
                charity_id: charityId,
                user_id: dbUser.id
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
