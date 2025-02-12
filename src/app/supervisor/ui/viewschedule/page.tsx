"use client";

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const ViewSchedule = () => {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

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

  return (
    <BaseLayout3>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-semibold text-gray-800">Live Classes</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4 w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Classes ({data.length})</h2>
          </div>

          {/* Table (No Borders) */}
          <div className="overflow-x-auto">
            <table className="table-auto min-w-full">
              <thead className="text-[12px] font-semibold ">
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
                      <span className={`px-3 py-1 text-white rounded-lg ${item.statusColor}`}>{item.status}</span>
                    </td>
                    {/* Three-Dot Menu */}
                    <td className="px-6 py-3 text-center relative">
                      <button className="text-gray-400" onClick={() => toggleMenu(index)}>
                        <HiOutlineDotsHorizontal size={20} className="text-[#717579]" />
                      </button>
                      {selectedMenu === index && (
                        <div className="absolute bg-white shadow-lg rounded-lg mt-1 right-0 w-32 z-10">
                          <button className="block w-full text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100">
                            View Details
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100">
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)}-{Math.min(currentPage * itemsPerPage, data.length)} of {data.length} records</p>
            <div className="flex space-x-2">
              <button
                className={`border px-3 py-1 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`border px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-900 text-white" : ""}`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={`border px-3 py-1 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default ViewSchedule;
