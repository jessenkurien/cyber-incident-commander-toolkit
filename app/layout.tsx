import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "jessenkurien.github.io";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = `${origin}/og.png`;
  const title = "Cyber Incident Commander Toolkit";
  const description = "A practical, leadership-focused workspace for commanding cyber incidents with clarity, accountability, and evidence.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    authors: [{ name: "Jessen Kurien", url: "https://github.com/jessenkurien" }],
    creator: "Jessen Kurien",
    keywords: ["cyber incident response", "incident command", "cyber risk management", "DFIR", "NIST CSF", "ISO 27001", "security leadership"],
    openGraph: { title, description, type: "website", images: [{ url: image, width: 1732, height: 909, alt: "Cyber Incident Commander Toolkit" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
