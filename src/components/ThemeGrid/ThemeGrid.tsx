"use client";
import React from 'react';
import Link from 'next/link';
import styles from './ThemeGrid.module.css';

const themes = [
  { title: 'Χριστός', slug: 'christos', image: '/themegrid1.webp' },
  { title: 'Παναγία', slug: 'panagia', image: '/themegrid2.webp' },
  { title: 'Άγιοι', slug: 'agioi', image: '/themegrid3.webp' },
  { title: 'Παραστάσεις', slug: 'parastaseis', image: '/themegrid4.webp' },
];

export default function ThemeGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {themes.map((theme) => (
            <Link 
              key={theme.slug} 
              /* Αλλαγή: Οδηγούμε πλέον στη σελίδα /theme/slug 
                 αντί για το query string του shop 
              */
              href={`/theme/${theme.slug}`} 
              className={styles.themeCard}
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${theme.image})` 
              }}
            >
              <div className={styles.overlay}>
                <h3 className={styles.themeTitle}>{theme.title}</h3>
                <span className={styles.viewMore}>ΑΝΑΚΑΛΥΨΤΕ</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}