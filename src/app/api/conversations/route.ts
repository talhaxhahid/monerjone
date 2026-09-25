import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userAId: me.id, hiddenByA: false },
          { userBId: me.id, hiddenByB: false },
        ],
      },
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const list = await Promise.all(
      conversations.map(async (c) => {
        const other = c.userAId === me.id ? c.userB : c.userA;
        const lastMsg = c.messages[0] || null;

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: c.id,
            fromUserId: other.id,
            readAt: null,
          },
        });

        const isOnline = Date.now() - new Date(other.lastActive).getTime() < 10 * 60 * 1000;

        return {
          id: c.id,
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
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                at: lastMsg.createdAt.toISOString(),
                fromMe: lastMsg.fromUserId === me.id,
              }
            : null,
          lastMessageAt: c.lastMessageAt.toISOString(),
          unread: unreadCount,
        };
      })
    );

    return NextResponse.json({ conversations: list });
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const { targetId } = await request.json();
    if (!targetId || targetId === me.id) {
      return NextResponse.json(
        { error: 'নিজের সাথে মেসেজিং করা সম্ভব নয়' },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id: targetId },
      include: {
        photos: { select: { id: true }, take: 1, orderBy: { position: 'asc' } },
      },
    });

    if (!target) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }

    // Gender check rule: can only chat between male and female
    if (target.gender === me.gender) {
      return NextResponse.json(
        {
          error:
            'শরীয়াহ ও প্ল্যাটফর্মের নিয়ম অনুযায়ী শুধুমাত্র বিপরীত লিঙ্গের পাত্র/পাত্রীর সাথে বার্তা আদান-প্রদান করা যাবে।',
        },
        { status: 403 }
      );
    }

    // Check existing conversation
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: me.id, userBId: targetId },
          { userAId: targetId, userBId: me.id },
        ],
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          userAId: me.id,
          userBId: targetId,
          lastMessageAt: new Date(),
        },
      });
    } else {
      // Unhide if hidden
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          hiddenByA: false,
          hiddenByB: false,
        },
      });
    }

    return NextResponse.json({
      conversationId: conv.id,
      other: {
        id: target.id,
        name: `${target.firstName} ${target.lastName}`,
        gender: target.gender,
        district: target.district,
        premium: target.premium,
        photoId: target.photos[0]?.id || null,
        photoUrl: target.photos[0]?.id ? `/api/photos/${target.photos[0].id}` : null,
      },
    });
  } catch (error: any) {
    console.error('Error in POST /api/conversations:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
