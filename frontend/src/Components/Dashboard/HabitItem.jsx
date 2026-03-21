import React from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import axios from "axios";

const HabitItem = ({ id, title, streak, icon, iconBg, checked, fetchHabits, refreshDashboard }) => {

  //local state for instant UI update initialized by backend logic
  const [completed, setCompleted] = React.useState(checked);

  React.useEffect(() => {
    setCompleted(checked);
  }, [checked]);

  const handleComplete = async () => {

    //prevent double click
    if (completed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5100/api/habits/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompleted(true);
      fetchHabits();       
      if (refreshDashboard) refreshDashboard(); 

    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  //Delete habit

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure want to delete this habit?");

    if(!confirmDelete) return;

    try{
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5100/api/habits/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

    fetchHabits();

    if(refreshDashboard) refreshDashboard();
    }

    catch(error){
      console.error("Error deleting habit: ", error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#121623] border border-[#1e293b] p-5 rounded-2xl hover:bg-[#1A1F30] transition cursor-pointer group">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${iconBg}`}>
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-[16px] tracking-wide text-white group-hover:text-gray-100 transition-colors">
            {title}
          </h3>
          <p className="text-orange-400 text-[13px] font-bold mt-1">
            {streak} days 🔥
          </p>
        </div>
      </div>

      {/* RIGHT (ACTIONS) */}
      <div className="flex items-center gap-4">
        {/* Completion Ring */}
        <div
          onClick={handleComplete}
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition cursor-pointer ${
            completed
              ? "bg-green-500 border-transparent"
              : "border-gray-600 hover:border-gray-400"
          }`}
        >
          {completed && <FaCheck className="text-[10px] text-white" />}
        </div>

        {/* Delete Button Container */}
        <div 
          onClick={(e) => { e.stopPropagation(); handleDelete(); }} 
          className="p-2 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition cursor-pointer"
          title="Delete Habit"
        >
          <FaTrash />
        </div>
      </div>
    </div>
  );
};

export default HabitItem;