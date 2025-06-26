import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import EquipmentBookingForm from "./forms/EquipmentBookingForm";
import EquipmentForm from "./forms/EquipmentForm";
import { Dispatch, SetStateAction } from "react";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "equipment-booking"
    | "equipment";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  try {
    switch (table) {
      case "subject":
        const teachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { teachers };
        break;
      case "class":
        const grades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const teachersForClass = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { grades, teachers: teachersForClass };
        break;
      case "teacher":
        const subjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { subjects };
        break;
      case "student":
        const gradesForStudent = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            capacity: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        });
        relatedData = { grades: gradesForStudent, classes };
        break;
      case "exam":
        const lessons = await prisma.lesson.findMany({
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                name: true,
              },
            },
          },
        });
        relatedData = { lessons };
        break;
      case "lesson":
        const subjectsForLesson = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        const classesForLesson = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        const teachersForLesson = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = {
          subjects: subjectsForLesson,
          classes: classesForLesson,
          teachers: teachersForLesson,
        };
        break;
      case "assignment":
        const lessonsForAssignment = await prisma.lesson.findMany({
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                name: true,
              },
            },
          },
        });
        relatedData = { lessons: lessonsForAssignment };
        break;
      case "result":
        const exams = await prisma.exam.findMany({
          select: {
            id: true,
            title: true,
          },
        });
        const students = await prisma.student.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { exams, students };
        break;
      case "attendance":
        const [studentsForAttendance, lessonsForAttendance] = await Promise.all([
          prisma.student.findMany({
            select: {
              id: true,
              name: true,
              surname: true,
            },
          }),
          prisma.lesson.findMany({
            select: {
              id: true,
              name: true,
              subject: {
                select: {
                  name: true,
                },
              },
              class: {
                select: {
                  name: true,
                },
              },
            },
          }),
        ]);
        relatedData = { students: studentsForAttendance, lessons: lessonsForAttendance };
        break;
      case "event":
        const classesForEvent = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { classes: classesForEvent };
        break;
      case "announcement":
        const classesForAnnouncement = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { classes: classesForAnnouncement };
        break;
      case "equipment-booking":
        relatedData = {};
        break;
    }
  } catch (error) {
    console.error("Error fetching related data:", error);
  } finally {
    await prisma.$disconnect();
  }

  const forms = {
    "equipment-booking": (
      setOpen: (open: boolean) => void,
      type: "create" | "update",
      data: any,
      relatedData: any
    ) => (
      <EquipmentBookingForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    "equipment": (setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update", data?: any) => (
      <EquipmentForm type={type} data={data} setOpen={setOpen} />
    ),
  };

  return <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />;
};

export default FormContainer;