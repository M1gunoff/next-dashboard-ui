"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';
import { FaProjectDiagram } from 'react-icons/fa';

// Цветовая палитра
const POLYTECH_COLORS = {
  primary: '#004D98',
  secondary: '#E30613', 
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#F5F5F5',
  accentBlue: '#007BFF',
  accentGreen: '#00A651' 
};

// Тип для данных проекта
type ProjectData = {
  name: string;
  value: number;
  color: string;
};

// Данные для диаграммы
const projectData: ProjectData[] = [
  { name: 'IT', value: 24, color: POLYTECH_COLORS.primary },
  { name: 'Дизайн', value: 12, color: POLYTECH_COLORS.secondary },
  { name: 'Мультимедиа', value: 8, color: '#3A5FCD' }, 
  { name: 'Научные', value: 18, color: POLYTECH_COLORS.accentGreen },
  { name: 'Технологии', value: 15, color: '#E30613A0' }, 
  { name: 'Транспорт', value: 22, color: '#004D98A0' }, 
];

// Кастомный Tooltip с правильными типами
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className={`bg-white p-3 shadow-md rounded-md border border-[${POLYTECH_COLORS.lightGray}] text-sm`}>
        <p className="font-semibold" style={{color: POLYTECH_COLORS.darkGray}}>
          {payload[0].name}
        </p>
        <p style={{color: POLYTECH_COLORS.mediumGray}}>
          {payload[0].value} проектов
        </p>
      </div>
    );
  }
  return null;
};

const ProjectStatsChart = () => {
  const totalProjects = projectData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border border-[${POLYTECH_COLORS.lightGray}] w-full max-w-[450px] mx-auto`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FaProjectDiagram 
            className="text-xl" 
            style={{color: POLYTECH_COLORS.primary}} 
          />
          <h2 
            className="text-lg font-bold" 
            style={{color: POLYTECH_COLORS.darkGray}}
          >
            Тематика проектов
          </h2>
        </div>
        <span 
          className="text-xs cursor-pointer hover:underline"
          style={{color: POLYTECH_COLORS.primary}}
        >
          Все проекты
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-full h-[160px] sm:h-[180px] mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
              >
                {projectData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2">
          {projectData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span 
                className="text-xs font-medium truncate"
                style={{color: POLYTECH_COLORS.darkGray}}
              >
                {item.name}
              </span>
              <span 
                className="text-xs font-semibold ml-auto bg-gray-100 px-1 rounded"
                style={{color: POLYTECH_COLORS.mediumGray}}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className="mt-4 pt-3 border-t flex flex-col sm:flex-row justify-between items-center gap-2"
        style={{borderColor: POLYTECH_COLORS.lightGray}}
      >
        <div className="text-xs" style={{color: POLYTECH_COLORS.mediumGray}}>
          <span className="font-medium">Всего проектов: </span>
          {totalProjects}
        </div>
        <div className="text-[10px]" style={{color: POLYTECH_COLORS.mediumGray}}>
          Московский Политех • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default ProjectStatsChart;