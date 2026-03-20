import React from "react";
import { FaMedal, FaRocket, FaAward, FaLock } from "react-icons/fa";

const BadgeCard = () => {
  return (
    <div className="bg-[#121623] p-8 rounded-3xl border border-[#1e293b] shadow-lg">
      
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
        <FaMedal className="text-purple-400 text-2xl" /> Recent Badges
      </h2>

      <div className="space-y-5">
        
        <div className="flex items-center gap-4 bg-transparent p-2 rounded-xl">
          <div className="w-[52px] h-[52px] bg-[#2D234A] rounded-2xl flex items-center justify-center text-2xl text-purple-400 shadow-inner">
            <FaRocket />
          </div>
          <div>
            <p className="font-bold text-white text-[16px]">Early Bird</p>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Wake up at 6am 5 days</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-transparent p-2 rounded-xl">
          <div className="w-[52px] h-[52px] bg-[#3D281E] rounded-2xl flex items-center justify-center text-2xl text-orange-400 shadow-inner">
            <FaAward />
          </div>
          <div>
            <p className="font-bold text-white text-[16px]">Streak Master</p>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Hit a 10-day streak</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-transparent p-2 rounded-xl opacity-60">
          <div className="w-[52px] h-[52px] bg-[#1A2035] rounded-2xl flex items-center justify-center text-2xl text-gray-500 shadow-inner">
            <FaLock />
          </div>
          <div>
            <p className="font-bold text-gray-400 text-[16px]">30-Day Warrior</p>
            <p className="text-[13px] text-gray-600 font-medium mt-0.5">Maintain habits for 1 month</p>
          </div>
        </div>

      </div>

      <button className="mt-8 w-full border border-[#2A344A] py-3 rounded-2xl hover:bg-[#1A2035] transition text-sm font-bold tracking-wide text-gray-300">
        View Trophy Room
      </button>
    </div>
  );
};

export default BadgeCard;