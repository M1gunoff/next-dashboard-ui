"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "moment/locale/ru";

moment.locale("ru");
const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const messages = {
    allDay: "Весь день",
    previous: "Назад",
    next: "Вперед",
    today: "Сегодня",
    month: "Месяц",
    week: "Неделя",
    day: "День",
    agenda: "Расписание",
    date: "Дата",
    time: "Время",
    event: "Событие",
    work_week: "Учебная неделя",
    noEventsInRange: "Нет событий в этом диапазоне",
    showMore: (total: number) => `+ еще ${total}`,
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      messages={messages}
    />
  );
};

export default BigCalendar;