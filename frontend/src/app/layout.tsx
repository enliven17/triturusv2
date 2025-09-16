import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import WalletProviderClient from "./WalletProviderClient";

export const metadata: Metadata = {
  title: "Triturus",
  description: "AI-Powered Freelance Hub on Polygon - Showcase, Mint NFTs, and Get Support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/webwhite.png" type="image/png" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        {/* Animated Dark Background */}
        <div className="fixed inset-0 -z-10 animate-gradient" />
        <div className="fixed inset-0 -z-10 bg-black/20" />
        
        {/* Floating AI Particles */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full ai-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full ai-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/35 rounded-full ai-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="flex flex-col min-h-screen">
          <WalletProviderClient>
            {/* Main Content with navbar spacing */}
            <main className="flex-1 flex flex-col items-center justify-start w-full px-2 sm:px-0 pt-24 pb-8">
              {children}
            </main>
          </WalletProviderClient>
          
          {/* Static Footer at bottom */}
          <footer className="w-full flex items-center justify-center gap-4 py-4 glass border-t border-white/10 text-white/60 text-sm mt-auto">
            <span>&copy; {new Date().getFullYear()} Triturus</span>
            <a
              href="https://x.com/TriturusApp"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-white/80 hover:text-blue-400 font-semibold transition-colors"
              title="X (Twitter)"
            >
              X
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
