"use client";
import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CustomConnectButton = dynamic(() => import("../../../components/CustomConnectButton"), { ssr: false });

interface ProjectDetail {
  id: number;
  title: string;
  creator: string;
  creatorName: string;
  image: string;
  description: string;
  fullDescription: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  skills: string[];
  deliveryTime: string;
  revisions: number;
  gallery: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // Mock project data - gerçek uygulamada API'den gelecek
    const mockProject: ProjectDetail = {
      id: parseInt(params.id as string),
      title: "AI-Generated Logo Design",
      creator: "0x1234...5678",
      creatorName: "Alex Designer",
      image: "/api/placeholder/600/400",
      description: "Modern logo design created with AI assistance",
      fullDescription: "This comprehensive logo design package includes multiple variations of your brand identity, created using cutting-edge AI tools combined with professional design expertise. The package includes vector files, color variations, and brand guidelines to ensure consistent application across all your marketing materials.",
      price: "0.5",
      category: "Design",
      rating: 4.8,
      reviews: 127,
      skills: ["AI Design", "Branding", "Logo Design", "Vector Graphics"],
      deliveryTime: "3 days",
      revisions: 3,
      gallery: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    };
    setProject(mockProject);
  }, [params.id]);

  const handleSupport = async () => {
    if (!isConnected || !project) return;
    
    setIsSending(true);
    try {
      await sendTransactionAsync({
        to: project.creator as `0x${string}`,
        value: parseEther(project.price),
      });
      setShowModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!mounted || !project) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-[1400px] mt-4 sm:mt-8 lg:mt-12 text-white space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="w-full animate-fadeInLeft">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Showcase
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left Column - Project Images */}
        <div className="lg:col-span-2 space-y-6 animate-fadeInLeft">
          {/* Main Image */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-6xl">🎨</span>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-3 gap-4">
            {project.gallery.map((img, index) => (
              <div key={index} className="glass rounded-xl aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
            ))}
          </div>

          {/* Project Description */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
            <p className="text-white/80 leading-relaxed mb-6">{project.fullDescription}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Skills Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="badge-minimal">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Project Info & Purchase */}
        <div className="space-y-6 animate-fadeInRight">
          {/* Project Info Card */}
          <div className="glass-card rounded-2xl p-6 sticky top-24">
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">{project.title}</h1>
                  <span className="badge-minimal">{project.category}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="text-yellow-400">⭐</span>
                  <span>{project.rating}</span>
                  <span>({project.reviews} reviews)</span>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{project.creatorName}</h3>
                  <p className="text-white/60 text-sm font-mono">{project.creator}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Price:</span>
                  <span className="text-2xl font-bold text-green-400">{project.price} MATIC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Delivery:</span>
                  <span className="text-white">{project.deliveryTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Revisions:</span>
                  <span className="text-white">{project.revisions} included</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isConnected ? (
                  <button
                    onClick={handleSupport}
                    disabled={isSending}
                    className="w-full py-4 bg-white/15 hover:bg-white/20 text-white font-bold text-lg rounded-xl border border-white/30 hover:border-white/40 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `💎 Purchase for ${project.price} MATIC`
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                      <p className="text-yellow-200 text-sm">Connect your wallet to purchase</p>
                    </div>
                    <div className="w-full">
                      <CustomConnectButton variant="large" />
                    </div>
                  </div>
                )}
                
                <button className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all">
                  💬 Contact Creator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4 text-center max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-4xl">🎉</span>
            <h3 className="text-2xl font-bold text-white">Purchase Successful!</h3>
            <p className="text-white/80">You've successfully purchased "{project.title}". The creator will be in touch soon!</p>
            <button 
              className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/20 transition-all" 
              onClick={() => setShowModal(false)}
            >
              Great!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}