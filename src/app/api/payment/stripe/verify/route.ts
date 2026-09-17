import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

type PlanTierType = 'Free' | 'Gold' | 'Platinum';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe client unavailable' }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        paymentStatus: session.payment_status,
        message: 'পেমেন্ট সম্পন্ন হয়নি বা মুলতুবি রয়েছে।',
      });
    }

    const { userId, planName } = session.metadata || {};

    if (!userId || !planName) {
      return NextResponse.json({ error: 'Metadata missing in session' }, { status: 400 });
    }

    const tier: PlanTierType = planName === 'Platinum' ? 'Platinum' : 'Gold';
    const amountTotal = session.amount_total ? Math.round(session.amount_total / 100) : (tier === 'Platinum' ? 2499 : 1350);

    // Upgrade user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        premium: tier,
        premiumActivatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        premium: true,
      },
    });

    // Record in PaymentRequests if not exists
    const trxId = (typeof session.payment_intent === 'string' ? session.payment_intent : session.id) || sessionId;
    const existing = await prisma.paymentRequest.findFirst({
      where: { trxId: trxId },
    });

    if (!existing) {
      await prisma.paymentRequest.create({
        data: {
          userId: userId,
          plan: tier,
          amount: amountTotal,
          bKashNumber: 'STRIPE_ONLINE_CARD',
          trxId: trxId,
          status: 'APPROVED',
          adminNote: `Automated Stripe Checkout verified (Session: ${sessionId})`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      plan: tier,
      user: updatedUser,
      message: `${tier === 'Platinum' ? 'প্লাটিনাম' : 'গোল্ড'} প্যাকেজ সফলভাবে সক্রিয় হয়েছে!`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Stripe verification error:', err);
    return NextResponse.json(
      { error: err?.message || 'পেমেন্ট যাচাই করতে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
