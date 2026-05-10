"use client";

import React from 'react';
import { Truck } from 'lucide-react'; // Αν χρησιμοποιείς lucide-react, αλλιώς βάλε ένα emoji 🚚

export default function PromoBanner() {
  return (
    <div style={{
      backgroundColor: '#8c7851', // Το χρυσό σου χρώμα για να κάνει αντίθεση με το πράσινο
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <Truck size={18} />
      <span>ΔΩΡΕΑΝ ΜΕΤΑΦΟΡΙΚΑ εντός Ελλάδας για αγορές άνω των 100€</span>
    </div>
  );
}