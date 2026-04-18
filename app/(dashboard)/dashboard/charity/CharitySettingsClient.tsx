"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowUpRight, HeartHandshake, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } } };

function Marquee({ text }: { text: string }) {
  const items = Array(12).fill(text);
  return (
    <div className="overflow-hidden py-3 border-y border-cream-border bg-cream-dim">
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {items.map((t, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.28em] px-8 text-ink-faint">{t} ◆</span>
        ))}
      </div>
    </div>
  );
}

export default function CharitySettingsClient({ dbUser, charities }: { dbUser: any; charities: any[] }) {
  const [selectedCharity, setSelectedCharity] = useState(dbUser.selected_charity_id || "");
  const [percentage, setPercentage] = useState(dbUser.charity_contribution_percentage || 10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const currentFee = dbUser.subscription_plan === "yearly" ? (96 / 12) : 10;
  const estContribution = (currentFee * (percentage / 100)).toFixed(2);
  const selectedCharityObj = charities.find(c => c.id === selectedCharity);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/charity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_charity_id: selectedCharity || null, charity_contribution_percentage: percentage }),
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      else { toast.success("Charity settings saved."); router.refresh(); }
    } catch { toast.error("Error saving settings."); }
    setLoading(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="-mx-6 md:-mx-8 lg:-mx-12">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 pt-2 pb-8">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-ink-faint" /> Dashboard / Charity
        </p>
        <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tight">
          Charity<span className="text-violet">.</span>
        </h1>
        <p className="text-ink-muted text-sm font-medium mt-2">
          Choose which organisation receives your monthly contribution.
        </p>
      </motion.section>

      <Marquee text="Charity selection · Contribution rate · Monthly impact · Donation routing · Partner organisations" />

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-cream-border divide-y lg:divide-y-0 lg:divide-x divide-cream-border">

          {/* Charity selector */}
          <motion.div variants={item} className="lg:col-span-2 px-6 md:px-8 lg:px-12 py-10">
            <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-5">Select Organisation</p>

            <div className="space-y-0 border border-cream-border divide-y divide-cream-border mb-6">
              <div className="flex items-center gap-4 px-5 py-4 bg-cream hover:bg-cream-dim transition-colors cursor-pointer"
                onClick={() => setSelectedCharity("")}>
                <div className={`w-4 h-4 border-2 shrink-0 transition-colors ${!selectedCharity ? "border-violet bg-violet" : "border-cream-border"}`} />
                <p className="text-sm font-semibold text-ink-muted">No charity selected</p>
              </div>
              {charities.map(c => (
                <div key={c.id}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${selectedCharity === c.id ? "bg-violet/5 border-l-2 border-violet" : "bg-cream hover:bg-cream-dim"}`}
                  onClick={() => setSelectedCharity(c.id)}>
                  <div className={`w-4 h-4 border-2 shrink-0 transition-colors ${selectedCharity === c.id ? "border-violet bg-violet" : "border-cream-border"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${selectedCharity === c.id ? "text-ink" : "text-ink-muted"}`}>{c.name}</p>
                  </div>
                  {selectedCharity === c.id && (
                    <a href={`/charities/${c.id}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      className="text-2xs font-black uppercase tracking-widest text-violet hover:text-coral transition-colors flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {charities.length === 0 && (
              <div className="border border-cream-border p-8 text-center">
                <HeartHandshake size={24} className="text-ink-faint mx-auto mb-3" />
                <p className="text-sm text-ink-muted font-medium">No charities available yet.</p>
              </div>
            )}
          </motion.div>

          {/* Contribution panel */}
          <motion.div variants={item} className="bg-onyx px-8 py-10 flex flex-col gap-8">
            <div>
              <p className="text-2xs font-black uppercase tracking-[0.28em] text-onyx-muted mb-5">Contribution Rate</p>

              {/* Big % display */}
              <div className="flex items-end gap-2 mb-5">
                <span className="text-6xl font-black font-mono text-lime leading-none">{percentage}%</span>
                <span className="text-onyx-muted font-medium pb-1 text-sm">/mo</span>
              </div>

              {/* Slider */}
              <input type="range" min="10" max="100" step="5" value={percentage}
                onChange={e => setPercentage(parseInt(e.target.value))}
                className="w-full h-1 bg-onyx-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-2xs font-bold text-onyx-muted">10%</span>
                <span className="text-2xs font-bold text-onyx-muted">100%</span>
              </div>
              <p className="text-xs text-onyx-muted mt-3 leading-relaxed">Min 10% · Max 100%</p>
            </div>

            {/* Est. contribution */}
            <div className="border border-onyx-border p-5">
              <p className="text-2xs font-black uppercase tracking-widest text-onyx-muted mb-2">Monthly Impact</p>
              <p className="text-4xl font-black font-mono text-cream">£{estContribution}</p>
              <p className="text-xs text-onyx-muted mt-1 capitalize">{dbUser.subscription_plan || "monthly"} plan</p>
            </div>

            {/* Save button */}
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-lime hover:bg-lime/80 text-ink font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <>Save Settings <ArrowUpRight size={13} /></>}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
