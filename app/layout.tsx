import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "fridge2food - Turn your fridge into a feast",
  description:
    "Instant recipes from your leftovers with AI. Powered by Gemini.",
  keywords: ["recipe", "AI", "leftovers", "midnight", "chef", "cooking"],
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
      </body>
    </html>
  );
}
