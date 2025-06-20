import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import WalletProviderClient from "./WalletProviderClient";

export const metadata: Metadata = {
  title: "Triturus",
  description: "Sui Wallet Donation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1b2e6f] to-[#3c3c6c] relative`}
      >
        {/* Animated Background Placeholder */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a174e] via-[#1b2e6f] to-[#3c3c6c] opacity-90" />
        <WalletProviderClient>
          {/* Main Content */}
          <main className="flex flex-col items-center justify-center min-h-[80vh] w-full px-2 sm:px-0">
            {children}
          </main>
        </WalletProviderClient>
        {/* Footer */}
        <footer className="w-full flex items-center justify-center gap-4 py-2 bg-white/5 backdrop-blur-md border-t border-white/10 text-white/60 text-sm fixed bottom-0 left-0">
          <span>&copy; {new Date().getFullYear()} Triturus</span>
          <a
            href="https://x.com/TriturusApp"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-white/80 hover:text-blue-400 font-semibold transition-colors"
            title="X (Twitter)"
          >
            X
          </a>
        </footer>
      </body>
    </html>
  );
}
