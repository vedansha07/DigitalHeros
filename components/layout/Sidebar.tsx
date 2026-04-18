"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Award, Users, Target, PieChart, Settings, LogOut, Menu, X, Coins, HeartHandshake } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);

    const userLinks = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Scorecard Matrix', href: '/dashboard/scores', icon: Target },
        { name: 'Prize Winnings', href: '/dashboard/winnings', icon: Award },
        { name: 'Charity Giving', href: '/dashboard/charity', icon: HeartHandshake },
        { name: 'Membership', href: '/dashboard/subscription', icon: Settings }
    ];

    const adminLinks = [
        { name: 'System Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'User Directory', href: '/admin/users', icon: Users },
        { name: 'Draw Engine', href: '/admin/draws', icon: Target },
        { name: 'Payout Ledger', href: '/admin/winners', icon: Coins },
        { name: 'Charity Catalog', href: '/admin/charities', icon: HeartHandshake },
        { name: 'Analytics', href: '/admin/reports', icon: PieChart }
    ];

    const links = isAdmin ? adminLinks : userLinks;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-primary text-white sticky top-0 z-50 shadow-md h-16">
                <span className="font-extrabold text-2xl tracking-tight">DIGITAL<span className="text-accent">HEROS</span></span>
                <button aria-label="Toggle Dashboard Menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-accent transition p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar Desktop + Mobile Menu */}
            <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-primary text-gray-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none`}>
                <div className="p-8 md:flex hidden flex-col items-start border-b border-white/10 shrink-0">
                    <span className="font-black text-3xl tracking-tighter text-white">DIGITAL<span className="text-accent">HEROS</span></span>
                    {isAdmin && <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary mt-2 bg-accent px-3 py-1 rounded shadow-sm">Admin Console</span>}
                </div>
                
                <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto w-full scrollbar-hide">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/admin');
                        
                        return (
                            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-accent text-primary shadow-md translate-x-1' : 'hover:bg-white/5 hover:text-white'}`}>
                                <Icon size={22} strokeWidth={2.5} className={isActive ? 'text-primary' : 'text-gray-400'} />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-white/10 shrink-0">
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all border border-transparent hover:border-red-400/20">
                        <LogOut size={20} strokeWidth={2.5} /> Secure Logout
                    </button>
                    {!isAdmin && (
                        <div className="mt-6 text-center text-xs text-gray-500 font-medium">
                            Need help? Contact <a href="mailto:support@digitalheros.app" className="text-gray-400 hover:text-white transition">support@digitalheros.app</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
        </>
    )
}
