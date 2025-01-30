'use client';


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { table } from "console";

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
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 798, name: "Samantha William", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 7:30 AM" },
    { id: 799, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 800, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Re-Schedule Requested" },
    { id: 801, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 802, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 803, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 804, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 805, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
  ]);

  const completedData = [
    { id: 803, name: "Samantha William", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 804, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 805, name: "Nadila Adja", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 806, name: "Nadila Adja", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
  ];

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
    if (rescheduleReason.trim()) {
      setShowSuccess(true);
      setUpcomingClasses(prevClasses => 
        prevClasses.map(item => 
          item.id === selectedItemId 
            ? { ...item, status: "Re-Schedule Requested" }
            : item
        )
      );
      
      setTimeout(() => {
        setShowSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    }
  };

  const handleStatusClick = (status: string) => {
    if (status.includes('Available')) {
      router.push('/teacher/ui/liveclass'); // Replace with your desired route
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
    <div className="p-4">
      <div className={`${isRescheduleModalOpen ? 'blur-sm' : ''} transition-all duration-200`}>
        <h1 className="text-2xl font-semibold text-gray-800 p-2">Scheduled Classes</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          {/* Tabs */}
          <div>
            <div className="flex">
              <button
                  className={`py-3 px-2 ml-5 ${
                  activeTab === "upcoming" ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold" : "text-gray-600"
                  } focus:outline-none text-[13px]`}
                  onClick={() => setActiveTab("upcoming")}
              >
                  Upcoming ({upcomingClasses.length})
              </button>
              <button
                  className={`py-3 px-6 ${
                  activeTab === "completed" ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold" : "text-gray-600"
                  } focus:outline-none text-[13px]`}
                  onClick={() => setActiveTab("completed")}
              >
                  Completed ({completedData.length})
              </button>
            </div>
            <div className="flex justify-end px-[50px] mt-[2px] h-6 relative">
              <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden">
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center space-x-2 shadow-lg p-1 rounded-lg text-gray-600 hover:text-gray-800"
                >
                  <span className="text-[14px]">{selectedDate ? selectedDate.toLocaleDateString() : "Date"}</span>
                  <IoMdArrowDropdownCircle />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-72">
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                  <tr>
                    {["Id", "Name", "Courses", "Date", "Status"].map((header) => (
                      <th key={header} className="px-6 py-3 text-center">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id} className="text-[12px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-6 py-2 text-center">{item.id}</td>
                      <td className="px-6 py-2 text-center">{item.name}</td>
                      <td className="px-6 py-2 text-center">{item.course}</td>
                      <td className="px-6 py-2 text-center">{item.date}</td>
                      <td className="px-6 py-2 text-center">
                        {activeTab === "completed" ? (
                          <span className="text-green-600 border text-[12px] border-green-600 bg-green-100 px-3 py-1 rounded-lg">{item.status}</span>
                        ) : (
                          <button 
                            onClick={() => handleStatusClick(item.status)}
                            className={`${
                              item.status === "Re-Schedule Requested" 
                                ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b] px-3" 
                                : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557] px-5"
                            } py-1 rounded-lg`}
                          >
                            {item.status}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {activeTab === "upcoming" && (
                          <>
                            <button 
                              className="text-xl"
                              onClick={() => handleOptionsClick(item.id)}
                            >
                              ...
                            </button>
                            {selectedItemId === item.id && (
                              <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setIsRescheduleModalOpen(true);
                                      setSelectedItemId(item.id);
                                    }}
                                  >
                                    Request
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-[#a72222] hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedItemId(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center p-4">
              <p className="text-[10px] text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataToShow.length)} from {dataToShow.length} data
              </p>
              <div className="flex space-x-2 text-[10px]">
                <button 
                  className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-2 py-1 rounded ${
                      currentPage === index + 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
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

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="bg-gray-100 rounded-3xl p-6 w-96 relative z-50">
            <h2 className="text-xl mb-4 text-gray-700">Reason for Re-Schedule</h2>
            {showSuccess ? (
              <div className="bg-[#108422] text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 mb-4 mx-auto max-w-[280px]">
                <img src="/assets/images/success.png" alt="" /><span>Request Has Been Sent to Admin</span>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full p-4 border rounded-2xl mb-4 h-32 resize-none bg-white"
                  placeholder="Type here..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                />
                <button
                  onClick={handleRescheduleSubmit}
                  className="w-32 bg-[#1B2B65] text-white py-2 rounded-full hover:bg-[#0f1839] mx-auto block"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledClasses;
