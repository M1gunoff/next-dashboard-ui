import Image from "next/image";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } }
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
    include: {
      class: true
    }
  });

  console.log('Announcements for role:', role, 'userId:', userId);
  console.log('Announcements data:', data);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Объявления</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 p-3 rounded-lg bg-gray-50"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(item.date).toLocaleDateString("ru-RU")}
              </span>
              {item.class && (
                <span className="text-xs text-gray-500">
                  {item.class.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;