"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Equipment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import EquipmentForm from "@/components/forms/EquipmentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ActionsCell = ({ row }: { row: { original: Equipment } }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Редактировать
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              if (confirm("Вы уверены, что хотите удалить это оборудование?")) {
                deleteMutation.mutate(row.original.id);
              }
            }}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <EquipmentForm
          type="update"
          data={{
            id: row.original.id,
            equipmentId: row.original.equipmentId,
            name: row.original.name,
            description: row.original.description || "",
            quantity: row.original.quantity,
            type: row.original.type,
            location: row.original.location,
          }}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Equipment>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "description",
    header: "Описание",
  },
  {
    accessorKey: "quantity",
    header: "Количество",
  },
  {
    accessorKey: "type",
    header: "Тип",
  },
  {
    accessorKey: "location",
    header: "Расположение",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]; 