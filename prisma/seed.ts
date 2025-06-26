import { Day, PrismaClient, UserRole, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Очистка всех таблиц (от зависимых к независимым)
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.equipmentBooking.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  // Администраторы
  await prisma.admin.create({ data: { id: "admin1", username: "admin1" } });
  await prisma.admin.create({ data: { id: "admin2", username: "admin2" } });

  // Классы и уровни
  const grades = [];
  for (let i = 1; i <= 6; i++) {
    const grade = await prisma.grade.create({ data: { level: i } });
    grades.push(grade);
  }

  // Только нужные группы
  const classNames = [
    "311-323",
    "311-322",
    "311-321",
    "301-323",
    "321-321"
  ];
  const classes = [];
  for (let i = 0; i < classNames.length; i++) {
    const createdClass = await prisma.class.create({
      data: {
        name: classNames[i],
        gradeId: grades[i % grades.length].id,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
    classes.push(createdClass);
  }

  // Дисциплины (на русском)
  const subjectData = [
    { name: "AI-Workshop" },
    { name: "Цифровая платформа поддержи проектного обучения" },
    { name: "Open Digital-Cash" },
    { name: "Автоматизация внутренних бизнес-процессов университета" },
    { name: "Автоматизированная система оценки деятельности работников" },
    { name: "Виртуальная лаборатория" },
    { name: "Группа проектов \"Робостанция\"" },
    { name: "ИИ-система для обработка текстовых файлов пользователя" },
    { name: "Интеллектуальные беспилотные системы" },
    { name: "Интерактивный музей Московского Политеха" },
    { name: "Карты дисциплин" },
    { name: "Киберполигон" },
    { name: "Студенческая веб-студия \"Polyweb\"" },
  ];
  const subjects = [];
  for (const subject of subjectData) {
    const createdSubject = await prisma.subject.create({ data: subject });
    subjects.push(createdSubject);
  }

  // Преподаватели (на русском)
  const teacherNames = [
    { name: "Вера", surname: "Чернова", patronymic: "Михайловна" },
    { name: "Марина", surname: "Даньшина", patronymic: "Владимировна" },
    { name: "Артем", surname: "Гнибеда", patronymic: "Юрьевич" },
    { name: "Акбар", surname: "Пардаев", patronymic: "Анварович" },
    { name: "Алексей", surname: "Харламенков", patronymic: "Евгеньевич" },
    { name: "Вероника", surname: "Натур", patronymic: "Валентиновна" },
    { name: "Владислав", surname: "Верещагин", patronymic: "Юрьевич" },
    { name: "Мария", surname: "Ткачева", patronymic: "Викторовна" },
    { name: "Екатерина", surname: "Пшехотская", patronymic: "Александровна" },
    { name: "Юлия", surname: "Смирнова", patronymic: "Владимировна" },
    { name: "Александр", surname: "Гаврилов", patronymic: "Игоревич" },
    { name: "Андрей", surname: "Филиппович", patronymic: "Юрьевич" },
    { name: "Владислав", surname: "Филиппович", patronymic: "Андреевич" },
    { name: "Юрий", surname: "Филиппович", patronymic: "Николаевич" },
    { name: "Владислав", surname: "Речинский", patronymic: "Алексеевич" },
    { name: "Никита", surname: "Воробьев", patronymic: "Григорьевич" },
    { name: "Екатерина", surname: "Пухова", patronymic: "Александровна" },
    { name: "Наталья", surname: "Семичевская", patronymic: "Петровна" },
    { name: "Владимир", surname: "Баринов", patronymic: "Романович" },
    { name: "Екатерина", surname: "Шукалова", patronymic: "Вячеславовна" },
    // Временные данные для остальных преподавателей
    { name: "Иван", surname: "Иванов", patronymic: "Иванович" },
    { name: "Петр", surname: "Петров", patronymic: "Петрович" },
    { name: "Сергей", surname: "Сергеев", patronymic: "Сергеевич" },
    { name: "Анна", surname: "Аннова", patronymic: "Анновна" },
    { name: "Ольга", surname: "Ольгова", patronymic: "Ольговна" },
    { name: "Михаил", surname: "Михайлов", patronymic: "Михайлович" },
    { name: "Дмитрий", surname: "Дмитриев", patronymic: "Дмитриевич" },
    { name: "Елена", surname: "Еленова", patronymic: "Еленовна" },
    { name: "Татьяна", surname: "Татьянова", patronymic: "Татьяновна" },
    { name: "Андрей", surname: "Андреев", patronymic: "Андреевич" },
    { name: "Виктор", surname: "Викторов", patronymic: "Викторович" },
    { name: "Наталья", surname: "Натальева", patronymic: "Натальевна" },
    { name: "Светлана", surname: "Светланова", patronymic: "Светлановна" },
  ];
  const teachers = [];
  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = await prisma.teacher.create({
      data: {
        id: `teacher${i + 1}`,
        username: `teacher${i + 1}`,
        name: teacherNames[i].name,
        surname: teacherNames[i].surname,
        patronymic: teacherNames[i].patronymic,
        email: `teacher${i + 1}@example.com`,
        phone: `900-111-11${i + 1}`,
        address: `Адрес преподавателя ${i + 1}`,
        groupNumber: `${100 + i + 1}`,
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: subjects[i % subjects.length].id }] },
        classes: { connect: [{ id: classes[i % classes.length].id }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
    teachers.push(teacher);
  }

  // Уроки (на русском) - создаем конкретное расписание для учителя
  const lessons = [];
  
  // Создаем расписание для первого учителя (teacher1) с тремя предметами
  const teacherSchedule = [
    {
      name: "AI-Workshop",
      day: Day.MONDAY,
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(10, 30, 0, 0)),
      subjectId: subjects[0].id, // AI-Workshop
      classId: classes[0].id, // 311-323
      teacherId: teachers[0].id, // teacher1
    },
    {
      name: "Цифровая платформа поддержи проектного обучения",
      day: Day.MONDAY,
      startTime: new Date(new Date().setHours(10, 40, 0, 0)),
      endTime: new Date(new Date().setHours(12, 10, 0, 0)),
      subjectId: subjects[1].id, // Цифровая платформа
      classId: classes[1].id, // 311-322
      teacherId: teachers[0].id, // teacher1
    },
    {
      name: "Open Digital-Cash",
      day: Day.MONDAY,
      startTime: new Date(new Date().setHours(12, 20, 0, 0)),
      endTime: new Date(new Date().setHours(13, 50, 0, 0)),
      subjectId: subjects[2].id, // Open Digital-Cash
      classId: classes[2].id, // 311-321
      teacherId: teachers[0].id, // teacher1
    },
    // Добавляем те же уроки на другие дни недели для полноты расписания
    {
      name: "AI-Workshop",
      day: Day.TUESDAY,
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(10, 30, 0, 0)),
      subjectId: subjects[0].id,
      classId: classes[0].id,
      teacherId: teachers[0].id,
    },
    {
      name: "Цифровая платформа поддержи проектного обучения",
      day: Day.TUESDAY,
      startTime: new Date(new Date().setHours(10, 40, 0, 0)),
      endTime: new Date(new Date().setHours(12, 10, 0, 0)),
      subjectId: subjects[1].id,
      classId: classes[1].id,
      teacherId: teachers[0].id,
    },
    {
      name: "Open Digital-Cash",
      day: Day.TUESDAY,
      startTime: new Date(new Date().setHours(12, 20, 0, 0)),
      endTime: new Date(new Date().setHours(13, 50, 0, 0)),
      subjectId: subjects[2].id,
      classId: classes[2].id,
      teacherId: teachers[0].id,
    },
    {
      name: "AI-Workshop",
      day: Day.WEDNESDAY,
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(10, 30, 0, 0)),
      subjectId: subjects[0].id,
      classId: classes[0].id,
      teacherId: teachers[0].id,
    },
    {
      name: "Цифровая платформа поддержи проектного обучения",
      day: Day.WEDNESDAY,
      startTime: new Date(new Date().setHours(10, 40, 0, 0)),
      endTime: new Date(new Date().setHours(12, 10, 0, 0)),
      subjectId: subjects[1].id,
      classId: classes[1].id,
      teacherId: teachers[0].id,
    },
    {
      name: "Open Digital-Cash",
      day: Day.WEDNESDAY,
      startTime: new Date(new Date().setHours(12, 20, 0, 0)),
      endTime: new Date(new Date().setHours(13, 50, 0, 0)),
      subjectId: subjects[2].id,
      classId: classes[2].id,
      teacherId: teachers[0].id,
    },
  ];

  // Создаем уроки по расписанию
  for (const lessonData of teacherSchedule) {
    const lesson = await prisma.lesson.create({
      data: lessonData,
    });
    lessons.push(lesson);
  }

  // Добавляем еще несколько уроков для других учителей (чтобы не было пусто)
  for (let i = 1; i <= 10; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        name: `Урок ${i}`,
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: subjects[(i - 1) % subjects.length].id,
        classId: classes[(i - 1) % classes.length].id,
        teacherId: teachers[(i - 1) % teachers.length].id,
      },
    });
    lessons.push(lesson);
  }

  // Ученики (на русском)
  const studentNames = [
    { name: "Анастасия", surname: "Абрамова" },
    { name: "Юлия", surname: "Авдошкина" },
    { name: "Изель", surname: "Бикулова" },
    { name: "Илья", surname: "Бондарь" },
    { name: "Матвей", surname: "Бухарцев" },
    { name: "Генрих", surname: "Гейне" },
    { name: "Александр", surname: "Горюнов" },
    { name: "Савелий", surname: "Грабовый" },
    { name: "Данила", surname: "Гусев" },
    { name: "Давид", surname: "Журавлев" },
    { name: "Артём", surname: "Завойских" },
    { name: "Даниил", surname: "Иванцов" },
    { name: "Алексей", surname: "Карпеченко" },
    { name: "Андрей", surname: "Киверин" },
    { name: "Максим", surname: "Киселев" },
    { name: "Андрей", surname: "Ковшов" },
    { name: "Елизавета", surname: "Колушова" },
    { name: "Иван", surname: "Крапивин" },
    { name: "Александр", surname: "Лагутов" },
    { name: "Михаил", surname: "Михайлов" },
    { name: "Санал", surname: "Няминов" },
    { name: "Виктор", surname: "Савенков" },
    { name: "Михаил", surname: "Сергеев" },
    { name: "Сергей", surname: "Борисенков" },
    { name: "Николай", surname: "Бухалов" },
    { name: "Полина", surname: "Втюрина" },
    { name: "Сергей", surname: "Герасичев" },
    { name: "Кирилл", surname: "Королёв" },
    { name: "Олжас", surname: "Куспаков" },
    { name: "Эрнест", surname: "Литвиненко" },
    { name: "Кира", surname: "Максимова" },
    { name: "Илья", surname: "Мигунов" },
    { name: "Марина", surname: "Молчанова" },
    { name: "Никита", surname: "Петросиенко" },
    { name: "Александр", surname: "Подольный" },
    { name: "Вадим", surname: "Пометун" },
    { name: "Егор", surname: "Рожков" },
    { name: "Артём", surname: "Самарин" },
    { name: "Анастасия", surname: "Сергеева" },
    { name: "Георгий", surname: "Сигалев" },
    { name: "Иван", surname: "Устинов" },
    { name: "Рустам", surname: "Хашимов" },
    { name: "Андрей", surname: "Цыбуленко" },
    { name: "Вадим", surname: "Шарков" },
    // Добавим ещё 7 случайных ФИО для полного списка из 50
    { name: "Валерия", surname: "Соловьёва" },
    { name: "Денис", surname: "Кузнецов" },
    { name: "Олеся", surname: "Павлова" },
    { name: "Вячеслав", surname: "Романов" },
    { name: "Тимур", surname: "Горбачёв" },
    { name: "Екатерина", surname: "Смирнова" },
    { name: "Артём", surname: "Васильев" },
  ];
  for (let i = 1; i <= 50; i++) {
    const student = studentNames[i - 1] || { name: `Имя${i}`, surname: `Фамилия${i}` };
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: student.name,
        surname: student.surname,
        email: `student${i}@example.com`,
        phone: `900-222-22${i}`,
        address: `Адрес ученика ${i}`,
        groupNumber: `${200 + i}`,
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        gradeId: grades[(i - 1) % grades.length].id,
        classId: classes[(i - 1) % classes.length].id,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }

  // Оборудование
  const equipmentData = [
    {
      name: "3D принтер Ultimaker S5",
      description: "Точность печати 50 мкм, рабочая зона 330x240x300 мм",
      quantity: 2,
      type: "Принтеры",
      location: "Лаб. 301",
      equipmentId: "eq-001"
    },
    {
      name: "Электронный микроскоп EM-3000",
      description: "Увеличение до 300000x, разрешение 0.1 нм",
      quantity: 1,
      type: "Лабораторное",
      location: "Лаб. 215",
      equipmentId: "eq-002"
    },
    {
      name: "Ноутбук Dell XPS 15",
      description: "Intel Core i7, 32GB RAM, SSD 1TB, NVIDIA GTX 1650",
      quantity: 5,
      type: "Компьютеры",
      location: "Каб. 108",
      equipmentId: "eq-003"
    },
    {
      name: "Лазерный проектор Epson EB-1781W",
      description: "Яркость 4000 люмен, разрешение WUXGA",
      quantity: 2,
      type: "Аудио/Видео",
      location: "Ауд. 402",
      equipmentId: "eq-004"
    },
    {
      name: "Осциллограф Tektronix TBS2000",
      description: "Полоса 200 МГц, 4 канала, частота дискретизации 2 Гвыб/с",
      quantity: 1,
      type: "Измерительное",
      location: "Лаб. 210",
      equipmentId: "eq-005"
    },
    {
      name: "Паяльная станция Hakko FX-888D",
      description: "Мощность 70 Вт, температура до 480°C",
      quantity: 3,
      type: "Электроника",
      location: "Лаб. 305",
      equipmentId: "eq-006"
    },
    {
      name: "Сервер HP ProLiant DL380",
      description: "2x Xeon Gold, 256GB RAM, 8x 1TB SSD",
      quantity: 1,
      type: "Серверное",
      location: "Серверная 101",
      equipmentId: "eq-007"
    },
    {
      name: "3D сканер EinScan Pro 2X",
      description: "Точность 0.04 мм, скорость сканирования 1.5 млн точек/сек",
      quantity: 1,
      type: "Сканеры",
      location: "Лаб. 301",
      equipmentId: "eq-008"
    },
    {
      name: "Графическая станция Wacom Cintiq 32",
      description: "4K разрешение, 8192 уровней нажатия пера",
      quantity: 2,
      type: "Графика",
      location: "Каб. 205",
      equipmentId: "eq-009"
    },
    {
      name: "Робот-манипулятор UR10e",
      description: "Грузоподъемность 10 кг, радиус действия 1300 мм",
      quantity: 1,
      type: "Робототехника",
      location: "Лаб. 410",
      equipmentId: "eq-010"
    }
  ];

  const equipment = [];
  for (const equipmentItem of equipmentData) {
    const createdEquipment = await prisma.equipment.create({
      data: equipmentItem
    });
    equipment.push(createdEquipment);
  }

  // Создаем тестового пользователя для бронирований
  await prisma.user.create({
    data: {
      id: "test-user",
      username: "test-user",
      role: UserRole.STUDENT
    }
  });

  // Создаем тестового пользователя-учителя для проверки календаря
  await prisma.user.create({
    data: {
      id: "teacher1",
      username: "teacher1",
      role: UserRole.TEACHER
    }
  });

  // Создаем несколько бронирований для тестирования
  const bookingData = [
    {
      equipmentId: equipment[1].id, // Электронный микроскоп
      bookedById: "test-user",
      startTime: new Date(),
      endTime: new Date(new Date().setDate(new Date().getDate() + 7))
    },
    {
      equipmentId: equipment[6].id, // Сервер
      bookedById: "test-user",
      startTime: new Date(),
      endTime: new Date(new Date().setDate(new Date().getDate() + 3))
    },
    {
      equipmentId: equipment[8].id, // Графическая станция
      bookedById: "test-user",
      startTime: new Date(),
      endTime: new Date(new Date().setDate(new Date().getDate() + 5))
    }
  ];

  for (const booking of bookingData) {
    await prisma.equipmentBooking.create({
      data: booking
    });
  }

  // Экзамены (на русском)
  const exams = [];
  for (let i = 1; i <= 10; i++) {
    const exam = await prisma.exam.create({
      data: {
        title: `Экзамен ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: lessons[i - 1].id,
      },
    });
    exams.push(exam);
  }

  // Задания (на русском)
  const assignments = [];
  for (let i = 1; i <= 10; i++) {
    const assignment = await prisma.assignment.create({
      data: {
        title: `Задание ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: lessons[i - 1].id,
      },
    });
    assignments.push(assignment);
  }

  // Успеваемость (на русском)
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 80 + i,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: exams[i - 1].id } : { assignmentId: assignments[i - 6].id }),
      },
    });
  }

  // Посещаемость (на русском)
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: i % 2 === 0,
        studentId: `student${i}`,
        lessonId: lessons[i - 1].id,
      },
    });
  }

  // События (на русском)
  const eventData = [
    {
      title: "AI-Workshop: Введение в машинное обучение",
      description: "Практический семинар по основам машинного обучения и нейронных сетей",
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(12, 0, 0, 0)),
      classId: classes[0].id,
    },
    {
      title: "Демонстрация робототехники",
      description: "Показ возможностей роботов и автоматизированных систем",
      startTime: new Date(new Date().setHours(14, 0, 0, 0)),
      endTime: new Date(new Date().setHours(16, 0, 0, 0)),
      classId: classes[1].id,
    },
    {
      title: "Виртуальная лаборатория: 3D моделирование",
      description: "Изучение 3D моделирования в виртуальной среде",
      startTime: new Date(new Date().setHours(16, 30, 0, 0)),
      endTime: new Date(new Date().setHours(18, 30, 0, 0)),
      classId: classes[2].id,
    },
    {
      title: "Киберполигон: Соревнования по кибербезопасности",
      description: "Соревнования студентов в области информационной безопасности",
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      classId: classes[3].id,
    },
    {
      title: "Студенческая веб-студия: Презентация проектов",
      description: "Демонстрация веб-проектов, созданных студентами",
      startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 2)),
      classId: classes[4].id,
    },
  ];

  for (const event of eventData) {
    await prisma.event.create({
      data: event
    });
  }

  // Объявления (на русском)
  const announcementData = [
    {
      title: "Запуск AI-Workshop: Регистрация открыта",
      description: "Открыта регистрация на практический семинар по машинному обучению. Количество мест ограничено.",
      date: new Date(),
      classId: classes[0].id,
    },
    {
      title: "Демонстрация робототехники: Приглашаем всех",
      description: "В лаборатории робототехники состоится демонстрация новых роботов. Вход свободный для всех студентов.",
      date: new Date(),
      classId: classes[1].id,
    },
    {
      title: "Виртуальная лаборатория: Новое оборудование",
      description: "Установлено новое оборудование для 3D моделирования в виртуальной среде. Запись на занятия открыта.",
      date: new Date(),
      classId: classes[2].id,
    },
    {
      title: "Киберполигон: Подготовка к соревнованиям",
      description: "Начинается подготовка к соревнованиям по кибербезопасности. Формируются команды.",
      date: new Date(),
      classId: classes[3].id,
    },
    {
      title: "Студенческая веб-студия: Прием проектов",
      description: "Открыт прием проектов для презентации в веб-студии. Срок подачи заявок - до конца месяца.",
      date: new Date(),
      classId: classes[4].id,
    },
  ];

  for (const announcement of announcementData) {
    await prisma.announcement.create({
      data: announcement
    });
  }

  console.log("Сидирование завершено успешно.");
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