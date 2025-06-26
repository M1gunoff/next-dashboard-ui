"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema } from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignmentsForm = ({
  type,
  data,
  setOpen,
  relatedData = { lessons: [] },
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { lessons: Array<{ id: number; name: string }> };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Задание успешно ${type === "create" ? "создано" : "обновлено"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Создание нового задания" : "Обновление задания"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Название задания"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Срок сдачи"
          name="dueDate"
          type="datetime-local"
          defaultValue={data?.dueDate}
          register={register}
          error={errors?.dueDate}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Урок</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option
                value={lesson.id}
                key={lesson.id}
                selected={data && lesson.id === data.lessonId}
              >
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Что-то пошло не так.</span>
      )}
      <button className="bg-lamaYellow text-white p-2 rounded-md">
        {type === "create" ? "Создать" : "Обновить"}
      </button>
    </form>
  );
};

export default AssignmentsForm; 