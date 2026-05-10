"use client";
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.overlay}></div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>T'ΑNAMA</h1>
        <h2 className={styles.mainSubtitle}>ΠΑΡΑΔΟΣΙΑΚΑ ΧΕΙΡΟΠΟΙΗΜΑΤΑ</h2>
        
        <p className={styles.description}>
          ΜΙΑ ΜΕΓΑΛΗ ΠΟΙΚΙΛΙΑ ΑΠΟ ΠΑΡΑΔΟΣΙΑΚΑ ΕΡΓΟΧΕΙΡΑ ΠΟΥ ΕΧΟΥΜΕ ΕΞΑΣΦΑΛΙΣΕΙ ΓΙΑ ΕΣΑΣ 
          <br className={styles.desktopBreak} /> ΣΤΙΣ ΠΙΟ ΠΡΟΣΙΤΕΣ ΤΙΜΕΣ
        </p>
        
        <div className={styles.buttonGroup}>
          {/* 1ο Κουμπί: ΕΙΚΟΝΕΣ - Slug: eikones */}
          <Link href="/category/eikones" className={styles.heroBtn}>
            ΕΙΚΟΝΕΣ
          </Link>

          {/* 2ο Κουμπί: ΕΙΚΟΝΑΚΙΑ - Slug: eikonakia */}
          <Link href="/category/eikonakia" className={styles.heroBtn}>
            ΕΙΚΟΝΑΚΙΑ
          </Link>

          {/* 3ο Κουμπί: ΚΟΣΜΗΜΑΤΑ - Slug: kosmimata */}
          <Link href="/category/kosmimata" className={styles.heroBtn}>
            ΚΟΣΜΗΜΑΤΑ
          </Link>
        </div>
      </div>
    </section>
  );
}