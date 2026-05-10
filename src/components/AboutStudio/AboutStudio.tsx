"use client";
import React from 'react';
import styles from './AboutStudio.module.css';

export default function AboutStudio() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          
          {/* Αριστερή Πλευρά: Εικόνα */}
          <div className={styles.imageSide}>
            <div className={styles.imageFrame}>
              <img 
                src="/labsection1.webp" 
                alt="Το Εργαστήριο Αγιογραφίας μας" 
                className={styles.image}
              />
            </div>
          </div>

          {/* Δεξιά Πλευρά: Κείμενο */}
          <div className={styles.textSide}>
            <h2 className={styles.title}>Παράδοση & Πίστη</h2>
            <div className={styles.underline}></div>
            <p className={styles.description}>
              Στο εργαστήριό μας, κάθε εικόνα δεν είναι απλώς ένα αντικείμενο, αλλά μια πνευματική διαδρομή. 
              Με σεβασμό στους κανόνες της βυζαντινής τέχνης, χρησιμοποιούμε παραδοσιακά υλικά, 
              φύλλο χρυσού και μεράκι για να δημιουργήσουμε έργα που αντέχουν στον χρόνο και μεταφέρουν την ιερότητα της παράδοσης.
            </p>
            <p className={styles.subtext}>
              * Κάθε έργο συνοδεύεται από πιστοποιητικό χειροποίητης δημιουργίας.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}