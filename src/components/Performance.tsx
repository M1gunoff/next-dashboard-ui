"use client";
import Image from "next/image";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Отличники", value: 35, fill: "#C3EBFA" },
  { name: "Хорошисты", value: 45, fill: "#FAE27C" },
  { name: "Троечники", value: 15, fill: "#FFB6C1" },
  { name: "Неуспевающие", value: 5, fill: "#FF6B6B" },
];

const Performance = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Успеваемость</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">4.2</h1>
        <p className="text-xs text-gray-500">средний балл</p>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-xs text-gray-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
