import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Название предмета обязательно!" }),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Название группы обязательно!" }),
  capacity: z.coerce.number().min(1, { message: "Вместимость обязательна!" }),
  gradeId: z.coerce.number().min(1, { message: "Курс обязателен!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Имя пользователя должно содержать минимум 3 символа!" })
    .max(20, { message: "Имя пользователя должно содержать максимум 20 символов!" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать минимум 8 символов!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Имя обязательно!" }),
  surname: z.string().min(1, { message: "Фамилия обязательна!" }),
  patronymic: z.string().optional(),
  email: z
    .string()
    .email({ message: "Некорректный email!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  groupNumber: z.string().min(1, { message: "Номер группы обязателен!" }),
  birthday: z.coerce.date({ message: "Дата рождения обязательна!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Пол обязателен!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Имя пользователя должно содержать минимум 3 символа!" })
    .max(20, { message: "Имя пользователя должно содержать максимум 20 символов!" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать минимум 8 символов!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Имя обязательно!" }),
  surname: z.string().min(1, { message: "Фамилия обязательна!" }),
  email: z
    .string()
    .email({ message: "Некорректный email!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().min(1, { message: "Адрес обязателен!" }),
  img: z.string().optional(),
  groupNumber: z.string().optional().or(z.literal("")),
  birthday: z.coerce.date({ message: "Дата рождения обязательна!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Пол обязателен!" }),
  gradeId: z.coerce.number().min(1, { message: "Курс обязателен!" }),
  classId: z.coerce.number().min(1, { message: "Группа обязательна!" }).optional()
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Название экзамена обязательно!" }),
  startTime: z.coerce.date({ message: "Время начала обязательно!" }),
  endTime: z.coerce.date({ message: "Время окончания обязательно!" }),
  lessonId: z.coerce.number({ message: "Урок обязателен!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Название задания обязательно!" }),
  dueDate: z.coerce.date({ message: "Срок сдачи обязателен!" }),
  lessonId: z.coerce.number().min(1, { message: "Урок обязателен!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  examId: z.coerce.number().min(1, { message: "Экзамен обязателен!" }),
  studentId: z.string().min(1, { message: "Студент обязателен!" }),
  score: z.coerce.number().min(0).max(100, { message: "Оценка должна быть от 0 до 100!" }),
  comment: z.string().optional(),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Название обязательно!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], {
    message: "День недели обязателен!",
  }),
  startTime: z.coerce.date({ message: "Время начала обязательно!" }),
  endTime: z.coerce.date({ message: "Время окончания обязательно!" }),
  subjectId: z.coerce.number().min(1, { message: "Предмет обязателен!" }),
  classId: z.coerce.number().min(1, { message: "Группа обязательна!" }),
  teacherId: z.string().min(1, { message: "Преподаватель обязателен!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const attendanceSchema = z.object({
  id: z.number().optional(),
  date: z.string().min(1, "Дата обязательна!"),
  present: z.string().min(1, "Статус обязателен!"),
  studentId: z.string().min(1, "Студент обязателен!"),
  lessonId: z.string().min(1, "Занятие обязательно!"),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const eventSchema = z.object({
  title: z.string().min(1, "Название обязательно!"),
  description: z.string().min(1, "Описание обязательно!"),
  startTime: z.string().min(1, "Дата и время начала обязательны!"),
  endTime: z.string().min(1, "Дата и время окончания обязательны!"),
  classId: z.string().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен!"),
  description: z.string().min(1, "Описание обязательно!"),
  classId: z.string().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const equipmentBookingSchema = z.object({
  equipmentId: z.string().min(1, "Выберите оборудование!"),
  startTime: z.string().min(1, "Выберите дату начала!"),
  endTime: z.string().min(1, "Выберите дату окончания!"),
  purpose: z.string().min(1, "Укажите цель использования!"),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type EquipmentBookingSchema = z.infer<typeof equipmentBookingSchema>;

export const equipmentSchema = z.object({
  equipmentId: z.string().min(1, "ID оборудования обязателен!"),
  name: z.string().min(1, "Название обязательно!"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Количество должно быть больше 0!"),
  type: z.string().min(1, "Тип обязателен!"),
  location: z.string().min(1, "Расположение обязательно!"),
});

export type EquipmentSchema = z.infer<typeof equipmentSchema>;