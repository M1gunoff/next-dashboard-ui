"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const EventsForm = ({
  type,
  data,
  setOpen,
  relatedData = { classes: [] },
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    classes: Array<{ id: number; name: string }>;
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    console.log('Form submitted with data:', formData);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      
      if (type === "create") {
        const result = await createEvent({ success: false, error: false }, formDataObj);
        if (result.success) {
          toast(`Мероприятие успешно создано!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Ошибка при создании мероприятия!`);
        }
      } else {
        formDataObj.append('id', data.id.toString());
        const result = await updateEvent({ success: false, error: false }, formDataObj);
        if (result.success) {
          toast(`Мероприятие успешно обновлено!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Ошибка при обновлении мероприятия!`);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Произошла ошибка при ${type === "create" ? "создании" : "обновлении"} мероприятия!`);
    }
  });

  const { classes = [] } = relatedData;

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новое событие" : "Обновление события"}
      </h2>
      <InputField
        label="Название"
        type="text"
        name="title"
        register={register}
        error={errors.title}
      />
      <InputField
        label="Описание"
        type="textarea"
        name="description"
        register={register}
        error={errors.description}
      />
      <InputField
        label="Дата и время начала"
        type="datetime-local"
        name="startTime"
        register={register}
        error={errors.startTime}
      />
      <InputField
        label="Дата и время окончания"
        type="datetime-local"
        name="endTime"
        register={register}
        error={errors.endTime}
      />
      <InputField
        label="Группа"
        type="select"
        name="classId"
        options={[
          { value: "", label: "Все группы" },
          ...classes.map((class_) => ({
            value: class_.id,
            label: class_.name,
          })),
        ]}
        register={register}
        error={errors.classId}
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

export default EventsForm;
