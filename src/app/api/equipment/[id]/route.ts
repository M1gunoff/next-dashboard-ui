import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            endTime: {
              gt: new Date()
            }
          },
          include: {
            bookedBy: true
          }
        }
      }
    });

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
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
    const { name, description, quantity, type, location, equipmentId } = body;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        description,
        quantity,
        type,
        location,
        equipmentId
      }
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.equipment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    );
  }
} 