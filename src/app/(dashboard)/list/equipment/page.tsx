"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { SetStateAction, useState } from "react";

type Equipment = {
  id: number;
  equipmentId: string;
  name: string;
  type: string;
  status: 'available' | 'booked' | 'maintenance';
  location: string;
  bookedUntil?: string;
  bookedBy?: string;
  specifications?: string;
};

const equipmentData: Equipment[] = [
  {
    id: 1,
    equipmentId: "eq-001",
    name: "3D принтер Ultimaker S5",
    type: "Принтеры",
    status: "available",
    location: "Лаб. 301",
    specifications: "Точность печати 50 мкм, рабочая зона 330x240x300 мм"
  },
  {
    id: 2,
    equipmentId: "eq-002",
    name: "Электронный микроскоп EM-3000",
    type: "Лабораторное",
    status: "booked",
    location: "Лаб. 215",
    bookedUntil: "2023-12-15",
    bookedBy: "Иванов И.И.",
    specifications: "Увеличение до 300000x, разрешение 0.1 нм"
  },
  {
    id: 3,
    equipmentId: "eq-003",
    name: "Ноутбук Dell XPS 15",
    type: "Компьютеры",
    status: "available",
    location: "Каб. 108",
    specifications: "Intel Core i7, 32GB RAM, SSD 1TB, NVIDIA GTX 1650"
  },
  {
    id: 4,
    equipmentId: "eq-004",
    name: "Лазерный проектор Epson EB-1781W",
    type: "Аудио/Видео",
    status: "maintenance",
    location: "Ауд. 402",
    specifications: "Яркость 4000 люмен, разрешение WUXGA"
  },
  {
    id: 5,
    equipmentId: "eq-005",
    name: "Осциллограф Tektronix TBS2000",
    type: "Измерительное",
    status: "available",
    location: "Лаб. 210",
    specifications: "Полоса 200 МГц, 4 канала, частота дискретизации 2 Гвыб/с"
  },
  {
    id: 6,
    equipmentId: "eq-006",
    name: "Паяльная станция Hakko FX-888D",
    type: "Электроника",
    status: "available",
    location: "Лаб. 305",
    specifications: "Мощность 70 Вт, температура до 480°C"
  },
  {
    id: 7,
    equipmentId: "eq-007",
    name: "Сервер HP ProLiant DL380",
    type: "Серверное",
    status: "booked",
    location: "Серверная 101",
    bookedUntil: "2023-12-20",
    bookedBy: "Петров А.С.",
    specifications: "2x Xeon Gold, 256GB RAM, 8x 1TB SSD"
  },
  {
    id: 8,
    equipmentId: "eq-008",
    name: "3D сканер EinScan Pro 2X",
    type: "Сканеры",
    status: "available",
    location: "Лаб. 301",
    specifications: "Точность 0.04 мм, скорость сканирования 1.5 млн точек/сек"
  },
  {
    id: 9,
    equipmentId: "eq-009",
    name: "Графическая станция Wacom Cintiq 32",
    type: "Графика",
    status: "booked",
    location: "Каб. 205",
    bookedUntil: "2023-12-10",
    bookedBy: "Сидорова Е.К.",
    specifications: "4K разрешение, 8192 уровней нажатия пера"
  },
  {
    id: 10,
    equipmentId: "eq-010",
    name: "Робот-манипулятор UR10e",
    type: "Робототехника",
    status: "available",
    location: "Лаб. 410",
    specifications: "Грузоподъемность 10 кг, радиус действия 1300 мм"
  },
];

const EquipmentBookingPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (id: number, bookedUntil: string, bookedBy: string) => {
    setEquipment(equipment.map(item =>
      item.id === id 
        ? { ...item, status: 'booked', bookedUntil, bookedBy }
        : item
    ));
  };

  const handleCancelBooking = (id: number) => {
    setEquipment(equipment.map(item =>
      item.id === id 
        ? { ...item, status: 'available', bookedUntil: undefined, bookedBy: undefined }
        : item
    ));
  };

  const handleAddEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const newId = Math.max(...equipment.map(e => e.id)) + 1;
    setEquipment([...equipment, { ...newEquipment, id: newId }]);
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    setEquipment(equipment.map(item =>
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
  };

  const handleDeleteEquipment = (id: number) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const columns = [
    {
      header: "Оборудование",
      accessor: "info",
    },
    {
      header: "ID",
      accessor: "equipmentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Тип",
      accessor: "type",
    },
    {
      header: "Статус",
      accessor: "status",
    },
    {
      header: "Местоположение",
      accessor: "location",
      className: "hidden lg:table-cell",
    },
    {
      header: "Действия",
      accessor: "action",
    },
  ];

  const renderRow = (item: Equipment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">
            {item.status === 'booked' && `Забронировано до: ${item.bookedUntil}`}
            {item.status === 'maintenance' && 'На обслуживании'}
            {item.specifications && <span className="block mt-1">{item.specifications}</span>}
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.equipmentId}</td>
      <td>{item.type}</td>
      <td>
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'available' ? 'bg-green-100 text-green-800' :
          item.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status === 'available' ? 'Доступно' : 
           item.status === 'booked' ? 'Забронировано' : 'Обслуживание'}
        </span>
      </td>
      <td className="hidden lg:table-cell">{item.location}</td>
      <td>
  <div className="flex items-center gap-2">
    {/* Кнопка бронирования */}
    {item.status === 'available' && (
      <button 
        onClick={() => handleBook(item.id, '2023-12-31', 'Текущий пользователь')}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
      >
        <Image 
          src="/book_block.png" 
          alt="Забронировать" 
          width={16} 
          height={16}
          onError={(e) => {
            // Fallback если иконка не загрузится
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/default-icon.png';
          }}
        />
      </button>
    )}
    {role === "admin" && (
      <button 
        onClick={() => console.log('Edit', item.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Image 
          src="/edit.png" 
          alt="Редактировать" 
          width={14} 
          height={14}
        />
      </button>
    )}
    {role === "admin" && (
      <button 
        onClick={() => handleDeleteEquipment(item.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors"
      >
        <Image 
          src="/delete.png" 
          alt="Удалить" 
          width={14} 
          height={14}
        />
      </button>
    )}
  </div>
</td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Бронирование оборудования</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Фильтр" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Сортировка" width={14} height={14} />
            </button>
            {role === "admin" && (
              <button 
                onClick={() => console.log('Add new equipment')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
              >
                <Image src="/plus.png" alt="Добавить" width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredEquipment} 
      />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default EquipmentBookingPage;