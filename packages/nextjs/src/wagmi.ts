// packages/nextjs/src/wagmi.ts
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { configureChains, createConfig } from "wagmi";
import { avalancheFuji } from "wagmi/chains";

// 1) RPC URL di Fuji (override in .env con NEXT_PUBLIC_FUJI_RPC_URL)
const fujiRpcUrl = process.env.NEXT_PUBLIC_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";

// 2) Configuriamo la catena e il provider JSON-RPC
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji],
  [
    jsonRpcProvider({
      rpc: chain => (chain.id === avalancheFuji.id ? { http: fujiRpcUrl } : null),
    }),
  ],
);

// 3) Prendiamo i connettori standard di RainbowKit
const { connectors } = getDefaultWallets({
  appName: "Unwasted Meals",
  chains,
});

// 4) Creiamo il config di Wagmi
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
