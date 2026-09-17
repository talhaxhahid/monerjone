import { NextResponse } from 'next/server';
import { isStripeConfigured } from '@/lib/stripe';

export async function GET() {
  const enabled = isStripeConfigured();
  return NextResponse.json({
    stripeEnabled: enabled,
    publishableKey: enabled ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null : null,
  });
}
