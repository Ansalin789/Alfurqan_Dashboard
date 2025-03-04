import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

// Define user interface
export interface User {
  _id: string;
  userName: string;
  email: string;
  role: string[];
  gender: "MALE" | "FEMALE";
  createdDate: string; // Store as string but convert when needed
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Teachers() {
  const [maleCount, setMaleCount] = useState<number>(0); // Male count for current month
  const [femaleCount, setFemaleCount] = useState<number>(0); // Female count for current month

  // Get current month index (0-11)
  const currentMonthIndex = new Date().getMonth();

  // Labels for X-axis (Only Current Month)
  const currentMonth = new Date().toLocaleString("default", { month: "short" }); // Example: "Feb"

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get("https://alfurqanacademy.tech/users", {
          params: { role: "TEACHER" },
        });

        const users: User[] = response.data.users;

        // Count male and female teachers for the current month
        let maleData = 0;
        let femaleData = 0;

        users.forEach((user) => {
          const monthIndex = new Date(user.createdDate).getMonth(); // Get month index (0-11)

          if (monthIndex === currentMonthIndex) {
            if (user.gender === "MALE") {
              maleData += 1;
            } else {
              femaleData += 1;
            }
          }
        });

        // Update state with current month’s counts
        setMaleCount(maleData);
        setFemaleCount(femaleData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeacherData();
  }, []);

  // Chart Data (Only Current Month)
  const data = {
    labels: [currentMonth], // Show only the current month
    datasets: [
      {
        label: "Male",
        data: [maleCount], // Show only current month’s Male count
        backgroundColor: "#6fd4ff",
        borderRadius: 6,
        barThickness: 11,
      },
      {
        label: "Female",
        data: [femaleCount], // Show only current month’s Female count
        backgroundColor: "#ff82f5",
        borderRadius: 6,
        barThickness: 11,
      },
    ],
  };

  // Chart Options (Keep Styling Intact)
  const options = {
    scales: {
      y: {
        display: false, // Hide Y-axis labels
        grid: { display: false }, // Remove background grid lines
      },
      x: {
        grid: { display: false }, // Remove background lines for X-axis
        ticks: {
          color: "white", // Set month text color
          font: { size: 12, weight: "normal" }, // Make font straight
        },
      },
    },
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: { enabled: true }, // Enable tooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { left: 10, right: 10, top: 20, bottom: 20 },
    },
  };

  return (
    <Link
      href="/Academic/manageTeachers"
      className="bg-[#3e68a1] p-4 py-3 rounded-[20px] shadow-xl"
    >
      <div className="col-span-12 bg-[#3e68a1]">
        <div className="flex justify-between items-center">
          <h3 className="text-[13px] font-medium text-white">Teachers</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-[#6fd4ff]"></div>
              <span className="text-white/60 text-[9px]">Male</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#ff82f5]"></div>
              <span className="text-white/60 text-[9px]">Female</span>
            </div>
          </div>
        </div>
        <div className="relative h-[120px] mt-10">
          <Bar data={data} options={options} />
        </div>
      </div>
    </Link>
  );
}
