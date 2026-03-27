import React, { useEffect, useState } from "react";
import axios from "axios";
import HabitItem from "./HabitItem";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const HabitList = ({ refreshDashboard, searchTerm }) => {
    const navigate = useNavigate();

    // ✅ STATES
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [icon, setIcon] = useState("🔥");
    const [color, setColor] = useState("orange");
    const [showInput, setShowInput] = useState(false);

    const colorMap = {
        blue: "bg-blue-900/40 text-blue-400",
        green: "bg-green-900/40 text-green-400",
        purple: "bg-purple-900/40 text-purple-400",
        orange: "bg-orange-900/40 text-orange-400",
        red: "bg-red-900/40 text-red-400",
        pink: "bg-pink-900/40 text-pink-400",
        yellow: "bg-yellow-900/40 text-yellow-400",
    };

    // ✅ DATE
    const today = new Date();
    const day = today.getDate();
    const month = today
        .toLocaleDateString("default", { month: "short" })
        .toUpperCase();

    // ✅ FETCH HABITS
    const fetchHabits = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5100/api/habits", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHabits(res.data);

        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // ✅ ADD HABIT
    const handleAddHabit = async () => {
        if (!newHabit.trim()) return;

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5100/api/habits", // Route is just '/' in backend
                { 
                    habitName: newHabit,
                    frequency: frequency,
                    icon: icon,
                    color: color
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNewHabit("");
            setFrequency("daily");
            setIcon("🔥");
            setColor("orange");
            setShowInput(false); // 🔥 hide input after adding
            fetchHabits();

            // Custom Notification
            Swal.fire({
                icon: "success",
                title: "Habit Saved",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                background: "#121623",
                color: "#fff",
                iconColor: "#4ADE80"
            });

        } catch (error) {
            console.error("Error adding habit:", error);
            
            if (error.response?.status === 403) {
                Swal.fire({
                    icon: "warning",
                    title: "Habit Limit Reached",
                    text: "Habit limit is only up to 5. Need to upgrade Premium to add more habits! 💎",
                    showCancelButton: true,
                    confirmButtonText: "Upgrade Now 🚀",
                    confirmButtonColor: "#8B5CF6",
                    cancelButtonColor: "#2A344A",
                    background: "#121623",
                    color: "#fff"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setShowInput(false);
                        navigate("/upgrade");
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to save habit!",
                    background: "#121623",
                    color: "#fff"
                });
            }
        }
    };

    return (
        <div className="bg-transparent mt-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">

                    <div className="bg-white text-black py-0.5 px-2 rounded flex flex-col items-center justify-center">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d32f2f]">
                            {month}
                        </span>
                        <span className="text-sm font-extrabold leading-tight">
                            {day}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-wide text-white">
                        Today's Habits
                    </h2>
                </div>
            </div>

            {/* Habit Items */}
            <div className="space-y-4">
                {habits.filter(habit => habit.habitName.toLowerCase().includes((searchTerm || "").toLowerCase())).length > 0 ? (
                    habits.filter(habit => habit.habitName.toLowerCase().includes((searchTerm || "").toLowerCase())).map((habit) => (
                        <HabitItem
                            key={habit._id}
                            id={habit._id}
                            title={habit.habitName}
                            streak={habit.streak || 0}
                            icon={habit.icon || "🔥"}
                            iconBg={colorMap[habit.color || "orange"]}
                            checked={habit.completedToday}
                            fetchHabits={fetchHabits}
                            refreshDashboard={refreshDashboard}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">
                        No habits found. Start adding one 🚀
                    </p>
                )}
            </div>

            {/* View More Global Log History */}
            {habits.length > 0 && (
                <div className="flex justify-center mt-5 mb-1">
                    <span 
                        onClick={() => navigate("/habits")}
                        className="text-sm text-blue-400 font-semibold cursor-pointer hover:text-blue-300 hover:underline transition tracking-wide"
                    >
                        View More History...
                    </span>
                </div>
            )}

            {/* ✅ ADD BUTTON */}
            <button
                onClick={() => setShowInput(true)}
                className="w-full mt-5 flex items-center justify-center gap-2 border border-dashed border-[#2A344A] text-gray-400 bg-[#121623]/30 hover:text-white hover:border-gray-500 py-4 rounded-2xl transition font-semibold text-sm tracking-wide"
            >
                <FaPlus />
                Add Habit
            </button>

            {/* ✅ ADD HABIT MODAL */}
            {showInput && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#121623] border border-[#2A344A] rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-white text-2xl font-bold mb-6 tracking-wide w-full text-center">Add New Habit</h2>
                        
                        <div className="w-full mb-4">
                            <label className="block text-gray-400 text-sm font-semibold mb-2">Habit Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Going to gym, Read 10 pages..."
                                value={newHabit}
                                onChange={(e) => setNewHabit(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddHabit();
                                }}
                                autoFocus
                                className="w-full bg-[#1A2035] border border-[#2A344A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#818CF8] shadow-inner transition"
                            />
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-gray-400 text-sm font-semibold mb-2">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full bg-[#1A2035] border border-[#2A344A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#818CF8] shadow-inner transition appearance-none cursor-pointer"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <div className="flex gap-4 w-full mb-8">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-semibold mb-2">Icon</label>
                                <select
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="w-full bg-[#1A2035] border border-[#2A344A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#818CF8] shadow-inner transition appearance-none cursor-pointer"
                                >
                                    <option value="🔥">🔥 Fire</option>
                                    <option value="💧">💧 Water</option>
                                    <option value="📚">📚 Book</option>
                                    <option value="🏃">🏃 Run</option>
                                    <option value="🧘">🧘 Meditate</option>
                                    <option value="💻">💻 Code</option>
                                    <option value="🥗">🥗 Eat</option>
                                    <option value="💤">💤 Sleep</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-semibold mb-2">Color</label>
                                <select
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full bg-[#1A2035] border border-[#2A344A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#818CF8] shadow-inner transition appearance-none cursor-pointer"
                                >
                                    <option value="orange">Orange</option>
                                    <option value="blue">Blue</option>
                                    <option value="green">Green</option>
                                    <option value="purple">Purple</option>
                                    <option value="red">Red</option>
                                    <option value="pink">Pink</option>
                                    <option value="yellow">Yellow</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full font-semibold tracking-wide">
                            <button 
                                onClick={() => {
                                    setShowInput(false);
                                    setNewHabit("");
                                    setFrequency("daily");
                                    setIcon("🔥");
                                    setColor("orange");
                                }}
                                className="flex-1 py-3 rounded-2xl border border-[#2A344A] text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#1A2035] transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddHabit}
                                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-[#7C3AED] hover:opacity-90 text-white shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2"
                            >
                                <FaPlus className="text-sm" /> Save Habit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HabitList;