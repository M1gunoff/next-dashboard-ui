import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Lesson, Prisma, Student, Subject } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type AttendanceList = Attendance & {
  student: Student;
  lesson: Lesson & {
    subject: Subject;
    class: Class;
  };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Дата",
      accessor: "date",
    },
    {
      header: "Студент",
      accessor: "student",
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
      header: "Статус",
      accessor: "status",
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

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">
        {new Intl.DateTimeFormat("ru-RU").format(item.date)}
      </td>
      <td className="p-4">
        {item.student.name} {item.student.surname}
      </td>
      <td className="p-4">{item.lesson.subject.name}</td>
      <td className="p-4">{item.lesson.class.name}</td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            item.present
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.present ? "Присутствовал" : "Отсутствовал"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson = { classId: parseInt(value) } as Prisma.LessonWhereInput;
            break;
          case "subjectId":
            query.lesson = { subjectId: parseInt(value) } as Prisma.LessonWhereInput;
            break;
          case "date":
            const date = new Date(value);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            query.date = {
              gte: date,
              lt: nextDate,
            };
            break;
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { surname: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  if (role === "teacher") {
    query.lesson = {
      ...query.lesson,
      teacherId: currentUserId,
    } as Prisma.LessonWhereInput;
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        lesson: {
          include: {
            subject: {
              select: {
                name: true,
              },
            },
            class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Посещаемость
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="attendance" type="create" />
            )}
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

export default AttendanceListPage; 