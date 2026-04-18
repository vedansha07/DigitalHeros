import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary flex bg-dot relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 relative z-10 border-r border-white/6">
        <Link href="/" className="font-black text-2xl text-white tracking-tighter">
          DIGITAL<span className="text-accent">HEROS</span>
        </Link>

        <div className="space-y-8">
          {[
            { stat: "£0", label: "Paid out to winners" },
            { stat: "3 tiers", label: "Prize distribution levels" },
            { stat: "10–100%", label: "Charity contribution range" },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-accent/40 pl-5">
              <p className="text-3xl font-black text-white font-mono">{item.stat}</p>
              <p className="text-sm text-white/50 font-medium mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-xs font-medium">
          © {new Date().getFullYear()} Digital Heros. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-5 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden font-black text-xl text-white tracking-tighter block mb-8">
            DIGITAL<span className="text-accent">HEROS</span>
          </Link>

          <div className="bg-surface rounded-2xl shadow-card-lg border border-surface-border/60 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
