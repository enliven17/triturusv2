"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function MintPage() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Design",
    price: "",
    royalty: "10"
  });

  useEffect(() => { setMounted(true); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMint = () => {
    // NFT minting logic will be implemented here
    console.log("Minting NFT with data:", formData);
  };

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mt-12 text-white">
        <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center animate-fadeInUp">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mint Your Work as NFT
          </h1>
          <p className="text-white/80 mb-6">
            Please connect your wallet to mint your projects as NFTs
          </p>
          <div className="text-6xl mb-4">🔒</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mt-4 sm:mt-8 lg:mt-12 text-white px-4 sm:px-6 lg:px-8">
      <div className="w-full glass-card rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
          Mint Your Project as NFT
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white/80 mb-2 font-semibold">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter your project title"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                placeholder="Describe your project and the AI tools used"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2 font-semibold">Price (MATIC)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0.001"
                  step="0.001"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 font-semibold">Royalty (%)</label>
                <input
                  type="number"
                  name="royalty"
                  value={formData.royalty}
                  onChange={handleInputChange}
                  min="0"
                  max="20"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white/80 mb-2 font-semibold">Upload Project File</label>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-white/70 mb-2">Drag & drop your file here</p>
                <p className="text-white/50 text-sm">or click to browse</p>
                <input type="file" className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" />
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">NFT Preview</h3>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-white/70">{formData.title || "Your Project Title"}</p>
                <p className="text-white/50 text-sm mt-2">{formData.category}</p>
                {formData.price && (
                  <p className="text-green-400 font-semibold mt-2">{formData.price} MATIC</p>
                )}
              </div>
            </div>

            <button
              onClick={handleMint}
              disabled={!formData.title || !formData.description || !formData.price}
              className="w-full py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-lg rounded-xl border border-white/20 hover:border-white/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}