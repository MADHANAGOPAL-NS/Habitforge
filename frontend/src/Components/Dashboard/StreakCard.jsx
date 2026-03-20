import React from "react";
import {FaFire} from "react-icons/fa";

const StreakCard = () => {

    return (
        <div className="bg-[#0E1424] p-6 rounded-xl flex flex-col items-center justify-center">
            <FaFire className="text-orange-400 text-3xl mb-2"></FaFire>

            <h2 className="text-xl font-bold">5 Days</h2>
            <p className="text-gray-400 text-sm">Current Streak</p>
        </div>
    );
};

export default StreakCard;