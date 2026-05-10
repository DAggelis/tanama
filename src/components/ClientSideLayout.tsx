"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar"; 
import MobileNavbar from "@/components/Navbar/MobileNavbar"; 
import Header from "@/components/Header/Header"; 
import Footer from "@/components/Footer/Footer";

export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ opacity: 0 }}>{children}</div>;
  }

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="desktop-only">
        <Navbar />
      </div>

      <div className="main-wrapper" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        width: '100%' 
      }}>
        <div className="desktop-only">
          <Header />
        </div>
        <div className="mobile-only">
          <MobileNavbar />
        </div>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}