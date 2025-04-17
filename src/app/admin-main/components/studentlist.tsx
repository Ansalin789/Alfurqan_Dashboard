"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";

const students = [
  {
    studentId: "STU001",
    dateOfJoining: "2024-01-15",
    studentName: "Amina Khan",
    teacherName: "Ustadh Ahmad",
    courseName: "Tajweed Basics",
    contact: "+91-9876543210",
    scheduledClass: "Mon, Wed, Fri - 5 PM",
    level: "Beginner",
  },
  {
    studentId: "STU002",
    dateOfJoining: "2024-02-10",
    studentName: "Zayd Rahman",
    teacherName: "Ustadha Fatima",
    courseName: "Quran Memorization",
    contact: "+91-9123456780",
    scheduledClass: "Tue, Thu - 6 PM",
    level: "Intermediate",
  },
  {
    studentId: "STU003",
    dateOfJoining: "2024-03-05",
    studentName: "Maryam Siddiqui",
    teacherName: "Ustadh Bilal",
    courseName: "Arabic Grammar",
    contact: "+91-9988776655",
    scheduledClass: "Sat, Sun - 4 PM",
    level: "Advanced",
  },
  {
    studentId: "STU004",
    dateOfJoining: "2024-01-25",
    studentName: "Ibrahim Ali",
    teacherName: "Ustadh Ahmad",
    courseName: "Tajweed Advanced",
    contact: "+91-9090909090",
    scheduledClass: "Mon to Fri - 7 AM",
    level: "Advanced",
  },
  {
    studentId: "STU005",
    dateOfJoining: "2024-02-28",
    studentName: "Fatima Noor",
    teacherName: "Ustadha Fatima",
    courseName: "Quran with Translation",
    contact: "+91-9876541230",
    scheduledClass: "Wed, Fri - 8 PM",
    level: "Beginner",
  },
];

const TrailManagement = () => {
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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

        {/* Duration Dropdown */}
        <div className="ml-auto">
          <select className="border rounded-lg px-2 py-1 shadow text-[12px]">
            <option>Duration: Last month</option>
            <option>Duration: Last week</option>
            <option>Duration: Last year</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
 <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
  <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-[11px]">
    <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
      <tr>
        <th className="p-3 py-5 font-semibold text-center">Student ID</th>
        <th className="p-3 py-5 font-semibold text-center">Date of Joining</th>
        <th className="p-3  py-5 font-semibold text-center">Student Name</th>
        <th className="p-3  py-5 font-semibold text-center">Teacher Name</th>
        <th className="p-3 py-5 font-semibold text-center">Course Name</th>
        <th className="p-3 py-5 font-semibold text-center">Contact</th>
        <th className="p-3 py-5 font-semibold text-center">Scheduled Class</th>
        <th className="p-3 py-5 font-semibold text-center">Level</th>
        <th className="p-3 py-5 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student ,index) => (
        <tr key={student.studentId} className={`text-[9px] font-medium mt-0 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}` }>
          <td className="p-2 text-center">{student.studentId}</td>
          <td className="p-2 text-center">{student.dateOfJoining}</td>
          <td className="p-2 text-center">{student.studentName}</td>
          <td className="p-2 text-center">{student.teacherName}</td>
          <td className="p-2 text-center">{student.courseName}</td>
          <td className="p-2 text-center">{student.contact}</td>
          <td className="p-2 text-center">{student.scheduledClass}</td>
          <td className="p-2 text-center">{student.level}</td>
          <td className="p-2 text-center">
            <button
              className="p-2 bg-[#1C3557] text-white rounded-lg"
              onClick={() =>
                setOpenPopup(openPopup === student.studentId ? null : student.studentId)
              }
            >
              <FaEdit size={10} />
            </button>

            {openPopup === student.studentId && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-50 text-xs"
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
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default TrailManagement;
