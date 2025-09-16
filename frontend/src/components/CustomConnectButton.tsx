"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface CustomConnectButtonProps {
  variant?: "default" | "large";
}

export default function CustomConnectButton({ variant = "default" }: CustomConnectButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                const buttonClasses = variant === "large"
                  ? "w-full py-4 bg-white/15 hover:bg-white/20 text-white font-bold text-lg rounded-xl border border-white/30 hover:border-white/40 hover:scale-[1.02] transition-all"
                  : "bg-yellow-400 hover:bg-yellow-300 text-[#232946] font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow-md transition-all text-xs sm:text-sm";

                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={buttonClasses}
                  >
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-red-400 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded shadow transition-all"
                  >
                    Wrong network
                  </button>
                );
              }

              // Mobil için kısaltılmış adres
              const shortAddress = account.address 
                ? `${account.address.slice(0, 4)}...${account.address.slice(-4)}`
                : account.displayName;

              return (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Mobilde sadece adres, desktop'ta adres + disconnect */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-white/10 hover:bg-white/15 px-2 sm:px-3 py-1 rounded text-white font-mono text-xs sm:text-sm transition-all"
                  >
                    <span className="hidden sm:inline">{account.displayName}</span>
                    <span className="sm:hidden">{shortAddress}</span>
                  </button>
                  
                  {/* Desktop'ta ayrı disconnect butonu */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="hidden sm:block bg-red-400 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded shadow transition-all text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}