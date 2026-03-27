import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, AreaChart, Area
} from "recharts";

import CalendarHeatmap from 'react-calendar-heatmap';

import 'react-calendar-heatmap/dist/styles.css';

import { FaChartLine, FaFireAlt, FaCheckCircle, FaSpinner, FaGem, FaDownload, FaLock } from "react-icons/fa";

import Navbar from "../Components/Dashboard/Navbar";

import Sidebar from "../Components/Dashboard/Sidebar";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Stats = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [completionData, setCompletionData] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [xpData, setXpData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [consistencyData, setConsistencyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch basic data
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

                // Fetch Premium Data if user is premium
                if (userRes.data.isPremium) {
                    const [heatRes, consistRes] = await Promise.all([
                        axios.get("http://localhost:5100/api/premium/heatmap", { headers }),
                        axios.get("http://localhost:5100/api/premium/consistency-30", { headers })
                    ]);
                    setHeatmapData(heatRes.data.map(d => ({ date: d._id, count: d.count })));
                    setConsistencyData(consistRes.data.map(d => ({ date: d._id, count: d.count })));
                }

            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleExport = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Error", "Authentication failed. Please log in again.", "error");
            return;
        }
        try {
            const res = await axios.get("http://localhost:5100/api/premium/export", {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `habit_history_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire("Error", "Failed to export data. Please try again.", "error");
        }
    };

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
                    isPremium={userData?.isPremium}
                />

                {/* Analytics Main Scrolling Frame */}
                <div className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar relative">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3">
                                    <FaChartLine className="text-purple-500" /> Analytics & Insights
                                </h1>
                                <p className="text-gray-400 mt-2 text-sm">Measure your progress and stay completely consistent.</p>
                            </div>
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

                        {/* Premium Advanced Analytics Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FaGem className="text-purple-500" /> Advanced Analytics
                            </h2>

                            {!userData?.isPremium ? (
                                <div className="relative group bg-[#121623] border border-[#2A344A] p-12 rounded-[40px] overflow-hidden text-center shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                                            <FaLock className="text-3xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Detailed Heatmap & Exports</h3>
                                        <p className="text-gray-400 max-w-md mx-auto mb-8 font-medium">
                                            Visualize your last 90 days of progress with a detailed heatmap and export your entire data history.
                                        </p>
                                        <button
                                            onClick={() => navigate("/upgrade")}
                                            className="px-10 py-4 bg-purple-500 rounded-2xl font-bold hover:bg-purple-600 transition shadow-lg shadow-purple-500/30"
                                        >
                                            Unlock Premium Now
                                        </button>
                                    </div>
                                    {/* Mock background decorative elements to look like a blurred heatmap */}
                                    <div className="mt-8 grid grid-cols-7 gap-1 opacity-10 blur-[1px]">
                                        {[...Array(28)].map((_, i) => (
                                            <div key={i} className={`w-8 h-8 rounded-sm ${i % 3 === 0 ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* 30-Day Consistency Graph */}
                                    <div className="bg-[#121623] border border-[#2A344A] p-8 rounded-[40px] shadow-2xl">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-white text-lg font-bold">30-Day Consistency Trend</h3>
                                            <button
                                                onClick={handleExport}
                                                className="flex items-center gap-2 text-purple-400 hover:text-white transition font-bold text-sm bg-purple-500/10 px-4 py-2 rounded-xl"
                                            >
                                                <FaDownload /> Export My Data (CSV)
                                            </button>
                                        </div>
                                        {consistencyData.length > 0 ? (
                                            <div className="h-72">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={consistencyData}>
                                                        <defs>
                                                            <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A344A" vertical={false} />
                                                        <XAxis dataKey="date" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} axisLine={false} tickLine={false} />
                                                        <YAxis allowDecimals={false} stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #2A344A', borderRadius: '8px', color: '#fff' }} />
                                                        <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} fill="url(#colorConsistency)" dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="h-72 flex items-center justify-center text-gray-500 text-sm font-semibold tracking-wide border border-dashed border-[#2A344A] rounded-2xl">
                                                No consistency data yet. Complete habits to see your trend!
                                            </div>
                                        )}
                                    </div>

                                    {/* Consistency Heatmap */}
                                    <div className="bg-[#121623] border border-[#2A344A] p-8 rounded-[40px] shadow-2xl">
                                        <h3 className="text-white text-lg font-bold mb-8">Consistency Heatmap (Last 90 Days)</h3>
                                        <div className="heatmap-container">
                                            <CalendarHeatmap
                                                startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
                                                endDate={new Date()}
                                                values={heatmapData}
                                                classForValue={(value) => {
                                                    if (!value || value.count === 0) return 'fill-gray-800';
                                                    if (value.count >= 5) return 'fill-purple-300';
                                                    if (value.count >= 3) return 'fill-purple-500';
                                                    return 'fill-purple-700';
                                                }}
                                                tooltipDataAttrs={value => ({
                                                    'data-tip': `${value.date}: ${value.count} habits`
                                                })}
                                            />
                                        </div>
                                        <style>{`
                                            .react-calendar-heatmap .fill-gray-800 { fill: #1A2035; }
                                            .react-calendar-heatmap .fill-purple-700 { fill: #4C1D95; }
                                            .react-calendar-heatmap .fill-purple-500 { fill: #8B5CF6; }
                                            .react-calendar-heatmap .fill-purple-300 { fill: #C4B5FD; }
                                            .react-calendar-heatmap rect { rx: 4; ry: 4; }
                                        `}</style>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
