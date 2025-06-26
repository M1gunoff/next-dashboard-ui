"use client";

import { Dispatch, SetStateAction } from "react";

type BookingFormProps = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const BookingForm = ({ type, data, setOpen, relatedData }: BookingFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Тип ресурса
        </label>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="equipment">Оборудование</option>
          <option value="room">Помещение</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ресурс
        </label>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="">Выберите ресурс</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Дата начала
          </label>
          <input 
            type="date" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Дата окончания
          </label>
          <input 
            type="date" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Цель бронирования
        </label>
        <textarea 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-lamaYellow hover:bg-lamaYellow/90 rounded-md"
        >
          {type === "create" ? "Создать" : "Обновить"}
        </button>
      </div>
    </div>
  );
};

export default BookingForm; 