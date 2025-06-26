"use client";

import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
  deleteAssignment,
  deleteResult,
  deleteAttendance,
  deleteEvent,
  deleteAnnouncement,
  deleteEquipment,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
  equipment: deleteEquipment,
  booking: deleteEquipment
};

const tableNamesMap = {
  subject: "предмет",
  class: "класс",
  teacher: "преподавателя",
  student: "студента",
  exam: "экзамен",
  parent: "родителя",
  lesson: "урок",
  assignment: "задание",
  result: "результат",
  attendance: "посещаемость",
  event: "мероприятие",
  announcement: "объявление",
  equipment: "оборудование",
  booking: "бронирование"
};

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const AssignmentsForm = dynamic(() => import("./forms/AssignmentsForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const ResultsForm = dynamic(() => import("./forms/ResultsForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const LessonsForm = dynamic(() => import("./forms/LessonsForm"), {
  loading: () => <h1>Загрузка...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <p>Загрузка...</p>,
});
const EventsForm = dynamic(() => import("./forms/EventsForm"), {
  loading: () => <p>Загрузка...</p>,
});
const AnnouncementsForm = dynamic(() => import("./forms/AnnouncementsForm"), {
  loading: () => <p>Загрузка...</p>,
});
const BookingForm = dynamic(() => import("./forms/BookingForm"), {
  loading: () => <p>Загрузка...</p>,
});
const EquipmentForm = dynamic(() => import("./forms/EquipmentForm"), {
  loading: () => <p>Загрузка...</p>,
});
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
    // TODO OTHER LIST ITEMS
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonsForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <AssignmentsForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  result: (setOpen, type, data, relatedData) => (
    <ResultsForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventsForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementsForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  booking: (setOpen, type, data, relatedData) => (
    <BookingForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  equipment: (setOpen, type, data) => (
    <EquipmentForm
      type={type}
      data={data}
      setOpen={setOpen}
    />
  ),
};

type TableType = "equipment" | "subject" | "class" | "teacher" | "student" | "exam" | "parent" | "lesson" | "assignment" | "result" | "attendance" | "event" | "announcement" | "equipment-booking";

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any; table: TableType }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${tableNamesMap[table]} был успешно удален!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text" name="id" value={id} readOnly hidden />
        <span className="text-center font-medium">
          Данные будут удалены. Вы уверены, что хотите удалить {tableNamesMap[table]}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Удалить
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? forms[table](setOpen, type, data, relatedData) : "Форма не найдена!"
    ) : (
      "Форма не найдена!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;