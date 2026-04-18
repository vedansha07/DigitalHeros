"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Database, Cpu, HeartPulse, CreditCard } from 'lucide-react';
import Link from 'next/link';

const FAQs = [
    { q: "Is this a lottery or a gambling application?", a: "No. Digital Heros utilizes a deterministic logic matrix. Users generate entry parameters through verified physical effort (submitting golf Stableford scores). Payouts are fractional distributions of a pre-determined communal subscription pool based on output correlation, completely removing probabilistic gambling loops." },
    { q: "How do I ensure my node is eligible for the upcoming cycle?", a: "Two parameters: 1) Maintain an 'Active' stripe subscription status at the time of programmatic execution. 2) Log exactly FIVE (5) 1-45 Stableford score entries through the Platform Dashboard before the chronological deadline." },
    { q: "What happens if I log 6 scores?", a: "Our database natively handles overflow pruning. Appending a 6th score automatically fires an internal trigger dropping your oldest logged score, ensuring your rolling matrix is always exactly 5 data points." },
    { q: "Where exactly does the charity fractional allocation go?", a: "10% to 100% of your net subscription input is instantly dedicated to a specific charity entity. You execute manual control over your preferred percentage split and the target recipient inside the Membership Dashboard. If you lapse on configuration, capital defaults to the currently Featured Master Charity." },
    { q: "Who authorizes the algorithmic draws?", a: "All draws are processed centrally via Next.js Serverless Execution Environments. System Administrators initialize chronological sweeps. The logic randomly queries 1-45 numbers (Random Logic) or clusters outliers (Algorithmic Logic). Data is immutable once published." },
    { q: "How is the rollover logic mathematically calculated?", a: "If zero users match the Tier 1 parameters (5 exact hits), that 40% sum physically rolls into the next month's Tier 1 allocation. Tiers 2 and 3 inherently distribute to whoever validates, but Tier 1 serves as an isolated progressive channel." },
    { q: "How do I physically acquire my capital if I successfully validate?", a: "Verification is natively handled inside the Dashboard. If a cycle indicates validation, you upload physical proof (a scorecard photograph or digital receipt supporting the Stableford parameter). Admins review, approve, and execute manual Stripe transit functions to disburse capital safely." },
    { q: "Can I terminate my physical footprint in the platform?", a: "Yes. Membership termination stops ongoing subscriptions immediately. You maintain your database node access until the final billed cycle concludes. After that, your data points are blocked from subsequent logic parses." }
];

export default function HowItWorksClient() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="bg-[#040C18] min-h-screen text-white pt-24 pb-32">
            
            {/* Header Section */}
            <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-24 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8 mt-12 text-accent text-xs font-black uppercase tracking-widest">
                    Technical Specifications
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
                    Architecture & Operations Protocol
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-gray-400 font-medium leading-relaxed">
                    Digital Heros is a subscription-based logic network executing fractional allocations to users capable of matching system-parameters generated dynamically each month. Explore the engine manual below.
                </motion.p>
            </section>

            {/* Core Mechanics Matrix */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32 border-t top-0 border-white/5 pt-24 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <h2 className="text-3xl font-black mb-16 text-center">Phase Interaction Loops</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <CreditCard className="text-accent mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">1. Sub-Initialization</h3>
                        <p className="text-gray-400 font-medium text-sm leading-relaxed">Initiate a Stripe integration cycle (Monthly or Yearly). This secures your Node Identifier and routes a split directly into the global liquidity pool and your external Charity target.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.1 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <Database className="text-blue-400 mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">2. Data Ingestion</h3>
                        <p className="text-gray-400 font-medium text-sm leading-relaxed">Play physical golf. Extrapolate Stableford format scores (1-45). Access your private portal and inject exactly five sets of values. Overwriting is natively handled dynamically.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.2 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <Cpu className="text-indigo-400 mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">3. Logic Parse Event</h3>
                        <p className="text-gray-400 font-medium text-sm leading-relaxed">Monthly chronological trigger. The Master Engine compiles a unified 5-number array. Fractional dispersion vectors (40/35/25%) are calculated structurally against the global active user pool.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.3 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <HeartPulse className="text-rose-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">4. Structural Output</h3>
                        <p className="text-gray-400 font-medium text-sm leading-relaxed">Instantaneous ledger sync. If 3+ figures correlate perfectly, verify your matrix offline and ingest capital directly back to your physical state.</p>
                    </motion.div>
                </div>
            </section>

            {/* In Depth Technical Documentation */}
            <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-32 bg-[#081220] p-10 md:p-16 rounded-[3rem] border border-white/5">
                <h2 className="text-3xl font-black mb-8 border-b border-white/10 pb-6">Distribution Matrix Physics</h2>
                <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
                    <p>
                        The Digital Heros platform relies completely on determinative validation logic instead of localized probability loops.
                    </p>
                    <p>
                        <strong className="text-white block mb-2">Liquidity Routing:</strong> When an active user transfers capital into the system, fractions are structurally stripped prior to pool injection. Based on User Authority Settings, anywhere from <span className="text-accent font-bold mt-1">10 to 100%</span> bypasses global logistics and lands inherently in charity wallets. The residual figure becomes our <strong>Global Pool Fund</strong>.
                    </p>
                    <p>
                        <strong className="text-white block mb-2">The Fraction Algorithm:</strong> Capital is split into internal tranches immediately upon execution.
                    </p>
                    <ul className="list-disc list-inside space-y-4 text-sm ml-4">
                        <li><span className="text-white font-bold">Tier 1 Target (40%):</span> Reserved exclusively for vectors matching all 5 parameters. If absent, capital cascades inherently to the subsequent chronological cycle.</li>
                        <li><span className="text-white font-bold">Tier 2 Target (35%):</span> Symmetrically dispersed against vectors sustaining 4 identical matches.</li>
                        <li><span className="text-white font-bold">Tier 3 Target (25%):</span> Floor dispersal routing, spread against generic 3-match correlates.</li>
                    </ul>
                </div>
            </section>

            {/* Interactive FAQ Engine */}
            <section className="max-w-3xl mx-auto px-6 lg:px-8">
                <h2 className="text-3xl font-black mb-12 text-center">Inquiry Database Access</h2>
                <div className="space-y-4">
                    {FAQs.map((faq, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300">
                            <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition"
                            >
                                <span className="font-bold text-lg">{faq.q}</span>
                                <ChevronDown 
                                    className={`text-accent transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                    size={20} 
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-2 text-gray-400 font-medium leading-relaxed border-t border-white/5 mt-2">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
                
                <div className="mt-20 text-center">
                    <Link href="/subscribe" className="inline-block bg-accent text-primary px-10 py-5 rounded-xl font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,201,107,0.3)]">
                        Clear Authorization. Engage Protocol.
                    </Link>
                </div>
            </section>

        </div>
    );
}
