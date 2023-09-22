"use client";

import "./globals.css";
import { Layout } from "../components/layout";
import { primary } from "./fonts";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import wagmi_config from "../config/wagmi_config";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black ${primary.className}`}>
        <WagmiConfig config={wagmi_config}>
          <ConnectKitProvider>
            <Layout>{children}</Layout>
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
