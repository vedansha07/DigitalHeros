"use client"
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CharityListClient({ initialCharities }: { initialCharities: any[] }) {
    const [search, setSearch] = useState('');

    const filtered = initialCharities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    
    const sorted = [...filtered].sort((a, b) => {
        if (a.is_featured === b.is_featured) return 0;
        return a.is_featured ? -1 : 1;
    });

    return (
        <div>
            <div className="mb-8">
                <input 
                    type="text" 
                    placeholder="Search charities by name..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-md border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {sorted.map((charity, i) => (
                        <motion.div 
                            key={charity.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className={`bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition ${charity.is_featured ? 'border-accent ring-1 ring-accent' : 'border-gray-200'}`}
                        >
                            {charity.is_featured && <div className="bg-accent text-white text-xs font-bold px-3 py-1 text-center uppercase tracking-wider">Featured Partner</div>}
                            <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                                {charity.logo_url ? (
                                    <img src={charity.logo_url} alt={charity.name} className="max-h-full object-contain" />
                                ) : (
                                    <div className="text-gray-400 font-medium">No Logo</div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-primary mb-2">{charity.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">{charity.description}</p>
                                <Link href={`/charities/${charity.id}`} className="block text-center w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition">
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                    {sorted.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">No charities found matching your search.</div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
