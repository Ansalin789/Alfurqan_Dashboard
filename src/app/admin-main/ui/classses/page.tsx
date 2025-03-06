"use client";


import { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { DatePicker } from "@nextui-org/react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card } from "@/components/ui/card";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import router from "next/router";
import { format } from "date-fns";

interface classData {
  id: number;
  name: string;
  course: string;
  classType: string;
  date: string;
  status: string;
}

const graphData = [
  { month: 'Jan', total: 30 },
  { month: 'Feb', total: 50 },
  { month: 'Mar', total: 40 },
  { month: 'Apr', total: 70 },
  { month: 'May', total: 50 },
  { month: 'Jun', total: 90 },
  { month: 'Jul', total: 80 },
  { month: 'Aug', total: 120 },
];
const data = [
  { label: "Completed Classes", value: 60, color: "bg-blue-300" },
  { label: "Upcoming Classes", value: 75, color: "bg-sky-400" },
  { label: "Ongoing Classes", value: 90, color: "bg-blue-700" },
  { label: "Completed Classes", value: 50, color: "bg-purple-600" },
  { label: "Total Classes", value: 120, color: "bg-gray-900" },
];



const classData = [
  {
    id: 798,
    name: "Samantha William",
    course: "Tajweed Masterclass",
    classType: "Trial Class",
    date: "2/1/2025",
    status: "Available at 7:30 AM",
  },
  {
    id: 799,
    name: "Jordan Nico",
    course: "Tajweed Masterclass",
    classType: "Trial Class",
    date: "2/1/2025",
    status: "Available at 7:30 AM",
  },
  {
    id: 800,
    name: "Nadila Adja",
    course: "Tajweed Masterclass",
    classType: "Group Class",
    date: "2/1/2025",
    status: "Re-Schedule Requested",
  },
  {
    id: 801,
    name: "Nadila Adja",
    course: "Tajweed Masterclass",
    classType: "Group Class",
    date: "2/1/2025",
    status: "Available at 7:30 AM",
  },
  {
    id: 802,
    name: "Nadila Adja",
    course: "Tajweed Masterclass",
    classType: "Regular Class",
    date: "2/1/2025",
    status: "Available at 7:30 AM",
  },
];



const Classes = () => {
       const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
       const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
       const [completedData, setCompletedData] = useState([classData]);
       const [currentPage, setCurrentPage] = useState(1);
       const itemsPerPage = 5;
       const [activeTab, setActiveTab] = useState("upcoming");
       const [upcomingClasses, setUpcomingClasses] = useState([classData]);
       const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
       const [selectedDate, setSelectedDate] = useState<Date | null>(null);
       const [rescheduleReason, setRescheduleReason] = useState("");
       const [showSuccess, setShowSuccess] = useState(false);
       const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

       
  const formattedDate = format(new Date("2025-01-02"), "MM/dd/yyyy"); 
  console.log(formattedDate); // "01/02/2025"   
       
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



  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim() && selectedItemId) {
      setShowSuccess(true);
      setUpcomingClasses((prevClasses) =>
        prevClasses.map((group) =>
          group.map((item) =>
            item.id === selectedItemId
              ? { ...item, status: "Re-Schedule Requested" }
              : item
          )
        )
      );
    } else {
      alert("Please provide a reason and select a class to reschedule.");
    }

    setTimeout(() => {
      setShowSuccess(false);
      setIsRescheduleModalOpen(false);
      setRescheduleReason("");
    }, 2000);
  };
       const handleDateSelect = (date: Date | null) => {
        if (date) {
          setSelectedDate(date);
          setIsDatePickerOpen(false);
          router.push("/");
        }
      };

     const handleStatusClick = (status: string) => {
        if (status.includes("Available")) {
          router.push("/");
        }
      };
      const handleOptionsClick = (id: number) => {
        setSelectedItemId(selectedItemId === id ? null : id);
      };
    
    const maxValue = Math.max(...data.map(item => item.value));

  return (
    <BaseLayout4>
      <div className="p-6 w-full h-full overflow-hidden">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Classes</h1>

        {/* Top Cards Section */}
   <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Total Classes Chart */}
    <Card className="p-6 shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-lg text-gray-900">Total Classes</h2>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={graphData}>
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis domain={[0, 125]} stroke="#6B7280" />
          <Tooltip />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#122F45" stopOpacity={1} />
              <stop offset="100%" stopColor="#759EBD" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="total"
            stroke="#122F45"
            fill="url(#gradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>

   {/* Total Classes Overview (Bar Chart) */}
   <Card className="p-6 rounded-lg shadow-md bg-white">
      <h2 className="font-semibold text-lg text-gray-900 mb-4">Total Classes Overview</h2>
      <div className="space-y-5">
        {data.map((item, index) => (
          <button
            key={index}
            className="relative w-full focus:outline-none"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative bg-gray-200 h-3 rounded-full w-full">
              <div
                className={`h-3 rounded-full ${item.color} relative transition-all duration-300`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                {hoveredIndex === index && (
                  <div className="absolute top-[-30px] right-0 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                    {item.value}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex space-x-4 mt-6 flex-wrap">
        {data.map((item, index) => (
          <div key={index} className="flex flex-1 items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
            <span className="text-[7px] text-gray-700 font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
   </div>

       {/* Table Section */}
       <div className="p-4 mb-5">
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          {/* Tabs */}
          <div>
            <div className="flex">
              <button
                className={`py-3 px-2 ml-5 ${
                  activeTab === "upcoming"
                    ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                    : "text-gray-600"
                } focus:outline-none text-[13px]`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming ({upcomingClasses.length})
              </button>
              <button
                className={`py-3 px-6 ${
                  activeTab === "completed"
                    ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                    : "text-gray-600"
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
                  <span className="text-[14px]">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Date"}
                  </span>
                  <IoMdArrowDropdownCircle />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-72">
                    <DatePicker
                     onChange={handleDateSelect}
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
                    {["Id", "Name", "Courses", "Date", "Status"].map(
                      (header) => (
                        <th key={header} className="px-6 py-3 text-center">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {classData.map((item, index) => (
                    <tr
                      key={item.id} // Fix: Assign a unique key
                      className={`text-[12px] font-medium mt-2 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="px-6 py-2 text-center">{item.id}</td>
                      <td className="px-6 py-2 text-center">{item.name}</td>
                      <td className="px-6 py-2 text-center">{item.course ?? "Quran"}</td>
                      <td className="px-6 py-2 text-center">
                        {new Date(item?.date ?? "2022-01-01").toLocaleDateString()}{" "}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {activeTab === "completed" ? (
                          <span className="text-green-600 border text-[12px] border-green-600 bg-green-100 px-3 py-1 rounded-lg">
                            {item.status}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStatusClick(item.status)}
                            className={`${
                              item.status === "Re-Schedule Requested"
                                ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b] px-3"
                                : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557] px-6"
                            } py-1 rounded-lg`}
                          >
                            {item.status}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {activeTab === "upcoming" && (
                          <>
                            <button className="text-xl" onClick={() => handleOptionsClick(item.id)}>
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
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, dataToShow.length)} from{" "}
                {dataToShow.length} data
              </p>
              <div className="flex space-x-2 text-[10px]">
                <button
                  className={`px-2 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-2 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-[#1B2B65] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`px-2 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
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
            <h2 className="text-xl mb-4 text-gray-700">
              Reason for Re-Schedule
            </h2>
            {showSuccess ? (
              <div className="bg-[#108422] text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 mb-4 mx-auto max-w-[280px]">
                <img src="/assets/images/success.png" alt="" />
                <span>Request Has Been Sent to Admin</span>
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
    </BaseLayout4>
  );
};

export default Classes;
