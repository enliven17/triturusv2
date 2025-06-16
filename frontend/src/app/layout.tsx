import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProviderClient from "./WalletProviderClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1b2e6f] to-[#3c3c6c] relative`}
      >
        {/* Animated Background Placeholder */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a174e] via-[#1b2e6f] to-[#3c3c6c] opacity-90" />
        <WalletProviderClient>
          {/* Main Content */}
          <main className="flex flex-col items-center justify-center min-h-[80vh] w-full px-2 sm:px-0">
            {children}
          </main>
          {/* Footer */}
          <footer className="w-full flex items-center justify-center py-4 bg-white/5 backdrop-blur-md border-t border-white/10 text-white/60 text-sm mt-8">
            <div className="flex gap-4">
              <a href="/get-tri" className="hover:text-white transition">Get @tri Name</a>
              <a href="/profile" className="hover:text-white transition">Profile</a>
              <span>&copy; {new Date().getFullYear()} Triturus</span>
            </div>
          </footer>
        </WalletProviderClient>
      </body>
    </html>
  );
}
