"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaRegEnvelope } from 'react-icons/fa';
import Modal from '@/components/Modal/Modal'; // Βεβαιώσου ότι η διαδρομή είναι σωστή
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // State για το ποιο modal είναι ανοιχτό
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Στήλη 1: Logo & Description */}
        <div className={styles.column}>
          <div className={styles.logoWrapper}>
            <img 
              src="/logo.png" 
              alt="T'ÁNAMA Logo" 
              style={{ width: '180px', height: 'auto' }} 
              className={styles.footerLogo}
            />
          </div>
          <p className={styles.description}>
            Αυθεντικές Βυζαντινές Αγιογραφίες και εκκλησιαστικά είδη, 
            φιλοτεχνημένα με παραδοσιακές μεθόδους και σεβασμό στην παράδοση.
          </p>
        </div>

        {/* Στήλη 2: Πληροφορίες - Τώρα με Buttons αντί για Link για τα Modals */}
        <div className={styles.column}>
          <h4>ΠΛΗΡΟΦΟΡΙΕΣ</h4>
          <ul className={styles.links}>
            <li>
              <button onClick={() => setActiveModal("terms")} className={styles.modalBtn}>
                Όροι Χρήσης
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal("privacy")} className={styles.modalBtn}>
                Πολιτική Απορρήτου
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal("returns")} className={styles.modalBtn}>
                Πολιτική Επιστροφών
              </button>
            </li>
          </ul>
        </div>

        {/* Στήλη 3: Επικοινωνία & Socials */}
        <div className={styles.column}>
          <h4>ΕΠΙΚΟΙΝΩΝΙΑ</h4>
          <ul className={styles.contactInfo}>
            <li>
              <a href="mailto:tonamagr@gmail.com" className={styles.emailLink}>
                <FaRegEnvelope size={18} className={styles.icon} /> 
                <span>tonamagr@gmail.com</span>
              </a>
            </li>
          </ul>
          
          <div className={styles.socials}>
            <a href="https://www.facebook.com/tanamagr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF size={22} />
            </a>
            <a href="https://www.instagram.com/tanama.gr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

      </div>
      
      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p>© {currentYear} tanama.g</p>
        </div>
      </div>

      {/* --- MODAL RENDERER --- */}
      <Modal 
        isOpen={activeModal !== null} 
        onClose={closeModal} 
        title={
          activeModal === "terms" ? "Όροι Χρήσης" :
          activeModal === "privacy" ? "Πολιτική Απορρήτου" : "Πολιτική Επιστροφών"
        }
      >
        {activeModal === "terms" && (
          <div className={styles.modalContent}>
            <p>Καλώς ήλθατε στο T'ÁNAMA. Η χρήση της ιστοσελίδας μας συνεπάγεται την αποδοχή των κάτωθι όρων...</p>
            <h3>1. Πνευματική Ιδιοκτησία</h3>
            <p>Όλο το περιεχόμενο, συμπεριλαμβανομένων των εικόνων των Αγιογραφιών, αποτελεί πνευματική ιδιοκτησία του T'ÁNAMA.</p>
            {/* Πρόσθεσε εδώ το κείμενό σου */}
          </div>
        )}
        
        {activeModal === "privacy" && (
          <div className={styles.modalContent}>
            <p>Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Συλλέγουμε μόνο τα απαραίτητα στοιχεία για την ολοκλήρωση των παραγγελιών σας...</p>
            <h3>Ποια δεδομένα συλλέγουμε;</h3>
            <p>Ονοματεπώνυμο, Διεύθυνση αποστολής και Email.</p>
          </div>
        )}

        {activeModal === "returns" && (
          <div className={styles.modalContent}>
            <p>Έχετε το δικαίωμα επιστροφής της παραγγελίας σας εντός 14 ημερών από την παραλαβή της.</p>
            <h3>Προϋποθέσεις</h3>
            <p>Το προϊόν πρέπει να βρίσκεται στην αρχική του κατάσταση και συσκευασία.</p>
            <p>Σημειώστε ότι οι ειδικές παραγγελίες (Custom Icons) δεν επιστρέφονται.</p>
          </div>
        )}
      </Modal>
    </footer>
  );
}