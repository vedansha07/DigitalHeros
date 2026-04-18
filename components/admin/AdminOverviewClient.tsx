"use client"
import { motion } from 'framer-motion';
import { Users, CreditCard, Award, HeartHandshake, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function AdminOverviewClient({ stats, recentActivity }: any) {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">System Command Center</h1>
                    <p className="text-gray-500 font-medium mt-2 text-lg">Top-level metrics and global performance monitoring.</p>
                </div>
                <Link href="/admin/reports" className="bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
                    <TrendingUp size={20} /> View Full Analytics
                </Link>
            </motion.div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                        <p className="text-4xl font-black text-primary">{stats.userCount}</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CreditCard className="text-green-600" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Active Subscribers</p>
                        <p className="text-4xl font-black text-primary">{stats.activeCount}</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-accent/20 flex flex-col justify-between group hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="text-accent" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Lifetime Prize Pool</p>
                        <p className="text-4xl font-black text-primary">£{stats.totalPrizePool.toFixed(2)}</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 flex flex-col justify-between group hover:shadow-md transition relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transform -rotate-12">
                       <HeartHandshake size={96} />
                    </div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HeartHandshake className="text-rose-500" size={24} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Total Charity Raised</p>
                        <p className="text-4xl font-black text-primary">£{stats.totalCharity.toFixed(2)}</p>
                    </div>
                </motion.div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                
                {/* Application Quick Access */}
                <motion.div variants={item} className="lg:col-span-1 space-y-4">
                    <h2 className="text-2xl font-black text-primary mb-6">Quick Actions</h2>
                    
                    <Link href="/admin/draws" className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg"><Target size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-primary text-lg">Execute Master Draw</h3>
                                    <p className="text-sm text-gray-500 font-medium">Run algorithms & distribute.</p>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-accent transition transform group-hover:translate-x-1" />
                        </div>
                    </Link>

                    <Link href="/admin/charities" className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg"><HeartHandshake size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-primary text-lg">Manage Charity Roster</h3>
                                    <p className="text-sm text-gray-500 font-medium">Add or edit partner profiles.</p>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-rose-500 transition transform group-hover:translate-x-1" />
                        </div>
                    </Link>

                    <Link href="/admin/winners" className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"><Award size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-primary text-lg">Review Winner Proofs</h3>
                                    <p className="text-sm text-gray-500 font-medium">Verify submissions & pay out.</p>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-blue-500 transition transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                </motion.div>

                {/* Score Matrix Stream */}
                <motion.div variants={item} className="lg:col-span-2">
                    <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-2"><Activity className="text-accent" /> Live Log Stream</h2>
                    <div className="bg-white border text-left border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-sm font-bold text-gray-500">Most recent user score inputs globally.</p>
                        </div>
                        {recentActivity.length === 0 ? (
                           <div className="p-10 text-center font-bold text-gray-400">
                               No recent activity recorded.
                           </div>
                        ) : (
                           <div className="divide-y divide-gray-50">
                               {recentActivity.map((log: any) => (
                                   <div key={log.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition">
                                       <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black">
                                                {log.score}
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary text-lg">{log.users?.full_name || 'Anonymous User'}</p>
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{new Date(log.created_at).toLocaleString('en-GB')}</p>
                                            </div>
                                       </div>
                                       <Target className="text-accent/20" />
                                   </div>
                               ))}
                           </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </motion.div>
    )
}
