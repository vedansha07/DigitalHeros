"use client"
import { useState, useEffect } from 'react';
import { Target, Play, CheckCircle, Database } from 'lucide-react';

export default function AdminDrawsClient() {
    const [draws, setDraws] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Create Draw Form States
    const [showCreate, setShowCreate] = useState(false);
    const [drawMonth, setDrawMonth] = useState('');
    const [drawType, setDrawType] = useState('random');
    const [algoWeight, setAlgoWeight] = useState('most_frequent');
    const [creating, setCreating] = useState(false);

    // Simulation Modal States
    const [simulation, setSimulation] = useState<any>(null);
    const [selectedDrawId, setSelectedDrawId] = useState<string|null>(null);
    const [simulating, setSimulating] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const loadDraws = async () => {
        const res = await fetch('/api/admin/draws');
        const data = await res.json();
        if (data.draws) setDraws(data.draws);
        setLoading(false);
    }

    useEffect(() => { loadDraws(); }, []);

    const handleCreate = async () => {
        if (!drawMonth) return alert('Month required');
        setCreating(true);
        await fetch('/api/admin/draws', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                drawMonth, 
                drawType, 
                algoWeight: drawType === 'algorithmic' ? algoWeight : undefined 
            })
        });
        await loadDraws();
        setShowCreate(false);
        setCreating(false);
    }

    const runSimulation = async (id: string) => {
        setSimulating(true);
        setSelectedDrawId(id);
        const res = await fetch(`/api/admin/draws/${id}/simulate`, { method: 'POST' });
        const data = await res.json();
        setSimulation(data.simulation);
        setSimulating(false);
    }

    const publishDraw = async () => {
        if (!selectedDrawId) return;
        setPublishing(true);
        await fetch(`/api/admin/draws/${selectedDrawId}/publish`, { method: 'POST' });
        setSimulation(null);
        setSelectedDrawId(null);
        await loadDraws();
        setPublishing(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button onClick={() => setShowCreate(!showCreate)} className="bg-primary text-white px-6 py-3 rounded-lg font-black tracking-wide flex items-center gap-2 hover:bg-primary/90 transition shadow-lg">
                    <Database size={18} /> Initialize New Draw
                </button>
            </div>

            {showCreate && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-black text-primary mb-6">Draw Initialization Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Month</label>
                            <input type="text" placeholder="e.g. October 2024" value={drawMonth} onChange={e=>setDrawMonth(e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-accent/20 outline-none font-bold bg-gray-50 text-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Logic Engine</label>
                            <select value={drawType} onChange={e=>setDrawType(e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-accent/20 outline-none font-bold text-primary bg-gray-50">
                                <option value="random">Random Number Generator</option>
                                <option value="algorithmic">Algorithmic Distribution</option>
                            </select>
                        </div>
                        {drawType === 'algorithmic' && (
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Weight Vector</label>
                                <select value={algoWeight} onChange={e=>setAlgoWeight(e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-accent/20 outline-none font-bold text-primary bg-gray-50">
                                    <option value="most_frequent">Most Frequent (Common Stats)</option>
                                    <option value="least_frequent">Least Frequent (Outlier Stats)</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button disabled={creating} onClick={handleCreate} className="bg-accent text-white font-black px-6 py-3 rounded-lg hover:bg-accent/90 transition shadow-md">{creating ? 'Executing...' : 'Commit Initialization'}</button>
                        <button onClick={()=>setShowCreate(false)} className="bg-gray-100 text-gray-500 font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white border text-left border-gray-200 rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 text-gray-500 font-extrabold uppercase tracking-widest text-[10px] border-b border-gray-100">
                        <tr>
                            <th className="p-5">Cycle Month</th>
                            <th className="p-5">Draw Logic</th>
                            <th className="p-5">Global Fund</th>
                            <th className="p-5">Extracted Vector</th>
                            <th className="p-5">Lifecycle Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading && <tr><td colSpan={6} className="text-center font-bold text-gray-400 py-10 animate-pulse">Fetching Draw Engine Registers...</td></tr>}
                        {!loading && draws.map(draw => (
                            <tr key={draw.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-5 font-black text-primary text-base">{draw.draw_month}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider ${draw.draw_type === 'algorithmic' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{draw.draw_type}</span>
                                </td>
                                <td className="p-5 font-bold text-primary">£{draw.total_prize_pool?.toFixed(2)}</td>
                                <td className="p-5 text-xs font-mono text-gray-600 bg-gray-50 rounded-lg whitespace-nowrap">{(draw.drawn_numbers||[]).join(', ')}</td>
                                <td className="p-5">
                                    {draw.status === 'published' ? (
                                        <span className="text-green-700 font-black bg-green-50 border border-green-200 px-3 py-1 rounded text-xs uppercase tracking-widest flex items-center gap-2 w-max"><CheckCircle size={14}/> Published</span>
                                    ) : (
                                        <span className="text-orange-600 font-black bg-orange-50 border border-orange-200 px-3 py-1 rounded text-xs uppercase tracking-widest flex items-center gap-2 w-max">Draft State</span>
                                    )}
                                </td>
                                <td className="p-5 text-right">
                                    {draw.status === 'draft' && (
                                        <button onClick={()=>runSimulation(draw.id)} disabled={simulating} className="text-accent bg-accent/10 border border-accent/20 font-black px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition uppercase text-xs tracking-wide">
                                            {simulating && selectedDrawId===draw.id ? 'Loading...' : 'Run Simulation'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simulation Preview Modal */}
            {simulation && (
                 <div className="fixed inset-0 bg-primary/95 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
                     <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-3xl w-full">
                         <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                             <h2 className="text-3xl font-black text-primary tracking-tight">Pre-Flight Simulation</h2>
                             <button onClick={()=>setSimulation(null)} disabled={publishing} className="text-gray-300 hover:text-red-500 font-black text-3xl transition disabled:opacity-50">&times;</button>
                         </div>

                         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 flex justify-between items-center text-center">
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pool Fund</p>
                                  <p className="text-2xl font-black text-primary border-b-2 border-accent/30 leading-snug">£{simulation.netPool}</p>
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Previous Rollover</p>
                                  <p className="text-xl font-bold text-gray-600">£{simulation.rolloverAdded}</p>
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valid Participant Matrices</p>
                                  <p className="text-xl font-bold text-gray-600">{simulation.totalValidUsers}</p>
                              </div>
                         </div>

                         <div className="space-y-4 mb-10">
                            {/* 5 Matches */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                         <span className="bg-accent text-primary text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded">Tier 1</span>
                                         <span className="font-bold text-primary">5 Matches (Jackpot)</span>
                                     </div>
                                     <p className="text-sm text-gray-400 font-medium">{simulation.matchCounts['5_match']} winner(s) split 40%</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xl font-black text-primary">£{simulation.prizes['5_match']}</p>
                                     <p className="text-xs font-bold text-gray-400">Total Available</p>
                                 </div>
                            </div>
                            
                            {/* 4 Matches */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                         <span className="bg-gray-200 text-gray-600 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded">Tier 2</span>
                                         <span className="font-bold text-primary">4 Matches</span>
                                     </div>
                                     <p className="text-sm text-gray-400 font-medium">{simulation.matchCounts['4_match']} winner(s) split 35%</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xl font-black text-primary">£{simulation.prizes['4_match']}</p>
                                     <p className="text-xs font-bold text-gray-400">Total Available</p>
                                 </div>
                            </div>

                            {/* 3 Matches */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                         <span className="bg-gray-200 text-gray-600 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded">Tier 3</span>
                                         <span className="font-bold text-primary">3 Matches</span>
                                     </div>
                                     <p className="text-sm text-gray-400 font-medium">{simulation.matchCounts['3_match']} winner(s) split 25%</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xl font-black text-primary">£{simulation.prizes['3_match']}</p>
                                     <p className="text-xs font-bold text-gray-400">Total Available</p>
                                 </div>
                            </div>
                         </div>

                         <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-amber-800 text-sm font-medium">
                             <strong>Warning:</strong> Publishing this draw will physically commit all simulated parameters to the live Database ledger. This action is irreversible. It will map individual draw_results into users' individual dashboards globally and issue immediate congratulatory emails.
                         </div>

                         <button disabled={publishing} onClick={publishDraw} className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 transition shadow-xl text-lg uppercase tracking-widest flex items-center justify-center gap-2">
                             {publishing ? 'Committing to Production...' : <><Play size={20} fill="currentColor"/> Publish Final Distribution</>}
                         </button>
                     </div>
                 </div>
            )}
        </div>
    )
}
