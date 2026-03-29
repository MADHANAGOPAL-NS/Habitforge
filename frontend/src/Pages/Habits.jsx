import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Habits = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://habitforge-3rb4.onrender.com/api/habits/all/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);

    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-8 text-white min-h-screen bg-[#0B0F19] relative">

      {/* Cross Button to leave page */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 right-6 lg:top-8 lg:right-8 bg-[#1A2035] hover:bg-[#2A344A] p-3 md:p-4 rounded-full text-gray-400 hover:text-white transition-all shadow-lg shadow-black/20 focus:outline-none"
      >
        <FaTimes className="text-xl" />
      </button>

      <h2 className="text-3xl font-bold mb-8 md:mt-0 mt-[1rem]">📅 Habit History</h2>

      {logs.length === 0 ? (
        <p className="text-gray-400">No history yet 🚀</p>
      ) : (
        <div className="space-y-4">

          {logs.map((log) => {
            const date = new Date(log.completedDate);

            return (
              <div
                key={log._id}
                className="bg-[#121623] p-5 rounded-2xl border border-[#1e293b] flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {log.habit?.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {date.toDateString()}
                  </p>
                </div>

                <span className="text-green-400 font-semibold">
                  ✔ Completed
                </span>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default Habits;
