"use client"
import { FaRegCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    const role = localStorage.getItem('userRole') || 'admin';
    router.push(`/${role}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:gap-4 md:mb-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-base md:text-lg" />
          <span className="text-sm md:text-base">Назад</span>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Polytech ПД</h1>
      </div>

      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
          <div className="bg-blue-100 p-2 md:p-3 rounded-md md:rounded-lg">
            <span className="text-blue-600 font-bold text-base md:text-lg">IT</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold">Студенческая веб-студия «Polyweb»</h2>
            <p className="text-xs md:text-sm text-gray-600">Подпроект: Полигеймс + Барахолка</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <h3 className="font-medium text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
              <FaRegCalendarAlt className="text-gray-500 text-sm md:text-base" />
              <span>Аттестации текущий семестр</span>
            </h3>
            <div className="space-y-2 md:space-y-3">
              {[
                { label: "Первая аттестация", value: "15" },
                { label: "Вторая аттестация", value: "20" },
                { label: "Промежуточная", value: "25" }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-gray-50 p-2 md:p-3 rounded">
                  <span className="text-xs md:text-sm">{item.label}</span>
                  <span className="text-green-600 text-xs md:text-sm flex items-center gap-1">
                    <FaCheckCircle className="text-xs md:text-sm" /> {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <h3 className="font-medium text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-500 text-sm md:text-base" />
              <span>Прошлый семестр</span>
            </h3>
            <div className="space-y-2 md:space-y-3">
              {[
                { label: "Набрано баллов", value: "60", note: "(зачтено)" },
                { label: "Погашение долга", value: "0", note: null },
                { label: "Текущий семестр", value: "60", note: "(зачтено)" }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-gray-50 p-2 md:p-3 rounded">
                  <span className="text-xs md:text-sm">{item.label}</span>
                  <span className={`${item.value === "0" ? "text-gray-500" : "text-green-600"} text-xs md:text-sm flex items-center gap-1`}>
                    {item.value !== "0" && <FaCheckCircle className="text-xs md:text-sm" />} 
                    {item.value} {item.note && <span className="text-xs">{item.note}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
          <p className="text-xs md:text-sm text-gray-600">
            Куратор: <span className="font-medium">Евтихов В. Г.</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Регистрация на проекты 2024/25</h2>
        
        <div className="flex flex-col gap-1 mb-4 md:mb-6">
          {[
            { text: "28.06 – Публикация витрины проектов", color: "blue" },
            { text: "01.07–05.07 – Собеседования (приоритетные)", color: "orange" },
            { text: "08.07–12.07 – Запись на проекты", color: "green" }
          ].map((item) => (
            <div key={item.text} className={`flex items-center gap-2 md:gap-3 bg-${item.color}-50 p-2 md:p-3 rounded`}>
              <FaRegCalendarAlt className={`text-${item.color}-600 text-sm md:text-base`} />
              <span className="text-xs md:text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <h3 className="font-medium text-sm md:text-base mb-2 md:mb-3">📌 Этапы регистрации</h3>
            <ul className="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li>Знакомство с проектами с 28.06 (12:00)</li>
              <li>Осознанный выбор проекта (изменить нельзя!)</li>
              <li>Регистрация в ЛК → Проектная деятельность</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm md:text-base mb-2 md:mb-3">🏷 Приоритетные проекты</h3>
            <div className="bg-purple-50 p-3 md:p-4 rounded-md md:rounded-lg">
              <p className="text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                37 проектов по направлениям:
              </p>
              <ul className="list-disc pl-4 md:pl-5 columns-1 sm:columns-2 gap-x-4 md:gap-x-8 text-xs md:text-sm">
                <li className="mb-1">Электромобилестроение</li>
                <li className="mb-1">Технологии сенсорики</li>
                <li className="mb-1">Программное обеспечение</li>
                <li className="mb-1">Интеллектуальные системы</li>
                <li className="mb-1">Автоматизированное машиностроение</li>
              </ul>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-purple-600">
                * Требуется анкетирование 01.07–05.07
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm md:text-base mb-2 md:mb-3">📅 График по факультетам</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              {[
                { date: '08.07', faculties: 'Транспортный факультет' },
                { date: '09.07', faculties: 'Машиностроения' },
                { date: '10.07', faculties: 'Информационных технологий' },
                { date: '11.07', faculties: 'Урбанистики + Полиграфический + Химические технологии' },
                { date: '12.07', faculties: 'Экономики + Графики + Издательского дела' },
              ].map((item) => (
                <div key={item.date} className="flex items-start gap-2 md:gap-3 bg-gray-50 p-2 md:p-3 rounded">
                  <span className="font-medium text-xs md:text-sm min-w-[40px] md:min-w-[45px]">{item.date}</span>
                  <span className="text-xs md:text-sm text-gray-700">{item.faculties}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;