import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "fridge2food - Turn your fridge into a feast",
    template: "%s | fridge2food",
  },
  description: "Instant recipes from your leftovers with AI. Powered by Gemini.",
  keywords: ["recipe", "AI", "leftovers", "midnight", "chef", "cooking", "meal planning", "food waste"],
  authors: [{ name: "Piyush Varma" }],
  openGraph: {
    title: "fridge2food - Turn your fridge into a feast",
    description: "Instant recipes from your leftovers with AI. Powered by Gemini.",
    url: "https://fridge2food-pyt.vercel.app",
    siteName: "fridge2food",
    images: [
      {
        url: "/meta-tag-image.png",
        width: 1200,
        height: 630,
        alt: "fridge2food - AI Recipe Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "fridge2food - Turn your fridge into a feast",
    description: "Instant recipes from your leftovers with AI. Powered by Gemini.",
    images: ["/meta-tag-image.png"],
    creator: "@piyushhvarma",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelify.variable} dark antialiased`}>
      <body className={`min-h-screen bg-zinc-950 ${pixelify.className} text-zinc-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
