import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getStripeClient, isStripeConfigured, PLAN_CONFIG } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'লগইন করা আবশ্যক' }, { status: 401 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'অনলাইন পেমেন্ট গেটওয়ে বর্তমানে নিষ্ক্রিয় বা কনফিগার করা হয়নি।' },
        { status: 503 }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'স্ট্রাইপ গেটওয়ে চালু করা সম্ভব হচ্ছে না।' },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const planKey = (body.plan || '').toLowerCase() as 'gold' | 'platinum';

    const plan = PLAN_CONFIG[planKey];
    if (!plan) {
      return NextResponse.json(
        { error: 'অবৈধ প্যাকেজ নির্বাচন করা হয়েছে।' },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      'http://localhost:3000';

    const currency = (process.env.STRIPE_CURRENCY || 'bdt').toLowerCase();
    const unitAmount =
      currency === 'bdt'
        ? Math.round(plan.priceBdt * 100)
        : Math.round(plan.priceUsd * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `MonerJone ${plan.label}`,
              description: plan.description,
              images: [`${appUrl}/images/hero-og.jpg`],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: user.phone ? `${user.phone}@monerjone.internal` : undefined,
      metadata: {
        userId: user.id,
        planKey: planKey,
        planName: plan.name,
        phoneQuota: plan.phoneQuota.toString(),
        durationDays: plan.durationDays.toString(),
      },
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Stripe checkout session creation error:', err);
    return NextResponse.json(
      { error: err?.message || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
