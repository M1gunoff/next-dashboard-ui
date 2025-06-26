"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookingTableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const BookingTableSearch = ({ value, onChange }: BookingTableSearchProps) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск бронирований..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default BookingTableSearch; 