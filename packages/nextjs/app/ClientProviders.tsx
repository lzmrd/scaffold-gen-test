// app/ClientProviders.tsx
"use client";

import React from "react";
import { WagmiConfig } from "wagmi";
import { chains, wagmiConfig } from "../src/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";

// app/ClientProviders.tsx

/**
 * ClientProviders wraps all client-only providers (Wagmi, RainbowKit, Theme, ScaffoldEth)
 * ensuring web3 and wallet logic runs only in the browser (on Fuji via /rpc proxy)
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ThemeProvider enableSystem>
        <RainbowKitProvider chains={chains}>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </RainbowKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}
