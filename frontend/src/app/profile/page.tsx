"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: "",
    portfolio: ""
  });

  useEffect(() => { setMounted(true); }, []);

  const mockProjects = [
    { id: 1, title: "AI Logo Design", status: "Completed", earnings: "0.5 MATIC" },
    { id: 2, title: "Smart Contract", status: "In Progress", earnings: "0 MATIC" },
  ];

  const renderContent = () => {
    if (!mounted) return null;
    if (!isConnected || !address) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-semibold">Please connect your wallet</h2>
          <p className="text-white/70 mt-2">Connect to access your freelancer profile.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
            👨‍💻
          </div>
          <h2 className="text-2xl font-bold text-white">{profile.name || "Freelancer"}</h2>
          <p className="text-blue-300 font-mono">{shortenAddress(address)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Profile Info</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/20 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-3 py-2 bg-white/20 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                  className="w-full px-3 py-2 bg-white/20 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm">Bio:</span>
                  <p className="text-white">{profile.bio || "No bio added yet"}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Skills:</span>
                  <p className="text-white">{profile.skills || "No skills added yet"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">Total Projects:</span>
                <span className="text-white font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">NFTs Minted:</span>
                <span className="text-white font-semibold">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Earnings:</span>
                <span className="text-green-400 font-semibold">0.5 MATIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Rating:</span>
                <span className="text-yellow-400 font-semibold">⭐ 4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex justify-between items-center bg-white/10 p-4 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{project.title}</h4>
                  <span className={`text-sm px-2 py-1 rounded ${
                    project.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <span className="text-green-400 font-semibold">{project.earnings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mt-12 text-white">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-fadeInUp">
        {renderContent()}
      </div>
    </div>
  );
}