import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://focus-room-proxy.workers.dev"),
  title: "专注一隅 Web 网页版 - 零门槛沉浸式线上自习室",
  description: "无需内测码，全屏 4K 沉浸式场景伴学，内置双路 Lofi 混音与极简番茄钟。",
  keywords: ["专注一隅", "线上自习室", "Study With Me", "番茄钟网页版"],
  applicationName: "专注一隅",
  manifest: "/focus-room/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "专注一隅",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      {
        url: "/focus-room/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/focus-room/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  alternates: {
    canonical: "/focus-room",
  },
  openGraph: {
    title: "专注一隅 Web 网页版 - 零门槛沉浸式线上自习室",
    description: "无需内测码，全屏 4K 沉浸式场景伴学，内置双路 Lofi 混音与极简番茄钟。",
    url: "/focus-room",
    siteName: "专注一隅",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "专注一隅 Web 沉浸式线上自习室",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "专注一隅 Web 网页版 - 零门槛沉浸式线上自习室",
    description: "无需内测码，全屏 4K 沉浸式场景伴学，内置双路 Lofi 混音与极简番茄钟。",
    images: ["https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&h=630&q=85"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-black">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
