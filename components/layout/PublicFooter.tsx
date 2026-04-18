import Link from 'next/link';

export default function PublicFooter() {
    return (
        <footer className="bg-primary text-white border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
             <div className="absolute -top-40 -right-40 h-96 w-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                  <div className="md:col-span-2">
                       <Link href="/" className="text-white font-black text-4xl tracking-tighter block mb-6">DIGITAL<span className="text-accent">HEROS</span></Link>
                       <p className="text-gray-400 font-medium max-w-sm text-lg leading-relaxed">Systematically routing capital into global philanthropy through an algorithmic performance distribution matrix. Pure output correlation. Zero gambling mechanics.</p>
                  </div>
                  <div>
                       <h4 className="font-extrabold text-white mb-8 uppercase tracking-widest text-xs">System Navigation</h4>
                       <ul className="space-y-4 font-bold text-gray-500 text-sm tracking-wide">
                           <li><Link href="/how-it-works" className="hover:text-accent transition">Logic & Output Process</Link></li>
                           <li><Link href="/charities" className="hover:text-accent transition">Charitable Database</Link></li>
                           <li><Link href="/subscribe" className="hover:text-accent transition">Membership Instantiation</Link></li>
                       </ul>
                  </div>
                  <div>
                       <h4 className="font-extrabold text-white mb-8 uppercase tracking-widest text-xs">Compliance</h4>
                       <ul className="space-y-4 font-bold text-gray-500 text-sm tracking-wide">
                           <li><a href="#" className="hover:text-white transition">Terms of Architecture</a></li>
                           <li><a href="#" className="hover:text-white transition">Privacy Matrix</a></li>
                           <li><a href="#" className="hover:text-white transition">Distribution Certifications</a></li>
                       </ul>
                  </div>
             </div>
             
             <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                  <div className="text-xs text-gray-600 font-black uppercase tracking-widest">
                       &copy; {new Date().getFullYear()} Digital Heros Ltd. All rights mapped.
                  </div>
                  <div className="text-xs text-gray-600 font-bold tracking-widest flex items-center gap-4">
                       <span>Built on Next.js</span>
                       <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                       <span>Powered by Supabase</span>
                  </div>
             </div>
        </footer>
    )
}
