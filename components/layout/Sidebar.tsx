"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Award, Target, Settings,
  LogOut, Menu, X, HeartHandshake, Users,
  PieChart, Coins, ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const userLinks = [
  { name: "Overview",   href: "/dashboard",              icon: LayoutDashboard },
  { name: "Scores",     href: "/dashboard/scores",       icon: Target },
  { name: "Winnings",   href: "/dashboard/winnings",     icon: Award },
  { name: "Charity",    href: "/dashboard/charity",      icon: HeartHandshake },
  { name: "Membership", href: "/dashboard/subscription", icon: Settings },
];

const adminLinks = [
  { name: "Overview",    href: "/admin",           icon: LayoutDashboard },
  { name: "Users",       href: "/admin/users",     icon: Users },
  { name: "Draw Engine", href: "/admin/draws",     icon: Target },
  { name: "Winners",     href: "/admin/winners",   icon: Coins },
  { name: "Charities",   href: "/admin/charities", icon: HeartHandshake },
  { name: "Analytics",   href: "/admin/reports",   icon: PieChart },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href));

  const NavContent = () => (
    <div className="flex flex-col h-full bg-onyx border-r border-onyx-border">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-onyx-border shrink-0">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="block">
          <span className="font-black text-xl tracking-tighter text-cream">
            digital<span className="text-lime">heros</span>
          </span>
        </Link>
        {isAdmin && (
          <span className="mt-2.5 inline-flex items-center gap-1.5 bg-violet/15 text-violet-light text-2xs font-black uppercase tracking-widest px-2.5 py-1 border border-violet/25">
            Admin Console
          </span>
        )}
      </div>

      {/* Section label */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-onyx-muted">
          {isAdmin ? "Management" : "Navigation"}
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-hide divide-y divide-onyx-border border-t border-onyx-border">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-4 text-xs font-black uppercase tracking-[0.18em] transition-colors group ${
                active
                  ? "bg-lime text-ink"
                  : "text-onyx-muted hover:text-cream hover:bg-onyx-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={15} strokeWidth={2.5} className={`shrink-0 ${active ? "text-ink" : "text-onyx-muted group-hover:text-cream"}`} />
                {link.name}
              </div>
              <ArrowUpRight size={12} className={`${active ? "text-ink/60" : "text-onyx-border group-hover:text-onyx-muted"}`} />
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-onyx-border shrink-0">
        <button onClick={handleLogout}
          className="flex w-full items-center justify-between px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-onyx-muted hover:text-coral hover:bg-coral/5 transition-colors group">
          <div className="flex items-center gap-3">
            <LogOut size={15} strokeWidth={2.5} />
            Sign Out
          </div>
          <ArrowUpRight size={12} className="text-onyx-border group-hover:text-coral" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-onyx border-b border-onyx-border flex items-center justify-between px-5 z-50">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="font-black text-lg tracking-tighter text-cream">
          digital<span className="text-lime">heros</span>
        </Link>
        <button aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="text-onyx-muted hover:text-cream p-2 border border-onyx-border hover:border-onyx-muted transition min-h-[44px] min-w-[44px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={isOpen ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-40">
        <NavContent />
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden">
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
