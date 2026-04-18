"use client"
import { useState, useEffect } from 'react';
import { Target, Search } from 'lucide-react';

export default function AdminUsersClient() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalUser, setModalUser] = useState<any>(null);
    const [detailUser, setDetailUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState('');

    const loadUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.users) setUsers(data.users);
        setLoading(false);
    }

    useEffect(() => { loadUsers(); }, []);

    const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search));

    const openModal = async (userId: string) => {
        setDetailUser(null);
        setModalUser(userId);
        const res = await fetch(`/api/admin/users/${userId}`);
        const data = await res.json();
        setDetailUser(data);
        setEditName(data.user.full_name || '');
        setEditStatus(data.user.subscription_status || 'inactive');
    }

    const handleSave = async () => {
        if (!detailUser) return;
        setSaving(true);
        await fetch(`/api/admin/users/${detailUser.user.id}`, {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ full_name: editName, subscription_status: editStatus })
        });
        await loadUsers();
        setModalUser(null);
        setSaving(false);
    }

    if (loading) return <div className="text-center p-10 font-bold text-gray-400 animate-pulse">Loading Member Directory Configuration...</div>

    return (
        <div>
            <div className="mb-6 relative w-full max-w-md">
                <Search className="absolute left-4 top-[14px] text-gray-400" size={20} />
                <input type="text" placeholder="Index search by name..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full border border-gray-200 py-3 pl-12 pr-4 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-accent font-medium text-gray-700 bg-white" />
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 text-gray-500 font-extrabold uppercase tracking-widest text-[10px] border-b border-gray-100">
                        <tr>
                            <th className="p-5">Identifier Handle</th>
                            <th className="p-5">Profile Alias</th>
                            <th className="p-5">Membership Link</th>
                            <th className="p-5">Data Output</th>
                            <th className="p-5">Ingestion Date</th>
                            <th className="p-5 text-right">Permissions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-5 font-mono text-xs text-gray-400 tracking-wider bg-gray-50 rounded-lg m-2">{u.id.substring(0,8)}...</td>
                                <td className="p-5 font-black text-primary text-base">{u.full_name || 'Unmapped Entity'}</td>
                                <td className="p-5">
                                    <div className="flex gap-2 items-center">
                                        <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${u.subscription_status === 'active' ? 'bg-green-50 border-green-200 text-green-700' : u.subscription_status === 'cancelled' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-red-50 border-red-200 text-red-700'}`}>{u.subscription_status}</span>
                                        {u.subscription_plan && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{u.subscription_plan}</span>}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="font-black text-accent bg-accent/5 border border-accent/20 px-3 py-1 rounded-full text-xs shadow-sm">{u.golf_scores?.length || 0}/5 Logged</span>
                                </td>
                                <td className="p-5 text-xs text-gray-400 font-bold tracking-wide">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                                <td className="p-5 text-right">
                                    <button onClick={()=>openModal(u.id)} className="text-primary hover:text-accent font-black px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-accent hover:bg-accent/10 transition text-xs shadow-sm shadow-black/5 uppercase tracking-wide">Override</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="text-center p-10 font-bold text-gray-400">0 records mapped.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalUser && (
                <div className="fixed inset-0 bg-primary/95 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                            <h2 className="text-3xl font-black text-primary tracking-tight">Member Control Core</h2>
                            <button onClick={()=>setModalUser(null)} className="text-gray-300 hover:text-red-500 font-black text-3xl transition">&times;</button>
                        </div>

                        {!detailUser ? <div className="p-12 font-black text-center text-gray-300 animate-pulse text-lg tracking-widest uppercase">Initializing Schema...</div> : (
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Display Alias Target</label>
                                        <input value={editName} onChange={e=>setEditName(e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-accent/20 outline-none font-bold text-gray-900 transition text-lg bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hard Access Override</label>
                                        <select value={editStatus} onChange={e=>setEditStatus(e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-accent/20 outline-none font-bold text-primary transition text-lg bg-gray-50">
                                            <option value="active">🟢 Active Node (Total Access)</option>
                                            <option value="inactive">⚪ Inactive Node</option>
                                            <option value="cancelled">🟠 Cancelled (Lapsing Cycle)</option>
                                            <option value="lapsed">🔴 Lapsed (Purged Access)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 relative overflow-hidden">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 relative z-10">Historical Data Matrix (Last {detailUser.scores.length})</h3>
                                    {detailUser.scores.length === 0 ? (
                                        <p className="text-sm text-gray-500 font-bold p-6 bg-white rounded-xl border border-dashed border-gray-300 text-center relative z-10">No data points propagated yet.</p>
                                    ) : (
                                        <div className="space-y-4 relative z-10">
                                            {detailUser.scores.map((s:any) => (
                                                <div key={s.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent font-black text-xl shadow-inner">{s.score}</div>
                                                        <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded shadow-sm">{s.score_date}</span>
                                                    </div>
                                                    <Target size={20} className="text-gray-200" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transform -rotate-12">
                                        <Target size={180} />
                                    </div>
                                </div>

                                <button disabled={saving} onClick={handleSave} className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 transition shadow-xl text-lg uppercase tracking-wide">
                                    {saving ? 'Commiting Protocol...' : 'Finalize & Save Member Schema'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
