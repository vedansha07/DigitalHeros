import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex bg-dot">

      {/* Left panel — editorial branding column */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 bg-onyx border-r border-onyx-border p-12">
        <Link href="/" className="font-black text-2xl tracking-tighter text-cream">
          digital<span className="text-lime">heros</span>
        </Link>

        {/* Big editorial headline */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-onyx-muted mb-6">The Platform</p>
          <h2 className="text-5xl font-black text-cream leading-tight mb-10">
            Golf.<br />
            <span className="text-lime">Charity.</span><br />
            Prizes.
          </h2>

          {/* Stats */}
          <div className="space-y-0 border-t border-onyx-border">
            {[
              { stat: "3 tiers", label: "Prize distribution levels" },
              { stat: "10–100%", label: "Charity contribution range" },
              { stat: "Monthly", label: "Automated draw cycle" },
            ].map((item) => (
              <div key={item.label} className="py-5 border-b border-onyx-border flex items-center justify-between gap-4">
                <p className="text-2xl font-black text-cream font-mono">{item.stat}</p>
                <p className="text-xs text-onyx-muted font-medium text-right">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-onyx-muted">© {new Date().getFullYear()} Digital Heros. All rights reserved.</p>
      </div>

      {/* Right panel — form area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden font-black text-xl tracking-tighter text-ink block mb-10">
          digital<span className="text-violet">heros</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Form card — editorial flat style */}
          <div className="bg-cream border border-cream-border shadow-card-lg p-8 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
