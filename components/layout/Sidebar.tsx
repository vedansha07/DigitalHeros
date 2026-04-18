"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Award, Target, Settings,
  LogOut, Menu, X, HeartHandshake, Users,
  PieChart, Coins, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const userLinks = [
  { name: "Overview",     href: "/dashboard",                icon: LayoutDashboard },
  { name: "Scores",       href: "/dashboard/scores",         icon: Target },
  { name: "Winnings",     href: "/dashboard/winnings",       icon: Award },
  { name: "Charity",      href: "/dashboard/charity",        icon: HeartHandshake },
  { name: "Membership",   href: "/dashboard/subscription",   icon: Settings },
];

const adminLinks = [
  { name: "Overview",     href: "/admin",                    icon: LayoutDashboard },
  { name: "Users",        href: "/admin/users",              icon: Users },
  { name: "Draw Engine",  href: "/admin/draws",              icon: Target },
  { name: "Winners",      href: "/admin/winners",            icon: Coins },
  { name: "Charities",    href: "/admin/charities",          icon: HeartHandshake },
  { name: "Analytics",    href: "/admin/reports",            icon: PieChart },
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
    pathname === href ||
    (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href));

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8 shrink-0">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="block">
          <span className="font-black text-2xl tracking-tighter text-white">
            DIGITAL<span className="text-accent">HEROS</span>
          </span>
        </Link>
        {isAdmin && (
          <span className="mt-2 inline-flex items-center gap-1.5 bg-accent/15 text-accent text-2xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-accent/25">
            Admin Console
          </span>
        )}
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all relative overflow-hidden ${
                active
                  ? "bg-accent text-primary shadow-glow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/6"
              }`}
            >
              {active && (
                <span className="absolute inset-0 bg-accent opacity-10 rounded-xl" />
              )}
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                className={`shrink-0 transition-transform group-hover:scale-110 ${active ? "text-primary" : "text-white/40 group-hover:text-white/70"}`}
              />
              <span className="relative">{link.name}</span>
              {active && <ChevronRight size={14} className="ml-auto text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8 shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-red-400 hover:bg-red-500/8 transition-all group"
        >
          <LogOut size={18} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* === MOBILE TOPBAR === */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-primary border-b border-white/10 flex items-center justify-between px-4 z-50 shadow-lg">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="font-black text-xl tracking-tighter text-white">
          DIGITAL<span className="text-accent">HEROS</span>
        </Link>
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-primary z-40 shadow-xl">
        <NavContent />
      </aside>

      {/* === MOBILE DRAWER === */}
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 w-72 bg-primary z-50 md:hidden shadow-2xl"
            >
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
