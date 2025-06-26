"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createEquipment, updateEquipment } from "@/lib/actions";

const equipmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Количество должно быть больше 0"),
  type: z.string().min(1, "Тип обязателен"),
  location: z.string().min(1, "Расположение обязательно"),
  equipmentId: z.string().min(1, "ID оборудования обязателен"),
});

type EquipmentSchema = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  type: "create" | "update";
  data?: EquipmentSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EquipmentForm = ({ type, data, setOpen }: EquipmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentSchema>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        const result = await createEquipment(
          { success: false, error: false },
          {
            equipmentId: formData.equipmentId,
            name: formData.name,
            description: formData.description,
            quantity: formData.quantity,
            type: formData.type,
            location: formData.location,
          }
        );
        if (result.success) {
          toast("Оборудование успешно создано!");
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Произошла ошибка!");
        }
      } else if (type === "update" && data?.id) {
        const result = await updateEquipment(
          { success: false, error: false },
          {
          id: data.id,
            equipmentId: formData.equipmentId,
            name: formData.name,
            description: formData.description,
            quantity: formData.quantity,
            type: formData.type,
            location: formData.location,
          }
        );
        if (result.success) {
          toast("Оборудование успешно обновлено!");
          setOpen(false);
          router.refresh();
        } else {
          toast.error("Произошла ошибка!");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Произошла ошибка!");
    }
  });

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === "create" ? "Создать новое оборудование" : "Обновить оборудование"}
      </h2>
      <InputField
        label="Название"
        type="text"
        name="name"
        register={register}
        error={errors.name}
      />
      <InputField
        label="Описание"
        type="textarea"
        name="description"
        register={register}
        error={errors.description}
      />
      <InputField
        label="Количество"
        type="number"
        name="quantity"
        register={register}
        error={errors.quantity}
      />
      <InputField
        label="Тип"
        type="text"
        name="type"
        register={register}
        error={errors.type}
      />
      <InputField
        label="Расположение"
        type="text"
        name="location"
        register={register}
        error={errors.location}
      />
      <InputField
        label="ID оборудования"
        type="text"
        name="equipmentId"
        register={register}
        error={errors.equipmentId}
      />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamaPurple"
        >
          Отмена
        </button>
      <button
        type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      >
          {type === "create" ? "Создать" : "Обновить"}
      </button>
      </div>
    </form>
  );
};

export default EquipmentForm; 