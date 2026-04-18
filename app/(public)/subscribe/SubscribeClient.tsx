"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder';
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder';

export default function SubscribeClient({ dbUser }: { dbUser: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const isActive = dbUser?.subscription_status === 'active';

  const handleSubscribe = async (priceId: string, plan: string) => {
    if (!dbUser) {
      router.push('/signup');
      return;
    }
    
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan }),
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading('manage');
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-500">Access premium features, participate in monthly draws, and support your favourite charity automatically.</p>
        
        {isActive && (
          <div className="mt-8 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 inline-block">
            <p className="font-medium">You already have an active {dbUser.subscription_plan} subscription.</p>
            <button 
              onClick={handleManage}
              disabled={loading === 'manage'}
              className="mt-2 text-sm font-semibold hover:underline"
            >
              {loading === 'manage' ? 'Loading...' : 'Manage your subscription'}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Monthly Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col">
          <h3 className="text-2xl font-bold text-primary mb-2">Monthly</h3>
          <div className="text-4xl font-bold text-primary mb-6">£10<span className="text-lg font-normal text-gray-500">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Full platform access</li>
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Monthly charity draw entry</li>
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Standard charity contribution</li>
          </ul>
          <button
            onClick={() => handleSubscribe(MONTHLY_PRICE_ID, 'monthly')}
            disabled={isActive || loading === 'monthly'}
            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'monthly' ? 'Processing...' : isActive ? 'Current Plan' : 'Subscribe Monthly'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-white border-2 border-accent rounded-2xl shadow-xl p-8 flex flex-col relative scale-[1.02]">
          <div className="absolute top-0 right-0 bg-accent text-white py-1 px-4 rounded-bl-xl rounded-tr-xl text-sm font-bold">
            Save 20%
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Yearly</h3>
          <div className="text-4xl font-bold text-primary mb-6">£96<span className="text-lg font-normal text-gray-500">/yr</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Full platform access</li>
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Monthly charity draw entry</li>
            <li className="flex items-center text-gray-600"><span className="text-accent mr-3">✓</span> Standard charity contribution</li>
            <li className="flex items-center text-gray-600 font-medium"><span className="text-accent mr-3">✓</span> 2 months free equivalent</li>
          </ul>
          <button
            onClick={() => handleSubscribe(YEARLY_PRICE_ID, 'yearly')}
            disabled={isActive || loading === 'yearly'}
            className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'yearly' ? 'Processing...' : isActive ? 'Current Plan' : 'Subscribe Yearly'}
          </button>
        </div>
      </div>
    </div>
  )
}
