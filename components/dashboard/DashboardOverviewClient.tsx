"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, CreditCard, ChevronRight, Target, HeartHandshake, TrendingUp } from 'lucide-react';
import ScoreEntry from './ScoreEntry';

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

export default function DashboardOverviewClient({ dbUser, scores, nextDraw, charity, winnings }: any) {
    const isActive = dbUser.subscription_status === 'active';
    const renewalDate = dbUser.subscription_renewal_date ? new Date(dbUser.subscription_renewal_date) : null;
    const renewalFormatted = renewalDate ? renewalDate.toLocaleDateString('en-GB') : 'Unknown';

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
            <motion.div variants={item} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">Welcome back, {dbUser.full_name?.split(' ')[0] || 'Player'}</h1>
                    <p className="text-gray-500 font-medium mt-2 text-lg">Here is your digital hero summary for the month.</p>
                </div>
            </motion.div>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Registration/Sub Card */}
                <motion.div variants={item} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CreditCard className="text-primary" size={24} />
                        </div>
                        {isActive ? <span className="bg-green-100 border border-green-200 text-green-800 text-[10px] font-black uppercase px-3 py-1 rounded">Active</span> : <span className="bg-red-100 border border-red-200 text-red-800 text-[10px] font-black uppercase px-3 py-1 rounded">Inactive</span>}
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Current Plan</p>
                        <p className="text-2xl font-black text-primary capitalize">{dbUser.subscription_plan || 'No Plan'}</p>
                        <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1">Renews: {renewalFormatted}</p>
                    </div>
                </motion.div>

                {/* Score Status */}
                <motion.div variants={item} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="text-accent" size={24} />
                        </div>
                        <span className="font-black text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded">{scores.length}/5 Output</span>
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Score Matrix</p>
                        <p className="text-2xl font-black text-primary">{scores.length === 5 ? 'Ready' : `${5 - scores.length} Missing`}</p>
                        <Link href="/dashboard/scores" className="text-accent text-xs font-bold hover:underline mt-2 inline-flex items-center">Open Scorecard <ChevronRight size={14} className="ml-0.5" /></Link>
                    </div>
                </motion.div>

                {/* Charity Giving */}
                <motion.div variants={item} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none transform rotate-12">
                       <HeartHandshake size={96} />
                    </div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HeartHandshake className="text-rose-500" size={24} />
                        </div>
                        <span className="font-black text-xs text-primary bg-gray-100 border border-gray-200 px-3 py-1 rounded">{dbUser.charity_contribution_percentage}% Split</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Active Charity</p>
                        <p className="text-2xl font-black text-primary truncate" title={charity ? charity.name : 'None Selected'}>{charity ? charity.name : 'Not Setup'}</p>
                        <Link href="/dashboard/charity" className="text-accent text-xs font-bold hover:underline mt-2 inline-flex items-center">Manage Giving <ChevronRight size={14} className="ml-0.5"/></Link>
                    </div>
                </motion.div>

                {/* Next Draw Target */}
                <motion.div variants={item} className="bg-primary p-7 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden text-white group hover:shadow-2xl transition duration-300">
                    <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition duration-500"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="h-12 w-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="text-accent" size={24} />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded shadow-sm">Upcoming Event</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-1">Target Implementation</p>
                        <p className="text-3xl font-black text-white tracking-tight">{nextDraw ? nextDraw.draw_month : 'TBD'}</p>
                        <p className="text-xs text-white/80 mt-2 font-bold flex items-center gap-1.5 opacity-90">{isActive && scores.length === 5 ? <span className="text-accent">✓ Authorized Entry</span> : '✕ Entry Action Required'}</p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-6">
                {/* Quick Add Score */}
                <motion.div variants={item} className="xl:col-span-1">
                    <h2 className="text-2xl font-black text-primary mb-6">Quick Log Matrix</h2>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <ScoreEntry scoreCount={scores.length} />
                    </div>
                </motion.div>

                {/* Recent Winnings */}
                <motion.div variants={item} className="xl:col-span-2">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-black text-primary">Recent Payout Ledger</h2>
                        <Link href="/dashboard/winnings" className="text-sm font-bold text-accent hover:text-primary transition bg-accent/5 hover:bg-accent/10 px-4 py-2 rounded-lg">Browse Full Book</Link>
                    </div>
                    <div className="bg-white border text-left border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        {winnings.length === 0 ? (
                           <div className="p-12 text-center flex items-center justify-center flex-col">
                               <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                   <Award className="text-gray-300" size={32} />
                               </div>
                               <p className="font-bold text-lg text-gray-500">No historical payouts attached to this profile.</p>
                               <p className="text-gray-400 font-medium text-sm mt-1">Maintain your 5 matrices to be eligible for upcoming distributions.</p>
                           </div>
                        ) : (
                           <table className="w-full text-sm">
                               <thead className="bg-gray-50/80 text-gray-400 font-black uppercase tracking-widest text-[10px] border-b border-gray-50">
                                   <tr>
                                       <th className="p-6 text-left">Draw Cycle Allocation</th>
                                       <th className="p-6 text-left">Internal Tier Match</th>
                                       <th className="p-6 text-left">Fund Output</th>
                                       <th className="p-6 text-right">Ledger Status</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-50">
                                   {winnings.map((w: any) => (
                                       <tr key={w.id} className="hover:bg-gray-50/50 transition">
                                           <td className="p-6 font-extrabold text-primary text-base">{w.draws?.draw_month}</td>
                                           <td className="p-6">
                                               <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded text-xs tracking-wide">{w.match_type.replace('_',' ')}es</span>
                                           </td>
                                           <td className="p-6 font-black text-primary text-xl">£{w.prize_amount.toFixed(2)}</td>
                                           <td className="p-6 text-right">
                                               {w.payment_status === 'paid' ? (
                                                  <span className="text-green-700 font-black bg-green-50 border border-green-100 px-3 py-1 rounded text-xs uppercase tracking-widest">Definitive</span>
                                               ) : (
                                                  <span className="text-orange-600 font-black bg-orange-50 border border-orange-100 px-3 py-1 rounded text-xs uppercase tracking-widest">Pending</span>
                                               )}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
