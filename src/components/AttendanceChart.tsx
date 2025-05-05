"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TooltipProps } from 'recharts';

const POLYTECH_COLORS = {
  primary: '#004D98A0',
  secondary: '#E30613A0',
  darkGray: '#333333',
  lightGray: '#F5F5F5'
};

const applicationData = [
  { period: '2023 Q1', applications: 45, approved: 38 },
  { period: '2023 Q2', applications: 62, approved: 55 },
  { period: '2023 Q3', applications: 58, approved: 52 },
  { period: '2023 Q4', applications: 71, approved: 63 },
  { period: '2024 Q1', applications: 68, approved: 60 },
];

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    payload: {
      period: string;
      applications: number;
      approved: number;
    };
    value: number;
    name: string;
    color: string;
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-semibold text-gray-800">{payload[0].payload.period}</p>
        <p className="text-sm text-blue-800">Подано: {payload[0].value}</p>
        <p className="text-sm text-red-800">Одобрено: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const ApplicationChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Динамика подачи заявок</h1>
        <span className="text-xs text-blue-800 cursor-pointer hover:underline">
          Подробнее
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={applicationData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            axisLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            axisLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            align="right" 
            verticalAlign="top" 
            iconSize={10}
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
          <Bar 
            dataKey="applications" 
            name="Подано заявок"
            fill={POLYTECH_COLORS.primary}
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
          <Bar 
            dataKey="approved" 
            name="Одобрено"
            fill={POLYTECH_COLORS.secondary}
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ApplicationChart;