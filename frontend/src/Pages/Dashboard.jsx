import React from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Dashboard/Navbar";
import WelcomeCard from "../Components/Dashboard/WelcomeCard";
import HabitList from "../Components/Dashboard/HabitList";
import BadgeCard from "../Components/Dashboard/BadgeCard";
import StatsCard from "../Components/Dashboard/StatsCard";

const Dashboard = () => {
    return (
        <div className="flex bg-[#0B0F19] text-white min-h-screen font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar />

                <div className="flex-1 overflow-y-auto w-full">
                    <div className="flex gap-8 p-8 max-w-[1600px] mx-auto">

                        {/* Left Main Content */}
                        <div className="flex-1">
                            <WelcomeCard />
                            <HabitList />
                        </div>

                        {/* Right Sidebar Content */}
                        <div className="w-[380px] space-y-8 flex-shrink-0">
                            <BadgeCard />
                            <StatsCard />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;