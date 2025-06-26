"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createEquipmentBooking } from "@/lib/actions";

const bookingSchema = z.object({
  equipmentId: z.string().min(1, "ID оборудования обязательно"),
  startTime: z.string().min(1, "Время начала обязательно"),
  endTime: z.string().min(1, "Время окончания обязательно"),
  purpose: z.string().min(1, "Цель бронирования обязательна"),
});

type BookingSchema = z.infer<typeof bookingSchema>;

interface EquipmentBookingFormProps {
  equipmentId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EquipmentBookingForm = ({ equipmentId, setOpen }: EquipmentBookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      equipmentId,
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result = await createEquipmentBooking(
        { success: false, error: false },
        {
          equipmentId: formData.equipmentId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          purpose: formData.purpose,
        }
      );
      if (result.success) {
        toast("Оборудование успешно забронировано!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Произошла ошибка при бронировании!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Произошла ошибка!");
    }
  });

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">Забронировать оборудование</h2>
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
        label="Цель бронирования"
        type="textarea"
        name="purpose"
        register={register}
        error={errors.purpose}
      />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          Забронировать
        </button>
      </div>
    </form>
  );
};

export default EquipmentBookingForm; 