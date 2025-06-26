"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingPaginationProps {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const BookingPagination = ({
  page,
  count,
  onPageChange,
  itemsPerPage,
}: BookingPaginationProps) => {
  const totalPages = Math.ceil(count / itemsPerPage);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Показано {Math.min((page - 1) * itemsPerPage + 1, count)} -{" "}
        {Math.min(page * itemsPerPage, count)} из {count} записей
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          Страница {page} из {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BookingPagination; 