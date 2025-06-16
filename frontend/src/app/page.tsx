"use client";
import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const mockTriNames = ["alice@tri", "bob@tri", "charlie@tri", "diana@tri"];
const mockTriToAddress: Record<string, string> = {
  "alice@tri": "0x1234567890abcdef1234567890abcdef12345678",
  "bob@tri": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "charlie@tri": "0x1111111111111111111111111111111111111111",
  "diana@tri": "0x2222222222222222222222222222222222222222",
};
const mockHistory = [
  { to: "alice@tri", amount: 2.5, time: "2m ago" },
  { to: "0x1234...abcd", amount: 1.1, time: "10m ago" },
  { to: "bob@tri", amount: 0.8, time: "1h ago" },
];

export default function Home() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction();
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredNames =
    input.length > 1
      ? mockTriNames.filter((name) => name.includes(input.toLowerCase()))
      : [];

  // Resolve input to Sui address
  const resolveAddress = (input: string) => {
    if (input.endsWith("@tri")) {
      return mockTriToAddress[input] || null;
    }
    // Basic Sui address validation
    if (/^0x[a-fA-F0-9]{40,64}$/.test(input)) return input;
    return null;
  };

  const handleSend = async () => {
    setError(null);
    const toAddress = resolveAddress(input);
    if (!toAddress) {
      setError("Invalid Sui address or @tri username.");
      return;
    }
    if (!currentAccount) {
      setError("Please connect your wallet.");
      return;
    }
    setSending(true);
    try {
      // Get all SUI coins for the sender
      const coins = await suiClient.getCoins({ owner: currentAccount.address, coinType: "0x2::sui::SUI" });
      if (!coins.data.length) throw new Error("No SUI coins found in wallet.");
      // Build transaction
      const tx = new TransactionBlock();
      const inputAmount = Math.floor(Number(amount) * 1e9); // SUI uses 9 decimals
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(inputAmount)]);
      tx.transferObjects([coin], tx.pure(toAddress));
      // Sign and execute
      await new Promise((resolve, reject) => {
        signAndExecuteTransaction(
          { transaction: tx.serialize() },
          {
            onSuccess: () => resolve(true),
            onError: (e) => reject(e),
          }
        );
      });
      setSending(false);
      setShowModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (e: any) {
      setSending(false);
      setError(e.message || "Transaction failed");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-12">
      {/* Glassmorphic Card */}
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20 relative">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Send a Donation</h2>
        {/* Address/@tri Input */}
        <div className="relative">
          <label className="block text-white/80 mb-1">Sui Address or @tri Username</label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter Sui address or @tri username"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowDropdown(true);
              setLoadingNames(true);
              setTimeout(() => setLoadingNames(false), 500);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            autoComplete="off"
          />
          {/* Auto-suggest Dropdown */}
          {showDropdown && input && (
            <div className="absolute left-0 right-0 mt-2 bg-white/90 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto animate-fade-in">
              {loadingNames ? (
                <div className="p-3 flex gap-2 items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
                  <span className="text-gray-700">Loading...</span>
                </div>
              ) : filteredNames.length > 0 ? (
                filteredNames.map((name) => (
                  <div
                    key={name}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-blue-900 rounded"
                    onMouseDown={() => {
                      setInput(name);
                      setShowDropdown(false);
                    }}
                  >
                    {name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No matches found</div>
              )}
            </div>
          )}
        </div>
        {/* Amount Input */}
        <div>
          <label className="block text-white/80 mb-1">Amount (SUI)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0.01}
              step={0.01}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              onClick={() => setAmount("10")}
              type="button"
            >
              MAX
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && <div className="text-red-300 text-sm text-center">{error}</div>}
        {/* Send Button */}
        <button
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 ${sending || isPending ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl animate-pulse"}`}
          disabled={sending || isPending || !input || !amount || Number(amount) < 0.01 || !currentAccount}
          onClick={handleSend}
        >
          <span className="relative z-10">{sending || isPending ? "Sending..." : "Send Donation"}</span>
          {/* Ripple Effect */}
          <span className="absolute inset-0 pointer-events-none" />
        </button>
        {/* Transaction History Mini-Card */}
        <div className="mt-2">
          <button
            className="flex items-center gap-2 text-blue-200 hover:text-white transition text-sm"
            onClick={() => setShowHistory((v) => !v)}
            type="button"
          >
            <span className="font-semibold">Recent Donations</span>
            <svg className={`w-4 h-4 transition-transform ${showHistory ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showHistory && (
            <div className="bg-white/20 rounded-lg mt-2 p-3 text-white text-sm animate-fade-in">
              {mockHistory.map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-white/10 last:border-b-0">
                  <span>{tx.to}</span>
                  <span className="font-mono">{tx.amount} SUI</span>
                  <span className="text-xs text-white/60">{tx.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 relative min-w-[300px]">
            <span className="text-3xl">🎉</span>
            <h3 className="text-xl font-bold text-gray-800">Donation Sent!</h3>
            <p className="text-gray-600">Thank you for supporting the community.</p>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            {/* Confetti Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Simple confetti dots */}
                {[...Array(30)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${8 + Math.random() * 8}px`,
                      height: `${8 + Math.random() * 8}px`,
                      background: `hsl(${Math.random() * 360}, 80%, 70%)`,
                      opacity: 0.8,
                      animation: `confetti-float 1.5s ease-out forwards`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Confetti Keyframes */}
      <style>{`
        @keyframes confetti-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(80px) scale(0.7); opacity: 0; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
