"use client"
import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0B1F3A', '#00C96B', '#3b82f6', '#f43f5e', '#8b5cf6', '#eab308'];

export default function AdminReportsClient({ users, draws, charities, contributions, allDraws }: any) {
    
    // 1. Line Chart Data (Cumulative User Growth by month)
    const growthData = useMemo(() => {
        const counts: Record<string, number> = {};
        users.forEach((u: any) => {
            const date = new Date(u.created_at);
            const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        
        let cumulative = 0;
        return Object.keys(counts).sort().map(month => {
            cumulative += counts[month];
            return { month, Users: cumulative };
        });
    }, [users]);

    // 2. Bar Chart Data (Prize Pool per Month)
    const prizeData = draws.map((d: any) => ({
        month: d.draw_month,
        Pool: d.total_prize_pool
    }));

    // 3. Pie Chart Data (Charity Distribution)
    const charityData = useMemo(() => {
        const totals: Record<string, number> = {};
        contributions.forEach((c: any) => {
            const name = charities.find((ch: any) => ch.id === c.charity_id)?.name || 'Unknown';
            totals[name] = (totals[name] || 0) + c.amount;
        });
        return Object.keys(totals).map(name => ({
            name, value: totals[name]
        })).filter(d => d.value > 0);
    }, [contributions, charities]);

    // 4. Data Table (Match stats per draw)
    const tableStats = allDraws.map((d: any) => {
        const matches5 = d.draw_results.filter((r: any) => r.match_type === '5_match').length;
        const matches4 = d.draw_results.filter((r: any) => r.match_type === '4_match').length;
        const matches3 = d.draw_results.filter((r: any) => r.match_type === '3_match').length;
        return {
            month: d.draw_month,
            totalHits: d.draw_results.length,
            m5: matches5,
            m4: matches4,
            m3: matches3
        };
    });

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-primary mb-6">Cumulative Member Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                <Line type="monotone" dataKey="Users" stroke="#0B1F3A" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-primary mb-6">Historical Prize Pools</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={prizeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val)=>`£${val}`} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="Pool" fill="#00C96B" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/3 w-full">
                       <h3 className="text-xl font-black text-primary mb-2">Philanthropic Dispersion</h3>
                       <p className="text-sm font-medium text-gray-500 mb-6">Aggregate summation of all fractional and independent donations distributed to charity partners via Stripe Webhooks.</p>
                       <div className="space-y-4">
                           {charityData.map((c, i) => (
                               <div key={c.name} className="flex justify-between items-center text-sm font-bold border-b border-gray-50 pb-2">
                                   <div className="flex items-center gap-2">
                                       <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                                       <span className="text-gray-700">{c.name}</span>
                                   </div>
                                   <span className="font-black text-primary">£{c.value.toFixed(2)}</span>
                               </div>
                           ))}
                       </div>
                    </div>
                    <div className="h-80 md:w-2/3 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={charityData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                                    {charityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => `£${Number(val).toFixed(2)}`} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
                    <h3 className="text-xl font-black text-primary mb-6">Historical Output Dispersions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/80 text-gray-400 font-black uppercase tracking-widest text-[10px] border-b border-gray-50">
                                <tr>
                                    <th className="p-5">Published Cycle</th>
                                    <th className="p-5 text-center">Total Verified Winners</th>
                                    <th className="p-5 text-center">Tier 1 (5 Matches)</th>
                                    <th className="p-5 text-center">Tier 2 (4 Matches)</th>
                                    <th className="p-5 text-center border-l border-gray-100 bg-gray-50/20">Tier 3 (3 Matches)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tableStats.map((stat: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition">
                                        <td className="p-5 font-bold text-primary">{stat.month}</td>
                                        <td className="p-5 text-center font-black text-lg bg-gray-50/50">{stat.totalHits}</td>
                                        <td className="p-5 text-center font-bold text-accent">{stat.m5} user(s)</td>
                                        <td className="p-5 text-center font-bold text-blue-600">{stat.m4} user(s)</td>
                                        <td className="p-5 text-center font-bold text-gray-500 border-l border-gray-50 bg-gray-50/20">{stat.m3} user(s)</td>
                                    </tr>
                                ))}
                                {tableStats.length === 0 && <tr><td colSpan={5} className="text-center py-10 font-bold text-gray-400">No historical draws published.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
