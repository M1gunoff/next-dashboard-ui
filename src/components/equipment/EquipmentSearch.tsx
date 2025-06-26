"use client";

import Image from "next/image";

type EquipmentSearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const EquipmentSearch = ({ value, onChange, placeholder = "Поиск по названию, типу или расположению..." }: EquipmentSearchProps) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-[300px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default EquipmentSearch; 