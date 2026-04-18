import Link from "next/link";

export default function PublicFooter() {
  const nav = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Charities", href: "/charities" },
    { label: "Subscribe", href: "/subscribe" },
  ];

  return (
    <footer className="bg-primary text-white border-t border-white/6 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/4 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-black text-3xl tracking-tighter block mb-4">
              DIGITAL<span className="text-accent">HEROS</span>
            </Link>
            <p className="text-white/40 font-medium max-w-sm text-sm leading-relaxed">
              A subscription golf platform connecting scores, charity giving, and monthly prize draws through a transparent algorithm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-white/30 mb-5">Platform</h4>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 font-medium">
            © {new Date().getFullYear()} Digital Heros. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-medium">Built with Next.js · Supabase · Stripe</p>
        </div>
      </div>
    </footer>
  );
}
