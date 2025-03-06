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
        const response = await axios.get<ApiResponse>("https://alfurqanacademy.tech/classShedule");
  
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of the day
  
        const futureSchedules = response.data.students
          .map((schedule) => {
            const scheduleDate = new Date(schedule.startDate);
            scheduleDate.setHours(0, 0, 0, 0); // Normalize schedule date
  
            let isOngoing = false;
            let isFuture = false;
            let formattedTimes: string[] = [];
  
            schedule.startTime.forEach((time, index) => {
              if (!schedule.endTime[index]) return;
  
              const [startHours, startMinutes] = time.split(":").map(Number);
              const [endHours, endMinutes] = schedule.endTime[index].split(":").map(Number);
  
              const scheduleStart = new Date(schedule.startDate);
              scheduleStart.setHours(startHours, startMinutes, 0, 0);
  
              const scheduleEnd = new Date(schedule.startDate);
              scheduleEnd.setHours(endHours, endMinutes, 0, 0);
  
              if (now >= scheduleStart && now <= scheduleEnd) {
                isOngoing = true; // ✅ Mark as ongoing if current time is within the range
              }
  
              if (scheduleStart > now) {
                isFuture = true; // ✅ Mark as future if it hasn't started yet
              }
  
              formattedTimes.push(`${time} - ${schedule.endTime[index]}`);
            });
  
            return { ...schedule, isOngoing, isFuture, scheduleDate, formattedTimes };
          })
          .filter((schedule): schedule is NonNullable<typeof schedule> => {
            if (!schedule) return false;
            // ✅ Keep today's schedules only if they are ongoing or in the future
            if (schedule.scheduleDate.getTime() === today.getTime()) {
              return schedule.startTime.some((time, index) => {
                const [hours, minutes] = time.split(":").map(Number);
                const scheduleStart = new Date(schedule.startDate);
                scheduleStart.setHours(hours, minutes, 0, 0);
  
                const [endHours, endMinutes] = schedule.endTime[index].split(":").map(Number);
                const scheduleEnd = new Date(schedule.startDate);
                scheduleEnd.setHours(endHours, endMinutes, 0, 0);
  
                return now <= scheduleEnd; // ✅ Keep schedules that are ongoing or upcoming today
              });
            }
            return schedule.scheduleDate > today;
          })
          .sort((a, b) => {
            if (a.isOngoing && !b.isOngoing) return -1; // Show ongoing schedules first
            if (!a.isOngoing && b.isOngoing) return 1;
            return a.scheduleDate.getTime() - b.scheduleDate.getTime(); // Sort by date
          });
  
        setUniqueStudentSchedules(futureSchedules);
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
  console.log(currentItems);
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleMenu = (index: number) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const handleLiveClassRedirect = (id:string) => {
    router.push("/supervisor/ui/liveclass");
    localStorage.setItem('showfeedbackid',id);
    localStorage.setItem('showfeedbackdirect',JSON.stringify(false));
  };

  const handleFeedbackRedirect = (id:string) => {
    router.push("/supervisor/ui/liveclass");
    localStorage.setItem('showfeedbackid',id);
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
  const isToday = (date: string) => {
    const today = new Date();
    const classDate = new Date(date);
    return (
      classDate.getFullYear() === today.getFullYear() &&
      classDate.getMonth() === today.getMonth() &&
      classDate.getDate() === today.getDate()
    );
  };
  
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([]);
  };
  
  const getEarliestTime = (times: string[]) => {
    return times.length ? times.toSorted((a, b) => a.localeCompare(b))[0] : "";
  };
  
  
  
  const isClassOngoing = (startDate: string, startTimes: string[], endTimes: string[]) => {
    const now = new Date();
    const today = new Date(startDate); // This is in UTC
  
    // Convert `today` to local timezone (to avoid mismatch issues)
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    if (
      localToday.getFullYear() === now.getFullYear() &&
      localToday.getMonth() === now.getMonth() &&
      localToday.getDate() === now.getDate()
    ) {
      return startTimes.some((time, index) => {
        const [startHours, startMinutes] = time.split(":").map(Number);
        const [endHours, endMinutes] = endTimes[index].split(":").map(Number);
  
        const classStartTime = new Date(localToday);
        classStartTime.setHours(startHours, startMinutes, 0, 0);
  
        const classEndTime = new Date(localToday);
        classEndTime.setHours(endHours, endMinutes, 0, 0);
  
        return now >= classStartTime && now <= classEndTime;
      });
    }
    return false;
  };
  
  
  

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
                  <td className="px-6 py-3 text-center">{new Date(item.startDate).toDateString()}</td>
                  <td className="px-6 py-3 text-center">
                  {(() => {
    let content;
    console.log("Checking for:", item.startDate, item.startTime, item.endTime);
    if (isClassOngoing(item.startDate, item.startTime, item.endTime)) {
      content = (
        <button
          onClick={() => handleLiveClassRedirect(item._id)}
          className="py-1 px-2 text-black rounded-lg bg-green-500 cursor-pointer hover:opacity-80"
        >
          Ongoing Now ({item.startTime[0]} - {item.endTime[0]})
        </button>
      );
    } else if (isToday(item.startDate)) {
      content = (
        <span className="py-1 px-2 text-black rounded-lg bg-yellow-500">
          Scheduled at {formatTime(getEarliestTime(item.startTime))}
        </span>
      );
    } else {
      content = (
        <span className="py-1 px-2 text-black rounded-lg bg-gray-400">
          Scheduled at {formatTime(getEarliestTime(item.startTime))}
        </span>
      );
    }
    return content;
  })()}


</td>

                  <td className="px-6 py-3 text-center relative">
                    <button className="text-[#000]" onClick={() => toggleMenu(index)}>
                      <HiOutlineDotsHorizontal size={20} className="text-[#00]" />
                    </button>
                    {selectedMenu === index && (
                      <div ref={menuRef} className="absolute bg-white shadow-lg rounded-lg mt-1 right-0 w-32 z-10">
                        <button
                          className="block w-full text-center px-4 py-2 text-[12px] text-[#223857] hover:bg-gray-100"
                          onClick={()=>{handleFeedbackRedirect(item._id)}}
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
