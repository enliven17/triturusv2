"use client";
import { useState, useEffect } from "react";
import { useWallets, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// Registry ve package ID'lerini kendi deploy ettiğiniz değerlerle değiştirin
const REGISTRY_ID = "0x<YOUR_REGISTRY_ID>";
const PACKAGE_ID = "0x<YOUR_PACKAGE_ID>";

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
      if (!address) {
        setAvailable(false);
        setChecking(false);
        return;
      }
      // get_name fonksiyonu: registry, address
      const resp = await suiClient.call(
        "suix_moveCall",
        [
          {
            packageObjectId: PACKAGE_ID,
            module: "donation",
            function: "get_name",
            arguments: [REGISTRY_ID, address],
          },
        ]
      );
      console.log("get_name resp", resp);
      const r = resp as any;
      // Option::Some ise alınmış, None ise alınmamış
      if ((r && Array.isArray(r.results) && r.results[0]) || (r && Array.isArray(r.returnValues) && r.returnValues[0])) {
        setAvailable(false);
      } else {
        setAvailable(true);
      }
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
        target: `${PACKAGE_ID}::donation::register_name`,
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
          <div className="flex gap-2 items-center">
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="username@tri"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setRegistered(false);
                setAvailable(false);
                setError("");
              }}
              autoComplete="off"
            />
            {(loading || checking) && <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />}
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