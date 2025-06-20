"use client";
import { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useWallets } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { SuiObjectData } from '@mysten/sui.js/client';

const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID!;
const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function Home() {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const wallet = wallets[0];
  const address = wallet?.accounts?.[0]?.address;
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
  const [triName, setTriName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredNames =
    input.length > 1
      ? mockTriNames.filter((name) => name.includes(input.toLowerCase()))
      : [];

  // Resolve input to Sui address
  const resolveAddress = async (input: string): Promise<string | null> => {
    if (input.endsWith("@tri")) {
      try {
        const name = input.slice(0, -4);
        const fieldResp = await suiClient.getDynamicFieldObject({
          parentId: REGISTRY_ID,
          name: {
            type: 'vector<u8>',
            value: Array.from(new TextEncoder().encode(name)),
          },
        });
        if (fieldResp.data && fieldResp.data.content && fieldResp.data.content.dataType === 'moveObject') {
          return (fieldResp.data.content.fields as { value: string }).value;
        }
      } catch (error) {
        console.error("Error resolving @tri name:", error);
        return null;
      }
    }
    // Basic Sui address validation
    if (/^0x[a-fA-F0-9]{40,64}$/.test(input)) return input;
    return null;
  };

  useEffect(() => {
    const fetchTriNameForOwner = async () => {
      if (!address) return;
      setLoading(true);
      setError("");
      try {
        // Query all dynamic fields of the registry
        let allFields: SuiObjectData[] = [];
        let hasNextPage = true;
        let cursor: string | null = null;
        while(hasNextPage) {
          const page = await suiClient.getDynamicFields({ parentId: REGISTRY_ID, cursor });
          allFields = [...allFields, ...page.data];
          hasNextPage = page.hasNextPage;
          cursor = page.nextCursor;
        }

        // Find the field where the value matches the user's address
        const userField = allFields.find(field => {
            if (field.data?.content?.dataType === 'moveObject') {
                const fields = field.data.content.fields as { value: string };
                return fields?.value === address;
            }
            return false;
        });
        
        let triName = null;
        if (userField && userField.name?.type === 'vector<u8>') {
          // The name of the dynamic field is the @tri name in bytes
          const nameValue = userField.name.value as number[];
          triName = new TextDecoder().decode(Uint8Array.from(nameValue));
        }
        setTriName(triName);

      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError("Blockchain sorgusunda hata: " + errorMessage);
        setTriName(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTriNameForOwner();
  }, [address]);

  const handleSend = async () => {
    setError(null);
    const toAddress = await resolveAddress(input);
    if (!toAddress) {
      setError("Invalid or unregistered Sui address or @tri username.");
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
            onSuccess: (result) => {
              console.log("Transaction successful:", result);
              resolve(result);
            },
            onError: (e: Error) => {
               console.error("Transaction error:", e);
               reject(e)
            },
          }
        );
      });
      setSending(false);
      setShowModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setSending(false);
      setError(errorMessage || "Transaction failed");
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
            }}
            onFocus={() => setShowDropdown(false)}
            onBlur={() => setShowDropdown(false)}
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
          disabled={sending || isPending || !input || !amount || Number(amount) <= 0 || !currentAccount}
          onClick={handleSend}
        >
          <span className="relative z-10">{sending || isPending ? "Sending..." : "Send Donation"}</span>
          {/* Ripple Effect */}
          <span className="absolute inset-0 pointer-events-none" />
        </button>
        {/* Transaction History Mini-Card */}
        <div className="mt-2">
          <div className="bg-white/10 rounded-lg mt-2 p-3 text-white text-sm">
            This is a simplified donation interface. Enter a valid @tri name or a Sui address to send funds.
          </div>
        </div>
        {wallet && mounted && (
          <div className="bg-white/10 rounded-xl p-4 text-white/90 text-center">
            <b>Wallet:</b> <span className="font-mono">{shortenAddress(address)}</span><br />
            <b>@tri Name:</b> <span>{loading ? "Loading..." : error ? "Error loading name" : triName ? triName + "@tri" : "(no name registered)"}</span>
          </div>
        )}
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
