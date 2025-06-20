"use client";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from 'next/link';
import { useEffect, useState } from "react";

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function Home() {
  const currentAccount = useCurrentAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-12 text-white">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to Triturus Name Service
        </h1>
        <p className="text-center text-lg text-white/80">
          Your decentralized identity on the Sui blockchain.
        </p>

        {mounted && currentAccount ? (
          <div className="bg-white/10 rounded-xl p-6 mt-4 text-center">
            <h2 className="text-xl font-semibold">Wallet Connected</h2>
            <p className="font-mono mt-2 text-blue-300">{shortenAddress(currentAccount.address)}</p>
          </div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 mt-4 text-center">
            <h2 className="text-xl font-semibold">Please connect your wallet</h2>
            <p className="text-white/70 mt-2">Connect your wallet to manage your @tri name.</p>
          </div>
        )}

        <Link
          href="/get-tri"
          className="w-full mt-4 py-3 text-center rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Get your @tri Name
        </Link>
      </div>
    </div>
  );
}
