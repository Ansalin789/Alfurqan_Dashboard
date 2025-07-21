"use client";
import React from "react";
import StudentsRecord from "../../components/studentrecord";
import BaseLayout4 from "@/components/BaseLayout4";
import TrailManagement from "../../components/studentlist";
import { useRouter } from "next/navigation";
import AdminHeader from "../../components/AdminHeader";

const Dashboard = () => {
  const router = useRouter();

  const handleView = () => {
    router.push("/admin-main/ui/studentlistviewall");
  };

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Student List" />

      <div className="min-h-screen w-full max-w-8xl mx-auto ">
        <div className=" p-2">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
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
              className="bg-transparent border border-[#576CBC] text-[#576CBC] text-[12px] px-4 py-2 rounded-md shadow transition"
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
