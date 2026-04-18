"use client"
import { useState } from 'react';
import Link from 'next/link';

export default function CharityProfileClient({ charity, isSubscribed }: { charity: any, isSubscribed: boolean }) {
    const [donateAmount, setDonateAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ charityId: charity.id, amount: parseFloat(donateAmount) })
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else alert(data.error);
        } catch(e) {}
        setLoading(false);
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <Link href="/charities" className="text-accent hover:underline mb-8 inline-block font-medium">&larr; Back to Charities</Link>
            
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="md:w-1/3 bg-white border border-gray-200 p-8 rounded-2xl flex items-center justify-center shadow-sm h-64 md:h-auto">
                    {charity.logo_url ? (
                        <img src={charity.logo_url} alt={charity.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="text-gray-400 font-medium">No Logo Available</div>
                    )}
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                    {charity.is_featured && <span className="text-xs font-bold px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full uppercase tracking-wider mb-4 self-start">Featured Partner</span>}
                    <h1 className="text-4xl font-extrabold text-primary mb-4">{charity.name}</h1>
                    <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{charity.description}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* External Donation Widget */}
                <div className="bg-primary text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Donate Independently</h3>
                        <p className="text-primary-foreground/80 mb-6">Make a one-time direct donation to {charity.name}. Tracked alongside your subscription contributions.</p>
                        <form onSubmit={handleDonation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Donation Amount (£)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    step="any"
                                    required 
                                    value={donateAmount} 
                                    onChange={e=>setDonateAmount(e.target.value)} 
                                    className="w-full p-4 rounded-xl text-primary font-bold text-lg focus:ring-4 focus:ring-accent/50 outline-none transition" 
                                    placeholder="e.g. 50"
                                />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg">
                                {loading ? 'Processing Securely...' : 'Proceed to Payment (Stripe)'}
                            </button>
                        </form>
                    </div>

                    {!isSubscribed && (
                       <div className="mt-8 border-t border-white/10 pt-6">
                           <p className="text-sm opacity-90 mb-4 font-medium">Want to support them automatically every month while getting premium platform access?</p>
                           <Link href="/subscribe" className="block text-center w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition border border-white/20">
                               This is my charity
                           </Link>
                       </div>
                    )}
                </div>

                {/* Additional Content: Events & Gallery */}
                <div className="space-y-6">
                    {charity.upcoming_events?.length > 0 && (
                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                <span className="text-accent">📅</span> Upcoming Events
                            </h3>
                            <ul className="space-y-5">
                                {charity.upcoming_events.map((ev: any, idx: number) => (
                                    <li key={idx} className="border-l-4 border-accent pl-5 py-1">
                                        <p className="font-bold text-gray-900 text-lg mb-1">{ev.event_name}</p>
                                        <p className="text-sm font-medium text-gray-500">{ev.event_date} {ev.location ? `• ${ev.location}` : ''}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {charity.images?.length > 0 && (
                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                <span className="text-accent">📸</span> Gallery
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {charity.images.map((img: string, idx: number) => (
                                    <img key={idx} src={img} alt="Gallery" className="w-full h-32 object-cover rounded-xl shadow-sm hover:opacity-90 transition cursor-pointer" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
