"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { attendanceSchema, AttendanceSchema } from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData = { students: [], lessons: [] },
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    students: Array<{ id: string; name: string; surname: string }>;
    lessons: Array<{ id: number; name: string; subject: { name: string }; class: { name: string } }>;
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    const submitData = {
      ...formData,
      id: data?.id,
    };
    formAction(submitData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Посещаемость успешно ${type === "create" ? "создана" : "обновлена"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students = [], lessons = [] } = relatedData;

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новую запись посещаемости" : "Обновление записи посещаемости"}
      </h2>
      <InputField
        label="Дата"
        type="date"
        name="date"
        register={register}
        error={errors.date}
      />
      <InputField
        label="Студент"
        type="select"
        name="studentId"
        options={students.map((student) => ({
          value: student.id,
          label: `${student.name} ${student.surname}`,
        }))}
        register={register}
        error={errors.studentId}
      />
      <InputField
        label="Занятие"
        type="select"
        name="lessonId"
        options={lessons.map((lesson) => ({
          value: lesson.id,
          label: `${lesson.subject.name} - ${lesson.class.name}`,
        }))}
        register={register}
        error={errors.lessonId}
      />
      <InputField
        label="Статус"
        type="select"
        name="present"
        options={[
          { value: "true", label: "Присутствовал" },
          { value: "false", label: "Отсутствовал" },
        ]}
        register={register}
        error={errors.present}
      />
      <button
        type="submit"
        className="bg-blue-400 text-white py-2 px-4 rounded-md border-none w-max self-center"
      >
        {type === "create" ? "Создать" : "Обновить"}
      </button>
    </form>
  );
};

export default AttendanceForm; 