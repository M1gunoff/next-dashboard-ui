"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import BookingModal from "./BookingModal";
import { useUser } from "@clerk/nextjs";

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

type BookingActionsProps = {
  item: Booking;
};

const BookingActions = ({ item }: BookingActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите отменить бронирование?")) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleStatus = (status: "approved" | "rejected") => {
    statusMutation.mutate({ id: item.id, status });
  };

  return (
    <div className="flex items-center gap-2">
      {role?.toUpperCase() === "ADMIN" && item.status === "pending" && (
        <>
          <button
            onClick={() => handleStatus("approved")}
            className="px-2 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600"
            disabled={statusMutation.isPending}
          >
            Подтвердить
          </button>
          <button
            onClick={() => handleStatus("rejected")}
            className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
            disabled={statusMutation.isPending}
          >
            Отклонить
          </button>
        </>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple hover:bg-lamaPurple/80 transition-colors"
      >
        <Image src="/edit.png" alt="Редактировать" width={14} height={14} />
      </button>
      <button
        onClick={handleDelete}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple hover:bg-lamaPurple/80 transition-colors"
      >
        <Image src="/delete.png" alt="Удалить" width={14} height={14} />
      </button>
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={item}
        />
      )}
    </div>
  );
};

export default BookingActions; 