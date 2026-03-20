import React from "react";

const StatsCard = () => {
  return (
    <div className="bg-[#121623] p-8 rounded-3xl border border-[#1e293b] shadow-lg flex flex-col items-center">
      
      <h2 className="text-[11px] font-bold text-gray-500 mb-8 tracking-[0.2em]">METABOLIC INTENSITY</h2>

      <div className="flex items-end justify-center gap-2 h-[120px] mb-2">
        <div className="w-2.5 bg-[#2A344A] h-[30px] rounded-full"></div>
        <div className="w-2.5 bg-[#818CF8] h-[50px] rounded-full"></div>
        <div className="w-2.5 bg-purple-400 h-[80px] rounded-full"></div>
        <div className="w-2.5 bg-orange-400 h-[110px] rounded-full shadow-[0_0_15px_rgba(251,146,60,0.4)]"></div>
        <div className="w-2.5 bg-[#818CF8] h-[75px] rounded-full"></div>
        <div className="w-2.5 bg-[#2A344A] h-[45px] rounded-full"></div>
        <div className="w-2.5 bg-[#1A2035] h-[25px] rounded-full"></div>
      </div>

    </div>
  );
};

export default StatsCard;