import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientSideLayout from "@/components/ClientSideLayout";
import { CartProvider } from "@/context/CartContext";
import CookieBanner from "@/components/CookieBanner"; // <--- Import το cookie banner
import DisableRightClick from "@/components/DisableRightClick"; // <--- Import το νέο component προστασίας εικόνων

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
            {/* Ενεργοποιούμε το component για την προστασία των εικόνων global σε όλο το site */}
            <DisableRightClick /> 
            
            {children}
          </ClientSideLayout>
        </CartProvider>

        {/* Καλούμε το Cookie Banner εδώ */}
        <CookieBanner /> 
      </body>
    </html>
  );
}
