import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
// import prisma from "@/lib/prisma";

interface AttendanceData {
  date: Date;
  present: boolean;
}

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  // const resData = await prisma.attendance.findMany({
  //   where: {
  //     date: {
  //       gte: lastMonday,
  //     },
  //   },
  //   select: {
  //     date: true,
  //     present: true,
  //   },
  // });

  const data = [
    { name: "Пн", present: 8, absent: 2 },
    { name: "Вт", present: 9, absent: 1 },
    { name: "Ср", present: 7, absent: 3 },
    { name: "Чт", present: 10, absent: 0 },
    { name: "Пт", present: 6, absent: 4 },
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Посещаемость</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;