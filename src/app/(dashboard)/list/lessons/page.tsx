import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher;
};


const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

const { sessionClaims } = await auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;


const columns = [
  {
    header: "День",
    accessor: "day",
  },
  {
    header: "Время",
    accessor: "time",
  },
  {
    header: "Предмет",
    accessor: "subject",
  },
  {
    header: "Группа",
    accessor: "class",
  },
  {
    header: "Преподаватель",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Действия",
          accessor: "action",
        },
      ]
    : []),
];

const dayNames = {
  MONDAY: "Понедельник",
  TUESDAY: "Вторник",
  WEDNESDAY: "Среда",
  THURSDAY: "Четверг",
  FRIDAY: "Пятница",
  SATURDAY: "Суббота",
  SUNDAY: "Воскресенье",
};

const renderRow = (item: LessonList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="p-4">{dayNames[item.day as keyof typeof dayNames]}</td>
    <td className="p-4">
      {new Date(item.startTime).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
      -{" "}
      {new Date(item.endTime).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
    <td className="p-4">{item.subject.name}</td>
    <td className="p-4">{item.class.name}</td>
    <td className="hidden md:table-cell p-4">
      {item.teacher.name + " " + item.teacher.surname + (item.teacher.patronymic ? " " + item.teacher.patronymic : "")}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="lesson" type="update" data={item} />
            <FormContainer table="lesson" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value);
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { teacher: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true, patronymic: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Все занятия</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;