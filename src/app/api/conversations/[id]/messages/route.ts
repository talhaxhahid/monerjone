import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { containsContactInfo, FREE_MESSAGE_LIMIT, THIRTY_DAYS_MS } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        userA: {
          include: {
            photos: { select: { id: true }, take: 1, orderBy: { position: 'asc' } },
          },
        },
        userB: {
          include: {
            photos: { select: { id: true }, take: 1, orderBy: { position: 'asc' } },
          },
        },
      },
    });

    if (
      !conversation ||
      (conversation.userAId !== me.id && conversation.userBId !== me.id)
    ) {
      return NextResponse.json({ error: 'কথোপকথন পাওয়া যায়নি' }, { status: 404 });
    }

    const other = conversation.userAId === me.id ? conversation.userB : conversation.userA;

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        fromUserId: other.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    // Check block status
    const iBlockedThem = !!(await prisma.block.findUnique({
      where: { userId_targetId: { userId: me.id, targetId: other.id } },
    }));
    const theyBlockedMe = !!(await prisma.block.findUnique({
      where: { userId_targetId: { userId: other.id, targetId: me.id } },
    }));

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    const isOnline = Date.now() - new Date(other.lastActive).getTime() < 10 * 60 * 1000;

    return NextResponse.json({
      other: {
        id: other.id,
        name: `${other.firstName} ${other.lastName}`,
        gender: other.gender,
        district: other.district,
        premium: other.premium,
        active: isOnline,
        lastActive: other.lastActive.toISOString(),
        photoId: other.photos[0]?.id || null,
        photoUrl: other.photos[0]?.id ? `/api/photos/${other.photos[0].id}` : null,
      },
      messages: messages.map((m) => ({
        id: m.id,
        from: m.fromUserId,
        text: m.text,
        at: m.createdAt.toISOString(),
        readAt: m.readAt?.toISOString() || null,
      })),
      iBlockedThem,
      theyBlockedMe,
    });
  } catch (error: any) {
    console.error('Error in GET /api/conversations/[id]/messages:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        userA: true,
        userB: true,
      },
    });

    if (
      !conversation ||
      (conversation.userAId !== me.id && conversation.userBId !== me.id)
    ) {
      return NextResponse.json({ error: 'কথোপকথন পাওয়া যায়নি' }, { status: 404 });
    }

    const otherId = conversation.userAId === me.id ? conversation.userBId : conversation.userAId;

    // Check block status
    const iBlockedThem = !!(await prisma.block.findUnique({
      where: { userId_targetId: { userId: me.id, targetId: otherId } },
    }));
    const theyBlockedMe = !!(await prisma.block.findUnique({
      where: { userId_targetId: { userId: otherId, targetId: me.id } },
    }));

    if (iBlockedThem || theyBlockedMe) {
      return NextResponse.json(
        { error: 'ব্লক থাকায় বার্তা প্রেরণ করা সম্ভব নয়' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const text = String(body.text || '').trim();

    if (!text) {
      return NextResponse.json({ error: 'মেসেজ খালি হতে পারে না' }, { status: 400 });
    }

    const isFree = !me.premium || me.premium === 'Free';
    if (isFree) {
      // Check 30-day message limit
      const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);
      const used = await prisma.messageLog.count({
        where: {
          userId: me.id,
          createdAt: { gte: cutoff },
        },
      });

      if (used >= FREE_MESSAGE_LIMIT) {
        return NextResponse.json(
          {
            error: 'FREE_LIMIT_REACHED',
            message: `আপনার ফ্রি অ্যাকাউন্টে ৩০ দিনে সর্বোচ্চ ${FREE_MESSAGE_LIMIT}টি মেসেজ পাঠানোর সীমা শেষ হয়েছে। সীমাহীন বার্তা পাঠাতে প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন।`,
            limit: FREE_MESSAGE_LIMIT,
            used,
          },
          { status: 403 }
        );
      }

      // Check contact info
      if (containsContactInfo(text)) {
        return NextResponse.json(
          {
            error: 'CONTACT_INFO_BLOCKED',
            message:
              'নিরাপত্তার স্বার্থে ফ্রি একাউন্টে সরাসরি ফোন নম্বর, ইমেইল, ফেসবুক বা যোগাযোগের তথ্য পাঠানো নিষিদ্ধ। প্রিমিয়ামে আপগ্রেড করুন।',
          },
          { status: 422 }
        );
      }
    }

    const now = new Date();

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        fromUserId: me.id,
        text,
        createdAt: now,
      },
    });

    // Update conversation last message timestamp & unhide
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: now,
        hiddenByA: false,
        hiddenByB: false,
      },
    });

    if (isFree) {
      await prisma.messageLog.create({
        data: {
          userId: me.id,
          createdAt: now,
        },
      });
    }

    return NextResponse.json({
      message: {
        id: message.id,
        from: me.id,
        text: message.text,
        at: message.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error in POST /api/conversations/[id]/messages:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
