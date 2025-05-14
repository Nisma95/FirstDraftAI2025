import React, { useState, useEffect } from "react";
import "./Calendar.scss";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Manage the current date

    // Get the first day of the month (Sunday = 0, Monday = 1, ...)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Get the number of days in the month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Navigate to the next month
    const nextMonth = () => {
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + 1); // Increment month
        setCurrentDate(nextMonthDate);
    };

    // Navigate to the previous month
    const prevMonth = () => {
        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(currentDate.getMonth() - 1); // Decrement month
        setCurrentDate(prevMonthDate);
    };

    // Get the current month and year
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Get first day of the month and total number of days
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    // Create an array of all the days in the month
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

    // Ensure 6 rows by adding empty cells if needed
    const totalCells = 42; // 6 rows * 7 days
    const emptyCells = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Sunday (or other start day)
    const remainingCells = totalCells - (days.length + emptyCells); // Remaining empty cells after the last day
    const paddedDays = [
        ...Array(emptyCells).fill(null), // Add empty cells before the first day
        ...days, // Add actual days
        ...Array(remainingCells).fill(null), // Add empty cells after the last day
    ];

    // Week days order (Set Sunday or Monday first, based on user preference)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg w-full sm:w-[80rem] justify-center items-center">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
                    Upcoming Schedule
                </h2>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-md border border-gray-200">
                    <button
                        onClick={prevMonth}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-200"
                    >
                        {/* Previous Month Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="m9.55 12l7.35 7.35q.375.375.363.875t-.388.875t-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675t-.15-.75t.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388t.375.875t-.375.875z"
                            />
                        </svg>
                    </button>

                    <span className="text-sm sm:text-lg font-semibold flex items-center gap-2">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                        })}{" "}
                        {year}
                    </span>

                    <button
                        onClick={nextMonth}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-200"
                    >
                        {/* Next Month Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                {/* Today Section */}
                <div className="col-span-1 flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                    <div className="flex flex-col justify-center items-center gap-y-5">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                            Today
                        </h1>
                        <div className="ToDayDiv">
                            <div className="Date text-lg sm:text-2xl">
                                {todayDate}
                            </div>
                            <div className="Weekday text-sm sm:text-lg">
                                {today.toLocaleString("default", {
                                    weekday: "long",
                                })}
                            </div>
                        </div>
                        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
                            {today.toLocaleString("default", { month: "long" })}
                        </p>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="col-span-1 sm:col-span-2 bg-white rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-2 CalendarGrid">
                        {/* Calendar Days Header */}
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 DayName"
                            >
                                {day}
                            </div>
                        ))}

                        {/* Calendar Days */}
                        {paddedDays.map((day, index) => (
                            <div
                                key={index}
                                className={`dateCell text-sm sm:text-base md:text-lg ${
                                    day === null ? "empty" : ""
                                } ${
                                    day === todayDate &&
                                    todayMonth === month &&
                                    todayYear === year
                                        ? "today"
                                        : ""
                                }`}
                            >
                                {day === null ? "" : day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
