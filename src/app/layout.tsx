import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Central de Comunicação",
  description: "Central de Operações da Secretaria de Comunicação",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Comunicação",
  },
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/icons/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F2A47",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
