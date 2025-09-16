"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomConnectButton() {
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
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-yellow-400 hover:bg-yellow-300 text-[#232946] font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
                  >
                    Connect Wallet
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

              return (
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 px-3 py-1 rounded text-white font-mono">
                    {account.displayName}
                  </span>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-red-400 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded shadow transition-all"
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