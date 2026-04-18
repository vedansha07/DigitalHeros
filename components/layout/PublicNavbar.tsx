"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const links = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Charities", href: "/charities" },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-cream/95 backdrop-blur-xl border-cream-border"
          : "bg-cream border-transparent"
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo — Insider-style bold wordmark */}
          <Link href="/" className="font-black text-2xl tracking-tighter text-ink shrink-0 group" aria-label="Digital Heros Home">
            digital<span className="text-violet group-hover:text-coral transition-colors">heros</span>
          </Link>

          {/* Desktop Nav — ↗ style links */}
          <div className="hidden md:flex items-center gap-0 divide-x divide-cream-border border-x border-cream-border">
            {links.map((l) => (
              <Link key={l.name} href={l.href}
                className={`px-6 py-5 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors hover:bg-cream-dim ${
                  pathname === l.href ? "text-violet bg-cream-dim" : "text-ink-muted hover:text-ink"
                }`}
              >
                {l.name} <ArrowUpRight size={12} className="opacity-40" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-0 divide-x divide-cream-border border-l border-cream-border">
            {user ? (
              <Link href="/dashboard"
                className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-cream bg-ink hover:bg-violet transition-colors flex items-center gap-1.5"
              >
                Dashboard <ArrowUpRight size={12} />
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-ink-muted hover:text-ink hover:bg-cream-dim transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/subscribe"
                  className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-cream bg-violet hover:bg-coral transition-colors flex items-center gap-1.5"
                >
                  Subscribe <ArrowUpRight size={12} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-none border border-cream-border text-ink hover:bg-cream-dim transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-screen drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed top-0 right-0 h-full w-72 bg-cream z-50 md:hidden flex flex-col border-l border-cream-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-cream-border">
                <span className="font-black text-xl tracking-tighter text-ink">
                  digital<span className="text-violet">heros</span>
                </span>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu"
                  className="text-ink-muted p-2 border border-cream-border hover:bg-cream-dim transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col divide-y divide-cream-border border-b border-cream-border">
                {links.map((l) => (
                  <Link key={l.name} href={l.href} onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-6 py-5 font-black text-sm uppercase tracking-[0.2em] transition-colors ${
                      pathname === l.href ? "text-violet bg-cream-dim" : "text-ink hover:bg-cream-dim"
                    }`}
                  >
                    {l.name} <ArrowUpRight size={14} className="text-ink-faint" />
                  </Link>
                ))}
              </nav>

              {/* CTAs */}
              <div className="flex flex-col divide-y divide-cream-border border-t border-cream-border">
                {user ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-cream bg-ink hover:bg-violet transition-colors"
                  >
                    Dashboard <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-ink hover:bg-cream-dim transition-colors"
                    >
                      Sign In <ArrowUpRight size={14} className="text-ink-faint" />
                    </Link>
                    <Link href="/subscribe" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-cream bg-violet hover:bg-coral transition-colors"
                    >
                      Subscribe <ArrowUpRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
