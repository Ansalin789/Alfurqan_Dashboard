"use client";

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/navigation";

const ViewSchedule = () => {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const data = [
    { id: 798, name: "Samantha William", course: "Tajweed Masterclass", classType: "Trial Class", date: "January 2, 2020", status: "Ongoing class", statusColor: "bg-red-400" },
    { id: 799, name: "Jordan Nico", course: "Tajweed Masterclass", classType: "Trial Class", date: "January 2, 2020", status: "Starts at 7:30 AM", statusColor: "bg-blue-900" },
    { id: 800, name: "Nadila Adja", course: "Tajweed Masterclass", classType: "Group Class", date: "January 2, 2020", status: "Re-Schedule Requested", statusColor: "bg-green-300" },
    { id: 801, name: "Ayesha Khan", course: "Arabic Grammar", classType: "One-on-One", date: "January 3, 2020", status: "Completed", statusColor: "bg-gray-500" },
    { id: 802, name: "Mohammad Ali", course: "Islamic Studies", classType: "Group Class", date: "January 4, 2020", status: "Cancelled", statusColor: "bg-yellow-500" },
  ];

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleMenu = (index: number) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const handleLiveClassRedirect = () => {
    router.push("/supervisor/ui/liveclass");
  };

  const handleFeedbackRedirect = () => {
    router.push("/supervisor/ui/liveclass");
      localStorage.setItem('showfeedbackdirect',JSON.stringify(true));
  };

  return (
    <BaseLayout3>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-semibold text-gray-800">Live Classes</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4 w-full overflow-x-auto">
          <table className="table-auto min-w-full">
            <thead className="text-[12px] font-semibold">
              <tr>
                {["Id", "Name", "Courses", "Class", "Date", "Scheduled", "Options"].map((header) => (
                  <th key={header} className="px-6 py-3 text-center whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="text-[12px] font-medium">
                  <td className="px-6 py-3 text-center">{item.id}</td>
                  <td className="px-6 py-3 text-center">{item.name}</td>
                  <td className="px-6 py-3 text-center">{item.course}</td>
                  <td className="px-6 py-3 text-center">{item.classType}</td>
                  <td className="px-6 py-3 text-center">{item.date}</td>
                  <td className="px-6 py-3 text-center">
                    {item.status === "Ongoing class" ? (
                      <button
                        onClick={handleLiveClassRedirect}
                        className={`px-3 py-1 text-white rounded-lg ${item.statusColor} cursor-pointer hover:opacity-80`}
                      >
                        {item.status}
                      </button>
                    ) : (
                      <span className={`px-3 py-1 text-white rounded-lg ${item.statusColor}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center relative">
                    <button className="text-gray-400" onClick={() => toggleMenu(index)}>
                      <HiOutlineDotsHorizontal size={20} className="text-[#717579]" />
                    </button>
                    {selectedMenu === index && (
                      <div className="absolute bg-white shadow-lg rounded-lg mt-1 right-0 w-32 z-10">
                        <button
                          className="block w-full text-center px-4 py-2 text-sm text-[#223857] hover:bg-gray-100"
                          onClick={handleFeedbackRedirect}
                        >
                          Write Feedback
                        </button>
                        <button className="block w-full text-center px-4 py-2 text-sm text-[#223857] hover:bg-gray-100">
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default ViewSchedule;
