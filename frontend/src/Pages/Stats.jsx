import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from "recharts";
import { FaChartLine, FaFireAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";
import Navbar from "../Components/Dashboard/Navbar";
import Sidebar from "../Components/Dashboard/Sidebar";

const Stats = () => {
    const [userData, setUserData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [completionData, setCompletionData] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [xpData, setXpData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch user data for sidebar/navbar AND fetch all Analytics Data simultaneously!
                const [userRes, completionRes, weeklyRes, xpRes] = await Promise.all([
                    axios.get("http://localhost:5100/api/users/dashboard", { headers }),
                    axios.get("http://localhost:5100/api/stats/completion-rate", { headers }),
                    axios.get("http://localhost:5100/api/stats/weekly-activity", { headers }),
                    axios.get("http://localhost:5100/api/stats/xp-growth", { headers })
                ]);

                setUserData(userRes.data);
                setCompletionData(completionRes.data);
                setWeeklyData(weeklyRes.data);
                setXpData(xpRes.data);
            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] text-purple-500">
                <FaSpinner className="animate-spin text-5xl" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0B0F19] font-sans overflow-hidden text-white">
            {/* Sidebar Injection */}
            <Sidebar
                userName={userData?.name}
                userPhoto={userData?.profilePicture}
                level={userData?.level}
                xp={userData?.xp}
            />

            <div className="flex-1 flex flex-col bg-[#0B0F19]">
                {/* Navbar Injection */}
                <Navbar
                    userName={userData?.name}
                    userPhoto={userData?.profilePicture}
                    xp={userData?.xp}
                    streak={userData?.streak}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    notifications={userData?.notifications || []}
                />

                {/* Analytics Main Scrolling Frame */}
                <div className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar relative">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3">
                                <FaChartLine className="text-purple-500" /> Analytics & Insights
                            </h1>
                            <p className="text-gray-400 mt-2 text-sm">Measure your progress and stay completely consistent.</p>
                        </div>

                        {/* Top Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Card 1: Completion Rate */}
                            <div className="bg-[#121623] border border-[#2A344A] p-6 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden group h-36">
                                <h3 className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">Today's Completion</h3>
                                <div className="flex items-end gap-3 z-10">
                                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                        {completionData?.completionRate || 0}%
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-2 font-medium z-10">
                                    You finished {completionData?.completedHabits || 0} out of {completionData?.totalhabits || 0} active habits seamlessly today.
                                </p>
                                <FaCheckCircle className="absolute -bottom-4 -right-4 text-8xl text-blue-500/5 transition-transform group-hover:scale-110" />
                            </div>

                            {/* Card 2: Total XP Gained */}
                            <div className="bg-[#121623] border border-[#2A344A] p-6 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden group h-36">
                                <h3 className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">Weekly XP Yield</h3>
                                <div className="flex items-end gap-3 z-10">
                                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                        {xpData.reduce((sum, item) => sum + item.xp, 0)} XP
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-2 font-medium z-10">
                                    Total XP physically accumulated dynamically since strictly Monday.
                                </p>
                                <FaFireAlt className="absolute -bottom-4 -right-4 text-8xl text-purple-500/5 transition-transform group-hover:scale-110" />
                            </div>

                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">

                            {/* Weekly Activity Chart */}
                            <div className="bg-[#121623] border border-[#2A344A] p-6 rounded-3xl shadow-2xl">
                                <h3 className="text-white text-lg font-bold mb-6 tracking-wide text-center">Weekly Activity Log</h3>
                                {weeklyData.some(d => d.count > 0) ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyData}>
                                                <XAxis dataKey="day" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#1A2035' }} contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #2A344A', borderRadius: '8px', color: '#fff' }} />
                                                <Bar dataKey="count" fill="url(#colorActivity)" radius={[6, 6, 0, 0]} />
                                                <defs>
                                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500 text-sm font-semibold tracking-wide border border-dashed border-[#2A344A] rounded-2xl">
                                        No activity captured this week.
                                    </div>
                                )}
                            </div>

                            {/* XP Growth Line Chart */}
                            <div className="bg-[#121623] border border-[#2A344A] p-6 rounded-3xl shadow-2xl">
                                <h3 className="text-white text-lg font-bold mb-6 tracking-wide text-center">XP Growth Curve</h3>
                                {xpData.some(d => d.xp > 0) ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={xpData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#2A344A" vertical={false} />
                                                <XAxis dataKey="date" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #2A344A', borderRadius: '8px', color: '#fff' }} />
                                                <Line type="monotone" dataKey="xp" stroke="#EC4899" strokeWidth={3} dot={{ r: 4, fill: '#EC4899' }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500 text-sm font-semibold tracking-wide border border-dashed border-[#2A344A] rounded-2xl">
                                        Zero XP physically mapped for the active week.
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
