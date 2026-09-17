import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';
import Stripe from 'stripe';

type PlanTierType = 'Free' | 'Gold' | 'Platinum';

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe unavailable' }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Stripe webhook verification error:', error.message);
    return NextResponse.json({ error: `Webhook error: ${error.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planName, phoneQuota } = session.metadata || {};

    if (userId && planName) {
      const tier: PlanTierType = planName === 'Platinum' ? 'Platinum' : 'Gold';
      const additionalQuota = Number(phoneQuota) || (tier === 'Platinum' ? 10 : 3);
      const amountTotal = session.amount_total ? Math.round(session.amount_total / 100) : (tier === 'Platinum' ? 2499 : 1350);

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            premium: tier,
            premiumActivatedAt: new Date(),
            phoneQuota: { increment: additionalQuota },
          },
        });

        const trxId = (typeof session.payment_intent === 'string' ? session.payment_intent : session.id) || session.id;
        const existing = await prisma.paymentRequest.findFirst({
          where: { trxId: trxId },
        });

        if (!existing) {
          await prisma.paymentRequest.create({
            data: {
              userId: userId,
              plan: tier,
              amount: amountTotal,
              bKashNumber: 'STRIPE_WEBHOOK',
              trxId: trxId,
              status: 'APPROVED',
              adminNote: `Automated Stripe Webhook (Session: ${session.id})`,
            },
          });
        }
      } catch (dbErr) {
        console.error('Webhook database update error:', dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
