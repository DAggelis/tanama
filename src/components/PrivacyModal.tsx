"use client";
import { useState } from 'react';

export default function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Το link που ανοίγει το modal - μπορείς να το βάλεις οπουδήποτε */}
      <span 
        onClick={() => setIsOpen(true)} 
        style={{ color: "#8c7851", cursor: "pointer", textDecoration: "underline" }}
      >
        Πολιτική Απορρήτου
      </span>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '15px',
            maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
            position: 'relative', color: '#333'
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}
            >✕</button>
            
            <h2 style={{ color: '#294038' }}>Πολιτική Απορρήτου</h2>
            <p>Εδώ μπαίνει το κείμενό σου...</p>
            <p>Στο T'ÁNAMA σεβόμαστε τα δεδομένα σας κτλ...</p>
          </div>
        </div>
      )}
    </>
  );
}