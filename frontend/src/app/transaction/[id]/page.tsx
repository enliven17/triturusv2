"use client";
import { useRouter } from "next/navigation";

const mockTx = {
  hash: "0xabc123...def456",
  from: "bob@tri",
  to: "alice@tri",
  amount: 2.5,
  time: "2m ago",
};

export default function TransactionDetails() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-12">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20 relative">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Transaction Details</h2>
        <div className="flex flex-col gap-2 text-white/90">
          <div><b>Hash:</b> <span className="font-mono">{mockTx.hash}</span></div>
          <div><b>From:</b> <span>{mockTx.from}</span></div>
          <div><b>To:</b> <span>{mockTx.to}</span></div>
          <div><b>Amount:</b> <span className="font-mono">{mockTx.amount} SUI</span></div>
          <div><b>Time:</b> <span>{mockTx.time}</span></div>
        </div>
        <button className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition self-center" onClick={() => router.back()}>
          Back
        </button>
      </div>
    </div>
  );
} 