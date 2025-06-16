"use client";
import { useState, useEffect } from "react";
import { useWallets } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const REGISTRY_ID = "0xe4093e9889cb1aa29e0ccd64ce2c5af08b784fa867a764498c2df41b7e059203";
const PACKAGE_ID = "0x0d6f972610977b591d07d958099964e269c20089c1901d21849e36e63406cb6b";
const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });

export default function Profile() {
  const [showReceived, setShowReceived] = useState(true);
  const [triName, setTriName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const wallets = useWallets();
  const wallet = wallets[0];
  const address = wallet?.accounts?.[0]?.address;

  useEffect(() => {
    const fetchTriName = async () => {
      if (!address) return;
      setLoading(true);
      setError("");
      try {
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
        const r = resp as any;
        if ((r && Array.isArray(r.results) && r.results[0])) {
          setTriName(r.results[0]);
        } else if ((r && Array.isArray(r.returnValues) && r.returnValues[0])) {
          setTriName(r.returnValues[0]);
        } else {
          setTriName(null);
        }
      } catch (e: any) {
        setError("Blockchain sorgusunda hata: " + (e.message || e.toString()));
        setTriName(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTriName();
  }, [address]);

  const mockProfile = {
    address: address || "0x...",
    tri: triName ? triName + "@tri" : "(no name)",
    balance: 42.7,
  };
  const mockDonations = [
    { type: "received", from: "bob@tri", amount: 2.5, time: "2m ago" },
    { type: "sent", to: "charlie@tri", amount: 1.1, time: "10m ago" },
    { type: "received", from: "0x5678...efgh", amount: 0.8, time: "1h ago" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-12 gap-6">
      {/* Profile Card */}
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-4 border border-white/20 relative">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Profile</h2>
        <div className="flex flex-col gap-2 text-white/90">
          <div><b>Wallet:</b> <span className="font-mono">{mockProfile.address}</span></div>
          <div><b>@tri Name:</b> <span>{loading ? "Loading..." : error ? error : mockProfile.tri}</span></div>
          <div><b>Balance:</b> <span className="font-mono">{mockProfile.balance} SUI</span></div>
        </div>
        <button className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition self-end">Edit Profile</button>
      </div>
      {/* Donations History */}
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/20 relative">
        <div className="flex gap-4 mb-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${showReceived ? "bg-blue-500 text-white" : "bg-white/20 text-white/70 hover:bg-blue-400/30"}`}
            onClick={() => setShowReceived(true)}
          >
            Received
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${!showReceived ? "bg-blue-500 text-white" : "bg-white/20 text-white/70 hover:bg-blue-400/30"}`}
            onClick={() => setShowReceived(false)}
          >
            Sent
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {mockDonations.filter(d => showReceived ? d.type === "received" : d.type === "sent").map((d, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0 text-white">
              <span>{showReceived ? d.from : d.to}</span>
              <span className="font-mono">{d.amount} SUI</span>
              <span className="text-xs text-white/60">{d.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 