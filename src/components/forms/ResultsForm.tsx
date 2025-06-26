"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultsForm = ({
  type,
  data,
  setOpen,
  relatedData = { exams: [], students: [] },
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { 
    exams: Array<{ id: number; title: string }>;
    students: Array<{ id: string; name: string; surname: string }>;
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
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
      toast(`Результат успешно ${type === "create" ? "создан" : "обновлен"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { exams = [], students = [] } = relatedData;

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новую оценку" : "Обновление оценки"}
      </h2>
      <InputField
        label="Экзамен"
        type="select"
        name="examId"
        options={exams.map((exam) => ({
          value: exam.id,
          label: exam.title,
        }))}
        register={register}
        error={errors.examId}
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
        label="Оценка"
        type="number"
        name="score"
        register={register}
        error={errors.score}
      />
      <InputField
        label="Комментарий"
        type="textarea"
        name="comment"
        register={register}
        error={errors.comment}
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

export default ResultsForm; 