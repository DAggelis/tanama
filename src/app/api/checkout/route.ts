import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    
    // 1. Υπολογισμός καθαρής αξίας προϊόντων σε cents
    const productsAmount = items.reduce((acc: number, item: any) => acc + (item.price * 100 * item.quantity), 0);

    // 2. Ορισμός ορίου για δωρεάν μεταφορικά (100€ = 10000 cents)
    const shippingThreshold = 10000;
    const shippingCost = 500; // 5€ μεταφορικά (σε cents)

    // 3. Υπολογισμός τελικού ποσού
    // Αν τα προϊόντα είναι < 100€, πρόσθεσε τα μεταφορικά. Αλλιώς, πρόσθεσε 0.
    const finalAmount = productsAmount < shippingThreshold ? productsAmount + shippingCost : productsAmount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount), // Χρήση του τελικού ποσού (με ή χωρίς μεταφορικά)
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        shipping_included: productsAmount < shippingThreshold ? "5.00 EUR" : "FREE",
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount / 100 // Επιστρέφουμε το ποσό σε ευρώ για επιβεβαίωση στο UI
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}