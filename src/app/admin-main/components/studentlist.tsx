"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";
import axios from "axios";

export interface StudentInfo {
  studentId: string;
  studentEmail: string;
  studentPhone: number;
  gender: string;
  package: string;
}

export interface Student {
  _id: string;
  student: StudentInfo;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string; // use Date if you plan to parse it
  createdBy: string;
  updatedDate: string; // use Date if you plan to parse it
  __v: number;
  classScheduleCount: number;
  level: number;

}

export interface StudentsResponse {
  students: Student[];
}



const TrailManagement = () => {
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://alfurqanacademy.tech/alstudents');
  
        // Remove duplicates based on studentId
        const uniqueStudentsMap = new Map();
        response.data.students.forEach((student: Student) => {
          uniqueStudentsMap.set(student.student.studentId, student);
        });
  
        const uniqueStudents = Array.from(uniqueStudentsMap.values());
  
        const sorted = uniqueStudents.sort((a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
  
        setStudents(sorted.slice(0, 5)); // Most recent 5 students
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
  
    fetchStudents();
  }, []);
  
  
  
  const [searchText, setSearchText] = useState('');
  const [duration, setDuration] = useState('Last month');
  const [filteredStudents, setFilteredStudents] = useState(students);

  // Search and filter logic
  useEffect(() => {
    let filtered = students;
  
    if (searchText) {
      filtered = filtered.filter((studentId) =>
        studentId.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        studentId.student?.studentEmail?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  
    if (duration === 'Last week') {
      filtered = filtered.filter((s) => new Date(s.createdDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    } else if (duration === 'Last month') {
      filtered = filtered.filter((s) => new Date(s.createdDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    } else if (duration === 'Last year') {
      filtered = filtered.filter((s) => new Date(s.createdDate) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
    }
  
    setFilteredStudents(filtered);
  }, [searchText, duration, students]);




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

  const handleViewDetails = (studentId : string) => {
    router.push(`/admin-main/ui/studentlist?studentId=${studentId}`);
  };

  return (
    <div className="pt-3 mx-auto w-full mt-1">
      {/* Search & Filter Section */}
      <div className="flex justify-between items-center p-2 ">
        <div className="flex space-x-4 items-center">
        <input
  type="text"
  placeholder="Search here..."
  className="border rounded-lg px-2 py-1 text-[12px] shadow w-[200px]"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
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
        <select
  className="border rounded-lg px-2 py-1 shadow text-[12px]"
  value={duration}
  onChange={(e) => setDuration(e.target.value)}
>
  <option value="Last month">Duration: Last month</option>
  <option value="Last week">Duration: Last week</option>
  <option value="Last year">Duration: Last year</option>
</select>

        </div>
      </div>

      {/* Table Section */}
 <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
  <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-[11px]">
    <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold ">
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
      {students.map((student, index) => (
        <tr key={student.student.studentId} className={`text-[9px] font-medium mt-0 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}>
        <td className="p-2 text-center text-gray-900">{student._id}</td>
        <td className="p-2 text-center text-gray-900">{new Date(student.createdDate).toLocaleDateString()}</td>
        <td className="p-2 text-center text-gray-900">{student.username}</td>
        <td className="p-2 text-center text-gray-900">{student.createdBy}</td>
        <td className="p-2 text-center text-gray-900">{student.student.package}</td>
        <td className="p-2 text-center text-gray-900">{student.student.studentPhone}</td>
        <td className="p-2 text-center text-gray-900">{student.classScheduleCount}</td>
        <td className="p-2 text-center text-gray-900">{student.level}</td>
      
        <td className="p-2 text-center relative">
          <div className="relative inline-block">
            <button
              className="p-2 bg-[#1C3557] text-white rounded-lg"
              onClick={() =>
                setOpenPopup(openPopup === student._id ? null : student._id)
              }
            >
              <FaEdit size={10} />
            </button>
      
            {openPopup === student._id && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-50 text-[11px]"
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={()=>handleViewDetails(student._id)}
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
          </div>
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
