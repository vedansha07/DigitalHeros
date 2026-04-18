"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        // Only set scrolled state properly if we aren't at top yet
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Charities', href: '/charities' }
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="text-white font-black text-3xl tracking-tighter group">DIGITAL<span className="text-accent group-hover:drop-shadow-[0_0_15px_rgba(0,201,107,0.8)] transition">HEROS</span></Link>
                
                <div className="hidden md:flex items-center gap-8">
                    {links.map(l => (
                        <Link key={l.name} href={l.href} className="text-white/80 hover:text-white font-bold transition text-sm uppercase tracking-widest">{l.name}</Link>
                    ))}
                    <div className="flex items-center gap-4 ml-8 border-l border-white/20 pl-8">
                        {user ? (
                            <Link href="/dashboard" className="bg-accent text-primary font-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-lg text-sm uppercase tracking-widest">Dashboard Console</Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-white font-bold hover:text-accent transition text-sm uppercase tracking-widest px-4">Log In</Link>
                                <Link href="/subscribe" className="bg-accent text-primary font-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,201,107,0.3)] hover:shadow-[0_0_30px_rgba(0,201,107,0.5)] text-sm uppercase tracking-widest">Subscribe</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="md:hidden">
                    <button aria-label="Toggle Menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-accent transition p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                        {isOpen ? <X size={32}/> : <Menu size={32}/>}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-primary/95 backdrop-blur-3xl border-t border-white/10 flex flex-col p-8 gap-6 md:hidden shadow-2xl">
                    {links.map(l => (
                         <Link key={l.name} href={l.href} onClick={()=>setIsOpen(false)} className="text-white font-black tracking-widest uppercase text-xl hover:text-accent transition">{l.name}</Link>
                    ))}
                    <div className="h-px bg-white/10 w-full my-4"></div>
                    {user ? (
                         <Link href="/dashboard" onClick={()=>setIsOpen(false)} className="bg-accent text-primary text-center font-black px-6 py-4 rounded-xl uppercase tracking-widest">Initialize Dashboard</Link>
                    ) : (
                         <div className="flex flex-col gap-4">
                             <Link href="/login" onClick={()=>setIsOpen(false)} className="text-center font-black uppercase tracking-widest px-6 py-4 rounded-xl border-2 border-white/20 text-white hover:bg-white/5 transition">Authenticate Log In</Link>
                             <Link href="/subscribe" onClick={()=>setIsOpen(false)} className="bg-accent text-primary text-center font-black uppercase tracking-widest px-6 py-4 rounded-xl shadow-xl">Deploy Subscription</Link>
                         </div>
                    )}
                </div>
            )}
        </nav>
    )
}
