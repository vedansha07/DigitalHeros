"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, AlertCircle, Calendar } from 'lucide-react';

export default function SubscriptionManager({ subscription, dbUser }: { subscription: any, dbUser: any }) {
  const [loading, setLoading] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  const handlePortal = async () => {
    setLoading('portal');
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Failed to load billing portal.');
    } catch(err) {
       console.error(err);
    }
    setLoading('');
  };

  const handleCancel = async () => {
    setLoading('cancel');
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("Subscription cancelled successfully. You will have access until your current billing period ends.");
        setShowCancelModal(false);
        router.refresh();
      } else {
        alert(data.error || 'Cancellation failed.');
      }
    } catch(err) {
       console.error(err);
    }
    setLoading('');
  }

  const isCancelled = subscription.status === 'cancelled';
  
  const renewalDate = subscription.end_date 
    ? new Date(subscription.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
      <div className="p-8 sm:p-12">
        <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3">
            <CreditCard className="text-accent" size={28} /> Membership Console
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8 mb-10 bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Tier</p>
            <p className="text-3xl font-black text-primary capitalize">{subscription.plan}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Network Status</p>
            <span className={`inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded shadow-sm ${!isCancelled ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-100 border border-red-200 text-red-800'}`}>
              {!isCancelled ? 'Active & Verifying' : 'Pending Cancellation'}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Billed Cycle Fee</p>
            <p className="text-2xl font-bold text-primary">£{Number(subscription.monthly_fee || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{isCancelled ? 'Access Revoked On' : 'Next Cycle Scheduled'}</p>
            <p className="text-xl font-bold text-primary flex items-center gap-2"><Calendar size={20} className="text-accent"/> {renewalDate}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          {!isCancelled && (
            <>
              <button
                onClick={handlePortal}
                disabled={loading !== ''}
                className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition disabled:opacity-50 text-lg shadow-md"
              >
                {loading === 'portal' ? 'Authenticating...' : 'Manage Stripe Billing / Upgrades'}
              </button>
              
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={loading !== ''}
                className="flex-1 bg-white text-red-600 border-2 border-red-100 px-8 py-4 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50 text-lg"
              >
                Terminate Subscription
              </button>
            </>
          )}
          {isCancelled && (
             <button
               onClick={handlePortal}
               disabled={loading !== ''}
               className="flex-1 bg-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-accent/90 transition disabled:opacity-50 text-lg shadow-md"
             >
               {loading === 'portal' ? 'Authenticating...' : 'Re-activate Membership Base'}
             </button>
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-primary/95 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl">
              <div className="flex justify-center mb-6">
                 <AlertCircle size={64} className="text-red-500" />
              </div>
            <h4 className="text-3xl font-black text-primary mb-4 text-center tracking-tight">Initiate Termination?</h4>
            <p className="text-gray-500 mb-8 text-center text-lg font-medium">
              You will definitively lose access to premium platform functionalities and Charity Draw entries automatically at the conclusion of your current billing period <strong className="text-primary">{renewalDate}</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancel}
                disabled={loading === 'cancel'}
                className="w-full py-4 px-6 bg-red-600 text-white rounded-xl font-black text-lg hover:bg-red-700 transition disabled:opacity-50 shadow-md"
              >
                {loading === 'cancel' ? 'Executing Terminate...' : 'Yes, Terminate My Plan'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 px-6 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-black transition"
              >
                Abort & Keep Active
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
