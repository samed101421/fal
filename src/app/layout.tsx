import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qubbe Düğün Salonu - Özel Kahve Falı",
  description: "Qubbe Düğün Salonu misafirleri için yapay zeka destekli özel kahve falı deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter relative bg-wood-950 overflow-x-hidden">
        {/* Subtle radial gradients to give depth like dark wood under spotlight */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-wood-800/40 via-wood-950/80 to-wood-950"></div>
        <div className="relative z-10 flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
