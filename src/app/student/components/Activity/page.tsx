'use client';
import React from "react";
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
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov","Dec"],
    datasets: [
      {
        label: "Teaching Activity",
        data: [5, 10, 15, 20, 10, 15, 12, 18, 10, 8, 15, 20],
        borderColor: "#012A4A",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(54, 64, 96, 1)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBorderColor: "#012A4A",
        pointBackgroundColor: "white",
        pointRadius: 0,
        hoverRadius: 6,
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
        borderWidth: 2,
      },
    },
  };

  return (
    <div
      className="col-span-12 p-6 py-2 rounded-sm border-gray-950 -mt-3"
      style={{
        background: "linear-gradient(180deg, #FFFFFF, #F4F4F4)",
        height: "240px",
        border: "1px solid #979595",
        borderRadius: "15px",
      }}
    >
      <div className="flex items-center justify-between mb-2 border-black">
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
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <div style={{ height: "190px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TeachingActivity;