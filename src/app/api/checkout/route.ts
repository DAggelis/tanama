import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "No items found" }, { status: 400 });
    }

    // 1. Υπολογισμός καθαρής αξίας προϊόντων σε cents (μονάδα μέτρησης Stripe)
    // Χρησιμοποιούμε Math.round(Number(...) * 100) για να αποφύγουμε λάθη με δεκαδικά
    const productsAmount = items.reduce((acc: number, item: any) => {
      const unitPriceInCents = Math.round(Number(item.price) * 100);
      const itemQuantity = Number(item.quantity) || 1;
      return acc + (unitPriceInCents * itemQuantity);
    }, 0);

    // 2. Ρυθμίσεις Μεταφορικών
    const shippingThreshold = 10000; // 100€ σε cents
    const shippingCost = 500;       // 5€ σε cents

    // 3. Υπολογισμός τελικού ποσού χρέωσης
    // Αν το ποσό των προϊόντων είναι μικρότερο από το όριο, προσθέτουμε μεταφορικά
    const hasShipping = productsAmount < shippingThreshold;
    const finalAmount = hasShipping ? productsAmount + shippingCost : productsAmount;

    // 4. Δημιουργία του Payment Intent στο Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      // Metadata για να βλέπεις στο Stripe Dashboard αν χρεώθηκαν μεταφορικά
      metadata: {
        shipping_cost: hasShipping ? "5.00 EUR" : "FREE",
        subtotal: `${(productsAmount / 100).toFixed(2)} EUR`,
      },
    });

    // 5. Επιστροφή του clientSecret και του τελικού ποσού
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount / 100 // Το στέλνουμε πίσω σε ευρώ για το UI
    });

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}