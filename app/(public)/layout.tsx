import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import PageTransition from '@/components/layout/PageTransition';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Heros | Output-Driven Philanthropy',
    description: 'Systematically route capital into global charity through an exact algorithm output distribution matrix. Play logic, allocate capital, earn distributions.',
    openGraph: {
        title: 'Digital Heros | Output-Driven Philanthropy',
        description: 'Systematically route capital into global charity through an exact algorithmic distribution matrix.',
        url: 'https://digitalheros.app',
        siteName: 'Digital Heros',
        images: [
            {
                url: 'https://digitalheros.app/og.png', // Placeholder URL
                width: 1200,
                height: 630,
            }
        ],
        type: 'website',
    }
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-primary font-sans selection:bg-accent/30 selection:text-primary overflow-x-hidden w-full text-white">
            <PublicNavbar />
            <main className="flex-grow flex flex-col w-full min-h-screen relative z-10">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <PublicFooter />
        </div>
    )
}
