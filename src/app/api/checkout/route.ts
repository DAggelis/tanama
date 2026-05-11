import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { items, country, totalWeight } = await req.json(); // Λαμβάνουμε και το βάρος σε γραμμάρια

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "No items found" }, { status: 400 });
    }

    // 1. Υπολογισμός αξίας προϊόντων σε cents
    const productsAmount = items.reduce((acc: number, item: any) => {
      return acc + Math.round(Number(item.price) * 100) * (Number(item.quantity) || 1);
    }, 0);

    // 2. Υπολογισμός Μεταφορικών (Τιμές με ΦΠΑ 24%)
    let shippingCost = 0;
    const weightInKg = (totalWeight || 0) / 1000;

    if (productsAmount < 10000) { // Δωρεάν αν subtotal > 100€ (ισχύει για Ελλάδα)
      
      const zone1 = ['AT','BE','BG','FR','DE','GE','GB','HU','UA','PL','RO','RS','SE','LT','MK','FI','IT','ES','NL','AL','CY'];
      const zone2 = ['RU','IL','TR','EG'];
      const zone3 = ['US','CA','AU','JP','NZ','ZA'];

      if (country === 'GR') {
        // Ελλάδα: Σταθερό 5€ μέχρι 2kg, μετά +1.5€ ανά κιλό
        shippingCost = weightInKg <= 2 ? 500 : 500 + Math.ceil(weightInKg - 2) * 150;
      } 
      else if (zone1.includes(country)) {
        // Ζώνη 1 (Ευρώπη): π.χ. 0.5kg=12€, 1kg=16€, 2kg=25€, μετά +4€ ανά κιλό
        if (weightInKg <= 0.5) shippingCost = 1200;
        else if (weightInKg <= 1) shippingCost = 1600;
        else if (weightInKg <= 2) shippingCost = 2500;
        else shippingCost = 2500 + Math.ceil(weightInKg - 2) * 400;
      }
      else if (zone3.includes(country) || zone2.includes(country)) {
        // Ζώνη 3 (ΗΠΑ/Κόσμος): π.χ. 0.5kg=18€, 1kg=28€, 2kg=42€, μετά +8€ ανά κιλό
        if (weightInKg <= 0.5) shippingCost = 1800;
        else if (weightInKg <= 1) shippingCost = 2800;
        else if (weightInKg <= 2) shippingCost = 4200;
        else shippingCost = 4200 + Math.ceil(weightInKg - 2) * 800;
      }
      else {
        shippingCost = 1500; // Default
      }
    }

    // Ειδική εξαίρεση: Αν είναι εξωτερικό, χρεώνουμε πάντα μεταφορικά (προαιρετικό)
    if (country !== 'GR' && shippingCost === 0) {
       shippingCost = 1500; 
    }

    const finalAmount = productsAmount + shippingCost;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        country: country,
        weight_grams: totalWeight?.toString() || "0",
        shipping: `${(shippingCost / 100).toFixed(2)}€`
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount / 100 
    });

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}