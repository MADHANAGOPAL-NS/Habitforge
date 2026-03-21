import React from "react";
import { FaMedal, FaRocket, FaAward, FaLock } from "react-icons/fa";

const BadgeCard = ({badges}) => {

  //badge mapping from backend

  const badge_map = {
    "3_day": {
      title: "3 Day Streak",
      desc: "Completed 3 days in a row",
      icon: <FaRocket></FaRocket>,
      bg: "bg-[#2D234A]",
      color: "text-purple-400"
    },

    "7_day": {
      title: "Streak Master",
      desc: "Hit a 7-day streak",
      icon: <FaAward></FaAward>,
      bg: "bg-[#3D281E]",
      color: "text-orange-400"
    },

    "30_day": {
      title: "30-Day Warrior",
      desc: "Maintains habits for 1 month",
      icon: <FaAward></FaAward>,
      bg: "bg-[#1A2035]",
      color: "text-gray-400"
    },
  };
  
   return (
    <div className="bg-[#121623] p-8 rounded-3xl border border-[#1e293b] shadow-lg">
      
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
        <FaMedal className="text-purple-400 text-2xl" /> Recent Badges
      </h2>

      <div className="space-y-5">

        {/* ✅ Dynamic Badges */}
        {badges && badges.length > 0 ? (
          badges.map((badge, index) => {
            const data = badge_map[badge];

            return (
              <div key={index} className="flex items-center gap-4 bg-transparent p-2 rounded-xl">
                
                <div className={`w-[52px] h-[52px] ${data?.bg} rounded-2xl flex items-center justify-center text-2xl ${data?.color} shadow-inner`}>
                  {data?.icon}
                </div>

                <div>
                  <p className="font-bold text-white text-[16px]">
                    {data?.title || badge}
                  </p>
                  <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                    {data?.desc || "Achievement unlocked"}
                  </p>
                </div>

              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm">No badges yet</p>
        )}

        {/* 🔒 Locked badge (always show) */}
        <div className="flex items-center gap-4 bg-transparent p-2 rounded-xl opacity-60">
          <div className="w-[52px] h-[52px] bg-[#1A2035] rounded-2xl flex items-center justify-center text-2xl text-gray-500 shadow-inner">
            <FaLock />
          </div>
          <div>
            <p className="font-bold text-gray-400 text-[16px]">30-Day Warrior</p>
            <p className="text-[13px] text-gray-600 font-medium mt-0.5">
              Maintain habits for 1 month
            </p>
          </div>
        </div>

      </div>

      
    </div>
  );
};

export default BadgeCard;