import Stripe from 'stripe';

export const isStripeConfigured = (): boolean => {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && key.trim().length > 0 && !key.includes('replace_with'));
};

let stripeInstance: Stripe | null = null;

export const getStripeClient = (): Stripe | null => {
  if (!isStripeConfigured()) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeInstance;
};

export interface PlanDetails {
  name: 'Gold' | 'Platinum';
  label: string;
  priceBdt: number;
  priceUsd: number;
  phoneQuota: number;
  durationDays: number;
  description: string;
}

export const PLAN_CONFIG: Record<'gold' | 'platinum', PlanDetails> = {
  gold: {
    name: 'Gold',
    label: 'গোল্ড প্যাকেজ (Gold)',
    priceBdt: 1350,
    priceUsd: 13.5,
    phoneQuota: 3,
    durationDays: 30,
    description: '৩০ দিন আনলিমিটেড মেসেজিং এবং ৩টি মোবাইল নম্বর সরাসরি আনলক',
  },
  platinum: {
    name: 'Platinum',
    label: 'প্লাটিনাম প্যাকেজ (Platinum)',
    priceBdt: 2499,
    priceUsd: 24.99,
    phoneQuota: 10,
    durationDays: 30,
    description: '৩০ দিন আনলিমিটেড মেসেজিং, ১০টি মোবাইল নম্বর আনলক ও ভিআইপি লিস্টিং',
  },
};
