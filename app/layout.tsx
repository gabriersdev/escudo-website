import type {Metadata} from "next";
import {Inter, Inter_Tight, Noto_Serif} from "next/font/google";
import "./globals.css";
import React from "react";
import {appConfigs, siteUrl} from "@/resources/resources";

const primaryFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const secondaryFont = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const fontSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: appConfigs.title,
  description: appConfigs.description,
};

export default function RootLayout(
  {
    children,
  }:
  Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="pt-br"
      className={`${primaryFont.variable} ${secondaryFont.variable} ${fontSerif.variable} h-full antialiased`}
    >
    <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
