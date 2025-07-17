"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const InvoicesDueByDays = () => {
  const STATUS_COLORS = [
    { name: "Completed", color: "#B6C6F5" },
    { name: "Scheduled", color: "#6CA8F7" },
    { name: "No Response", color: "#A7D3F5" },
    { name: "Cancelled", color: "#C6E2F9" },
  ];
  const COLORS = ["#6CA8F7", "#B6C6F5", "#A7D3F5", "#C6E2F9"];
  const [dueData, setDueData] = useState({
    range_0_10: 0,
    range_11_20: 0,
    range_21_30: 0,
    range_30_plus: 0,
  });
  const doughnutData = {
    labels: ["0 to 10", "10 to 20", "20 to 30", "More than 30 Days"],
    datasets: [
      {
        data: [
          dueData.range_0_10,
          dueData.range_11_20,
          dueData.range_21_30,
          dueData.range_30_plus,
        ],
        backgroundColor: COLORS,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };
  const legendLabels = [
  { label: "0 to 10", color: COLORS[0] },
  { label: "10 to 20", color: COLORS[1] },
  { label: "20 to 30", color: COLORS[2] },
  { label: "More than 30 Days", color: COLORS[3] },
];

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;
    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const res = await fetch("https://api.blackstoneinfomaticstech.com/invoiceduebydates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setDueData(json.data);
      }
    } catch (err) {
      console.error("Error fetching invoiceduebydates", err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
  {/* Title aligned left */}
  <h3 className="text-[#181A20] text-base font-bold mb-4 self-start">Invoice Due by Days</h3>
  
  {/* Chart and legend centered */}
  <div className="flex flex-col items-center w-full">
    <div className="relative w-32 h-32 mb-6">
      <Doughnut data={doughnutData} options={doughnutOptions} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-extrabold text-[#181A20]">
          {Object.values(dueData).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)}
        </span>
      </div>
    </div>
    <div className="flex flex-col items-start gap-2">
      {legendLabels.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded  flex items-center justify-center">
            <span className="w-3 h-3 rounded " style={{ backgroundColor: color }} />
          </span>
          <span className="text-[#181A20] font-semibold text-xs">{label}</span>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default InvoicesDueByDays;