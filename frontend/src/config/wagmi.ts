"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem";

export const polygonAmoy: Chain = {
  id: 80002,
  name: "Polygon Amoy Testnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology/"] },
    public: { http: ["https://rpc-amoy.polygon.technology/"] },
  },
  blockExplorers: {
    default: { name: "OKLink", url: "https://www.oklink.com/amoy" },
  },
  testnet: true,
};

export const wagmiConfig = getDefaultConfig({
  appName: "Triturus",
  projectId: "ab26ccf9ca4261fbb23302b9029e8a1f",
  chains: [polygonAmoy],
  ssr: true,
});


