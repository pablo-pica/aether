import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "@/styles/globals.css";
import ObservabilityProvider from "@/components/ObservabilityProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aethyr Aid — Verified Typhoon Relief Payments on Stellar",
  description: "Track Bicol relief from campaign escrow to voucher, evidence, verification, and payout or dispute.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aethyr Aid",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-aid-gold/60 selection:text-aid-ink">
        <ObservabilityProvider>{children}</ObservabilityProvider>
      </body>
    </html>
  );
}
