"use client";
import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

// Bu ID'yi ortam değişkenlerinden alıyoruz
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;

function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function ProfilePage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [triName, setTriName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!account?.address) return;

    const fetchTriName = async () => {
      setLoading(true);
      setError(null);
      setTriName(null);

      try {
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${PACKAGE_ID}::tri_name::TriName`,
          },
          options: {
            showContent: true,
          },
        });

        if (objects.data.length > 0) {
          const nameObject = objects.data[0];
          if (nameObject.data?.content?.dataType === 'moveObject') {
            const fields = nameObject.data.content.fields as { name: string };
            setTriName(fields.name);
          }
        }
      } catch (e) {
        console.error("Error fetching @tri Name NFT:", e);
        setError("Could not fetch your @tri name. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTriName();
  }, [account?.address, suiClient]);

  const renderContent = () => {
    if (!mounted) {
      return null; // or a loading spinner
    }
    if (!account) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Please connect your wallet</h2>
          <p className="text-white/70 mt-2">Connect to see your profile.</p>
        </div>
      );
    }
    return (
      <>
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Your Profile</h2>
        <div className="flex flex-col gap-4 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Wallet Address:</span>
            <span className="font-mono text-blue-300">{shortenAddress(account.address)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Your @tri Name:</span>
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : triName ? (
              <span className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {triName}@tri
              </span>
            ) : (
              <span className="text-gray-500">No name registered</span>
            )}
          </div>
        </div>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </>
    );
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-12 text-white">
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {renderContent()}
      </div>
    </div>
  );
} 