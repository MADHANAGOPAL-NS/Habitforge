import React, { useState } from "react";
import { FaSearch, FaBell, FaStar, FaFire, FaUserAlt, FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userName, userPhoto, xp, streak, searchTerm, setSearchTerm, notifications = [], isPremium }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-20 bg-[#0B0F19] flex items-center justify-between px-8 border-b border-[#1e293b]">
      {/*Search*/}
      <div className="flex items-center bg-[#181F30] px-4 py-3 rounded-xl w-[400px]">
        <FaSearch className="text-gray-500 mr-3 text-sm"></FaSearch>
        <input 
          type="text" 
          placeholder="Search habits..." 
          value = {searchTerm}
          onChange = {(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
        />
      </div>

      {/*Right*/}
      <div className="flex items-center gap-8">
        {/* User Info & Stats */}
        <div className="flex flex-col items-end">
          <span className="text-white text-sm font-medium mb-1">Welcome, {userName}</span>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-yellow-500">
              <FaStar /> XP: {xp || 0}
            </span>
            <span className="flex items-center gap-1 text-orange-500">
              <FaFire /> STREAK: {streak || 0}
            </span>
          </div>
        </div>

        {/*Premium Button*/}
        {!isPremium && (
          <button 
            onClick={() => navigate("/upgrade")}
            className="bg-gradient-to-r from-purple-500 to-[#7C3AED] px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-500/20"
          >
            <FaRocket className="text-xs" /> Upgrade to Premium
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
              PRO
            </span>
          </button>
        )}

        {/*Bell*/}
        <div className="relative">
          <div className="cursor-pointer relative" onClick={() => setShowDropdown(!showDropdown)}>
            <FaBell className="text-gray-400 text-lg hover:text-white transition" />
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F19] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            )}
          </div>
          
          {showDropdown && (
            <div className="absolute right-0 mt-4 w-[280px] bg-[#121623] border border-[#2A344A] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <h3 className="text-white text-[11px] font-bold px-5 py-3 border-b border-[#2A344A] tracking-widest text-gray-400 uppercase">
                Notifications
              </h3>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((msg, i) => (
                    <div key={i} className="px-5 py-4 text-[13px] font-semibold text-gray-300 hover:bg-[#1A2035] hover:text-white transition cursor-pointer border-b border-[#2A344A]/40 last:border-0 flex items-start gap-3">
                      <span className="mt-0.5">{msg.split(' ')[0]}</span>
                      <span>{msg.slice(msg.indexOf(' ') + 1)}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-xs font-semibold text-gray-500 text-center flex flex-col items-center gap-2">
                    <FaBell className="text-2xl text-[#2A344A]" />
                    All caught up!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/*Avatar*/}
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 p-[2px] cursor-pointer shadow-lg shadow-purple-500/30">
          <div className="flex items-center justify-center bg-[#1A2035] w-full h-full rounded-full overflow-hidden">
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <FaUserAlt className="text-gray-400 text-sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;