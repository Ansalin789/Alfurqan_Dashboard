"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";

const TrailManagement = () => {
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); // Initialize router

  // Function to handle outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpenPopup(null);
    }
  };

  // Effect to add/remove event listener for outside clicks
  useEffect(() => {
    if (openPopup !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPopup]);

  // Function to handle view details click
  const handleViewDetails = () => {
    router.push(`/admin-main/ui/studentlist`); // Navigate to student details page
  };

  return (
    <div className="pt-3 mx-auto w-[1160px]">
      {/* Search & Filter Section */}
      <div className="flex justify-between items-center p-2">
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search here..."
            className="border rounded-lg px-2 py-1 text-[12px] shadow w-[200px]"
          />
          <button
            className="flex items-center bg-gray-200 px-3 py-1 rounded-lg shadow text-[12px]"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FaFilter className="mr-2" /> Filter
          </button>
        </div>

        {/* Duration Dropdown on the Right */}
        <div className="ml-auto">
          <select className="border rounded-lg px-2 py-1 shadow text-[12px]">
            <option>Duration: Last month</option>
            <option>Duration: Last week</option>
            <option>Duration: Last year</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-[1150px]">
        <table className="w-full table-auto bg-[#fff] rounded-lg shadow">
          <thead className="border-b border-[#1C3557] text-[11px] font-semibold">
            <tr className="bg-gray-100">
              <th className="p-3 text-center">Student ID</th>
              <th className="p-3 text-center">Date of Joining</th>
              <th className="p-3 text-center">Student Name</th>
              <th className="p-3 text-center">Teacher Name</th>
              <th className="p-3 text-center">Course Name</th>
              <th className="p-3 text-center">Contact</th>
              <th className="p-3 text-center">Scheduled Class</th>
              <th className="p-3 text-center">Level</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="border-b border-gray-200 relative">
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center text-gray-400">-</td>
                <td className="p-2 text-center">
                  <button
                    className="p-2 bg-[#1C3557] text-white rounded-full"
                    onClick={() => setOpenPopup(openPopup === index ? null : index)}
                  >
                          <FaEdit size={10} />
                  </button>

                  {/* Pop-up */}
                  {openPopup === index && (
                    <div
                      ref={popupRef}
                      className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-50 text-[12px]"
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleViewDetails()}
                      >
                        View Details
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                        Delete
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
  );
};

export default TrailManagement;
