import { stripe } from './index';

export async function createCustomer(email: string, name: string) {
  return stripe.customers.create({ email, name });
}

export async function createCheckoutSession(
  userId: string, 
  email: string, 
  stripeCustomerId: string | null, 
  priceId: string, 
  origin: string
) {
  let customerId = stripeCustomerId;
  
  if (!customerId) {
    const customer = await createCustomer(email, 'Digital Heros User');
    customerId = customer.id;
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard`,
    cancel_url: `${origin}/subscribe`,
    client_reference_id: userId,
  });
}

export async function cancelSubscription(stripeSubId: string) {
  return stripe.subscriptions.cancel(stripeSubId);
}

export async function getSubscriptionStatus(stripeSubId: string) {
  return stripe.subscriptions.retrieve(stripeSubId);
}
