"use client";
import React from 'react';
import { Truck, ShieldCheck, Paintbrush, Clock } from 'lucide-react';
import styles from './Features.module.css';

const features = [
  {
    icon: <Paintbrush size={32} strokeWidth={1.2} />,
    title: "Χειροποίητη Τέχνη",
    description: "Κάθε έργο φιλοτεχνείται με παραδοσιακές τεχνικές αγιογραφίας."
  },
  {
    icon: <ShieldCheck size={32} strokeWidth={1.2} />,
    title: "Εγγύηση Ποιότητας",
    description: "Χρήση αρίστων υλικών και φύλλου χρυσού για αντοχή στο χρόνο."
  },
  {
    icon: <Truck size={32} strokeWidth={1.2} />,
    title: "Ασφαλής Αποστολή",
    description: "Ειδική συσκευασία για προστασία και tracking σε κάθε παραγγελία."
  },
  {
    icon: <Clock size={32} strokeWidth={1.2} />,
    title: "Άμεση Εξυπηρέτηση",
    description: "Είμαστε στη διάθεσή σας για ειδικές παραγγελίες και ερωτήσεις."
  }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((f, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}