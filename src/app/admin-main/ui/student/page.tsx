"use client";
import React from "react";
import StudentsRecord from "../../components/studentrecord";
import BaseLayout4 from "@/components/BaseLayout4";
import TrailManagement from "../../components/studentlist";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleView = () => {
    router.push("/admin-main/ui/studentlistviewall");
  };

  return (
    <BaseLayout4>
<div className=" sm:p-1 md:p-3 min-h-screen w-full max-w-8xl mx-auto ">
  <div className=" px-5">
    <h2 className="text-xl font-bold mb-4">Students List</h2>

    <div className="mb-4">
      <div className="flex flex-wrap gap-6 ml-2">
        <StudentsRecord />
      </div>
    </div>

    <div className="mb-2">
      <div className="flex flex-wrap gap-4">
        <TrailManagement />
      </div>
    </div>

    <div className="flex justify-end">
      <button
        className="text-white text-xs bg-[#223857] cursor-pointer rounded-md px-2 py-1 mr-3"
        onClick={handleView}
      >
        View all
      </button>
    </div>
    </div>
</div>

    </BaseLayout4>
  );
};

export default Dashboard;
