"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  AssignmentSchema,
  ResultSchema,
  LessonSchema,
} from "./formValidationSchemas";
import  prisma  from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // Проверяем существование предмета
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subject) {
      return { success: false, error: true };
    }

    // Сначала удаляем все связанные уроки
    await prisma.lesson.deleteMany({
      where: {
        subjectId: parseInt(id),
      },
    });

    // Затем удаляем сам предмет
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        groupNumber: data.groupNumber,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log('Error creating teacher:', err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        groupNumber: data.groupNumber,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  console.log("Deleting teacher with id:", id);
  try {
    const clerk = await clerkClient();
    console.log("Deleting user from Clerk");
    await clerk.users.deleteUser(id);

    console.log("Deleting teacher from database");
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    console.log("Teacher deleted successfully");
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting teacher:", err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address,
        img: data.img || undefined,
        groupNumber: data.groupNumber || undefined,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId || undefined
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address,
        img: data.img || undefined,
        groupNumber: data.groupNumber || undefined,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId || undefined
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.dueDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.dueDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    await prisma.result.create({
      data: {
        examId: data.examId,
        studentId: data.studentId,
        score: data.score,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        examId: data.examId,
        studentId: data.studentId,
        score: data.score,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export async function createAttendance(
  state: { success: boolean; error: boolean },
  data: {
    date: string;
    present: string;
    studentId: string;
    lessonId: string;
  }
) {
  try {
    await prisma.attendance.create({
      data: {
        date: new Date(data.date),
        present: data.present === "true",
        studentId: data.studentId,
        lessonId: parseInt(data.lessonId),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating attendance:", error);
    return { success: false, error: true };
  }
}

export async function updateAttendance(
  state: { success: boolean; error: boolean },
  data: {
    id: number;
    date: string;
    present: string;
    studentId: string;
    lessonId: string;
  }
) {
  try {
    await prisma.attendance.update({
      where: { id: data.id },
      data: {
        date: new Date(data.date),
        present: data.present === "true",
        studentId: data.studentId,
        lessonId: parseInt(data.lessonId),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating attendance:", error);
    return { success: false, error: true };
  }
}

export async function deleteAttendance(
  state: { success: boolean; error: boolean },
  data: FormData
) {
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.attendance.delete({
      where: { id },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return { success: false, error: true };
  }
}

export async function createEvent(
  state: { success: boolean; error: boolean },
  formData: FormData
) {
  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    startTime: formData.get('startTime') as string,
    endTime: formData.get('endTime') as string,
    classId: formData.get('classId') as string,
  };
  
  console.log('Creating event with data:', data);
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    console.log('Event created successfully:', event);
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: true };
  }
}

export async function updateEvent(
  state: { success: boolean; error: boolean },
  formData: FormData
) {
  const data = {
    id: parseInt(formData.get('id') as string),
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    startTime: formData.get('startTime') as string,
    endTime: formData.get('endTime') as string,
    classId: formData.get('classId') as string,
  };

  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: true };
  }
}

export async function deleteEvent(
  state: { success: boolean; error: boolean },
  data: FormData
) {
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.event.delete({
      where: { id },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: true };
  }
}

export async function createAnnouncement(
  state: { success: boolean; error: boolean },
  data: {
    title: string;
    description: string;
    classId?: string;
  }
) {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: true };
  }
}

export async function updateAnnouncement(
  state: { success: boolean; error: boolean },
  data: {
    id: number;
    title: string;
    description: string;
    classId?: string;
  }
) {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, error: true };
  }
}

export async function deleteAnnouncement(
  state: { success: boolean; error: boolean },
  data: FormData
) {
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: true };
  }
}

export async function createEquipmentBooking(
  state: { success: boolean; error: boolean },
  data: {
    equipmentId: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: true };
    }

    // Проверяем, не забронировано ли уже оборудование на это время
    const existingBooking = await prisma.equipmentBooking.findFirst({
      where: {
        equipmentId: parseInt(data.equipmentId),
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(data.startTime) } },
              { endTime: { gt: new Date(data.startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(data.endTime) } },
              { endTime: { gte: new Date(data.endTime) } }
            ]
          }
        ]
      }
    });

    if (existingBooking) {
      return { success: false, error: true };
    }

    await prisma.equipmentBooking.create({
      data: {
      equipment: {
        connect: {
            id: parseInt(data.equipmentId)
          }
        },
        bookedBy: {
        connect: {
            id: userId
          }
      },
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      purpose: data.purpose,
        status: "pending"
      }
    });

    revalidatePath("/list/equipment/bookings");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating equipment booking:", error);
    return { success: false, error: true };
  }
}

export async function updateEquipmentBooking(
  state: { success: boolean; error: boolean },
  data: {
    id: number;
    status: "approved" | "rejected";
  }
) {
  try {
    const updateData: Prisma.EquipmentBookingUpdateInput = {
      status: data.status,
    };

    await prisma.equipmentBooking.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    revalidatePath("/list/equipment/bookings");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}

export async function createEquipment(
  state: { success: boolean; error: boolean },
  data: {
    equipmentId: string;
    name: string;
    description?: string;
    quantity: number;
    type: string;
    location: string;
  }
) {
  try {
    // Проверяем, существует ли уже оборудование с таким ID
    const existingEquipment = await prisma.equipment.findUnique({
      where: {
        equipmentId: data.equipmentId
      }
    });

    if (existingEquipment) {
      return { success: false, error: 'Оборудование с таким ID уже существует!' };
    }

    // Проверяем, существует ли уже оборудование с таким названием
    const existingEquipmentByName = await prisma.equipment.findUnique({
      where: {
        name: data.name
      }
    });

    if (existingEquipmentByName) {
      return { success: false, error: 'Оборудование с таким названием уже существует!' };
    }

    await prisma.equipment.create({
      data: {
        equipmentId: data.equipmentId,
        name: data.name,
        description: data.description,
        quantity: Number(data.quantity),
        type: data.type,
        location: data.location,
      },
    });
    revalidatePath("/list/equipment");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating equipment:", error);
    return { success: false, error: true };
  }
}

export async function updateEquipment(
  state: { success: boolean; error: boolean },
  data: {
    id: number;
    equipmentId: string;
    name: string;
    description?: string;
    quantity: number;
    type: string;
    location: string;
  }
) {
  try {
    await prisma.equipment.update({
      where: { id: data.id },
      data: {
        equipmentId: data.equipmentId,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        type: data.type,
        location: data.location,
      },
    });
    revalidatePath("/list/equipment");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating equipment:", error);
    return { success: false, error: true };
  }
}

export async function deleteEquipment(
  state: { success: boolean; error: boolean },
  data: FormData
) {
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.equipment.delete({
      where: { id },
    });
    revalidatePath("/list/equipment");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return { success: false, error: true };
  }
}