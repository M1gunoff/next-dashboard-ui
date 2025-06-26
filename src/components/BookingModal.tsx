"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
};

const BookingModal = ({ isOpen, onClose, booking }: BookingModalProps) => {
  const { user } = useUser();
  const bookedById = user?.id;
  const [startTime, setStartTime] = useState(booking?.startTime || "");
  const [endTime, setEndTime] = useState(booking?.endTime || "");
  const [equipmentId, setEquipmentId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: equipmentList = [], isLoading: isEquipmentLoading } = useQuery({
    queryKey: ["equipment-list"],
    queryFn: async () => {
      const res = await fetch("/api/equipment");
      if (!res.ok) throw new Error("Failed to fetch equipment");
      return res.json();
    },
    enabled: !booking, // Только для создания
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId,
          startTime,
          endTime,
          bookedById,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create booking");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings/${booking?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime,
          endTime,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (booking) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const filteredEquipment = equipmentList.filter((eq: any) => {
    if (!startTime || !endTime) return true;
    if (!eq.isBooked) return true;
    const bookedUntil = eq.bookedUntil ? new Date(eq.bookedUntil) : null;
    return bookedUntil && new Date(startTime) >= bookedUntil;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{booking ? "Редактировать бронирование" : "Новое бронирование"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!booking && (
            <div className="space-y-2">
              <label htmlFor="equipment" className="text-sm font-medium">Оборудование</label>
              <select
                id="equipment"
                value={equipmentId ?? ""}
                onChange={e => setEquipmentId(Number(e.target.value))}
                required
                className="w-full border rounded px-2 py-2"
                disabled={isEquipmentLoading}
              >
                <option value="" disabled>Выберите оборудование</option>
                {equipmentList.map((eq: any) => {
                  const isDisabled = startTime && endTime && eq.isBooked && new Date(startTime) < new Date(eq.bookedUntil);
                  return (
                    <option key={eq.id} value={eq.id} disabled={isDisabled}>
                      {eq.name} ({eq.type}){isDisabled ? ' — Занято' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium">Время начала</label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium">Время окончания</label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-400 text-white border-none"
            >
              {(createMutation.isPending || updateMutation.isPending)
                ? "Сохранение..."
                : booking ? "Сохранить" : "Забронировать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal; 