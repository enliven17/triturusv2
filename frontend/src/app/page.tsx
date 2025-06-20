"use client";
import { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui/transactions";
import Link from "next/link";

const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID!;

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function Home() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [mounted, setMounted] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = async () => {
    if (!account || !recipient || !amount || Number(amount) <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }
    setIsSending(true);
    setError(null);

    try {
      let toAddress = recipient;
      if (recipient.endsWith("@tri")) {
        const name = recipient.slice(0, -4);
        const field = await suiClient.getDynamicFieldObject({
          parentId: REGISTRY_ID,
          name: {
            type: "vector<u8>",
            value: Array.from(new TextEncoder().encode(name)),
          },
        });
        if (field.data?.content?.dataType === 'moveObject') {
           toAddress = (field.data.content.fields as { value: string }).value;
        } else {
          throw new Error(`@tri name "${recipient}" not found.`);
        }
      }

      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(Math.floor(Number(amount) * 1e9))]);
      tx.transferObjects([coin], tx.pure(toAddress));

      signAndExecute(
        { transaction: tx },
        {
          onError: (err: Error) => {
            setError(err.message);
          },
          onSuccess: () => {
            setShowModal(true);
          },
        }
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Donation failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };
  
  const renderWelcome = () => (
     <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to Triturus
        </h1>
        <p className="text-center text-lg text-white/80">
          Your decentralized identity on the Sui blockchain. Please connect your wallet to get started.
        </p>
         <Link
          href="/get-tri"
          className="w-full mt-4 py-3 text-center rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Get your @tri Name
        </Link>
      </div>
  );

  const renderDonation = () => (
     <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Send a Donation</h2>
      <div>
        <label className="block text-white/80 mb-1">Recipient</label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter Sui address or @tri username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-white/80 mb-1">Amount (SUI)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {error && <p className="text-red-400 text-center">{error}</p>}
      <button
        className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 ${isSending ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
        disabled={isSending || !recipient || !amount}
        onClick={handleSend}
      >
        {isSending ? "Sending..." : "Send Donation"}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-12 text-white">
      {mounted && account ? renderDonation() : renderWelcome()}
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 text-gray-800" onClick={(e) => e.stopPropagation()}>
            <span className="text-4xl">🎉</span>
            <h3 className="text-2xl font-bold">Donation Sent!</h3>
            <p>Your donation to <span className="font-mono">{shortenAddress(recipient)}</span> was successful.</p>
            <button className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold" onClick={() => setShowModal(false)}>
              Great!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
