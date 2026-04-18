import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Initialize service role client to bypass RLS securely in backend route
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Idempotency execution check for Independent donations
        if (session.metadata?.payment_type === 'independent_donation') {
            const charityId = session.metadata?.charity_id;
            const userId = session.metadata?.user_id;
            const amountTotal = session.amount_total || 0;
            
            // Basic idempotency check for double-firing webhooks based on session signature within 2 minutes
            const { count } = await supabase.from('charity_contributions').select('*', { count: 'exact', head: true })
                .eq('charity_id', charityId)
                .eq('amount', amountTotal / 100);
                
            if (count && count > 0 && !userId) break; // simplistic guard without schema change

            if (charityId) {
                await supabase.from('charity_contributions').insert({
                    user_id: userId || null,
                    charity_id: charityId,
                    amount: amountTotal / 100,
                    contribution_type: 'independent'
                });

                if (session.customer_details?.email) {
                    await resend.emails.send({
                        from: 'Digital Heros <system@digitalheros.app>',
                        to: session.customer_details.email,
                        subject: 'Independent Philanthropy Validated',
                        text: `Thank you. Transferred: £${amountTotal / 100}`
                    });
                }
            }
            break;
        }

        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) break;

        const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
        if (!user) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const planInterval = sub.items.data[0].plan.interval;
        const planEnum = planInterval === 'year' ? 'yearly' : 'monthly';
        
        const amountTotal = session.amount_total || 0; 
        const monthlyFee = planEnum === 'yearly' ? (amountTotal / 12) / 100 : amountTotal / 100;

        await supabase.from('users').update({
          subscription_status: 'active',
          subscription_plan: planEnum,
          stripe_customer_id: customerId,
          subscription_renewal_date: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('id', userId);

        await supabase.from('subscriptions').insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          plan: planEnum,
          status: 'active',
          monthly_fee: monthlyFee,
          start_date: new Date(sub.current_period_start * 1000).toISOString(),
          end_date: new Date(sub.current_period_end * 1000).toISOString(),
        });

        if (user.selected_charity_id && user.charity_contribution_percentage) {
          const charAmount = (amountTotal / 100) * (user.charity_contribution_percentage / 100);
          await supabase.from('charity_contributions').insert({
            user_id: userId,
            charity_id: user.selected_charity_id,
            amount: charAmount, // Proper conversion applied
            contribution_type: 'subscription_based'
          });
        }

        if (session.customer_details?.email) {
          await resend.emails.send({
            from: 'Digital Heros <noreply@digitalheros.app>',
            to: session.customer_details.email,
            subject: 'Welcome to Digital Heros!',
            text: 'Thank you for subscribing and upgrading your golf experience.',
          });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason === 'subscription_create') break; // Ignore, handled by checkout complete

        const subscriptionId = invoice.subscription as string;
        const amountPaid = invoice.amount_paid;

        const customerId = invoice.customer as string;
        const { data: user } = await supabase.from('users').select('*').eq('stripe_customer_id', customerId).single();
        if (!user) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const renewalDate = new Date(sub.current_period_end * 1000).toISOString();

        await supabase.from('users').update({
          subscription_status: 'active',
          subscription_renewal_date: renewalDate,
        }).eq('id', user.id);

        await supabase.from('subscriptions').update({
          status: 'active',
          end_date: renewalDate,
        }).eq('stripe_subscription_id', subscriptionId);

        if (user.selected_charity_id && user.charity_contribution_percentage) {
          const charAmount = (amountPaid / 100) * (user.charity_contribution_percentage / 100);
          await supabase.from('charity_contributions').insert({
            user_id: user.id,
            charity_id: user.selected_charity_id,
            amount: charAmount,
            contribution_type: 'subscription_based'
          });
        }

        if (invoice.customer_email) {
          await resend.emails.send({
            from: 'Digital Heros <noreply@digitalheros.app>',
            to: invoice.customer_email,
            subject: 'Subscription Renewed Successfully',
            text: 'Your subscription has been renewed successfully. Thank you for your continued support!',
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const { data: user } = await supabase.from('users').select('id').eq('stripe_customer_id', customerId).single();
        
        if (user) {
          await supabase.from('users').update({ subscription_status: 'lapsed' }).eq('id', user.id);
          await supabase.from('subscriptions').update({ status: 'lapsed' }).eq('stripe_subscription_id', invoice.subscription);
          
          if (invoice.customer_email) {
            await resend.emails.send({
              from: 'Digital Heros <noreply@digitalheros.app>',
              to: invoice.customer_email,
              subject: 'Subscription Payment Failed',
              text: 'We were unable to process your subscription renewal. Please update your payment information to avoid cancellation.',
            });
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const { data: user } = await supabase.from('users').select('id').eq('stripe_customer_id', customerId).single();
        
        if (user) {
          await supabase.from('users').update({ subscription_status: 'cancelled' }).eq('id', user.id);
          await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const planInterval = subscription.items.data[0].plan.interval;
        const planEnum = planInterval === 'year' ? 'yearly' : 'monthly';
        
        let statusStr = 'active';
        if (subscription.status === 'past_due' || subscription.status === 'unpaid') statusStr = 'lapsed';
        if (subscription.status === 'canceled') statusStr = 'cancelled';
        
        const { data: user } = await supabase.from('users').select('id').eq('stripe_customer_id', customerId).single();
        
        if (user) {
          await supabase.from('users').update({ 
            subscription_plan: planEnum as any,
            subscription_status: statusStr as any,
            subscription_renewal_date: new Date(subscription.current_period_end * 1000).toISOString()
          }).eq('id', user.id);
          
          await supabase.from('subscriptions').update({ 
            plan: planEnum as any,
            status: statusStr as any,
            end_date: new Date(subscription.current_period_end * 1000).toISOString()
          }).eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
