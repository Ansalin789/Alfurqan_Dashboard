"use client";
import BaseLayout4 from "@/components/BaseLayout4";
import AdminHeader from "../../components/AdminHeader";
import { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";

interface ClassSchedule {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  course: {
    courseId: string;
    courseName: string;
  };
  package: string;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  status: string;
}

export default function StudentClassPage({ searchParams }: { searchParams: { studentId: string } }) {
  const studentId = searchParams.studentId;
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchClassSchedule() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("AdminAuthToken");
        if (!token) {
          setError("No auth token found.");
          setLoading(false);
          return;
        }
        const res = await fetch(
          `https://api.blackstoneinfomaticstech.com/classShedule/students?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setError("API error: " + (data?.message || res.status));
          setLoading(false);
          return;
        }
        setClassData(data.classSchedule || []);
      } catch (err: any) {
        setError("Failed to fetch class schedule");
      } finally {
        setLoading(false);
      }
    }
    if (studentId) fetchClassSchedule();
  }, [studentId]);

  // Filtered and paginated data
  const filteredClassData = classData.filter((row) => {
    const search = searchQuery.toLowerCase();
    return (
      row.student?.studentFirstName?.toLowerCase().includes(search) ||
      row.teacher?.teacherName?.toLowerCase().includes(search) ||
      row.course?.courseName?.toLowerCase().includes(search)
    );
  });
  const totalPages = Math.ceil(filteredClassData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedClassData = filteredClassData.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-[#DCFCE7] dark:bg-[#2E3C2E] dark:text-[#377E36] text-green-800 rounded-md";
      case "Cancelled":
        return "bg-red-100 text-red-500 border-red-500 border rounded-lg";
      case "Rescheduled":
        return "bg-yellow-100 text-yellow-600 border-yellow-600 border rounded-lg";
      case "Scheduled":
        return "bg-blue-100 text-blue-600 border-blue-600 border rounded-lg";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Student Class" />
      <div>
        <div className="rounded-lg overflow-hidden">
        <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
        <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            <div className="relative">
              <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-3 border-r-2 border-l-2 px-48 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>
            </div>
            <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
            Showing {filteredClassData.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClassData.length)} of {filteredClassData.length}
              </span>
          </div>
          <div className="overflow-x-auto max-h-none">
            <table
              className="w-full min-w-[900px] text-sm text-left table-auto"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                <tr className="font-medium">
                  <th className="p-3 font-semibold text-[12px] text-center">Student ID</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Student Name</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Teacher Name</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Course Name</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Date</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Time</th>
                  <th className="p-3 font-semibold text-[12px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-[10px] text-[#1D2939]">
                {loading ? (
                  <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
                ) : paginatedClassData.length > 0 ? (
                  paginatedClassData.map((row, index) => (
                    <tr
                      key={row._id}
                      className={`text-center dark:text-white ${
                        index % 2 === 0
                          ? "bg-[#fff] dark:bg-[#2C2C2C]"
                          : "bg-[#F8F8F8] dark:bg-[#303030]"
                      }`}
                    >
                      <td className="p-3">{row.student?.studentId}</td>
                      <td className="p-3">{row.student?.studentFirstName}</td>
                      <td className="p-3">{row.teacher?.teacherName}</td>
                      <td className="p-3">{row.course?.courseName}</td>
                      <td className="p-3">{new Date(row.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })}</td>
                      <td className="p-3">{row.startTime?.[0]} - {row.endTime?.[0]}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${getStatusColor(row.scheduleStatus)}`}>
                          {row.scheduleStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </BaseLayout4>
  );
}
