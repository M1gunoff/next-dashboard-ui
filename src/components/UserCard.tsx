import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "project";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    project: { count: async () => 13 },
  };

  let data = 0;
  try {
    data = await modelMap[type].count();
  } catch (error) {
    console.error(`Ошибка подсчета ${type}:`, error);
  }

  const labels = {
    admin: "Администраторы",
    teacher: "Преподаватели",
    student: "Студенты",
    project: "Проекты",
  };

  const cardStyles = {
    admin: "bg-white border-l-4 border-blue-500",
    teacher: "bg-white border-l-4 border-red-500",
    student: "bg-white border-l-4 border-blue-500",
    project: "bg-white border-l-4 border-red-500",
  };

  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}/${currentYear + 1}`;

  return (
    <div className={`rounded-lg ${cardStyles[type]} p-4 flex-1 min-w-[150px] shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
          {academicYear}
        </span>
        <div className="w-6 h-6 relative opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/more.png"
            alt="Московский Политех"
            width={20}
            height={20}
          />
        </div>
      </div>
      <h1 className="text-2xl font-bold my-3 text-gray-800">{data.toLocaleString('ru-RU')}</h1>
      <h2 className="text-sm font-medium text-gray-600">
        {labels[type]}
      </h2>
    </div>
  );
};

export default UserCard;