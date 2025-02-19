"use client";

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "axios";


const ViewSchedule = () => {
  interface Student {
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
    }
  
    interface Teacher {
      teacherId: string;
      teacherName: string;
      teacherEmail: string;
    }
  
    interface Schedule {
      student: Student;
      teacher: Teacher;
      _id: string;
      classDay: string[];
      package: string;
      preferedTeacher: string;
      totalHourse: number;
      startDate: string;
      endDate: string;
      startTime: string[];
      endTime: string[];
      scheduleStatus: string;
      status: string;
      createdBy: string;
      createdDate: string;
      lastUpdatedDate: string;
      __v: number;
    }
  
    interface ApiResponse {
      totalCount: number;
      students: Schedule[];
    }
    const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<Schedule[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("SupervisorAuthToken");
        const response = await axios.get<ApiResponse>("http://localhost:5001/classShedule", {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
  
        const now = new Date(); // Current date & time
  
        // Filter schedules where startDate & startTime are in the future
        const upcomingSchedules = response.data.students
          .filter((schedule) => {
            if (!schedule.startDate || schedule.startTime.length === 0) return false;
  
            return schedule.startTime.some((time) => {
              const [hours, minutes] = time.split(":").map(Number);
              const scheduleDateTime = new Date(schedule.startDate);
              scheduleDateTime.setHours(hours, minutes, 0, 0);
  
              return scheduleDateTime > now; // Keep only future schedules
            });
          })
          .sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
  
            // Sort by date first
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
  
            // Sort by time if dates are the same
            const timeA = Math.min(...a.startTime.map(time => {
              const [h, m] = time.split(":").map(Number);
              return h * 60 + m; // Convert to total minutes
            }));
  
            const timeB = Math.min(...b.startTime.map(time => {
              const [h, m] = time.split(":").map(Number);
              return h * 60 + m;
            }));
  
            return timeA - timeB;
          });
  
        setUniqueStudentSchedules(upcomingSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  


  const dataToShow = uniqueStudentSchedules;
  const paginatedData = uniqueStudentSchedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleMenu = (index: number) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const handleLiveClassRedirect = () => {
    router.push("/supervisor/ui/liveclass");
    localStorage.setItem('showfeedbackdirect',JSON.stringify(false));
  };

  const handleFeedbackRedirect = () => {
    router.push("/supervisor/ui/liveclass");
      localStorage.setItem('showfeedbackdirect',JSON.stringify(true));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BaseLayout3>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <h1 className="text-2xl font-semibold text-gray-800 p-2 mb-8">Live Classes</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px]  flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
              <tr>
                {["Id", "Name", "Courses", "Class", "Date", "Scheduled", "Options"].map((header) => (
                  <th key={header} className="px-6 py-6 text-center whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item._id} className={`text-[12px] font-medium mt-2 ${
                    index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                  }`}>
                  <td className="px-6 py-3 text-center">{item._id}</td>
                  <td className="px-6 py-3 text-center">{item.teacher.teacherName}</td>
                  <td className="px-6 py-3 text-center">Quran</td>
                  <td className="px-6 py-3 text-center">MasterClass</td>
                  <td className="px-6 py-3 text-center">{item.startDate}</td>
                  <td className="px-6 py-3 text-center">
                    {item.status === "Ongoing class" ? (
                      <button
                        onClick={handleLiveClassRedirect}
                        className={`py-1 text-white rounded-lg ${item.statusColor} cursor-pointer hover:opacity-80`}
                        style={{ paddingLeft: item.paddingLeft, paddingRight: item.paddingRight }}
                      >
                        {item.status}
                      </button>
                    ) : (
                      <span className={`py-1 text-white rounded-lg ${item.statusColor}`} style={{ paddingLeft: item.paddingLeft, paddingRight: item.paddingRight }}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center relative">
                    <button className="text-[#000]" onClick={() => toggleMenu(index)}>
                      <HiOutlineDotsHorizontal size={20} className="text-[#00]" />
                    </button>
                    {selectedMenu === index && (
                      <div ref={menuRef} className="absolute bg-white shadow-lg rounded-lg mt-1 right-0 w-32 z-10">
                        <button
                          className="block w-full text-center px-4 py-2 text-[12px] text-[#223857] hover:bg-gray-100"
                          onClick={handleFeedbackRedirect}
                        >
                          Write Feedback
                        </button>
                        <button 
                          className="block w-full text-center px-4 py-2 text-[12px] text-[#223857] hover:bg-gray-100"
                          onClick={() => toggleMenu(index)}
                        >
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
        <div>
            <div className="flex justify-between items-center p-4">
              <p className="text-[10px] text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataToShow.length)} from {dataToShow.length} data
              </p>
              <div className="flex space-x-2 text-[10px]">
                {/* Previous Button */}
                <button
                  className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {/* Pagination Numbers */}
                {totalPages > 5 ? (
                  <>
                    {/* First Page */}
                    <button
                      className={`px-2 py-1 rounded ${
                        currentPage === 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>

                    {/* Left Ellipsis */}
                    {currentPage > 3 && <span className="px-2 py-1">...</span>}

                    {/* Pages Around Current */}
                    {Array.from(
                      { length: 3 },
                      (_, i) => currentPage - 1 + i
                    )
                      .filter((page) => page > 1 && page < totalPages)
                      .map((page) => (
                        <button
                          key={page}
                          className={`px-2 py-1 rounded ${
                            currentPage === page ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Right Ellipsis */}
                    {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}

                    {/* Last Page */}
                    <button
                      className={`px-2 py-1 rounded ${
                        currentPage === totalPages ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : (
                  // Display all pages when totalPages <= 5
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`px-2 py-1 rounded ${
                        currentPage === index + 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                )}

                {/* Next Button */}
                <button
                  className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default ViewSchedule;
