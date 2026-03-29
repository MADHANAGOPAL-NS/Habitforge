import React from "react";
import { FaFire } from "react-icons/fa";

const WelcomeCard = ({ userName, streak }) => {

  const getGreeting = () => {
    const hour = new Date().getHours();

    if(hour >= 5 && hour < 12) return "Good Morning";
    if(hour >= 12 && hour < 17) return "Good Afternoon";
    if(hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };
  return (
    <div className="relative bg-gradient-to-br from-[#1A1F30] to-[#121623] p-8 lg:p-10 lg:py-12 rounded-[32px] border border-[#2A344A] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 shadow-2xl overflow-hidden">

      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* LEFT */}
      <div className="relative z-10 text-center md:text-left w-full md:w-auto">
        <p className="text-gray-400 mb-2 text-base lg:text-lg">Welcome back,</p>

        <h1 className="text-3xl lg:text-[48px] font-bold leading-tight text-white tracking-tight">
          {getGreeting()},<br /> {userName || "User"}!
        </h1>
      </div>

      {/* RIGHT STREAK BOX */}
      <div className="bg-[#1C2030]/80 backdrop-blur-sm border border-[#2A344A] rounded-3xl p-6 lg:py-8 lg:px-10 text-center shadow-lg relative z-10 w-full md:w-auto md:mr-4">
        <p className="text-[10px] text-gray-500 font-bold mb-4 tracking-widest uppercase">CURRENT STREAK</p>
        <div className="flex justify-center items-end gap-2 text-orange-400">
          <h2 className="text-5xl lg:text-[56px] font-bold leading-none tracking-tighter">{streak || 0}</h2>
          <FaFire className="text-3xl lg:text-4xl mb-1 lg:mb-2" />
        </div>
        <p className="text-orange-400 text-lg lg:text-xl font-bold mt-2">Days</p>
      </div>
    </div>
  );
};

export default WelcomeCard;