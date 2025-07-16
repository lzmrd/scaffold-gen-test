// packages/nextjs/scaffold.config.ts
import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// Read your Fuji RPC URL from .env or default to the public endpoint
const FUJI_RPC = process.env.NEXT_PUBLIC_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";

const scaffoldConfig = {
  // ← Switch from hardhat to avalancheFuji:
  targetNetworks: [chains.avalancheFuji],

  // Poll every 30s (only matters on non-local chains)
  pollingInterval: 30_000,

  // Alchemy key (unused on Fuji, but required by the type)
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  // Override the RPC for Fuji so that `/rpc` proxy goes there
  rpcOverrides: {
    [chains.avalancheFuji.id]: FUJI_RPC,
  },

  // WalletConnect Project ID (as before)
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Disable the burner-only wallet since we’re on a real testnet
  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
