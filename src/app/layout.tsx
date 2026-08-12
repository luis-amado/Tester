import "~/styles/globals.css";

import { type Metadata } from "next";
import Script from "next/script";
import { MotionConfig } from "framer-motion";

export const metadata: Metadata = {
  title: "Tester",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </html>
  );
}
