"use client";
import { useState, useEffect } from "react";
import { useWallets, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

// Registry ve package ID'lerini kendi deploy ettiğiniz değerlerle değiştirin
const REGISTRY_ID = "0x1909789c965257d9782898b2b229828fe2314de9b896def05c89ccfb9d53473b";
const PACKAGE_ID = "0x8eed833809bdd02556304e15c44df3b734d948ea4b5b1009d836e75e0b4284d5";

const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });

const takenNames = ["alice@tri", "bob@tri", "charlie@tri"];

export default function GetTri() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [available, setAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const wallets = useWallets();
  const wallet = wallets[0];
  const address = wallet?.accounts?.[0]?.address;
  const signAndExecute = useSignAndExecuteTransaction();

  // Zincirden isim sorgulama
  const checkAvailability = async (name: string) => {
    setChecking(true);
    setError("");
    try {
      if (!name || name.length < 3) {
        setAvailable(false);
        setChecking(false);
        return;
      }
      // Kullanıcı adını zincir formatına (vector<u8>) çevir
      const fieldResp = await suiClient.getDynamicFieldObject({
        parentId: REGISTRY_ID,
        name: {
          type: 'vector<u8>',
          value: Array.from(new TextEncoder().encode(name)),
        },
      });
      const isTaken = !!(fieldResp.data && fieldResp.data.content);
      setAvailable(!isTaken);
    } catch (e: any) {
      setError("Blockchain sorgusunda hata: " + (e.message || e.toString()));
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (input.length > 2) {
      checkAvailability(input);
    } else {
      setAvailable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, address]);

  const handleRegister = async () => {
    if (!wallet || !address) {
      alert("Wallet not connected");
      return;
    }
    setLoading(true);
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::tri_name::register_name`,
        arguments: [tx.object(REGISTRY_ID), tx.pure(input)],
      });
      await signAndExecute.mutateAsync({
        transaction: tx.serialize(),
      });
      setRegistered(true);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1800);
    } catch (error) {
      console.error("Error registering name:", error);
      alert("Failed to register name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-12">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20 relative">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Get your @tri Name</h2>
        <div>
          <label className="block text-white/80 mb-1">Choose Username</label>
          <div className="flex gap-2 items-center relative">
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-16"
              placeholder="username"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setRegistered(false);
                setAvailable(false);
                setError("");
              }}
              autoComplete="off"
            />
            {(loading || checking) && (
              <div className="absolute right-16 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
              </div>
            )}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 font-semibold pointer-events-none select-none">@tri</span>
          </div>
          {input && !loading && !checking && (
            <div className="mt-2 text-sm">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : available ? (
                <span className="text-green-300">Available!</span>
              ) : (
                <span className="text-red-300">Taken</span>
              )}
            </div>
          )}
        </div>
        <button
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 ${(!available || registered || !input) ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl animate-pulse"}`}
          disabled={!available || registered || !input}
          onClick={handleRegister}
        >
          {registered ? "Registered!" : "Register @tri Name"}
        </button>
        <div className="bg-white/10 rounded-lg p-4 mt-2 text-white/80 text-sm">
          <b>Why @tri names?</b> <br />
          @tri usernames make it easy to receive donations and share your Sui address with others. Secure your unique name now!
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 relative min-w-[300px]">
            <span className="text-3xl">🎉</span>
            <h3 className="text-xl font-bold text-gray-800">@tri Name Registered!</h3>
            <p className="text-gray-600">You can now receive donations with your new name.</p>
          </div>
        </div>
      )}
      <style>{`
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