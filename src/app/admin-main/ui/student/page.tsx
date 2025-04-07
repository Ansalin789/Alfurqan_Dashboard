"use client";
import React from "react";
import StudentsRecord from "../../components/studentrecord";
import BaseLayout4 from "@/components/BaseLayout4";
import GaugeChart from "../../components/gender";
import TrailManagement from "../../components/studentlist";
import CountriesCard from "../../components/counteries";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleView = () => {
    router.push("/admin-main/ui/studentlistviewall");
  };

  return (
    <BaseLayout4>
      <div className="flex">
        <main className="flex-grow p-6">
          <h2 className="text-xl font-bold mb-6">Students List</h2>
          <div className="flex flex-wrap gap-6">
            <StudentsRecord />
            <GaugeChart />
            <CountriesCard />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <TrailManagement />
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-1 text-gray-600 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
              onClick={handleView}
            >
              View all
            </button>
          </div>
        </main>
      </div>
    </BaseLayout4>
  );
};

export default Dashboard;
