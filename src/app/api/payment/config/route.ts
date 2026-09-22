import { NextResponse } from 'next/server';
import { isStripeConfigured } from '@/lib/stripe';

export async function GET() {
  const stripeEnabled = isStripeConfigured();
  const bkashNumber = process.env.BKASH_NUMBER || '01821124713';

  return NextResponse.json({
    stripeEnabled,
    bkashEnabled: true,
    bkashNumber,
    publishableKey: stripeEnabled ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null : null,
  });
}

