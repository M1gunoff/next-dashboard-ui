import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const bookings = await prisma.equipmentBooking.findMany({
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        bookedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { equipmentId, startTime, endTime } = body;

    // Получаем userId из Clerk
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Проверяем, есть ли пользователь в базе
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          username: typeof sessionClaims?.username === 'string' ? sessionClaims.username : userId,
          role: ((sessionClaims?.metadata as { role?: string })?.role?.toUpperCase() as UserRole) || UserRole.STUDENT,
        },
      });
    }

    const booking = await prisma.equipmentBooking.create({
      data: {
        equipmentId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        bookedById: userId,
        status: 'pending',
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        bookedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 