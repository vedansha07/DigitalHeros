"use client"
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Layers, Trophy, HeartHandshake, ArrowRight, Activity, Cpu } from 'lucide-react';

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
            {children}
        </motion.div>
    );
};

export default function PublicHomeClient({ featuredCharity, pendingDraw, usersCount, totalDonated }: any) {
    
    const displayPool = pendingDraw ? (pendingDraw.total_prize_pool || 0) : 0;
    
    // Quick number counter effect for impact values
    const [countDonated, setCountDonated] = useState(0);
    useEffect(() => {
        let current = 0;
        const target = totalDonated;
        const step = target / 50; 
        if (target <= 0) return;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                setCountDonated(target);
                clearInterval(timer);
            } else {
                setCountDonated(Math.floor(current));
            }
        }, 30);
        return () => clearInterval(timer);
    }, [totalDonated]);

    return (
        <div className="bg-primary min-h-screen text-white selection:bg-accent/30 selection:text-white">
            
            {/* SECTION 1: HERO */}
            <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
                {/* Abstract Tech Background */}
                <div className="absolute inset-0 z-0">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-b from-accent/5 to-transparent blur-[120px] mix-blend-screen pointer-events-none" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-500/5 to-accent/5 blur-[100px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-4xl">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-xs font-bold tracking-widest uppercase text-gray-300">Algorithmic Distribution Engine</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-8">
                            Output-Driven <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent/80 to-accent">Philanthropy.</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mb-12 leading-relaxed">
                            Log internal logic matrices. Access the global smart-distribution pool. Direct capital securely into registered charitable foundations concurrently.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                            <Link href="/subscribe" className="bg-accent text-primary px-8 py-5 rounded-2xl font-black text-lg text-center hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(0,201,107,0.4)]">
                                Initialize Subscription
                            </Link>
                            <Link href="/how-it-works" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-5 rounded-2xl font-bold text-lg text-center hover:bg-white/10 transition">
                                Review Process Logic
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: HOW IT WORKS PIPELINE */}
            <section className="py-32 relative bg-[#091527]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <FadeInWhenVisible>
                        <h2 className="text-sm font-black tracking-widest text-accent uppercase mb-4">Pipeline Architecture</h2>
                        <p className="text-4xl md:text-5xl font-black mb-16 tracking-tight">Three exact states. <br/>Zero gambles.</p>
                    </FadeInWhenVisible>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-[45px] left-0 right-0 h-px bg-gradient-to-r from-accent/50 to-transparent z-0"></div>
                        
                        <FadeInWhenVisible delay={0.1} className="relative z-10">
                            <div className="h-24 w-24 bg-primary border-2 border-accent/30 rounded-3xl flex items-center justify-center mb-8 shadow-xl relative mt-[-2rem] md:mt-0">
                                <Layers size={36} className="text-accent" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 bg-accent text-primary font-black rounded-lg flex items-center justify-center text-sm shadow-md">01</div>
                            </div>
                            <h3 className="text-2xl font-black mb-4">Network Subscription</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">Establish base continuity into the platform network. Your active node funds both the Monthly Prize Distribution engine and your explicitly selected Foundation.</p>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2} className="relative z-10">
                            <div className="h-24 w-24 bg-primary border-2 border-accent/20 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                                <Target size={36} className="text-blue-400" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 bg-blue-400 text-primary font-black rounded-lg flex items-center justify-center text-sm shadow-md">02</div>
                            </div>
                            <h3 className="text-2xl font-black mb-4">Data Propagation</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">Upload your precise performance metrics across 5 identical matrices into the database. A completed 5-node dataset permanently authorizes your specific entry keys for that month.</p>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.3} className="relative z-10">
                            <div className="h-24 w-24 bg-primary border-2 border-accent/20 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                                <Cpu size={36} className="text-indigo-400" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 bg-indigo-400 text-primary font-black rounded-lg flex items-center justify-center text-sm shadow-md">03</div>
                            </div>
                            <h3 className="text-2xl font-black mb-4">Algorithmic Match</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">The Core executes randomly across 1-45 nodes globally. Datasets matching 3, 4, or 5 numbers programmatically inherit fractional sums from the global liquidity pool automatically.</p>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* SECTION 4: PRIZE POOL EXPLAINER */}
            <section className="py-32 relative overflow-hidden border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeInWhenVisible>
                            <h2 className="text-sm font-black tracking-widest text-accent uppercase mb-4">Mathematical Dispersion</h2>
                            <p className="text-4xl lg:text-5xl font-black mb-8 tracking-tight">Structured <br/>Capital Logistics.</p>
                            <p className="text-xl font-medium text-gray-400 mb-8 leading-relaxed">
                                Our programmatic layer ingests subscription inputs, permanently strips the fractional percentage towards verified charity hooks, and consolidates the rest into an untouchable global pool.
                            </p>
                            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Staging Minimum Pool</p>
                                    <p className="text-4xl font-black text-accent">£{displayPool.toFixed(2)}</p>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                        
                        <FadeInWhenVisible delay={0.2}>
                            <div className="space-y-6">
                                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm flex items-center gap-6 group hover:bg-white/10 transition">
                                    <div className="h-16 w-16 bg-accent/20 text-accent font-black text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">40%</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Tier 1 Target Matrix</h3>
                                        <p className="text-gray-400 font-medium text-sm">Perfect 5-Match logic. Includes any rolled-over capital from prior unhit allocations.</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm flex items-center gap-6 group hover:bg-white/10 transition">
                                    <div className="h-16 w-16 bg-blue-500/20 text-blue-400 font-black text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">35%</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Tier 2 Target Matrix</h3>
                                        <p className="text-gray-400 font-medium text-sm">4-Match validation. Distributed symmetrically amongst identically verified profiles.</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm flex items-center gap-6 group hover:bg-white/10 transition">
                                    <div className="h-16 w-16 bg-indigo-500/20 text-indigo-400 font-black text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">25%</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Tier 3 Target Matrix</h3>
                                        <p className="text-gray-400 font-medium text-sm">3-Match validation. Programmed as our baseline entry dispersal sum.</p>
                                    </div>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* SECTION 3: CHARITY SPOTLIGHT */}
            {featuredCharity && (
                <section className="py-32 relative bg-[#091527] border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <FadeInWhenVisible>
                            <div className="bg-gradient-to-br from-primary via-primary/80 to-accent/10 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-black/50 to-transparent z-0"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                                    <div className="p-12 md:p-20 flex flex-col justify-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-8 w-max border border-accent/20">
                                            Priority Network Spotlight
                                        </div>
                                        <h2 className="text-4xl font-black mb-6">{featuredCharity.name}</h2>
                                        <p className="text-lg text-gray-400 font-medium mb-10 leading-relaxed max-w-xl">
                                            {featuredCharity.description}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Link href={`/charities/${featuredCharity.id}`} className="bg-white text-primary font-bold px-8 py-4 rounded-xl text-center hover:bg-gray-100 transition shadow-lg">
                                                Audit Charity Dossier
                                            </Link>
                                            <Link href="/charities" className="border border-white/20 text-white font-bold px-8 py-4 rounded-xl text-center hover:bg-white/5 transition">
                                                View Whole Database
                                            </Link>
                                        </div>
                                    </div>
                                    {featuredCharity.logo_url && (
                                        <div className="hidden lg:flex items-center justify-center p-20 bg-black/20 backdrop-blur-sm border-l border-white/5">
                                            <div className="h-64 w-64 bg-white rounded-[2rem] p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                                <img src={featuredCharity.logo_url} alt={featuredCharity.name} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </section>
            )}

            {/* SECTION 5: IMPACT LEDGER */}
            <section className="py-32 relative text-center">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <FadeInWhenVisible>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Systematic Altruism.</h2>
                        <p className="text-xl text-gray-400 font-medium mb-16 leading-relaxed">
                            No obscure processing loops. 10 to 100% of your designated fractional index actively routes to foundations you control. Here is the physical volume produced by the network to date.
                        </p>
                    </FadeInWhenVisible>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FadeInWhenVisible delay={0.1}>
                            <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10">
                                <Activity className="text-accent mx-auto mb-6" size={48} />
                                <h3 className="text-6xl font-black mb-2 text-white">{usersCount}</h3>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Active Nodes</p>
                            </div>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible delay={0.2}>
                            <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10">
                                <HeartHandshake className="text-rose-500 mx-auto mb-6" size={48} />
                                <h3 className="text-6xl font-black mb-2 text-white">£{countDonated}</h3>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Global Capital Moved</p>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* SECTION 6: FATAL CTA */}
            <section className="py-32 relative bg-accent">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <FadeInWhenVisible>
                        <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-8 leading-[1.1]">Initiate Your Digital <br/>Hero State.</h2>
                        <p className="text-xl text-primary/80 font-bold mb-12 max-w-2xl mx-auto">
                            The architecture is structured. The distribution protocol is live. Inject your metrics today and establish compliance before the upcoming chronological trigger event.
                        </p>
                        <Link href="/subscribe" className="inline-flex items-center gap-3 bg-primary text-white text-xl font-black px-12 py-6 rounded-2xl hover:scale-105 transition-transform shadow-2xl">
                            Deploy Subscription Node <ArrowRight size={24} />
                        </Link>
                        <p className="mt-8 text-sm font-bold text-primary/60 tracking-widest uppercase">Target Vector: {pendingDraw ? pendingDraw.draw_month : 'TBD'}</p>
                    </FadeInWhenVisible>
                </div>
            </section>

        </div>
    )
}
