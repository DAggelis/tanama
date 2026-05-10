"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: "Είναι οι εικόνες όντως χειροποίητες;",
    answer: "Ναι, κάθε εικόνα φιλοτεχνείται ξεχωριστά στο εργαστήριό μας, χρησιμοποιώντας παραδοσιακές τεχνικές, ξύλο υψηλής ποιότητας και φύλλο χρυσού."
  },
  {
    question: "Πόσο χρόνο διαρκεί η αποστολή;",
    answer: "Για ετοιμοπαράδοτα προϊόντα, η αποστολή γίνεται εντός 1-3 εργάσιμων ημερών. Για ειδικές παραγγελίες, θα ενημερωθείτε προσωπικά για τον χρόνο ολοκλήρωσης (συνήθως 10-15 ημέρες)."
  },
  {
    question: "Στέλνετε προϊόντα στο εξωτερικό;",
    answer: "Φυσικά. Στέλνουμε τις δημιουργίες μας σε όλο τον κόσμο με ειδική, ασφαλή συσκευασία ώστε να φτάνουν σε εσάς σε άριστη κατάσταση."
  },
  {
    question: "Μπορώ να παραγγείλω ένα συγκεκριμένο θέμα που δεν υπάρχει στο site;",
    answer: "Βεβαίως. Ειδικευόμαστε στις εξατομικευμένες παραγγελίες. Μπορείτε να επικοινωνήσετε μαζί μας για να συζητήσουμε το θέμα και τις διαστάσεις που επιθυμείτε."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Συχνές Ερωτήσεις</h2>
        <div className={styles.underline}></div>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button 
                className={styles.questionRow} 
                onClick={() => toggleFAQ(index)}
              >
                <span className={styles.questionText}>{faq.question}</span>
                {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              <div className={`${styles.answerWrapper} ${activeIndex === index ? styles.open : ''}`}>
                <div className={styles.answerContent}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}