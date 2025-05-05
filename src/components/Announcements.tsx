"use client"
import { FaBullhorn, FaBook, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';

const announcements = [
  {
    title: "Защита дипломных проектов",
    date: "15.06.2025",
    description: "График защиты дипломных проектов для студентов выпускных курсов будет опубликован 1 июня.",
    icon: <FaGraduationCap className="text-blue-600" />,
    bg: "bg-blue-50",
    tag: "Учебный процесс"
  },
  {
    title: "Изменения в расписании",
    date: "20.05.2025",
    description: "Внесены изменения в расписание занятий для 2-3 курсов факультета Информационных технологий.",
    icon: <FaCalendarAlt className="text-orange-600" />,
    bg: "bg-orange-50",
    tag: "Расписание"
  },
  {
    title: "Конкурс научных работ",
    date: "30.10.2025",
    description: "Принимаются заявки на ежегодный конкурс студенческих научных работ по техническим направлениям.",
    icon: <FaBook className="text-purple-600" />,
    bg: "bg-purple-50",
    tag: "Наука"
  }
];

const Announcements = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaBullhorn className="text-red-500" />
          Официальные объявления
        </h1>
        <span className="text-sm text-blue-600 cursor-pointer hover:underline">
          Все объявления →
        </span>
      </div>
      
      <div className="space-y-4">
        {announcements.map((item, index) => (
          <div 
            key={index} 
            className={`${item.bg} rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-xs transition-shadow`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="font-semibold text-gray-800">{item.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                <button className="mt-3 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Подробнее
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Московский Политех • Актуально на {new Date().toLocaleDateString('ru-RU')}
        </p>
      </div>
    </div>
  );
};

export default Announcements;