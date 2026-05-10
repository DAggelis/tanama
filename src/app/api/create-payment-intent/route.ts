import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    // Υπολογισμός του συνολικού ποσού στο Backend (για ασφάλεια)
    // ΣΗΜΑΝΤΙΚΟ: Η Stripe θέλει το ποσό σε cents (λεπτά)
    const amount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * 100 * item.quantity);
    }, 0);

    // Δημιουργία του Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}