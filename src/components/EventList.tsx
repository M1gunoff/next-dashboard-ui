import prisma from "@/lib/prisma";
import { Event, Class } from "@prisma/client";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const today = new Date();
  
  // Получаем реальные данные из базы
  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      class: true,
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  if (data.length === 0) {
    return <div className="text-gray-400 text-center py-4">На сегодня мероприятий нет</div>;
  }

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
      {event.class && (
        <p className="mt-1 text-xs text-gray-500">Группа: {event.class.name}</p>
      )}
    </div>
  ));
};

export default EventList;