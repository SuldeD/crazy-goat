import "./globals.css";
import { primary } from "./fonts";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import Provider from "../components/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black ${primary.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
