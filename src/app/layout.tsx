import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const siteDescription = "电影级动态自然场景、双路 Lofi 混音与极简番茄钟，打开网页即刻进入沉浸专注。";
const siteTitle = "vibe studying room - 零门槛沉浸式自然专注空间";
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE_URL ?? "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&h=630&q=85";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://focus-room-proxy.focusroom.workers.dev"),
  title: siteTitle,
  description: siteDescription,
  keywords: ["vibe studying room", "自然专注空间", "动态视频背景", "Study With Me", "番茄钟网页版"],
  applicationName: "vibe studying room",
  manifest: "/focus-room/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "vibe studying room",
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
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "vibe studying room",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "vibe studying room 沉浸式自然专注空间",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden bg-black font-sans text-white">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
