import { ReactNode } from "react";

type Column = {
  header: string;
  accessor: string;
  className?: string;
};

type EquipmentTableProps = {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
};

const EquipmentTable = ({ data, columns, onEdit, onDelete }: EquipmentTableProps) => {
  const renderCell = (item: any, accessor: string) => {
    if (accessor === "isBooked") {
      return item[accessor] ? "Забронировано" : "Доступно";
    }
    if (accessor === "bookedUntil" && item[accessor]) {
      return new Date(item[accessor]).toLocaleDateString();
    }
    return item[accessor];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    column.className || ""
                  }`}
                >
                  {renderCell(item, column.accessor)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Редактировать
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable; 