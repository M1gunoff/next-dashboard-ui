"use client";

import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Equipment } from "@prisma/client";

type EquipmentWithActions = Equipment & {
  actions?: React.ReactNode;
};

const ActionButtons = ({ item, onEdit, onDelete }: { 
  item: Equipment; 
  onEdit: (item: Equipment) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <FormModal
        table="equipment"
        type="update"
        data={item}
      />
      <button
        onClick={() => onDelete(item.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple hover:bg-lamaPurple/80 transition-colors"
      >
        <Image src="/delete.png" alt="Удалить" width={14} height={14} />
      </button>
    </div>
  );
};

const EquipmentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["equipment"],
    queryFn: async () => {
      const response = await fetch("/api/equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch equipment");
      }
      return response.json();
    },
  });

  const handleDeleteEquipment = async (id: number) => {
    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["equipment"] });
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredEquipment.slice(startIndex, endIndex);

  const columns = [
    { header: "ID", accessor: "equipmentId" },
    { header: "Название", accessor: "name" },
    { header: "Описание", accessor: "description" },
    { header: "Количество", accessor: "quantity" },
    { header: "Тип", accessor: "type" },
    { header: "Расположение", accessor: "location" },
    { header: "Действия", accessor: "actions" }
  ];

  const renderRow = (item: Equipment) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">{item.equipmentId}</td>
      <td className="p-4">{item.name}</td>
      <td className="p-4">{item.description || "-"}</td>
      <td className="p-4">{item.quantity}</td>
      <td className="p-4">{item.type}</td>
      <td className="p-4">{item.location}</td>
      <td className="p-4">
        <ActionButtons 
          item={item} 
          onEdit={() => {}}
          onDelete={handleDeleteEquipment}
        />
</td>
    </tr>
  );

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Оборудование</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormModal
              table="equipment"
              type="create"
              data={null}
            />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="mt-4 overflow-x-auto">
      <Table 
        columns={columns} 
          data={currentEquipment}
        renderRow={renderRow} 
      />
      </div>

      {/* PAGINATION */}
      <Pagination
        page={currentPage}
        count={totalPages}
      />
    </div>
  );
};

export default EquipmentPage;