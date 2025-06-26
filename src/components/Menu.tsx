import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "МЕНЮ",
    items: [
      {
        icon: "/home.png",
        label: "Главная",
        href: "/",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/teacher.png",
        label: "Преподаватели",
        href: "/list/teachers",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Студенты",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Дисциплины",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Аудитории",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Расписание",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Экзамены",
        href: "/list/exams",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/assignment.png",
        label: "Задания",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/result.png",
        label: "Успеваемость",
        href: "/list/results",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/attendance.png",
        label: "Посещаемость",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/calendar.png",
        label: "События",
        href: "/list/events",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/announcement.png",
        label: "Объявления",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student"],
      },
    ],
  },
  {
    title: "ОБОРУДОВАНИЕ",
    items: [
      {
        icon: "/equipment.png",
        label: "Оборудование",
        href: "/list/equipment",
        visible: ["admin", "teacher", "student"],
        iconClass: "w-[27px] h-[27px] object-contain"
      },

      {
        icon: "/equipmentBooking.png",
        label: "Бронирование",
        href: "/list/equipment/bookings",
        visible: ["admin", "teacher", "student"],
        iconClass: "w-[27px] h-[27px] object-contain"
      },
    ],
  },
  {
    title: "ПРОФИЛЬ",
    items: [
      {
        icon: "/profile.png",
        label: "Профиль",
        href: "/profile",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/logout.png",
        label: "Выход",
        href: "/logout",
        visible: ["admin", "teacher", "student"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser()
  const role = user?.publicMetadata.role as string;
  const userId = user?.id;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
          {i.items.map(item => {
            // Модифицируем href для профиля в зависимости от роли
            const href = item.label === "Профиль" && role !== "admin" 
              ? `/list/${role === "teacher" ? "teachers" : "students"}/${userId}`
              : item.href;

            return item.visible.includes(role) && (
              <Link 
                href={href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image 
                  src={item.icon} 
                  alt="" 
                  width={20} 
                  height={20} 
                  className={item.iconClass || ""}
                />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu;
