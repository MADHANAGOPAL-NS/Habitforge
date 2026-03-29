import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Dashboard/Navbar";
import WelcomeCard from "../Components/Dashboard/WelcomeCard";
import HabitList from "../Components/Dashboard/HabitList";
import BadgeCard from "../Components/Dashboard/BadgeCard";
import StatsCard from "../Components/Dashboard/StatsCard";

const Dashboard = () => {

    //Store full user data
    const [userData, setUserData] = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    //Fetch dashboard data
    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/api/users/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setUserData(res.data);
            if (res.data.profilePicture) {
                setUserPhoto(res.data.profilePicture);
            }
        } catch (error) {
            console.error("Dashboard fetch error: ", error);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleSetUserName = (newName) => {
        if (userData) {
            setUserData({ ...userData, name: newName });
        }
    };

    return (
        <div className="flex bg-[#0B0F19] text-white min-h-screen font-sans">
            <Sidebar
                userName={userData?.name || ""}
                setUserName={handleSetUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
                level={userData?.level}
                xp={userData?.xp}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar
                    userName={userData?.name}
                    userPhoto={userPhoto}
                    xp={userData?.xp}
                    streak={userData?.streak}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    notifications={userData?.notifications || []}
                    isPremium={userData?.isPremium === true}
                />

                <div className="flex-1 overflow-y-auto w-full">
                    <div className="flex flex-col xl:flex-row gap-8 p-4 md:p-8 max-w-[1600px] mx-auto">

                        {/* Left Main Content */}
                        <div className="flex-1">
                            <WelcomeCard userName={userData?.name} streak={userData?.streak} />
                            <HabitList searchTerm={searchTerm} refreshDashboard={fetchDashboard} />
                        </div>

                        {/* Right Sidebar Content */}
                        <div className="w-full xl:w-[380px] space-y-8 flex-shrink-0">
                            <BadgeCard badges={userData?.badges} />
                            <StatsCard
                                xp={userData?.xp}
                                level={userData?.level}
                                streak={userData?.streak}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
