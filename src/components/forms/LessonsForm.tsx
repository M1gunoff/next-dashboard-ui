"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonsForm = ({
  type,
  data,
  setOpen,
  relatedData = { subjects: [], classes: [], teachers: [] },
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    subjects: Array<{ id: number; name: string }>;
    classes: Array<{ id: number; name: string }>;
    teachers: Array<{ id: string; name: string; surname: string }>;
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Занятие успешно ${type === "create" ? "создано" : "обновлено"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects = [], classes = [], teachers = [] } = relatedData;

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новое занятие" : "Обновление занятия"}
      </h2>
      <InputField
        label="Название"
        type="text"
        name="name"
        register={register}
        error={errors.name}
      />
      <InputField
        label="День недели"
        type="select"
        name="day"
        options={[
          { value: "MONDAY", label: "Понедельник" },
          { value: "TUESDAY", label: "Вторник" },
          { value: "WEDNESDAY", label: "Среда" },
          { value: "THURSDAY", label: "Четверг" },
          { value: "FRIDAY", label: "Пятница" },
          { value: "SATURDAY", label: "Суббота" },
          { value: "SUNDAY", label: "Воскресенье" },
        ]}
        register={register}
        error={errors.day}
      />
      <InputField
        label="Время начала"
        type="datetime-local"
        name="startTime"
        register={register}
        error={errors.startTime}
      />
      <InputField
        label="Время окончания"
        type="datetime-local"
        name="endTime"
        register={register}
        error={errors.endTime}
      />
      <InputField
        label="Предмет"
        type="select"
        name="subjectId"
        options={subjects.map((subject) => ({
          value: subject.id,
          label: subject.name,
        }))}
        register={register}
        error={errors.subjectId}
      />
      <InputField
        label="Группа"
        type="select"
        name="classId"
        options={classes.map((classItem) => ({
          value: classItem.id,
          label: classItem.name,
        }))}
        register={register}
        error={errors.classId}
      />
      <InputField
        label="Преподаватель"
        type="select"
        name="teacherId"
        options={teachers.map((teacher) => ({
          value: teacher.id,
          label: `${teacher.name} ${teacher.surname}`,
        }))}
        register={register}
        error={errors.teacherId}
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

export default LessonsForm; 