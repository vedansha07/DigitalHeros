"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CharitySettingsClient({ dbUser, charities }: { dbUser: any, charities: any[] }) {
    const [selectedCharity, setSelectedCharity] = useState(dbUser.selected_charity_id || '');
    const [percentage, setPercentage] = useState(dbUser.charity_contribution_percentage || 10);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentFee = dbUser.subscription_plan === 'yearly' ? (96 / 12) : 10;
    const estContribution = (currentFee * (percentage / 100)).toFixed(2);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user/charity', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    selected_charity_id: selectedCharity || null, 
                    charity_contribution_percentage: percentage 
                })
            });
            const data = await res.json();
            if (data.error) alert(data.error);
            else {
                alert("Settings saved successfully.");
                router.refresh();
            }
        } catch(err) {
            alert('Error saving settings.');
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
                <label className="block text-sm font-semibold text-primary mb-2">My Selected Charity</label>
                <select 
                    value={selectedCharity} 
                    onChange={e => setSelectedCharity(e.target.value)}
                    className="w-full border border-gray-300 p-3.5 rounded-xl font-medium text-gray-900 focus:ring-2 focus:ring-accent outline-none transition"
                >
                    <option value="">-- No Charity Selected --</option>
                    {charities.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {selectedCharity && (
                    <a href={`/charities/${selectedCharity}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline mt-3 inline-block">
                        View Charity Profile &rarr;
                    </a>
                )}
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <label className="block text-sm font-semibold text-primary">Contribution Percentage</label>
                    <span className="font-extrabold text-accent text-2xl bg-accent/10 px-3 py-1 rounded-lg">{percentage}%</span>
                </div>
                <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={percentage} 
                    onChange={e => setPercentage(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <p className="text-sm text-gray-500 font-medium mt-3">Determine how much of your total subscription goes directly to this charity. Min 10%, Max 100%.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 flex justify-between items-center sm:flex-row flex-col text-center sm:text-left gap-4">
                <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Estimated Monthly Contribution</p>
                    <p className="text-xs text-gray-500">Based on your {dbUser.subscription_plan || 'monthly'} plan</p>
                </div>
                <p className="text-4xl font-black text-primary">£{estContribution} <span className="text-sm font-bold text-gray-500">/mo</span></p>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 text-lg rounded-xl transition disabled:opacity-50">
                {loading ? 'Saving Preferences...' : 'Save Charity Settings'}
            </button>
        </form>
    )
}
