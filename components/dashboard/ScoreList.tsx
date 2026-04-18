"use client"
import { useState } from 'react';
import { formatScoreDate } from '@/lib/utils/scoreValidation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreList({ scores, onScoreUpdated }: { scores: any[], onScoreUpdated: () => void }) {
    const [editingId, setEditingId] = useState<string|null>(null);
    const [editScore, setEditScore] = useState<number>(0);
    const [editDate, setEditDate] = useState<string>('');
    const [loading, setLoading] = useState(false);

    if (scores.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📋</span>
                </div>
                <h4 className="text-lg font-semibold text-primary">No scores yet</h4>
                <p className="text-gray-500 mt-1">Add your first Stableford score above to get started.</p>
            </div>
        );
    }

    const startEdit = (s: any) => {
        setEditingId(s.id);
        setEditScore(s.score);
        setEditDate(s.score_date);
    };

    const handleSave = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/scores/${id}`, {
                method: 'PATCH',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ score: editScore, score_date: editDate })
            });
            const data = await res.json();
            if (data.error) alert(data.error);
            else {
                setEditingId(null);
                onScoreUpdated();
            }
        } catch(e) {
            alert('Failed to update score.');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this score?")) return;
        setLoading(true);
        try {
            await fetch(`/api/scores/${id}`, { method: 'DELETE' });
            onScoreUpdated();
        } catch(e) {
            alert('Failed to delete score.');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {scores.map((s, index) => (
                    <motion.div 
                        key={s.id} 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between group"
                    >
                        {editingId === s.id ? (
                            <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
                                <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} className="border border-gray-200 p-2.5 rounded-lg w-full sm:w-auto text-sm focus:ring-2 outline-none focus:ring-accent" />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Score:</span>
                                    <input type="number" min="1" max="45" value={editScore} onChange={e=>setEditScore(parseInt(e.target.value))} className="border border-gray-200 p-2.5 rounded-lg w-20 text-center font-bold text-primary focus:ring-2 outline-none focus:ring-accent" />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                                   <button onClick={() => handleSave(s.id)} disabled={loading} className="w-full sm:w-auto bg-accent text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50">Save</button>
                                   <button onClick={()=>setEditingId(null)} className="w-full sm:w-auto text-gray-500 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg font-medium transition">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-6">
                                    <div className="bg-primary/5 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-primary/10">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{new Date(s.score_date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                        <span className="text-xl font-black text-primary leading-none">{new Date(s.score_date).getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-primary leading-tight"><span className="text-accent">{s.score}</span> <span className="text-sm font-semibold text-gray-400">pts</span></p>
                                        <p className="text-sm font-medium text-gray-500">Stableford Score</p>
                                    </div>
                                </div>
                                <div className="flex sm:opacity-0 group-hover:opacity-100 transition-opacity gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                    <button onClick={()=>startEdit(s)} className="flex-1 sm:flex-none border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition">Edit</button>
                                    <button onClick={()=>handleDelete(s.id)} className="flex-1 sm:flex-none border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition">Delete</button>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
