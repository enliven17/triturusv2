"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../config/wagmi";
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const CustomConnectButton = dynamic(() => import("../components/CustomConnectButton"), { ssr: false });

export default function WalletProviderClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider theme={darkTheme()}>
          {/* Floating Sticky Navbar */}
          <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[98%] sm:w-[95%] max-w-6xl floating-navbar rounded-2xl z-50">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              {/* Logo Section */}
              <div className="flex items-center gap-2 sm:gap-3 z-10">
                <div className="relative">
                  <Image src="/logo.png" alt="Triturus Logo" width={32} height={32} className="sm:w-10 sm:h-10 rounded-full shadow-lg object-cover ai-glow" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-white tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Triturus
                </span>
                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full font-medium hidden sm:inline">
                  AI
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <nav className="flex gap-6 xl:gap-8 text-white/80 text-base xl:text-lg justify-center items-center">
                  <Link href="/" className="hover:text-white transition-all hover:scale-105 relative group">
                    Home
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link href="/showcase" className="hover:text-white transition-all hover:scale-105 relative group">
                    Showcase
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link href="/mint" className="hover:text-white transition-all hover:scale-105 relative group">
                    Mint NFT
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link href="/profile" className="hover:text-white transition-all hover:scale-105 relative group">
                    Profile
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </nav>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 z-10">
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                {/* Connect Button */}
                <div className="scale-90 sm:scale-100">
                  <CustomConnectButton />
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-white/10 px-4 py-4">
                <nav className="flex flex-col gap-3">
                  <Link 
                    href="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-all py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                  </Link>
                  <Link 
                    href="/showcase" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-all py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    <span className="text-lg">🎨</span>
                    <span>Showcase</span>
                  </Link>
                  <Link 
                    href="/mint" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-all py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    <span className="text-lg">⚡</span>
                    <span>Mint NFT</span>
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-all py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    <span className="text-lg">👤</span>
                    <span>Profile</span>
                  </Link>
                </nav>
              </div>
            )}
          </header>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
      <style jsx global>{`
@keyframes gradient-move {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-slow {
  background-size: 200% 200%;
  animation: gradient-move 8s ease-in-out infinite;
}
`}</style>
    </QueryClientProvider>
  );
}