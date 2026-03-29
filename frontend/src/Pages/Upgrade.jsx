import React from "react";
import axios from "axios";
import { FaGem, FaCheck, FaChartLine, FaDownload, FaInfinity, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
    const navigate = useNavigate();
    const handleUpgrade = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://habitforge-3rb4.onrender.com/api/premium/upgrade", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Welcome to Premium!',
                text: 'You now have full access to all features.',
                confirmButtonColor: '#818CF8'
            }).then(() => window.location.href = "/dashboard");
        } catch (err) {
            Swal.fire("Error", "Upgrade failed. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 text-white font-sans">
            <div className="max-w-4xl w-full bg-[#121623] border border-[#2A344A] rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                {/* Close Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                >
                    <FaTimes className="text-xl" />
                </button>

                <div className="flex-1 p-12 bg-gradient-to-br from-[#1A2035] to-[#0B0F19]">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-400">
                        <FaGem className="text-3xl" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Go Premium.</h1>
                    <p className="text-gray-400 mb-8 text-lg">Master your habits with advanced tools and zero limits.</p>

                    <ul className="space-y-4">
                        {[
                            { icon: <FaInfinity />, text: "Unlimited Habits" },
                            { icon: <FaChartLine />, text: "Advanced Analytics & Heatmaps" },
                            { icon: <FaDownload />, text: "CSV Data Export" },
                            { icon: <FaCheck />, text: "Priority Support" }
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-gray-300">
                                <span className="text-purple-500">{item.icon}</span>
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full md:w-80 bg-purple-600 p-12 flex flex-col justify-center items-center text-center">
                    <p className="text-purple-200 uppercase tracking-widest text-xs font-bold mb-2">Lifetime Access</p>
                    <div className="text-6xl font-black mb-6">Rs.0<span className="text-xl opacity-50 font-normal">.00</span></div>
                    <p className="text-purple-100 mb-8 text-sm opacity-80">One-time payment for limited period (Demo Mode)</p>
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 bg-white text-purple-600 rounded-2xl font-bold hover:scale-105 transition shadow-xl"
                    >
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upgrade;
