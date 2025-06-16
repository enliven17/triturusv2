"use client";
import { useWallets, useConnectWallet, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

function shortenAddress(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function CustomConnectButton() {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (currentAccount) {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-white/10 px-3 py-1 rounded text-white font-mono">{shortenAddress(currentAccount.address)}</span>
        <button
          onClick={() => disconnect()}
          className="bg-red-400 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded shadow transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {wallets.length === 0 && (
        <div className="text-red-500">No Sui wallet extension detected.</div>
      )}
      {wallets.map((wallet: any) => (
        <button
          key={wallet.name}
          onClick={() => connect({ wallet })}
          className="bg-yellow-400 hover:bg-yellow-300 text-[#232946] font-semibold px-5 py-2 rounded-lg shadow-md transition-all m-2"
        >
          Connect Wallet
        </button>
      ))}
    </div>
  );
} 