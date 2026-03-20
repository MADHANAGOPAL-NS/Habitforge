import React from "react";
import { FaSearch, FaBell, FaStar, FaFire } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="h-20 bg-[#0B0F19] flex items-center justify-between px-8 border-b border-[#1e293b]">
      {/*Search*/}
      <div className="flex items-center bg-[#181F30] px-4 py-3 rounded-xl w-[400px]">
        <FaSearch className="text-gray-500 mr-3 text-sm"></FaSearch>
        <input 
          type="text" 
          placeholder="Search habits..." 
          className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
        />
      </div>

      {/*Right*/}
      <div className="flex items-center gap-8">
        {/* User Info & Stats */}
        <div className="flex flex-col items-end">
          <span className="text-white text-sm font-medium mb-1">Welcome, Madhan</span>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-yellow-500">
              <FaStar /> XP: 120
            </span>
            <span className="flex items-center gap-1 text-orange-500">
              <FaFire /> STREAK: 5
            </span>
          </div>
        </div>

        {/*Premium Button*/}
        <button className="bg-gradient-to-r from-purple-500 to-[#7C3AED] px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-500/20">
          🚀 Upgrade to Premium
          <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
            PRO
          </span>
        </button>

        {/*Bell*/}
        <div className="relative cursor-pointer">
          <FaBell className="text-gray-400 text-lg hover:text-white transition" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F19]"></div>
        </div>

        {/*Avatar*/}
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-yellow-100 to-yellow-600 p-[2px] cursor-pointer">
          <div className="flex items-center justify-center bg-[#242b3d] w-full h-full rounded-full">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhan" 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;