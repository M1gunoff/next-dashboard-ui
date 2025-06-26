import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
// import prisma from "@/lib/prisma";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  // Моки для расписания преподавателя
  const dummyData = [
    {
      title: "AI-Workshop",
      start: new Date(new Date().setHours(9, 0, 0, 0)),
      end: new Date(new Date().setHours(10, 30, 0, 0)),
    },
    {
      title: "Цифровая платформа поддержи проектного обучения",
      start: new Date(new Date().setHours(10, 40, 0, 0)),
      end: new Date(new Date().setHours(12, 10, 0, 0)),
    },
    {
      title: "Open Digital-Cash",
      start: new Date(new Date().setHours(12, 20, 0, 0)),
      end: new Date(new Date().setHours(13, 50, 0, 0)),
    },
  ];

  // // Получаем реальные данные из базы данных
  // const dataRes = await prisma.lesson.findMany({
  //   where: {
  //     ...(type === "teacherId"
  //       ? { teacherId: id as string }
  //       : { classId: id as number }),
  //   },
  //   include: {
  //     subject: true,
  //     class: true,
  //   },
  //   orderBy: {
  //     startTime: 'asc'
  //   }
  // });

  // const data = dataRes.map((lesson) => {
  //   const startTime = new Date(lesson.startTime);
  //   const endTime = new Date(lesson.endTime);
  //   const timeString = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  //   return {
  //     title: `${lesson.name} (${lesson.subject.name})`,
  //     start: lesson.startTime,
  //     end: lesson.endTime,
  //     class: lesson.class.name,
  //     time: timeString,
  //     fullTitle: `${lesson.name} (${lesson.subject.name}) - ${lesson.class.name} - ${timeString}`
  //   };
  // });

  const schedule = adjustScheduleToCurrentWeek(dummyData);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;