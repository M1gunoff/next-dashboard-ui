import Image from "next/image";

type UserCardProps = {
  type: "student" | "team" | "project" | "faculty";
  count: number;
};

const UserCard = ({ type, count }: UserCardProps) => {
  const cardStyles: Record<UserCardProps["type"], string> = {
    student: "bg-white border-l-4 border-blue-500",
    team: "bg-white border-l-4 border-red-500",
    project: "bg-white border-l-4 border-blue-500", 
    faculty: "bg-white border-l-4 border-red-500"
  };

  const typeNames: Record<UserCardProps["type"], string> = {
    student: "Студенты",
    team: "Команды",
    project: "Проекты",
    faculty: "Факультеты"
  };

  return (
    <div className={`rounded-lg ${cardStyles[type]} p-4 flex-1 min-w-[150px] shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
          2024/25
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
      <h1 className="text-2xl font-bold my-3 text-gray-800">{count.toLocaleString()}</h1>
      <h2 className="text-sm font-medium text-gray-600">
        {typeNames[type]}
      </h2>
    </div>
  );
};

export default UserCard;