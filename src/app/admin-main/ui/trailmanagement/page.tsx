"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSyncAlt, FaFilter, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Dashboard from "@/app/admin-main/components/trailmanagementcard";
import BaseLayout4 from "@/components/BaseLayout4";
// Define the return type of the getAllUsers function

export interface TransformedUser {
  _id: string;
  academicCoachId: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentGender: string;
    studentPhone: number;
    studentCity: string;
    studentCountry: string;
    studentCountryCode: string;
    learningInterest: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime: string;
    preferredToTime: string;
    timeZone: string;
    referralSource: string;
    preferredDate: string; // ISO Date string
    evaluationStatus: string;
    status: string;
    createdDate: string; // ISO Date string
    createdBy: string;
  };
  teacher: {
    teacherName: string;
  };
  subscription: {
    subscriptionName: string;
  };
  classDay: string[]; // e.g., ["Monday", "Tuesday"]
  startTime: string[]; // e.g., ["09:00", "09:00"]
  endTime: string[];   // e.g., ["09:30", "09:30"]
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  planTotalPrice: number;
  classStartDate: string; // ISO Date string
  classEndDate: string;   // ISO Date string
  classStartTime: string;
  classEndTime: string;
  accomplishmentTime: string;
  studentRate: number;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  status: string;
  createdDate: string; // ISO Date string
  createdBy: string;
  updatedDate: string; // ISO Date string
  updatedBy: string;
  expectedFinishingDate: number;
  teacherStatus: string;
  __v: number;
}


const TrailManagement = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  console.log(setItemsPerPage);

  const router = useRouter();
  // Fetch API Data
  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/alltrialclass");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const pendingClasses = data.evaluation.filter(
        (item: { trialClassStatus: string }) =>
          item.trialClassStatus === "COMPLETED"
      );
      setFilteredUsers(pendingClasses); // Only pending data
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Modal.setAppElement("body");
    getAllUsers(); // Fetch users when component mounts
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchTerm(query);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const filteredItems = currentItems.filter((item) => {
    const searchFields = [
      item._id,
      `${item.student.studentFirstName} ${item.student.studentLastName}`,
      item.student.studentPhone,
      item.student.studentCountry,
      item.student.learningInterest,
      item.student.preferredTeacher,
      item.assignedTeacher,
      item.classStartTime,
      item.classStatus,
      item.paymentStatus,
      item.status,
    ];
    return searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
  });

  return (
    <BaseLayout4>
      <div className="py-2 md:mr-10 w-full scrollbar-none mx-auto h-full">
        <div className="flex justify-between ml-4">
          <h2 className="text-[20px] font-semibold">Scheduled Trail Classes</h2>
        </div>

        <div className="p-2">
          <Dashboard />
        </div>
        <div className="w-full max-w-[1300px] mx-auto px-4">
          <div className="flex justify-between items-center p-2 -ml-2">
            <div className="flex flex-1 mb-4 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none">
              <div className="flex ">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border rounded-lg px-2 text-[12px] mr-4 shadow"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className="flex">
                <select className="border rounded-lg p-2 shadow text-[12px] appearance-none  bg-white">
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
            <table className="min-w-full table-fixed bg-white shadow rounded-lg">
              <thead className="border-b-[1px] border-[#1C3557] text-[10px] font-semibold">
                <tr>
                  {[
                    "Trial ID",
                    "Student Name",
                    "Mobile",
                    "Country",
                    "Course",
                    "Preferred Teacher",
                    "Assigned Teacher",
                    "Time",
                    "Class Status",
                    "Payment Status",
                    "Student Status",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="p-3 text-center w-[8.33%] break-words"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[9px] font-medium">
                      {filteredItems.length > 0 ? (
                        filteredItems.slice(0, 5).map((item, index) => (
                          <tr
                            key={item._id}
                            className={
                              index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                            }
                          >
                            <td className="p-3 text-center break-words">
                              {item._id}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.student.studentFirstName}{" "}
                              {item.student.studentLastName}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.student.studentPhone}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.student.studentCountry}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.student.learningInterest}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.student.preferredTeacher}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.assignedTeacher}
                            </td>
                            <td className="p-3 text-center break-words">
                              {item.classStartTime}
                            </td>
                            {/* Trial Class Status */}
                            <td className="p-3 text-center break-words">
                              <span
                                className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                                  item.trialClassStatus === "COMPLETED"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                    : "bg-green-100 text-green-800 border border-green-900 px-2"
                                }`}
                              >
                                {item.trialClassStatus}
                              </span>
                            </td>
                            {/* Payment Status */}
                            <td className="p-3 text-center break-words">
                              <span
                                className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                                  item.paymentStatus === "PAID"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                    : "bg-green-100 text-green-800 border border-green-900 px-2"
                                }`}
                              >
                                {item.paymentStatus}
                              </span>
                            </td>
                            {/* Account Status */}
                            <td className="p-3 text-center break-words">
                              <span
                                className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                                  item.status === "Active"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                    : "bg-green-100 text-green-800 border border-green-900 px-2"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={11} className="p-4 text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              className="text-[#fff] mt-4 text-[11px] bg-[#223857] cursor-pointer rounded-md border-none px-2 py-1"
              onClick={() =>
                router.push("/admin-main/ui/scheduledtrailclasslist")
              }
            >
              View All
            </button>
          </div>
        </div>
      </div>

    </BaseLayout4>
  );
};

export default TrailManagement;
