"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement 
} from '@stripe/react-stripe-js';
import styles from './Checkout.module.css';
import { ChevronLeft, Lock, CreditCard, User, ChevronDown, ChevronUp, Loader2, Calendar, Hash } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, totalPrice } = useCart();
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '',
    city: '', zip: '', phone: '', cardHolder: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = 
    formData.email.trim() !== '' &&
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.zip.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.cardHolder.trim() !== '';

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Δημιουργία Payment Intent στο Backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      
      const data = await response.json();

      // 2. Επιβεβαίωση πληρωμής
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: formData.cardHolder,
            email: formData.email,
          },
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        window.location.href = '/success';
      }
    } catch (err) {
      console.error(err);
      alert("Κάτι πήγε στραβά με την πληρωμή.");
    } finally {
      setLoading(false);
    }
  };

  // Styling για τα Stripe Inputs
  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#333',
        '::placeholder': { color: '#aab7c4' },
      },
    },
  };

  if (cart.length === 0) return null; // Ή το empty view σου

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.backToShop}>
          <ChevronLeft size={20} /> Επιστροφή στο κατάστημα
        </Link>
        <div className={styles.secureBadge}>
          <Lock size={16} /> Ασφαλές Checkout
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.layout}>
          
          <section className={styles.formSection}>
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>1. Στοιχεία Επικοινωνίας</h3>
              <div className={styles.inputRow}>
                <input type="email" name="email" placeholder="Email" className={styles.inputField} onChange={handleInputChange} required />
                <input type="tel" name="phone" placeholder="Τηλέφωνο" className={styles.inputField} onChange={handleInputChange} required />
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>2. Διεύθυνση Αποστολής</h3>
              <div className={styles.inputRow}>
                <input type="text" name="firstName" placeholder="Όνομα" className={styles.inputField} onChange={handleInputChange} required />
                <input type="text" name="lastName" placeholder="Επώνυμο" className={styles.inputField} onChange={handleInputChange} required />
              </div>
              <input type="text" name="address" placeholder="Διεύθυνση" className={styles.inputField} onChange={handleInputChange} required />
              <div className={styles.inputRow}>
                <input type="text" name="city" placeholder="Πόλη" className={styles.inputField} onChange={handleInputChange} required />
                <input type="text" name="zip" placeholder="Τ.Κ." className={styles.inputField} onChange={handleInputChange} required />
              </div>
            </div>
          </section>

          <aside className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Σύνοψη Παραγγελίας</h3>
              
              <div className={styles.paymentAccordion}>
                <button type="button" className={styles.paymentToggleBtn} onClick={() => setIsPaymentOpen(!isPaymentOpen)}>
                  <div className={styles.toggleLeft}>
                    <CreditCard size={20} />
                    <span>Πιστωτική / Χρεωστική Κάρτα</span>
                  </div>
                  {isPaymentOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isPaymentOpen && (
                  <div className={styles.accordionContent}>
                    <div className={styles.inputFull}>
                      <div className={styles.inputIconWrapper}>
                        <User size={16} className={styles.inputIcon} />
                        <input type="text" name="cardHolder" placeholder="Όνομα Κατόχου" className={styles.sidebarInputField} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className={styles.inputFull}>
                      <div className={styles.inputIconWrapper}>
                        <CreditCard size={16} className={styles.inputIcon} />
                        <div className={styles.sidebarInputField} style={{paddingTop: '12px'}}><CardNumberElement options={elementOptions} /></div>
                      </div>
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputHalf}>
                        <div className={styles.inputIconWrapper}>
                          <Calendar size={16} className={styles.inputIcon} />
                          <div className={styles.sidebarInputField} style={{paddingTop: '12px'}}><CardExpiryElement options={elementOptions} /></div>
                        </div>
                      </div>
                      <div className={styles.inputHalf}>
                        <div className={styles.inputIconWrapper}>
                          <Hash size={16} className={styles.inputIcon} />
                          <div className={styles.sidebarInputField} style={{paddingTop: '12px'}}><CardCvcElement options={elementOptions} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.calcTable}>
                <div className={styles.calcRow}><span>Υποσύνολο</span><span>{totalPrice.toFixed(2).replace('.', ',')} €</span></div>
                <div className={`${styles.calcRow} ${styles.totalFinal}`}><span>ΣΥΝΟΛΟ</span><span>{totalPrice.toFixed(2).replace('.', ',')} €</span></div>
              </div>

              <button 
                className={`${styles.submitOrderBtn} ${(!isFormValid || loading) ? styles.disabledBtn : ''}`}
                disabled={!isFormValid || loading}
                onClick={handleSubmit}
              >
                {loading ? <Loader2 className={styles.spinner} size={20} /> : !isFormValid ? 'ΣΥΜΠΛΗΡΩΣΤΕ ΤΑ ΣΤΟΙΧΕΙΑ' : 'ΠΛΗΡΩΜΗ & ΟΛΟΚΛΗΡΩΣΗ'}
              </button>
              
              <p className={styles.secureFooter}><Lock size={12} /> SSL Secure Payment via Stripe</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}