"use client"
import { useState } from 'react';
import { validateScore, validateScoreDate } from '@/lib/utils/scoreValidation';

export default function ScoreEntry({ scoresCount, existingDates, onScoreAdded }: { scoresCount: number, existingDates: string[], onScoreAdded: () => void }) {
    const [score, setScore] = useState<number>(36);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningAcknowledged, setWarningAcknowledged] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const scoreVal = validateScore(score);
        if (!scoreVal.valid) return setError(scoreVal.error!);
        
        const dateVal = validateScoreDate(date, existingDates);
        if (!dateVal.valid) return setError(dateVal.error!);

        if (scoresCount >= 5 && !warningAcknowledged) {
            setShowWarning(true);
            return;
        }

        executeSubmit();
    }

    const executeSubmit = async () => {
        setLoading(true);
        setShowWarning(false);
        setWarningAcknowledged(false);
        try {
            const res = await fetch('/api/scores', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ score, score_date: date })
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else {
                setScore(36);
                setDate(new Date().toISOString().split('T')[0]);
                onScoreAdded();
            }
        } catch(err) {
            setError('Failed to add score. Please try again.');
        }
        setLoading(false);
    }

    const confirmWarning = () => {
        setWarningAcknowledged(true);
        // Using setTimeout to guarantee state pushes before dom executes form submit immediately
        setTimeout(() => executeSubmit(), 0);
    }

    return (
        <>
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-primary mb-2">Add New Score</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 mb-6">
               <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">Capacity: {scoresCount}/5 scores</span>
            </div>

            {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-primary mb-2" htmlFor="score_date">Score Date</label>
                    <input id="score_date" type="date" required value={date} onChange={e=>setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-accent outline-none transition" />
                </div>
                
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-primary mb-2" htmlFor="score_value">Stableford Score (1-45)</label>
                    <div className="flex items-center">
                        <button type="button" aria-label="Decrease score" onClick={()=>setScore(Math.max(1, score-1))} className="px-5 py-3 h-[46px] min-w-[44px] flex items-center justify-center bg-gray-50 rounded-l-xl border border-gray-200 border-r-0 hover:bg-gray-100 transition font-bold text-lg text-gray-600">-</button>
                        <input id="score_value" type="number" required min="1" max="45" value={score} onChange={e=>setScore(parseInt(e.target.value) || 0)} className="h-[46px] w-full border border-gray-200 p-3 text-center outline-none focus:ring-2 focus:ring-accent z-10 text-lg font-bold text-primary" />
                        <button type="button" aria-label="Increase score" onClick={()=>setScore(Math.min(45, score+1))} className="px-5 py-3 h-[46px] min-w-[44px] flex items-center justify-center bg-gray-50 rounded-r-xl border border-gray-200 border-l-0 hover:bg-gray-100 transition font-bold text-lg text-gray-600">+</button>
                    </div>
                </div>

                <div className="sm:flex-none flex items-end">
                    <button type="submit" disabled={loading} className="w-full h-[46px] min-w-[44px] sm:w-40 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50">
                        {loading ? 'Adding...' : 'Add Score'}
                    </button>
                </div>
            </div>
        </form>

        {showWarning && (
            <div className="fixed inset-0 bg-primary/90 flex items-center justify-center z-50 p-4 transition-all">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                     <h3 className="text-xl font-black text-rose-600 mb-2">Maximum Capacity Reached</h3>
                     <p className="text-gray-500 font-medium text-sm mb-8">
                         Your physical matrix is currently at maximum capacity (5 entries). Appending a 6th entry will automatically overwrite your oldest log to maintain parameters. Is this acceptable?
                     </p>
                     <div className="flex flex-col sm:flex-row gap-3">
                          <button onClick={confirmWarning} className="flex-1 bg-rose-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-rose-600 transition min-h-[44px]">Overwrite Data</button>
                          <button onClick={()=>setShowWarning(false)} className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition min-h-[44px]">Abort Execution</button>
                     </div>
                </div>
            </div>
        )}
        </>
}
