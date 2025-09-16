"use client";
import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import dynamic from "next/dynamic";

const CustomConnectButton = dynamic(() => import("../components/CustomConnectButton"), { ssr: false });

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const [mounted, setMounted] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSend = async () => {
    if (!isConnected || !address || !recipient || !amount || Number(amount) <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }
    setIsSending(true);
    setError(null);
    try {
      await sendTransactionAsync({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
      setShowModal(true);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const renderWelcome = () => (
    <div className="w-full glass-card rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 hover-lift">
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 sm:px-4 py-2 rounded-full border border-blue-500/30">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-xs sm:text-sm font-medium">AI-Powered Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Welcome to Triturus
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
          Harness the power of AI to showcase your work, mint NFTs, and build your freelance empire on Polygon
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center hover-lift group">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">🤖</div>
          <h3 className="font-bold text-white text-base sm:text-lg mb-2">AI-Enhanced Showcase</h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">Use AI to optimize your portfolio presentation and reach</p>
        </div>
        <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center hover-lift group">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">⚡</div>
          <h3 className="font-bold text-white text-base sm:text-lg mb-2">Smart NFT Minting</h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">AI-powered metadata generation and pricing optimization</p>
        </div>
        <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center hover-lift group sm:col-span-2 lg:col-span-1">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">💰</div>
          <h3 className="font-bold text-white text-base sm:text-lg mb-2">Intelligent Support</h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">AI-driven audience matching and revenue optimization</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <CustomConnectButton />
        <p className="text-white/60 text-xs sm:text-sm text-center px-4">Connect your wallet to unlock AI-powered features</p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* AI Assistant Card */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover-lift">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ai-glow">
            <span className="text-lg sm:text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">AI Assistant</h3>
            <p className="text-white/60 text-xs sm:text-sm">Ready to help optimize your freelance journey</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20">
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">💡 <strong>AI Suggestion:</strong> Based on current trends, consider adding Web3 development skills to increase your earning potential by 40%</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 hover-lift">
        <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your AI-Powered Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white">AI-Enhanced Actions</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/15 text-white rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:border-white/30 group">
                <div className="flex items-center justify-between">
                  <span className="font-medium">🎨 AI Project Upload</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">Smart</span>
                </div>
              </button>
              <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/15 text-white rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:border-white/30 group">
                <div className="flex items-center justify-between">
                  <span className="font-medium">⚡ Smart NFT Mint</span>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">AI</span>
                </div>
              </button>
              <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/15 text-white rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:border-white/30 group">
                <div className="flex items-center justify-between">
                  <span className="font-medium">📊 AI Analytics</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">Pro</span>
                </div>
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Performance Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/80">Active Projects:</span>
                <span className="text-white font-bold text-lg">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/80">NFTs Minted:</span>
                <span className="text-green-400 font-bold text-lg">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/80">Total Earnings:</span>
                <span className="text-blue-400 font-bold text-lg">0 MATIC</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <span className="text-white/80">AI Score:</span>
                <span className="text-yellow-400 font-bold text-lg">⭐ New</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-8 hover-lift">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center ai-glow">
            <span className="text-white text-lg">💎</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Support a Freelancer</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-white/80 mb-2 font-medium">Freelancer Address</label>
            <input
              className="w-full px-4 py-4 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all border border-white/10"
              placeholder="0x... address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 font-medium">Amount (MATIC)</label>
            <input
              type="number"
              min="0.001"
              step="0.001"
              className="w-full px-4 py-4 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all border border-white/10"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}
        
        <button
          className={`w-full py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-lg border border-white/20 hover:border-white/30 transition-all duration-300 ${
            isSending ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"
          }`}
          disabled={isSending || !recipient || !amount}
          onClick={handleSend}
        >
          {isSending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            "💫 Send Support"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mt-4 sm:mt-8 lg:mt-12 text-white px-4 sm:px-6 lg:px-8">
      {mounted && !isConnected ? renderWelcome() : mounted && isConnected ? renderDashboard() : null}
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
