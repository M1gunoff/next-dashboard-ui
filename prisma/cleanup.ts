import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Удаляем все записи из таблицы Equipment
    await prisma.equipment.deleteMany({});
    console.log('Все записи из таблицы Equipment успешно удалены');
  } catch (error) {
    console.error('Ошибка при очистке данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 