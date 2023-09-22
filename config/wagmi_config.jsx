import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { polygon } from "wagmi/chains";

const chains = [polygon];

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.ALCHEMY_ID,
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID,
    chains,

    appName: "Crazy GOAT Platform",

    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default config;
