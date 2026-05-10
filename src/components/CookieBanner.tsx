"use client";

import React, { useState } from 'react';
import CookieConsent from "react-cookie-consent";
import './CookieBanner.css'; // <--- Εισαγωγή του CSS

const PrivacyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} style={{ color: "#8c7851", cursor: "pointer", textDecoration: "underline", marginLeft: "5px" }}>
        Πολιτική Απορρήτου
      </span>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '15px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', color: '#333' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: '#eee', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: '#294038', marginBottom: '20px' }}>Πολιτική Απορρήτου & Cookies</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>Στο T'ÁNAMA, η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Συλλέγουμε μόνο τα απαραίτητα στοιχεία για την ολοκλήρωση της παραγγελίας σας και την ασφάλεια των συναλλαγών σας μέσω Stripe.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default function CookieBanner() {
  return (
    <CookieConsent
      location="none"
      buttonText="Αποδοχή"
      declineButtonText="Όχι"
      enableDeclineButton
      cookieName="tanama_cookie_consent"
      disableStyles={true} 
      
      // Χρησιμοποιούμε κλάσεις αντί για style props για να αποφύγουμε σφάλματα TypeScript
      containerClasses="cookie-container-main"
      buttonWrapperClasses="cookie-button-wrapper"
      
      buttonStyle={{ 
        background: "#8c7851", 
        color: "white", 
        fontSize: "13px", 
        fontWeight: "600",
        borderRadius: "8px",
        padding: "10px 20px",
        border: "none",
        flex: "1"
      }}
      declineButtonStyle={{ 
        background: "transparent", 
        color: "rgba(255,255,255,0.7)", 
        fontSize: "12px", 
        borderRadius: "8px",
        padding: "10px 15px",
        border: "1px solid rgba(255,255,255,0.2)",
        flex: "0.5"
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#8c7851' }}>🛡️ Cookies & Ιδιωτικότητα</span>
        <span style={{ fontSize: '13px' }}>
          Βελτιώνουμε την εμπειρία περιήγησης και την ασφάλεια των συναλλαγών σας.
          <PrivacyModal />
        </span>
      </div>
    </CookieConsent>
  );
}