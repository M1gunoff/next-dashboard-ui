import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        bookings: {
          where: {
            endTime: {
              gt: new Date()
            }
          },
          include: {
            bookedBy: true
          },
          orderBy: {
            startTime: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedEquipment = equipment.map(item => ({
      id: item.id,
      equipmentId: item.equipmentId,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      type: item.type,
      location: item.location,
      isBooked: item.bookings.length > 0,
      bookedUntil: item.bookings[0]?.endTime,
      bookedBy: item.bookings[0]?.bookedBy.username
    }));

    return NextResponse.json(formattedEquipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, quantity, type, location, equipmentId } = body;

    // Создаем объект с данными для создания оборудования
    const equipmentData = {
      name,
      description,
      quantity: Number(quantity),
      type,
      location,
      equipmentId
    };

    // Проверяем, существует ли уже оборудование с таким ID
    const existingEquipment = await prisma.equipment.findUnique({
      where: {
        equipmentId: equipmentId
      }
    });

    if (existingEquipment) {
      return NextResponse.json(
        { error: 'Equipment with this ID already exists' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже оборудование с таким названием
    const existingEquipmentByName = await prisma.equipment.findUnique({
      where: {
        name: name
      }
    });

    if (existingEquipmentByName) {
      return NextResponse.json(
        { error: 'Equipment with this name already exists' },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: equipmentData
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
} 