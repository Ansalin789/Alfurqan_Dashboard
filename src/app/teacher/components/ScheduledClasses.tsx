'use client';

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { useRouter } from 'next/navigation';
import axios from "axios";

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

const ScheduledClasses = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [upcomingClasses, setUpcomingClasses] = useState<Schedule[]>([]);
  const[completedData,setCompletedData]=useState<Schedule[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("TeacherAuthToken");
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const response = await axios.get<ApiResponse>("http://localhost:5001/classShedule", {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        const teacherClasses = response.data.students.filter(
          (classItem) => classItem.teacher.teacherId === teacherIdToFilter
        );
  
        // Set filtered data to state
        setUpcomingClasses(teacherClasses.filter((classItem) => classItem.status === "Active"));
        setCompletedData(teacherClasses.filter((classItem) => classItem.status === "completed"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

 

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOptionsClick = (id: number) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim() && selectedItemId) {
      setShowSuccess(true);
      setUpcomingClasses((prevClasses : Schedule[]) =>
        prevClasses.map(item =>
          Number(item._id) === selectedItemId // Convert item._id to a number
            ? { ...item, status: 'Re-Schedule Requested' }
            : item
        )
      );
    } else {
      alert('Please provide a reason and select a class to reschedule.');
    }

    setTimeout(() => {
      setShowSuccess(false);
      setIsRescheduleModalOpen(false);
      setRescheduleReason("");
    }, 2000);
  };

  const handleStatusClick = (status: string) => {
    if (status.includes('Available')) {
      router.push('/teacher/ui/liveclass');
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
      router.push('/teacher/ui/schedule/schedules');
    }
  };

  return (
    <div className="p-4 min-h-screen ml-20 w-[1040px]">
      <div className={`${isRescheduleModalOpen ? 'blur-sm' : ''} transition-all duration-200`}>
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Classes</h1>
        <div className="bg-white rounded-[30px] shadow-lg p-8 h-[60vh]">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4 justify-between">
            <div>
              <button
                className={`px-6 py-2 text-[13px] font-semibold ${activeTab === "upcoming" ? "text-[#1C3557] border-b-2 border-[#1C3557]" : "text-gray-600"}`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming ({upcomingClasses.length})
              </button>
              <button
                className={`px-6 py-2 text-[13px] font-semibold ${activeTab === "completed" ? "text-[#1C3557] border-b-2 border-green-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("completed")}
              >
                Completed ({completedData.length})
              </button>
            </div>
            <div>
              <div className="relative">
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center space-x-2 shadow-lg p-1 rounded-lg text-gray-600 hover:text-gray-800"
                >
                  <span className="text-[14px]">{selectedDate ? selectedDate.toLocaleDateString() : "Date"}</span>
                  <IoMdArrowDropdownCircle />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      inline
                      className="border rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {["Id", "Name", "Courses", "Date", "Status"].map((header) => (
                  <th key={header} className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                    {header}
                  </th>
                ))}
                <th className="px-2 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item._id} className="relative text-[12px] font-medium text-[#374557]">
                  <td className="px-4 py-2 border-b">{item._id}</td>
                  <td className="px-4 py-2">{item.student.studentFirstName} {item.student.studentLastName}</td>
                  <td className="px-4 py-2">{item.package}</td>
                  <td className="px-4 py-2">{item.startDate}</td>
                  <td className="px-4 py-2">
                    {activeTab === "completed" ? (
                      <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">{item.status}</span>
                    ) : (
                      <button 
                        onClick={() => handleStatusClick(item.status)}
                        className={`${
                          item.status === "Re-Schedule Requested" 
                            ? "bg-[#79D67B] text-black" 
                            : "bg-[#1C3557] text-white"
                        } px-4 py-1 rounded-lg`}
                      >
                        {item.status}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-600 relative">
                    {activeTab === "upcoming" && (
                      <>
                        <button 
                          className="text-xl"
                          onClick={() => handleOptionsClick(Number(item._id))}
                        >
                          ...
                        </button>
                        {selectedItemId === Number(item._id) && (
                          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-36">
                            <button
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                              onClick={() => {
                                setIsRescheduleModalOpen(true);
                                setSelectedItemId(Number(item._id));
                              }}
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-center mb-4">Reschedule Class</h2>
            <textarea
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="Provide a reason for rescheduling"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 text-white bg-blue-500 rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg">
          Reschedule Request Sent
        </div>
      )}
    </div>
  );
};

export default ScheduledClasses;

