import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const PLAN_PRICES: Record<string, number> = {
  Gold: 1350,
  Platinum: 2499,
};

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const requests = await prisma.paymentRequest.findMany({
      where: { userId: me.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ payments: requests });
  } catch (error: any) {
    console.error('Error in GET /api/payment:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, bKashNumber, trxId } = body;

    if (!plan || (plan !== 'Gold' && plan !== 'Platinum')) {
      return NextResponse.json({ error: 'সঠিক প্ল্যান নির্বাচন করুন (Gold বা Platinum)' }, { status: 400 });
    }
    if (!bKashNumber || bKashNumber.length < 11) {
      return NextResponse.json({ error: 'বিকাশ নম্বর সঠিকভাবে দিন' }, { status: 400 });
    }
    if (!trxId || trxId.length < 6) {
      return NextResponse.json({ error: 'বিকাশ TrxID সঠিকভাবে দিন' }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan] || 1350;

    // Instant activation, no admin verification -- trusting the member's
    // own "I've paid" click, matching the original site's behavior. The
    // payment request is still logged (status APPROVED) for record-keeping
    // and shows up in payment history, but nothing blocks on manual review.
    const [payment] = await prisma.$transaction([
      prisma.paymentRequest.create({
        data: {
          userId: me.id,
          plan,
          amount,
          bKashNumber,
          trxId: trxId.toUpperCase().trim(),
          status: 'APPROVED',
          adminNote: 'স্বয়ংক্রিয়ভাবে অনুমোদিত (কোনো ম্যানুয়াল যাচাই ছাড়াই)',
        },
      }),
      prisma.user.update({
        where: { id: me.id },
        data: {
          premium: plan,
          premiumActivatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: `আপনার ${plan} মেম্বারশিপ সফলভাবে চালু হয়েছে!`,
      payment,
    });
  } catch (error: any) {
    console.error('Error in POST /api/payment:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
