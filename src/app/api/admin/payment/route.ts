import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
    }

    const payments = await prisma.paymentRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            premium: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error('Error in GET /api/admin/payment:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
    }

    const { paymentId, action, adminNote } = await request.json();
    if (!paymentId || (action !== 'APPROVE' && action !== 'REJECT')) {
      return NextResponse.json({ error: 'ভুল অনুরোধ' }, { status: 400 });
    }

    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.paymentRequest.update({
          where: { id: paymentId },
          data: {
            status: 'APPROVED',
            adminNote: adminNote || 'পেমেন্ট যাচাইকৃত ও অনুমোদিত',
          },
        }),
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            premium: payment.plan,
            premiumActivatedAt: new Date(),
          },
        }),
      ]);

      return NextResponse.json({
        ok: true,
        message: `পেমেন্ট অনুমোদিত হয়েছে এবং ব্যবহারকারীকে ${payment.plan} প্যাকেজে আপগ্রেড করা হয়েছে।`,
      });
    } else {
      await prisma.paymentRequest.update({
        where: { id: paymentId },
        data: {
          status: 'REJECTED',
          adminNote: adminNote || 'ভুল TrxID বা লেনদেন খুঁজে পাওয়া যায়নি',
        },
      });

      return NextResponse.json({
        ok: true,
        message: 'পেমেন্ট রিকোয়েস্ট বাতিল করা হয়েছে।',
      });
    }
  } catch (error: any) {
    console.error('Error in POST /api/admin/payment:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
