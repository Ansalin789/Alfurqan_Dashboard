"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";
import BaseLayout4 from "@/components/BaseLayout4";

const TrailManagement = () => {
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const students = [
    {
      id: 1,
      joinDate: "22/12/2025",
      name: "Janani",
      teacher: "David",
      course: "Arabic",
      contact: "98765432321",
      time: "10.00 AM",
      level: 2,
    },
    {
      id: 2,
      joinDate: "20/12/2025",
      name: "Ayesha",
      teacher: "Fatima",
      course: "Quran",
      contact: "9876543210",
      time: "11.30 AM",
      level: 3,
    },
    {
      id: 3,
      joinDate: "18/12/2025",
      name: "Zara",
      teacher: "Ahmed",
      course: "Arabic",
      contact: "9876501234",
      time: "9.00 AM",
      level: 1,
    },
    {
      id: 4,
      joinDate: "19/12/2025",
      name: "Imran",
      teacher: "Sameera",
      course: "Quran",
      contact: "9876512345",
      time: "2.00 PM",
      level: 2,
    },
    {
      id: 5,
      joinDate: "21/12/2025",
      name: "Sara",
      teacher: "Khalid",
      course: "Tajweed",
      contact: "9876523456",
      time: "4.30 PM",
      level: 1,
    },
    {
      id: 6,
      joinDate: "23/12/2025",
      name: "Yusuf",
      teacher: "Fatima",
      course: "Quran",
      contact: "9876534567",
      time: "5.00 PM",
      level: 3,
    },
    {
      id: 7,
      joinDate: "25/12/2025",
      name: "Amina",
      teacher: "David",
      course: "Arabic",
      contact: "9876545678",
      time: "6.00 PM",
      level: 2,
    },
    {
      id: 8,
      joinDate: "24/12/2025",
      name: "Bilal",
      teacher: "Khalid",
      course: "Tajweed",
      contact: "9876556789",
      time: "3.00 PM",
      level: 1,
    },
    {
      id: 9,
      joinDate: "26/12/2025",
      name: "Fatima",
      teacher: "Sameera",
      course: "Quran",
      contact: "9876567890",
      time: "7.30 PM",
      level: 2,
    },
    {
      id: 10,
      joinDate: "27/12/2025",
      name: "Hassan",
      teacher: "Ahmed",
      course: "Arabic",
      contact: "9876578901",
      time: "8.00 AM",
      level: 3,
    },
    {
        id: 11,
        joinDate: "27/12/2025",
        name: "Has",
        teacher: "Ahmen",
        course: "Arabic",
        contact: "9876578901",
        time: "8.00 AM",
        level: 3,
      },
      {
        id: 12,
        joinDate: "27/12/2025",
        name: "Has",
        teacher: "Ahm",
        course: "Arabic",
        contact: "9876578901",
        time: "8.00 AM",
        level: 3,
      },
      {
        id: 13,
        joinDate: "27/12/2025",
        name: "Has",
        teacher: "Ahmen",
        course: "Arabic",
        contact: "9876578901",
        time: "8.00 AM",
        level: 3,
      },
  ];
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudent = students.slice(startIndex, startIndex + itemsPerPage);
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpenPopup(null);
    }
  };

  useEffect(() => {
    if (openPopup !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPopup]);

  const handleViewDetails = () => {
    router.push(`/admin-main/ui/studentlist`);
  };

  return (
    <BaseLayout4>
      <div className="pt-3 mx-auto w-[1160px]">
      <div className="text-start">
    <h2 className="text-black text-[22px] font-semibold">Student Lists</h2>
  </div> <br/>
        {/* Search & Filter */}
        <div className="flex justify-between items-center  ">
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

          <div className="ml-auto">
            <select className="border rounded-lg px-2 py-1 shadow text-[12px]">
              <option>Duration: Last month</option>
              <option>Duration: Last week</option>
              <option>Duration: Last year</option>
            </select>
          </div>
        </div>
<br/>
        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
        <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-[11px]">
    <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
      <tr>
        <th className="p-3 py-5 font-semibold text-center">Student ID</th>
        <th className="p-3 py-5 font-semibold text-center">Date of Joining</th>
        <th className="p-3 py-5 font-semibold text-center">Student Name</th>
        <th className="p-3 py-5 font-semibold text-center">Teacher Name</th>
        <th className="p-3 py-5 font-semibold text-center">Course Name</th>
        <th className="p-3 py-5 font-semibold text-center">Contact</th>
        <th className="p-3 py-5 font-semibold text-center">Scheduled Class</th>
        <th className="p-3 py-5 font-semibold text-center">Level</th>
        <th className="p-3 py-5 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {students.length === 0 ? (
        <tr>
          <td colSpan={9} className="text-center py-4 text-gray-500 text-[11px]">
            No student records found.
          </td>
        </tr>
      ) : (
        paginatedStudent.map((student,index) => (
          <tr key={student.id} className={`text-[9px] font-medium mt-0 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}` }>
            <td className="p-2 text-center text-gray-900">{student.id}</td>
            <td className="p-2 text-center text-gray-900">{student.joinDate}</td>
            <td className="p-2 text-center text-gray-900">{student.name}</td>
            <td className="p-2 text-center text-gray-900">{student.teacher}</td>
            <td className="p-2 text-center text-gray-900">{student.course}</td>
            <td className="p-2 text-center text-gray-900">{student.contact}</td>
            <td className="p-2 text-center text-gray-900">{student.time}</td>
            <td className="p-2 text-center text-gray-900">{student.level}</td>
            <td className="p-2 text-center relative">
              <button
                className="p-2 bg-[#1C3557] text-white rounded-lg"
                onClick={() => setOpenPopup(openPopup === student.id ? null : student.id)}
              >
                <FaEdit size={10} />
              </button>

              {openPopup === student.id && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-50 text-[11px]"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={handleViewDetails}
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
        ))
      )}
    </tbody>
  </table>

  {/* Pagination Controls */}
  <div className="flex justify-between items-center p-2 mt-4 text-[11px] text-gray-600">
    <p>
      Showing {paginatedStudent.length} of {students.length} classes
    </p>
    <div className="flex gap-2">
      {Array.from({ length: Math.ceil(students.length / itemsPerPage) }, (_, i) => (
        <button
          key={i}
          className={`w-5 h-5 text-[11px] flex items-center justify-center rounded ${
            currentPage === i + 1
              ? "bg-[#1C3557] text-white"
              : "text-[#1C3557] border border-[#1C3557]"
          }`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
</div>

      </div>
    </BaseLayout4>
  );
};

export default TrailManagement;
