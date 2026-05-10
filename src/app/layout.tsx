import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientSideLayout from "@/components/ClientSideLayout";
import { CartProvider } from "@/context/CartContext";
import CookieBanner from "@/components/CookieBanner"; // <--- Import το νέο component

export const metadata: Metadata = {
  title: {
    default: "T'ÁNAMA | Βυζαντινές Αγιογραφίες & Εκκλησιαστικά Είδη",
    template: "%s | T'ÁNAMA"
  },
  description: "Αυθεντικές βυζαντινές αγιογραφίες, εκκλησιαστικά είδη και παραδοσιακά χειροποιήματα.",
  // ... υπόλοιπα metadata
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#294038",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body suppressHydrationWarning={true}>
        <CartProvider>
          <ClientSideLayout>
            {children}
          </ClientSideLayout>
        </CartProvider>

        {/* Καλούμε το Client Component εδώ */}
        <CookieBanner /> 
      </body>
    </html>
  );
}
