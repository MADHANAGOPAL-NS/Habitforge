import React from "react";
import HabitItem from "./HabitItem";
import { FaPlus } from "react-icons/fa";

const HabitList = () => {

    //Dynamic Date Logic...

    const today = new Date();

    const day = today.getDate();

    const month = today.toLocaleDateString('default', {month: 'short'}).toUpperCase();
    const habits = [
        {title: "Drink Water", streak: 3, icon: "💧", iconBg: "bg-blue-900/40 text-blue-400", checked: true},
        {title: "Workout", streak: 5, icon: "🏋🏻‍♂️", iconBg: "bg-red-900/40 text-red-500", checked: true},
        {title: "Read 20 mins", streak: 2, icon: "📖", iconBg: "bg-purple-900/40 text-purple-400", checked: true}
    ];

    return (
        <div className="bg-transparent mt-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">

                    <div className="bg-white text-black py-0.5 px-2 rounded flex flex-col items-center justify-center">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d32f2f]">{month}</span>
                        <span className="text-sm font-extrabold leading-tight">{day}</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-wide text-white">Today's Habits</h2>
                </div>
                <span className="text-sm text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition">
                    View All
                </span>
            </div>

            {/* Habit Items */}
            <div className="space-y-4">
                {habits.map((habit, index) => (
                    <HabitItem
                        key={index}
                        title={habit.title}
                        streak={habit.streak}
                        icon={habit.icon}
                        iconBg={habit.iconBg}
                        checked={habit.checked}
                    />
                ))}
            </div>

            {/* Add Habit Button */}
            <button className="w-full mt-4 flex items-center justify-center gap-2 border border-dashed border-[#2A344A] py-4 rounded-2xl text-gray-400 hover:text-white hover:border-gray-500 transition font-semibold text-sm tracking-wide bg-[#121623]/30">
                <FaPlus /> Add Habit
            </button>
        </div>
    );
};

export default HabitList;