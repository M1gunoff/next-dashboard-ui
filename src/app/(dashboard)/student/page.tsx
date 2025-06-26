import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalendar";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
  const { userId } = await auth();

  let classItem = [];
  let classId = null;
  let className = "";
  try {
    classItem = await prisma.class.findMany({
      where: {
        students: { some: { id: userId! } },
      },
    });
    classId = classItem[0]?.id;
    className = classItem[0]?.name || "";
  } catch (e) {
    classId = null;
    className = "";
  }

  // Если класс не найден — показываем мок-расписание
  if (!classId) {
    const dummyData = [
      {
        title: 'Студенческая студия "Polyweb"',
        start: new Date(new Date().setHours(10, 40, 0, 0)),
        end: new Date(new Date().setHours(12, 10, 0, 0)),
      },
    ];
    return (
      <div className="p-4 flex gap-4 flex-col xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Расписание (пример)</h1>
            <BigCalendar data={dummyData} />
          </div>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <EventCalendarContainer searchParams={searchParams || {}} />
          <Announcements />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Расписание ({className})</h1>
          <BigCalendarContainer type="classId" id={classId} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams || {}} />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;