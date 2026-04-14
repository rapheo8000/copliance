import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Copliance — Le copilote administratif des entrepreneurs",
    template: "%s | Copliance",
  },
  description:
    "Centralisez et simplifiez votre vie administrative. Calendrier d'obligations, alertes, simulateurs et assistant IA pour entrepreneurs francais.",
  keywords: [
    "micro-entrepreneur",
    "auto-entrepreneur",
    "urssaf",
    "tva",
    "cotisations",
    "calendrier obligations",
    "entrepreneur",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
