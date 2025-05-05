"use client"
import Image from "next/image";
import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaChalkboardTeacher, FaFlask, FaLaptopCode, FaCarAlt } from 'react-icons/fa';

const events = [
  {
    id: 1, 
    title: "Защита проектов",
    time: "10:00 - 12:30",
    description: "Защита проектов по направлению 'Программная инженерия'. Прянишникова, Аудитория 4201.",
    icon: <FaLaptopCode className="text-blue-500" />
  },
  {
    id: 2, 
    title: "Научный семинар",
    time: "14:00 - 16:00",
    description: "Семинар 'Инновации в электромобилестроении'. Большая Семеновская, Корпус Н, ауд. 4302.",
    icon: <FaCarAlt className="text-green-500" />
  },
  {
    id: 3, 
    title: "Консультация",
    time: "16:30 - 18:00",
    description: "Консультация по курсовым работам (проф. Иванов А.А.). Автозаводская, Каб. 3205.",
    icon: <FaChalkboardTeacher className="text-orange-500" />
  }
];

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Календарь событий</h2>
      
      <div className="mb-6">
        <Calendar 
          onChange={onChange} 
          value={value}
          locale="ru-RU"
          className="border-gray-200 rounded-lg"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Ближайшие мероприятия</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Все события →
        </button>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <div
            className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
            key={event.id}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {event.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{event.title}</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {event.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Московский Политех • {new Date().getFullYear()} год
        </p>
      </div>
    </div>
  );
};

export default EventCalendar;