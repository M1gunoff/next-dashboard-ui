import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Очистка существующих данных
  await prisma.$transaction([
    prisma.result.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.class.deleteMany(),
    prisma.grade.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.event.deleteMany(),
    prisma.announcement.deleteMany(),
  ]);

  // Создание курсов
  const grades = await Promise.all(
    [1, 2, 3, 4].map((level) =>
      prisma.grade.create({
        data: { level },
      })
    )
  );

  // Создание групп
  const classes = await Promise.all(
    grades.flatMap((grade) =>
      ["а", "б"].map((letter) =>
        prisma.class.create({
          data: {
            name: `${grade.level}${letter}`,
            gradeId: grade.id,
            capacity: 30,
          },
        })
      )
    )
  );

  // Создание предметов
  const subjects = await Promise.all(
    [
      "Математика",
      "Физика",
      "Информатика",
      "Русский язык",
      "Литература",
      "История",
      "Обществознание",
      "Английский язык",
      "Биология",
      "Химия",
    ].map((name) =>
      prisma.subject.create({
        data: { name },
      })
    )
  );

  // Создание преподавателей
  const teachers = await Promise.all(
    [
      {
        name: "Иван",
        surname: "Иванов",
        subjects: [0, 1], // Математика, Физика
        classes: [0, 1], // 1а, 1б
      },
      {
        name: "Петр",
        surname: "Петров",
        subjects: [2], // Информатика
        classes: [0, 1, 2, 3], // 1а, 1б, 2а, 2б
      },
      // Добавьте других преподавателей по аналогии
    ].map((teacher, index) =>
      prisma.teacher.create({
        data: {
          id: `teacher${index + 1}`,
          username: `teacher${index + 1}`,
          name: teacher.name,
          surname: teacher.surname,
          email: `teacher${index + 1}@example.com`,
          phone: `+7 (999) ${100 + index}-${1000 + index}${index}`,
          address: `ул. Примерная, д. ${index + 1}`,
          groupNumber: `${100 + index}`,
          sex: index % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          birthday: new Date(1980 + index, 0, 1),
          subjects: {
            connect: teacher.subjects.map((subjectIndex) => ({
              id: subjects[subjectIndex].id,
            })),
          },
          classes: {
            connect: teacher.classes.map((classIndex) => ({
              id: classes[classIndex].id,
            })),
          },
        },
      })
    )
  );

  // Создание студентов
  const students = await Promise.all(
    classes.flatMap((classItem, classIndex) =>
      Array.from({ length: 15 }, (_, i) =>
        prisma.student.create({
          data: {
            id: `student${classIndex * 15 + i + 1}`,
            username: `student${classIndex * 15 + i + 1}`,
            name: `Студент${classIndex * 15 + i + 1}`,
            surname: `Студенческий${classIndex * 15 + i + 1}`,
            email: `student${classIndex * 15 + i + 1}@example.com`,
            phone: `+7 (999) ${300 + classIndex}-${3000 + classIndex * 15 + i}`,
            address: `ул. Студенческая, д. ${i + 1}`,
            groupNumber: `${200 + i}`,
            sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
            birthday: new Date(2005 + classItem.gradeId - 1, 0, 1),
            classId: classItem.id,
            gradeId: classItem.gradeId,
          },
        })
      )
    )
  );

  // Создание занятий
  const lessons = await Promise.all(
    classes.flatMap((classItem) =>
      subjects.map((subject, subjectIndex) =>
        prisma.lesson.create({
          data: {
            name: `${subject.name} - ${classItem.name}`,
            day: Day[Object.keys(Day)[subjectIndex % 5] as keyof typeof Day],
            startTime: new Date(2024, 0, 1, 8 + Math.floor(subjectIndex / 2)),
            endTime: new Date(2024, 0, 1, 9 + Math.floor(subjectIndex / 2)),
            subjectId: subject.id,
            classId: classItem.id,
            teacherId: teachers[subjectIndex % teachers.length].id,
          },
        })
      )
    )
  );

  // Создание экзаменов
  const exams = await Promise.all(
    lessons.slice(0, 10).map((lesson, i) =>
      prisma.exam.create({
        data: {
          title: `Экзамен по ${lesson.name}`,
          startTime: new Date(2024, 5, 1 + i),
          endTime: new Date(2024, 5, 1 + i, 2),
          lessonId: lesson.id,
        },
      })
    )
  );

  // Создание заданий
  const assignments = await Promise.all(
    lessons.slice(0, 10).map((lesson, i) =>
      prisma.assignment.create({
        data: {
          title: `Задание по ${lesson.name}`,
          startDate: new Date(2024, 0, 1 + i),
          dueDate: new Date(2024, 0, 8 + i),
          lessonId: lesson.id,
        },
      })
    )
  );

  // Создание результатов
  await Promise.all(
    students.slice(0, 20).map((student, i) =>
      prisma.result.create({
        data: {
          score: Math.floor(Math.random() * 41) + 60, // Оценка от 60 до 100
          studentId: student.id,
          ...(i < 10 ? { examId: exams[i % 10].id } : { assignmentId: assignments[i % 10].id }),
        },
      })
    )
  );

  // Создание посещаемости
  await Promise.all(
    students.slice(0, 20).map((student, i) =>
      prisma.attendance.create({
        data: {
          date: new Date(2024, 0, 1 + i),
          present: Math.random() > 0.1, // 90% вероятность присутствия
          studentId: student.id,
          lessonId: lessons[i % lessons.length].id,
        },
      })
    )
  );

  // Создание событий
  await Promise.all(
    classes.map((classItem, i) =>
      prisma.event.create({
        data: {
          title: `Событие для ${classItem.name}`,
          description: `Описание события для группы ${classItem.name}`,
          startTime: new Date(2024, 0, 1 + i),
          endTime: new Date(2024, 0, 1 + i, 2),
          classId: classItem.id,
        },
      })
    )
  );

  // Создание объявлений
  await Promise.all(
    classes.map((classItem, i) =>
      prisma.announcement.create({
        data: {
          title: `Объявление для ${classItem.name}`,
          description: `Текст объявления для группы ${classItem.name}`,
          date: new Date(2024, 0, 1 + i),
          classId: classItem.id,
        },
      })
    )
  );

  console.log("Seeding completed successfully.");
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