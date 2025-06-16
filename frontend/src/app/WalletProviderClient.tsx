"use client";
import { SuiClientProvider, WalletProvider, useWallets, useConnectWallet } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
          <header className="w-full flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md shadow-lg border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Logo Placeholder */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">T</div>
              <span className="text-2xl font-bold text-white tracking-wide">Triturus</span>
            </div>
            <nav className="flex gap-6 text-white/80 text-lg">
              <a href="/" className="hover:text-white transition">Home</a>
              <a href="/get-tri" className="hover:text-white transition">Get @tri Name</a>
              <a href="/profile" className="hover:text-white transition">Profile</a>
            </nav>
            {/* Custom Wallet Connect Button */}
            <CustomConnectButton />
          </header>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 