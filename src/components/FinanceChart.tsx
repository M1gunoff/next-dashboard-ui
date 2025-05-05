"use client"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

// Цветовая палитра
const POLYTECH_COLORS = {
  primary: '#004D98', 
  secondary: '#E30613', 
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#F5F5F5',
  accentBlue: '#007BFF',
  accentGreen: '#00A651',
  accentOrange: '#FF6D00'
};

// Тип для данных финансирования
type FinanceData = {
  month: string;
  budget: number;
  expenses: number;
  grants: number;
  equipment: number;
};

// Данные для графика
const projectFinanceData: FinanceData[] = [
  { 
    month: 'Сен',
    budget: 1200000,
    expenses: 850000,
    grants: 300000,
    equipment: 150000
  },
  { 
    month: 'Окт',
    budget: 1500000,
    expenses: 920000,
    grants: 450000,
    equipment: 180000
  },
  { 
    month: 'Ноя',
    budget: 1450000,
    expenses: 1100000,
    grants: 350000,
    equipment: 220000
  },
  { 
    month: 'Дек',
    budget: 1350000,
    expenses: 950000,
    grants: 400000,
    equipment: 175000
  },
  { 
    month: 'Янв',
    budget: 1600000,
    expenses: 1050000,
    grants: 550000,
    equipment: 250000
  },
  { 
    month: 'Фев',
    budget: 1700000,
    expenses: 1250000,
    grants: 600000,
    equipment: 300000
  },
];

// Типизированный CustomTooltip
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as FinanceData;
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border" style={{borderColor: POLYTECH_COLORS.lightGray}}>
        <h3 className="font-semibold" style={{color: POLYTECH_COLORS.primary}}>{data.month}</h3>
        <div className="space-y-2 mt-2">
          <p className="text-sm">
            <span className="font-medium" style={{color: POLYTECH_COLORS.darkGray}}>Бюджет:</span> 
            <span style={{color: POLYTECH_COLORS.primary}}> {data.budget.toLocaleString()} ₽</span>
          </p>
          <p className="text-sm">
            <span className="font-medium" style={{color: POLYTECH_COLORS.darkGray}}>Расходы:</span> 
            <span style={{color: POLYTECH_COLORS.secondary}}> {data.expenses.toLocaleString()} ₽</span>
          </p>
          <p className="text-sm">
            <span className="font-medium" style={{color: POLYTECH_COLORS.darkGray}}>Гранты:</span> 
            <span style={{color: POLYTECH_COLORS.accentGreen}}> {data.grants.toLocaleString()} ₽</span>
          </p>
          <p className="text-sm">
            <span className="font-medium" style={{color: POLYTECH_COLORS.darkGray}}>Оборудование:</span> 
            <span style={{color: POLYTECH_COLORS.accentOrange}}> {data.equipment.toLocaleString()} ₽</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ProjectFinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 border" style={{borderColor: POLYTECH_COLORS.lightGray}}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold" style={{color: POLYTECH_COLORS.darkGray}}>
          Финансы проектов
        </h1>
        <span 
          className="text-xs cursor-pointer hover:underline"
          style={{color: POLYTECH_COLORS.primary}}
        >
          Детализация
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={projectFinanceData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={POLYTECH_COLORS.lightGray} 
            vertical={false} 
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tick={{ fill: POLYTECH_COLORS.mediumGray, fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickFormatter={(value) => `${(value/1000).toFixed(0)} тыс`}
            tick={{ fill: POLYTECH_COLORS.mediumGray, fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            align="right"
            verticalAlign="top"
            iconSize={10}
            wrapperStyle={{ paddingBottom: 20 }}
            formatter={(value) => (
              <span style={{color: POLYTECH_COLORS.mediumGray, fontSize: '0.75rem'}}>
                {value}
              </span>
            )}
          />
          
          <Line 
            type="monotone" 
            dataKey="budget" 
            name="Общий бюджет"
            stroke={POLYTECH_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            name="Расходы"
            stroke={POLYTECH_COLORS.secondary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="grants" 
            name="Гранты"
            stroke={POLYTECH_COLORS.accentGreen}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="equipment" 
            name="Оборудование"
            stroke={POLYTECH_COLORS.accentOrange}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div 
        className="mt-4 pt-3 border-t text-xs"
        style={{borderColor: POLYTECH_COLORS.lightGray, color: POLYTECH_COLORS.mediumGray}}
      >
        <p>Московский Политех • Финансовый год 2024/25</p>
      </div>
    </div>
  );
};

export default ProjectFinanceChart;