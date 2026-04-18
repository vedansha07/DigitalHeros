import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50/50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-primary animate-spin" />
                <p className="text-primary font-black uppercase tracking-widest text-sm animate-pulse">Initializing Administrative Terminal...</p>
            </div>
        </div>
    );
}
