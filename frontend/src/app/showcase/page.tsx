"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function ShowcasePage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const mockProjects = [
    {
      id: 1,
      title: "AI-Generated Logo Design",
      creator: "0x1234...5678",
      image: "/api/placeholder/300/200",
      description: "Modern logo design created with AI assistance",
      price: "0.5 MATIC",
      category: "Design"
    },
    {
      id: 2,
      title: "Smart Contract Audit",
      creator: "0x9876...5432",
      image: "/api/placeholder/300/200",
      description: "Comprehensive security audit for DeFi protocols",
      price: "2.0 MATIC",
      category: "Development"
    },
    {
      id: 3,
      title: "AI Content Writing",
      creator: "0xabcd...efgh",
      image: "/api/placeholder/300/200",
      description: "SEO-optimized content created with AI tools",
      price: "0.3 MATIC",
      category: "Writing"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-[1400px] mt-4 sm:mt-8 lg:mt-12 text-white space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="w-full glass-card rounded-3xl p-8 hover-lift animate-fadeInUp">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-blue-500/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-medium">AI-Curated Showcase</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Freelancer Showcase
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover exceptional projects created by talented freelancers using cutting-edge AI tools
          </p>
        </div>
        
        {/* AI-Powered Filters */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <button className="px-6 py-3 bg-white/15 text-white rounded-xl hover:scale-[1.02] transition-all border border-white/30 font-medium hover:bg-white/20">
            🤖 AI Recommended
          </button>
          <button className="px-6 py-3 bg-white/10 text-white/80 rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:bg-white/15 hover:text-white">
            🎨 Design
          </button>
          <button className="px-6 py-3 bg-white/10 text-white/80 rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:bg-white/15 hover:text-white">
            💻 Development
          </button>
          <button className="px-6 py-3 bg-white/10 text-white/80 rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:bg-white/15 hover:text-white">
            ✍️ Writing
          </button>
          <button className="px-6 py-3 bg-white/10 text-white/80 rounded-xl hover:scale-[1.02] transition-all border border-white/20 hover:bg-white/15 hover:text-white">
            📱 Marketing
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <div className="w-full glass rounded-2xl p-6 animate-stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center ai-glow">
            <span className="text-white text-sm">🧠</span>
          </div>
          <h3 className="text-lg font-bold text-white">AI Market Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
            <p className="text-green-300 text-sm">📈 <strong>Trending:</strong> Web3 Development (+45% demand)</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30">
            <p className="text-blue-300 text-sm">⚡ <strong>Hot Skills:</strong> AI Integration, Smart Contracts</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30">
            <p className="text-purple-300 text-sm">💰 <strong>Top Earners:</strong> NFT Artists, DeFi Devs</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full animate-stagger-2">
        {mockProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => router.push(`/showcase/${project.id}`)}
            className="glass-card rounded-2xl overflow-hidden hover-lift group cursor-pointer"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl group-hover:scale-110 transition-transform">🎨</span>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                AI Enhanced
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                <span className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                  {project.category}
                </span>
              </div>
              
              <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👤</span>
                </div>
                <span>by {project.creator}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-green-400 font-bold text-lg">{project.price}</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-white/60 text-xs">4.8</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Wallet CTA */}
      {!isConnected && (
        <div className="w-full glass-card rounded-2xl p-8 text-center hover-lift animate-stagger-3">
          <div className="space-y-4">
            <div className="text-4xl">🔐</div>
            <h3 className="text-xl font-bold text-white">Unlock Full AI Features</h3>
            <p className="text-white/70">Connect your wallet to access AI-powered recommendations, support freelancers, and unlock premium features</p>
            <div className="flex justify-center">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl hover:scale-[1.02] transition-all font-medium border border-white/20 hover:border-white/30">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}