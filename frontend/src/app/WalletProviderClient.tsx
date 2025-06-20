"use client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

const networks = {
  devnet: {
    url: "https://fullnode.devnet.sui.io:443",
  },
};
const queryClient = new QueryClient();

const CustomConnectButton = dynamic(() => import("../components/CustomConnectButton"), { ssr: false });

export default function WalletProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} network="devnet">
        <WalletProvider autoConnect>
          <header className="w-full flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md shadow-lg border-b border-white/10 relative">
            <div className="flex items-center gap-3 z-10">
              {/* Logo Placeholder */}
              <Image src="/logo.png" alt="Triturus Logo" width={40} height={40} className="rounded-full shadow-lg object-cover" />
              <span className="text-2xl font-bold text-white tracking-wide">Triturus</span>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <nav className="flex gap-6 text-white/80 text-lg justify-center items-center">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/get-tri" className="hover:text-white transition font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-slow">Get @tri Name</Link>
                <Link href="/profile" className="hover:text-white transition">Profile</Link>
              </nav>
            </div>
            <div className="z-10">
              {/* Custom Wallet Connect Button */}
              <CustomConnectButton />
            </div>
          </header>
          {children}
        </WalletProvider>
      </SuiClientProvider>
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