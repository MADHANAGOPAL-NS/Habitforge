import React from "react";
import { FaCheck } from "react-icons/fa";

const HabitItem = ({ title, streak, icon, iconBg, checked }) => {
  return (
    <div className="flex items-center justify-between bg-[#121623] border border-[#1e293b] p-5 rounded-2xl hover:bg-[#1A1F30] transition cursor-pointer group">
      
      {/* LEFT */}
      <div className="flex items-center gap-6">
        
        {/* Icon Circle */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${iconBg}`}>
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-[16px] tracking-wide text-white group-hover:text-gray-100 transition-colors">{title}</h3>
          <p className="text-orange-400 text-[13px] font-bold mt-1">{streak} days 🔥</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition ${checked ? "bg-[#1E293B] border-transparent" : "border-gray-600 group-hover:border-gray-500"}`}>
        {checked && <FaCheck className="text-[10px] text-gray-400" />}
      </div>
    </div>
  );
};

export default HabitItem;