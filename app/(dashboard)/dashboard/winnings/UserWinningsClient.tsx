"use client"
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function UserWinningsClient() {
    const [winnings, setWinnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const loadData = async () => {
        const res = await fetch('/api/user/winnings');
        const data = await res.json();
        if (data.winnings) setWinnings(data.winnings);
        setLoading(false);
    }

    useEffect(() => { loadData(); }, []);

    const handleUpload = async (file: File, resultId: string) => {
        setUploadingId(resultId);
        
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Images only: Must be JPG or PNG.');
            setUploadingId(null); return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large: Must be less than 5MB.');
            setUploadingId(null); return;
        }

        const ext = file.name.split('.').pop();
        const path = `${resultId}-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage.from('winner-proofs').upload(path, file);
        if (upErr) {
            alert('Failed to securely upload image.');
            setUploadingId(null); return;
        }

        const { data } = supabase.storage.from('winner-proofs').getPublicUrl(path);
        
        const res = await fetch(`/api/user/winnings/${resultId}/proof`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ proof_url: data.publicUrl })
        });
        
        if (res.ok) {
            alert('Proof submitted securely! Awaiting admin review.');
            loadData();
        } else alert('Submission failed to register on the server.');
        
        setUploadingId(null);
    }

    if (loading) return <div className="text-gray-500 font-bold p-10 text-center animate-pulse">Loading Winnings...</div>;

    if (winnings.length === 0) return <div className="bg-white p-16 text-center rounded-2xl border border-gray-100 shadow-sm text-gray-500 shadow-inner">You haven't won any prizes yet. Ensure you record your 5 scores before monthly draws!</div>;

    return (
        <div className="space-y-6">
            {winnings.map(win => {
                const verified = win.winner_verifications && win.winner_verifications.length > 0 ? win.winner_verifications[0] : null;
                const status = verified ? verified.admin_status : 'not_submitted';
                
                return (
                    <div key={win.id} className="bg-white border hover:border-gray-300 transition rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <h3 className="text-2xl font-extrabold text-primary">{win.draws?.draw_month}</h3>
                                <span className="bg-accent/10 border border-accent/20 text-accent font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">{win.match_type.replace('_', ' ')}es</span>
                                {win.payment_status === 'paid' && <span className="bg-green-100 border border-green-200 text-green-800 font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">PAID</span>}
                            </div>
                            <p className="text-4xl font-black text-primary mb-3">£{win.prize_amount.toFixed(2)}</p>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Status:</span>
                                {status === 'not_submitted' && <span className="text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">Awaiting Proof</span>}
                                {status === 'pending' && <span className="text-orange-500 font-bold bg-orange-50 border border-orange-100 px-3 py-1 rounded-full text-xs">Review Pending</span>}
                                {status === 'approved' && <span className="text-green-600 font-bold bg-green-50 border border-green-100 px-3 py-1 rounded-full text-xs">Approved</span>}
                                {status === 'rejected' && <span className="text-red-500 font-bold bg-red-50 border border-red-100 px-3 py-1 rounded-full text-xs">Rejected</span>}
                            </div>
                            
                            {status === 'rejected' && verified?.admin_notes && (
                                <div className="mt-4 bg-red-50 p-4 rounded-xl text-sm text-red-800 border border-red-200 font-medium">
                                    <strong className="text-red-900 mb-1 block">Admin Follow-up required:</strong> {verified.admin_notes}
                                </div>
                            )}
                        </div>

                        {win.payment_status !== 'paid' && status !== 'approved' && status !== 'pending' && (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-2xl w-full md:w-80 group hover:bg-gray-100 transition relative">
                                <label className="block text-sm font-bold text-primary mb-2">Upload Certified Score Card</label>
                                <p className="text-xs text-gray-500 mb-4 font-medium">(JPG/PNG only, 5MB Max)</p>
                                
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg" 
                                    disabled={uploadingId === win.id}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0], win.id);
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 transition cursor-pointer"
                                />
                                {uploadingId === win.id && <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center text-accent font-bold">Uploading securely...</div>}
                            </div>
                        )}
                        
                        {status === 'pending' && (
                            <div className="text-sm w-full md:w-80 text-orange-600 font-bold bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center shadow-sm">
                                Proof currently under review.
                            </div>
                        )}

                        {(status === 'approved' || win.payment_status === 'paid') && (
                            <div className="w-full md:w-80 text-center">
                                {win.payment_status === 'paid' ? 
                                    <div className="bg-green-100/50 border border-green-200 p-6 rounded-2xl">
                                        <p className="text-green-800 font-bold">Payment has been dispatched.</p>
                                    </div> 
                                : 
                                    <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl">
                                        <p className="text-accent font-bold">Proof Approved. Processing Payout.</p>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    )
}
