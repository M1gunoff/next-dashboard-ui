import { Day, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Очистка существующих данных
  await prisma.$transaction([
    prisma.consultation.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.project.deleteMany(),
    prisma.projectDirection.deleteMany(),
  ]);

  // Создание направлений проектов
  const directions = await Promise.all(
    ["IT", "Дизайн", "Мультимедиа"].map((name) =>
      prisma.projectDirection.create({
        data: { name },
      })
    )
  );

  // Создание преподавателей (если их нет)
  const teachers = await Promise.all(
    [
      {
        name: "Бабичев",
        surname: "Даниил Романович",
        email: "babichev@example.com",
        phone: "89166433792",
      },
      {
        name: "Никулина",
        surname: "Анна Константиновна",
        email: "nickulinaasa@yandex.ru",
        phone: "nickulinaasa@yandex.ru",
      },
      // Добавьте других преподавателей по аналогии
    ].map((teacher) =>
      prisma.teacher.create({
        data: {
          id: `teacher_${teacher.name.toLowerCase()}_${teacher.surname.toLowerCase()}`,
          username: `teacher_${teacher.name.toLowerCase()}_${teacher.surname.toLowerCase()}`,
          name: teacher.name,
          surname: teacher.surname,
          email: teacher.email,
          phone: teacher.phone,
          address: "ул. Примерная, д. 1",
          sex: "MALE",
          birthday: new Date(1980, 0, 1),
          groupNumber: "1",
        },
      })
    )
  );

  // Создание проектов
  const projects = await Promise.all([
    // AI-Workshop
    prisma.project.create({
      data: {
        name: "AI-Workshop",
        description: "AI-Workshop (I курс)",
        directionId: directions[0].id, // IT
        teacherId: teachers[0].id, // Бабичев
        schedules: {
          create: [
            {
              dayOfWeek: Day.WEDNESDAY,
              startTime: new Date(2024, 0, 1, 19, 30),
              endTime: new Date(2024, 0, 1, 21, 0),
              location: "ПК407",
            },
          ],
        },
        consultations: {
          create: [
            {
              dayOfWeek: Day.SATURDAY,
              startTime: new Date(2024, 0, 1, 10, 40),
              endTime: new Date(2024, 0, 1, 12, 10),
              link: "https://telemost.yandex.ru/j/84535435132986",
            },
          ],
        },
      },
    }),
    // AllRussia.Info
    prisma.project.create({
      data: {
        name: "AllRussia.Info",
        description: "AllRussia.Info (I курс)",
        directionId: directions[0].id, // IT
        teacherId: teachers[1].id, // Никулина
        schedules: {
          create: [
            {
              dayOfWeek: Day.MONDAY,
              startTime: new Date(2024, 0, 1, 12, 20),
              endTime: new Date(2024, 0, 1, 13, 50),
              location: "ПК505",
              notes: "03.03.2025 г. занятие по адресу: проспект Мира, 119, стр. 2, (павильон № 2)",
            },
          ],
        },
        consultations: {
          create: [
            {
              dayOfWeek: Day.SATURDAY,
              startTime: new Date(2024, 0, 1, 10, 40),
              endTime: new Date(2024, 0, 1, 15, 15),
              link: "https://telemost.yandex.ru/j/07308625442696",
            },
          ],
        },
      },
    }),
    // Добавьте другие проекты по аналогии
  ]);

  console.log("Project seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 