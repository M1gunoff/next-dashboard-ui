import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.equipmentBooking.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { startTime, endTime } = body;

    const booking = await prisma.equipmentBooking.update({
      where: {
        id,
      },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
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
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status } = body;
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    // TODO: Проверка роли администратора (можно добавить Clerk/JWT проверку)
    const booking = await prisma.equipmentBooking.update({
      where: { id },
      data: { status },
      include: {
        equipment: { select: { id: true, name: true, description: true } },
        bookedBy: { select: { id: true, username: true } },
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
} 