import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  position: string;
  department: string;
  subjects: string[];
  degree: string;
  address: string;
};

const columns = [
  {
    header: "Преподаватель",
    accessor: "info"
  },
  {
    header: "ID",
    accessor: "teacherId",
    className: "hidden md:table-cell"
  },
  {
    header: "Должность",
    accessor: "position",
    className: "hidden lg:table-cell"
  },
  {
    header: "Кафедра",
    accessor: "department"
  },
  {
    header: "Телефон",
    accessor: "phone",
    className: "hidden xl:table-cell"
  },
  {
    header: "Действия",
    accessor: "action"
  }
];

const TeacherListPage = () => {
  const renderRow = (item: Teacher) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <Image 
          src={item.photo} 
          alt="" 
          width={40} 
          height={40} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.degree}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden lg:table-cell">{item.position}</td>
      <td>{item.department}</td>
      <td className="hidden xl:table-cell">{item.phone}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="Просмотр" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Преподаватели Московского Политеха
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Фильтр" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Сортировка" width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormModal table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachersData} />
      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
};

export default TeacherListPage;