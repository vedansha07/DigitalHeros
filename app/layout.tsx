import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Heros | Golf × Charity × Prize Platform",
  description:
    "A subscription-based platform connecting golf scores, charitable giving, and monthly prize draws. Play golf. Support charities. Win prizes.",
  openGraph: {
    title: "Digital Heros",
    description: "Golf scores × Charity × Monthly prize draws.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-surface text-foreground`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0B1F3A",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />
      </body>
    </html>
  );
}
