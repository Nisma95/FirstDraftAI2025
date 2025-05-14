import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ModeSwitcher() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300"
            style={{
                background: "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
                color: "#d4d3d3",
            }}
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
