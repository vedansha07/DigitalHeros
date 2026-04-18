"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, ChevronRight } from "lucide-react";
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const links = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Charities", href: "/charities" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-primary/95 backdrop-blur-xl shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-black text-2xl tracking-tighter shrink-0 group"
            aria-label="Digital Heros Home"
          >
            DIGITAL
            <span className="text-accent group-hover:drop-shadow-[0_0_12px_rgba(0,201,107,0.8)] transition-all duration-300">
              HEROS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  isActive(l.href)
                    ? "text-accent bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:bg-accent/90 hover:shadow-glow-sm transition-all"
              >
                Dashboard <ChevronRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/subscribe"
                  className="bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:bg-accent/90 hover:shadow-glow-sm transition-all shadow-glow-sm"
                >
                  Subscribe
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 right-0 h-full w-80 bg-primary z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="font-black text-xl text-white tracking-tighter">
                  DIGITAL<span className="text-accent">HEROS</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 p-4">
                {links.map((l) => (
                  <Link
                    key={l.name}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-base transition-all ${
                      isActive(l.href)
                        ? "text-accent bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10 flex flex-col gap-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="bg-accent text-primary font-black text-center py-4 rounded-xl hover:bg-accent/90 transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="border border-white/20 text-white font-semibold text-center py-3.5 rounded-xl hover:bg-white/5 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/subscribe"
                      onClick={() => setIsOpen(false)}
                      className="bg-accent text-primary font-black text-center py-4 rounded-xl hover:bg-accent/90 transition"
                    >
                      Subscribe Now
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
