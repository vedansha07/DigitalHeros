"use client"
import { useState, useEffect } from 'react';

export default function AdminWinnersClient() {
    const [winners, setWinners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalWin, setModalWin] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [saving, setSaving] = useState(false);

    // Filters
    const [filterMonth, setFilterMonth] = useState('');
    const [filterPay, setFilterPay] = useState('');

    const loadData = async () => {
        const res = await fetch('/api/admin/winners');
        const data = await res.json();
        if (data.winners) setWinners(data.winners);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filtered = winners.filter(w => {
        if (filterMonth && w.draws?.draw_month !== filterMonth) return false;
        if (filterPay && w.payment_status !== filterPay) return false;
        return true;
    });

    const activeVerif = modalWin?.winner_verifications?.[0];

    const handleApprove = async () => {
        if (!activeVerif) return;
        setSaving(true);
        await fetch(`/api/admin/winners/${activeVerif.id}/approve`, { method: 'PATCH' });
        await loadData();
        setModalWin(null);
        setSaving(false);
    };

    const handleReject = async () => {
        if (!activeVerif || !rejectReason) return alert("Must provide a reason");
        setSaving(true);
        await fetch(`/api/admin/winners/${activeVerif.id}/reject`, { 
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ reason: rejectReason })
        });
        await loadData();
        setModalWin(null);
        setRejectReason('');
        setSaving(false);
    };

    const handleMarkPaid = async (resultId: string) => {
        if (!confirm("Confirm execution? This logs the prize definitively as PAID and dispatches a success email to the user.")) return;
        setSaving(true);
        await fetch(`/api/admin/winners/${resultId}/mark-paid`, { method: 'PATCH' });
        await loadData();
        setModalWin(null);
        setSaving(false);
    }

    if (loading) return <div className="text-gray-500 font-bold px-4 py-8 animate-pulse text-center">Loading Payout Matrix...</div>;

    return (
        <div>
            <div className="flex gap-4 mb-6">
                <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} className="border border-gray-200 p-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-accent font-bold text-gray-700">
                    <option value="">All Months Filter</option>
                    {Array.from(new Set(winners.map(w => w.draws?.draw_month))).map((m: any) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <select value={filterPay} onChange={e=>setFilterPay(e.target.value)} className="border border-gray-200 p-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-accent font-bold text-gray-700">
                    <option value="">All Payment Statuses</option>
                    <option value="pending">Awaiting Action</option>
                    <option value="paid">Definitively Paid</option>
                </select>
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-900 font-extrabold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-5">User Profiling</th>
                            <th className="p-5">Draw Iteration</th>
                            <th className="p-5">Tier</th>
                            <th className="p-5">Owed Payout</th>
                            <th className="p-5">Proof Verification</th>
                            <th className="p-5">Ledger</th>
                            <th className="p-5 text-right">Controller</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(w => {
                            const verif = w.winner_verifications?.[0];
                            const status = verif?.admin_status || 'not_submitted';
                            
                            return (
                                <tr key={w.id} className="hover:bg-gray-50 transition">
                                    <td className="p-5">
                                        <div className="font-extrabold text-primary">{w.users?.full_name}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{w.users?.email}</div>
                                    </td>
                                    <td className="p-5 font-bold text-gray-700">{w.draws?.draw_month}</td>
                                    <td className="p-5 font-bold"><span className="bg-gray-100 px-3 py-1 text-xs rounded-full">{w.match_type.replace('_',' ')}</span></td>
                                    <td className="p-5 font-black text-primary text-lg">£{w.prize_amount.toFixed(2)}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            {status === 'not_submitted' && <span className="text-gray-400 font-bold bg-white border border-gray-200 rounded px-2 py-1 text-xs">Not Submitted</span>}
                                            {status === 'pending' && <span className="text-orange-600 font-bold bg-orange-50 border border-orange-200 rounded px-2 py-1 text-xs flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>Review Req</span>}
                                            {status === 'approved' && <span className="text-green-700 font-bold bg-green-50 border border-green-200 rounded px-2 py-1 text-xs">Approved</span>}
                                            {status === 'rejected' && <span className="text-red-600 font-bold bg-red-50 border border-red-200 rounded px-2 py-1 text-xs">Rejected</span>}
                                            
                                            {verif?.proof_url && status === 'pending' && <img src={verif.proof_url} alt="proof" className="h-10 w-16 object-cover rounded shadow hover:scale-105 transition cursor-pointer border border-gray-200" onClick={()=>setModalWin(w)} />}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {w.payment_status === 'paid' ? <span className="text-green-700 font-black tracking-wider bg-green-100 border border-green-200 px-3 py-1 rounded text-xs">PAID</span> : <span className="text-gray-400 font-bold text-xs">PENDING</span>}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={()=>setModalWin(w)} className="text-accent bg-accent/10 hover:bg-accent hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm border border-accent/20">Manage Panel</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {modalWin && (
                <div className="fixed inset-0 bg-primary/95 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-black text-primary">Master Verification Terminal</h2>
                            <button onClick={()=>{setModalWin(null); setRejectReason('');}} className="text-gray-400 hover:text-red-500 font-black text-2xl transition">&times;</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Authenticated Subject</p>
                                <p className="font-extrabold text-primary text-xl">{modalWin.users?.full_name}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">{modalWin.users?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Locked Prize Amount</p>
                                <p className="font-black text-primary text-3xl mb-1">£{modalWin.prize_amount.toFixed(2)}</p>
                                <span className="text-xs font-extrabold uppercase bg-accent text-white px-3 py-1 rounded shadow-sm">{modalWin.match_type.replace('_',' ')}</span>
                            </div>
                        </div>

                        {activeVerif?.proof_url ? (
                            <div className="mb-10">
                                <p className="font-bold text-primary mb-3">Submitted User Photographic Proof</p>
                                <a href={activeVerif.proof_url} target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden border border-gray-200">
                                    <img src={activeVerif.proof_url} className="w-full h-auto max-h-[400px] object-contain bg-gray-100" alt="Proof" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition">
                                        <p className="text-white font-bold text-sm text-center">Open Full Resolution in New Tab ↗</p>
                                    </div>
                                </a>
                            </div>
                        ) : (
                           <div className="mb-10 p-12 bg-gray-50 text-center rounded-2xl font-bold tracking-wide text-gray-400 border-2 border-dashed border-gray-200">
                               Awaiting participant evidence submission.
                           </div> 
                        )}

                        <div className="flex flex-col gap-4">
                           {activeVerif?.admin_status === 'pending' && (
                               <div className="grid grid-cols-2 gap-4">
                                   <button disabled={saving} onClick={handleApprove} className="w-full border-2 border-green-500 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-700 font-extrabold p-4 rounded-xl disabled:opacity-50 transition">
                                       <span className="block text-xl">Approve Request</span>
                                       <span className="text-xs font-medium opacity-80 mt-1 block">Proceeds to payout phase</span>
                                   </button>
                                   
                                   <div className="border border-red-200 p-4 rounded-xl bg-red-50 flex flex-col justify-between">
                                       <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Mandatory rejection justification..." className="w-full p-3 mb-3 border-red-200 rounded-lg resize-none text-sm focus:outline-red-400" rows={2}></textarea>
                                       <button disabled={saving} onClick={handleReject} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded-lg disabled:opacity-50 shadow-sm transition">
                                           Reject & Notify
                                       </button>
                                   </div>
                               </div>
                           )}

                           {activeVerif?.admin_status === 'approved' && modalWin.payment_status !== 'paid' && (
                               <div className="border-t-4 border-t-accent p-8 rounded-b-2xl rounded-t-lg bg-gray-50 text-center shadow-inner">
                                   <p className="font-extrabold text-2xl text-primary mb-2">Clearance Approved</p>
                                   <p className="font-medium text-gray-500 mb-6">Physical or digital payout is ready to be logged definitively.</p>
                                   <button disabled={saving} onClick={()=>handleMarkPaid(modalWin.id)} className="w-full max-w-sm mx-auto bg-primary hover:bg-primary/90 text-white font-black py-5 px-4 rounded-xl transition shadow-xl text-lg">
                                       Mark Funds as Paid (Dispatches Email)
                                   </button>
                               </div>
                           )}

                           {modalWin.payment_status === 'paid' && (
                               <div className="bg-green-100 text-green-900 px-6 py-8 rounded-2xl text-center font-black text-2xl border-2 border-green-200">
                                   ✓ Payout Completed Validated
                               </div>
                           )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
