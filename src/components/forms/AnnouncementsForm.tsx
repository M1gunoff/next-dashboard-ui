"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AnnouncementsForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        const result = await createAnnouncement({ success: false, error: false }, formData);
        if (result.success) {
          toast(`Объявление успешно создано!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Ошибка при создании объявления!`);
        }
      } else {
        const result = await updateAnnouncement({ success: false, error: false }, {
          ...formData,
          id: data.id,
        });
        if (result.success) {
          toast(`Объявление успешно обновлено!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Ошибка при обновлении объявления!`);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Произошла ошибка при ${type === "create" ? "создании" : "обновлении"} объявления!`);
    }
  });

  const { classes = [] } = relatedData;

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новое объявление" : "Обновление объявления"}
      </h2>
      <InputField
        label="Заголовок"
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

export default AnnouncementsForm; 