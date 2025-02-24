"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  ChartOptions,
  TooltipItem
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const TeachingActivity = () => {
  const [chartData, setChartData] = useState<number[]>(new Array(12).fill(0)); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeachingActivity = async () => {
      try {
        const response = await fetch("http://localhost:5001/classShedule/activity");
        const result = await response.json();

        if (!result || !result.classSchedule) {
          console.warn("No class schedule data received.");
          return;
        }

        // Extract total hours per month
        const monthlyData = new Array(12).fill(0); 

        result.classSchedule.forEach((schedule: any) => {
          const startDate = new Date(schedule.startDate);
          const monthIndex = startDate.getMonth(); 
          monthlyData[monthIndex] += schedule.totalHourse || 0;
        });

        setChartData(monthlyData);
      } catch (error) {
        console.error("Error fetching teaching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachingActivity();
  }, []);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov","Dec"],
    datasets: [
      {
        label: "Teaching Activity",
        data: chartData,        
        borderColor: "#ffffff",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "#536680");
          gradient.addColorStop(1, "#FEFEFE");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBorderColor: "#012A4A",
        pointBackgroundColor: "white",
        pointRadius: 0,
        hoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        usePointStyle: true,
        callbacks: {
          title: function() {
            return 'April 30, 2024';
          },
          label: function(context: TooltipItem<'line'>) {
            if (context.raw && typeof context.raw === 'number') {
              return `${context.raw * 6} Hours`;
            }
            return '';
          },
        },
        displayColors: false,
        backgroundColor: "white",
        titleColor: "#FF5C5C",
        bodyColor: "#333",
        borderWidth: 1,
        borderColor: "#FF5C5C",
        padding: 10,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        caretPadding: 10,
        caretSize: 6,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 0,
        max: 20,
        ticks: {
          stepSize: 5,
          color: "#333",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#E0E0E0",
          borderDash: [5, 5],
          drawBorder: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2, // Line thickness
      },
    },
  };

  return (
    <div
      className="col-span-12 p-6 py-2 rounded-sm -mt-3"
      style={{
        background: "linear-gradient(180deg, #FFFFFF, #F4F4F4)",
        height: "240px",
        border: "1px solid #c8c8c8",
        borderRadius: "15px",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2
          className="text-[16px] font-semibold text-gray-700"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          Teaching Activity
        </h2>
        <select
          className="p-1 border border-gray-300 rounded-md text-[10px] text-gray-600"
          defaultValue="monthly"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly" className="hidden">Weekly</option>
        </select>
      </div>
      <div style={{ height: "190px" }}>
        {loading ? <p className="text-center">Loading...</p> : <Line data={data} options={options} />}
      </div>
    </div>
  );
};

export default TeachingActivity;
