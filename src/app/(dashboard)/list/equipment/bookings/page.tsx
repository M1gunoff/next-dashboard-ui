"use client";

import BookingPagination from "@/components/BookingPagination";
import Table from "@/components/Table";
import BookingTableSearch from "@/components/BookingTableSearch";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import BookingActions from "@/components/BookingActions";
import BookingModal from "@/components/BookingModal";
import { useQuery } from "@tanstack/react-query";

type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  equipment: {
    id: number;
    name: string;
    description: string | null;
  };
  bookedBy: {
    id: string;
    username: string;
  };
  status: string;
};

const BookingsPage = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  const columns = [
    {
      header: "Бронирование",
      accessor: "info",
    },
    {
      header: "ID",
      accessor: "id",
      className: "hidden md:table-cell",
    },
    {
      header: "Оборудование",
      accessor: "equipment",
    },
    {
      header: "Период",
      accessor: "period",
    },
    {
      header: "Статус",
      accessor: "status",
    },
    {
      header: "Действия",
      accessor: "action",
    },
  ];

  const renderRow = (item: Booking) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.equipment.name}</h3>
          <p className="text-xs text-gray-500">
            Забронировано: {item.bookedBy.username}
            <span className="block mt-1">{item.equipment.description}</span>
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.id}</td>
      <td>{item.equipment.name}</td>
      <td>
        {new Date(item.startTime).toLocaleDateString()} - {new Date(item.endTime).toLocaleDateString()}
      </td>
      <td>
        <span className={`px-2 py-1 rounded-full text-xs
          ${item.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
          ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${item.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {item.status === 'approved' && 'Подтверждено'}
          {item.status === 'pending' && 'Ожидание'}
          {item.status === 'rejected' && 'Отклонено'}
        </span>
      </td>
      <td>
        <BookingActions item={item} />
      </td>
    </tr>
  );

  const filteredBookings = bookings.filter(booking =>
    booking.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookedBy.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Бронирования</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <BookingTableSearch value={searchTerm} onChange={setSearchTerm}/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Фильтр" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Сортировка" width={14} height={14} />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
            >
              <Image src="/plus.png" alt="Добавить" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={paginatedBookings} 
      />

      {/* PAGINATION */}
      <BookingPagination 
        page={currentPage} 
        count={filteredBookings.length} 
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <BookingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingsPage; 