"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HeartHandshake, ArrowUpRight } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";

function Marquee({ text }: { text: string }) {
  const items = Array(14).fill(text);
  return (
    <div className="overflow-hidden py-3.5 border-y border-cream-border bg-cream-dim">
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {items.map((t, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.25em] px-7 text-ink-faint">{t} ◆</span>
        ))}
      </div>
    </div>
  );
}

export default function CharityListClient({ initialCharities }: { initialCharities: any[] }) {
  const [search, setSearch] = useState("");
  const filtered = initialCharities
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));

  return (
    <div className="bg-cream text-ink min-h-screen">
      <PublicNavbar />

      {/* ── HEADER ── */}
      <section className="pt-28 pb-16 px-6 lg:px-12 border-b border-cream-border max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-ink-faint" /> Partner Organisations
            </p>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
              Our<br /><span className="text-violet">charities.</span>
            </h1>
          </div>
          <p className="text-base text-ink-muted font-medium max-w-sm leading-relaxed">
            Every subscription routes a percentage directly to one of our vetted partner organisations each month.
          </p>
        </div>
      </section>

      <Marquee text="Vetted organisations · Monthly contributions · Direct donations · Charity impact · Partner network" />

      {/* Search + Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Search bar */}
        <div className="relative mb-10 max-w-sm">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input type="text" placeholder="Search charities..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 border border-cream-border bg-cream text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition"
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-cream-border divide-y md:divide-y-0">
          <div className="contents">
            <AnimatePresence>
              {filtered.map((charity, i) => (
                <motion.div key={charity.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, delay: i * 0.04 }}
                  className={`flex flex-col bg-cream hover:bg-cream-dim transition-colors border-b md:border-b-0 md:border-r border-cream-border last:border-r-0 ${charity.is_featured ? "relative" : ""}`}
                >
                  {/* Featured badge */}
                  {charity.is_featured && (
                    <div className="bg-lime text-ink text-2xs font-black uppercase tracking-widest px-4 py-2 border-b border-cream-border">
                      Featured Partner
                    </div>
                  )}

                  {/* Logo area */}
                  <div className="h-44 bg-cream-dim flex items-center justify-center p-6 border-b border-cream-border">
                    {charity.logo_url ? (
                      <img src={charity.logo_url} alt={charity.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <HeartHandshake size={36} className="text-ink-faint" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col gap-4">
                    <h3 className="text-lg font-black text-ink">{charity.name}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed flex-1 line-clamp-3">{charity.description}</p>
                    <Link href={`/charities/${charity.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ink hover:text-violet transition-colors mt-auto w-fit">
                      View Profile <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="border border-dashed border-cream-border py-20 text-center">
            <HeartHandshake size={28} className="text-ink-faint mx-auto mb-4" />
            <p className="text-sm font-black text-ink uppercase tracking-widest">No charities found</p>
            <p className="text-sm text-ink-muted mt-1.5">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer strip */}
      <footer className="bg-ink border-t border-onyx-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between gap-4">
          <span className="font-black text-lg tracking-tighter text-cream">digital<span className="text-lime">heros</span></span>
          <p className="text-xs text-onyx-muted">© {new Date().getFullYear()} Digital Heros</p>
        </div>
      </footer>
    </div>
  );
}
