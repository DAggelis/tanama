"use client";
import React, { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h2 className={styles.title}>Γινετε μελος της κοινοτητας μας</h2>
          <p className={styles.subtitle}>
            Εγγραφείτε για να μαθαίνετε πρώτοι για νέα έργα και προσφορές.
          </p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Το E-mail σας" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={status === 'loading' || status === 'success'}
            />
            <button 
              type="submit" 
              className={styles.button}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'ΠΕΡΙΜΕΝΕΤΕ...' : 'ΕΓΓΡΑΦΗ'}
            </button>
          </form>

          {status === 'success' && (
            <p className={styles.successMsg}>Ευχαριστούμε! Η εγγραφή σας ολοκληρώθηκε.</p>
          )}
          {status === 'error' && (
            <p className={styles.errorMsg}>Παρουσιάστηκε πρόβλημα. Δοκιμάστε ξανά.</p>
          )}
        </div>
      </div>
    </section>
  );
}