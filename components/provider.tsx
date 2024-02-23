"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";
import { Layout } from "./layout";
import wagmi_config from "../config/wagmi_config";

export default function Provider({ children }) {
  return (
    <WagmiConfig config={wagmi_config}>
      <ConnectKitProvider>
        <Layout>{children}</Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
