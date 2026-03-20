import React from "react";
import { FaThLarge, FaTasks, FaMedal, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#0B0F19] h-screen p-5 flex flex-col justify-between border-r border-[#1e293b]">
      
      {/* TOP SECTION */}
      <div>
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#818CF8] mb-8 px-3 tracking-wide flex items-center gap-2">
          HabitForge
        </h1>

        {/* Level + Progress */}
        <div className="mb-8 px-3">
          <p className="text-xs text-gray-400 mb-2 font-semibold tracking-wider">LEVEL 24</p>
          
          <div className="h-1.5 bg-[#1A2035] rounded-full mb-2">
            <div className="h-1.5 w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-[10px] text-gray-500">1,240 XP to Level 25</p>
        </div>

        {/* Menu */}
        <ul className="space-y-2 text-gray-400 font-semibold text-sm tracking-wide">
          
          {/* Active */}
          <li className="flex items-center gap-4 bg-gradient-to-r from-[#202946] to-[#141A2E] text-white p-3 px-4 rounded-xl cursor-pointer border border-[#2A344A]">
            <FaThLarge className="text-lg" /> DASHBOARD
          </li>

          <li className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition">
            <FaTasks className="text-lg" /> HABITS
          </li>

          <li className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition">
            <FaMedal className="text-lg" /> BADGES
          </li>

          <li className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition">
            <FaChartBar className="text-lg" /> STATS
          </li>

          <li className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition">
            <FaCog className="text-lg" /> SETTINGS
          </li>
        </ul>
      </div>
    
      {/*Bottom Section*/}
      <div className="space-y-4 font-semibold text-sm tracking-wide">
        <div className="flex items-center gap-4 p-3 px-4 text-gray-500 cursor-pointer hover:text-white transition rounded-xl">
          <FaQuestionCircle className="text-lg" /> SUPPORT
        </div>
        <div className="flex items-center gap-4 p-3 px-4 text-red-500 cursor-pointer hover:bg-red-500/10 transition rounded-xl">
          <FaSignOutAlt className="text-lg" /> LOGOUT
        </div>
      </div>
    </div>
  );
};

export default Sidebar;