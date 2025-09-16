"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const renderContent = () => {
    if (!mounted) return null;
    if (!isConnected || !address) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Please connect your wallet</h2>
          <p className="text-white/70 mt-2">Connect to see your profile.</p>
        </div>
      );
    }
    return (
      <>
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Your Profile</h2>
        <div className="flex flex-col gap-4 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Wallet Address:</span>
            <span className="font-mono text-blue-300">{shortenAddress(address)}</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-12 text-white">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {renderContent()}
      </div>
    </div>
  );
}