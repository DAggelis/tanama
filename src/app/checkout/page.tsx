"use client";

import { countriesList } from '@/utils/countries';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  useStripe, 
  useElements, 
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement 
} from '@stripe/react-stripe-js';
import styles from './Checkout.module.css';
import { ChevronLeft, Lock, CreditCard, Loader2, Globe } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΤΑΦΟΡΙΚΩΝ ΜΕ ΒΑΣΗ ΖΩΝΕΣ ΕΛΤΑ & ΦΠΑ 24% ---
const calculateShipping = (countryCode: string, weightInGrams: number, totalPrice: number) => {
  if (weightInGrams <= 0) return 0;
  
  let baseCost = 0;
  const weightInKg = weightInGrams / 1000;

  // 1. ΕΛΛΑΔΑ
  if (countryCode === 'GR') {
    if (totalPrice >= 100) return 0; // Δωρεάν άνω των 100€ μόνο Ελλάδα
    if (weightInGrams <= 500) baseCost = 4.00;
    else if (weightInGrams <= 2000) baseCost = 6.00;
    else baseCost = 6.00 + Math.ceil(weightInKg - 2) * 1.50; // +1.5€ ανά έξτρα κιλό
  } 
  // 2. ΕΞΩΤΕΡΙΚΟ
  else {
    // Ορισμός Ζωνών βάσει των χωρών που προσθέσαμε
    const zone1 = ['AT','BE','BG','FR','DE','GE','GB','HU','UA','PL','RO','RS','SE','LT','MK','FI','IT','ES','NL','AL','CY'];
    const zone2 = ['RU','IL','TR','EG'];
    const zone3 = ['US','CA','AU','JP','NZ','ZA'];

    if (zone1.includes(countryCode)) {
      if (weightInKg <= 0.5) baseCost = 12.00;
      else if (weightInKg <= 1) baseCost = 16.50;
      else if (weightInKg <= 2) baseCost = 24.00;
      else baseCost = 24.00 + Math.ceil(weightInKg - 2) * 4.50;
    } 
    else if (zone2.includes(countryCode) || zone3.includes(countryCode)) {
      if (weightInKg <= 0.5) baseCost = 16.50;
      else if (weightInKg <= 1) baseCost = 26.00;
      else if (weightInKg <= 2) baseCost = 38.00;
      else baseCost = 38.00 + Math.ceil(weightInKg - 2) * 8.50;
    }
    else {
      baseCost = 20.00; // Default για λοιπές χώρες
    }
  }

  // Επιστρέφουμε την τελική τιμή (το ΦΠΑ περιλαμβάνεται ήδη στις παραπάνω τιμές λιανικής)
  return baseCost; 
};

const stripeElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#9e2146' },
  },
};

function CheckoutFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, subtotal, totalWeight } = useCart(); 
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState('GR');
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '',
    city: '', zip: '', phone: '', cardHolder: ''
  });

  // Χρησιμοποιούμε το subtotal από το Context για τον υπολογισμό
  const shippingCost = calculateShipping(country, totalWeight, subtotal);
  const grandTotal = subtotal + shippingCost;

  useEffect(() => { setMounted(true); }, []);

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isFormValid = 
    formData.firstName.trim() !== '' && 
    formData.lastName.trim() !== '' && 
    formData.email.trim() !== '' &&
    formData.address.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // ΚΑΛΕΣΜΑ API: Στέλνουμε χώρα και βάρος για να τα ξέρει το Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          country: country, // Η επιλεγμένη χώρα
          totalWeight: totalWeight // Το συνολικό βάρος
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Σφάλμα πληρωμής");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: { 
            name: formData.cardHolder || `${formData.firstName} ${formData.lastName}`,
            email: formData.email 
          },
        },
      });

      if (result.error) alert(result.error.message);
      else if (result.paymentIntent?.status === 'succeeded') router.push('/success');

    } catch (err: any) { 
      console.error(err); 
      alert(err.message || "Σφάλμα κατά την επεξεργασία.");
    } finally { 
      setLoading(false); 
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.backToShop}><ChevronLeft size={20} /> Επιστροφή</Link>
        <div className={styles.secureBadge}><Lock size={16} /> Ασφαλές Checkout</div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.layout}>
          <section className={styles.formSection}>
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>1. ΣΤΟΙΧΕΙΑ ΑΠΟΣΤΟΛΗΣ</h3>
              <div className={styles.selectWrapper}>
                <Globe size={18} className={styles.inputIconLeft} />
                <select 
                  name="country" 
                  className={styles.inputFieldSelect} 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countriesList.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.inputRow}>
                <input type="text" name="firstName" placeholder="Όνομα" className={styles.inputField} onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Επώνυμο" className={styles.inputField} onChange={handleInputChange} />
              </div>
              <input type="email" name="email" placeholder="Email" className={styles.inputField} onChange={handleInputChange} />
              <input type="text" name="address" placeholder="Διεύθυνση" className={styles.inputField} onChange={handleInputChange} />
              <div className={styles.inputRow}>
                <input type="text" name="city" placeholder="Πόλη" className={styles.inputField} onChange={handleInputChange} />
                <input type="text" name="zip" placeholder="Τ.Κ." className={styles.inputField} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <aside className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>ΣΥΝΟΨΗ ΠΑΡΑΓΓΕΛΙΑΣ</h3>
              <div className={styles.itemList}>
                {cart.map((item: any, idx: number) => (
                  <div key={idx} className={styles.summaryItem}>
                    <div className={styles.itemThumbWrapper}>
                      <img src={item.image || item.imageUrl} alt={item.title} className={styles.itemThumb} />
                      <span className={styles.itemQtyBadge}>{item.quantity}</span>
                    </div>
                    <span className={styles.itemName}>{item.title}</span>
                    <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              <div className={styles.calcTable}>
                <div className={styles.calcRow}>
                  <span>Υποσύνολο</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className={styles.calcRow}>
                   <span>Μεταφορικά ({totalWeight}g)</span>
                   <span style={{ color: shippingCost === 0 ? '#27ae60' : 'inherit', fontWeight: 'bold' }}>
                     {shippingCost === 0 ? 'ΔΩΡΕΑΝ' : `${shippingCost.toFixed(2)}€`}
                   </span>
                </div>
                <div className={styles.totalFinal}>
                  <span>ΣΥΝΟΛΟ</span>
                  <span>{grandTotal.toFixed(2)}€</span>
                </div>
              </div>

              <div className={styles.paymentAccordion}>
                 <div className={styles.accordionHeader}>
                   <CreditCard size={18} className={styles.accordionIcon} />
                   <span>Στοιχεία Κάρτας</span>
                 </div>
                 <div className={styles.accordionContent}>
                    <input 
                      type="text" 
                      name="cardHolder" 
                      placeholder="Όνομα Κατόχου Κάρτας" 
                      className={styles.inputField} 
                      onChange={handleInputChange} 
                    />
                    <div className={styles.stripeInputWrapper}>
                      <CardNumberElement options={stripeElementOptions} />
                    </div>
                    <div className={styles.inputRowStripe}>
                      <div className={styles.stripeInputWrapperHalf}>
                        <CardExpiryElement options={stripeElementOptions} />
                      </div>
                      <div className={styles.stripeInputWrapperHalf}>
                        <CardCvcElement options={stripeElementOptions} />
                      </div>
                    </div>
                 </div>
              </div>

              <button 
                className={`${styles.submitOrderBtn} ${(!isFormValid || loading) ? styles.disabledBtn : ''}`} 
                onClick={handleSubmit} 
                disabled={!isFormValid || loading}
              >
                {loading ? <Loader2 className={styles.spinner} /> : `ΠΛΗΡΩΜΗ ${grandTotal.toFixed(2)}€`}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
}