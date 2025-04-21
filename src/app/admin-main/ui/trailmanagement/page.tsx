"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSyncAlt, FaFilter, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Dashboard from "@/app/admin-main/components/trailmanagementcard";
import BaseLayout4 from "@/components/BaseLayout4";
// Define the return type of the getAllUsers function

const evaluation: EvaluationItem[] = [
  {
    paymentLink: "https://payment.example.com/link1",
    _id: "eval001",
    student: {
      learningInterest: "Mathematics",
      studentId: "stu001",
      studentFirstName: "Alice",
      studentLastName: "Smith",
      studentPhone: 1234567890,
      studentCountry: "USA",
      preferredTeacher: "Teacher A",
      preferredFromTime: "10:00 AM",
      preferredToTime: "11:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    trialClassStatus: "Scheduled",
    assignedTeacher: "Teacher A",
    paymentStatus: "Pending",
  },
  {
    paymentLink: "https://payment.example.com/link2",
    _id: "eval002",
    student: {
      learningInterest: "Science",
      studentId: "stu002",
      studentFirstName: "Bob",
      studentLastName: "Johnson",
      studentPhone: 9876543210,
      studentCountry: "UK",
      preferredTeacher: "Teacher B",
      preferredFromTime: "2:00 PM",
      preferredToTime: "3:00 PM",
      classStatus: "Confirmed",
      status: "Active",
      trialClassStatus: "Completed",
    },
    trialClassStatus: "Completed",
    assignedTeacher: "Teacher B",
    paymentStatus: "Paid",
  },
  {
    paymentLink: "https://payment.example.com/link3",
    _id: "eval003",
    student: {
      learningInterest: "English",
      studentId: "stu003",
      studentFirstName: "Charlie",
      studentLastName: "Brown",
      studentPhone: 1122334455,
      studentCountry: "Canada",
      preferredTeacher: "Teacher C",
      preferredFromTime: "9:00 AM",
      preferredToTime: "10:00 AM",
      classStatus: "Rescheduled",
      status: "Inactive",
      trialClassStatus: "Pending",
    },
    trialClassStatus: "Pending",
    assignedTeacher: "Teacher C",
    paymentStatus: "Unpaid",
  },
];

console.log(evaluation);

// Define interfaces for the API response structure
interface Student {
  learningInterest: string; // Replace with the exact type if known
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
}

interface EvaluationItem {
  paymentLink: string;
  _id: string;
  student: Student;
  trialClassStatus: string;
  assignedTeacher: string;
  paymentStatus: string;
}

// Define the transformed user structure
interface TransformedUser {
  _id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  number: string;
  country: string;
  course: string; // Assuming this corresponds to `learningInterest`
  preferredTeacher: string;
  time: string;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
  paymentStatus: string;
  assignedTeacher: string;
  paymentLink: string;
}

const TrailManagement = () => {
  const [users, setUsers] = useState<TransformedUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  console.log(setItemsPerPage);

  const router = useRouter();
  const handleSyncClick = () => {
    if (router) {
      router.push("/admin-main/ui/evaluations");
    } else {
      console.error("Router is not available");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const openModal = (user: TransformedUser | null = null) => {
    setIsEditMode(!!user);
    setIsModalOpen(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIsOpen(false);
  };

  useEffect(() => {
    console.log("Current users data:", users);
  }, [users]);

  interface FormData {
    _id: string;
    student: {
      city: string;
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
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
      preferredDate: string; // ISO date string
      evaluationStatus: string;
      status: string;
      createdDate: string; // ISO date string
      createdBy: string;
    };
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    subscription: {
      subscriptionName: string;
    };
    planTotalPrice: number;
    classStartDate: string; // ISO date string
    classEndDate: string; // ISO date string
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
    createdDate: string; // ISO date string
    createdBy: string;
    updatedDate: string; // ISO date string
    updatedBy: string;
    expectedFinishingDate: number;
    __v: number;
  }
  const handleClick = (id: string) => {
    const selectedItem = evaluation.find((item) => item._id === id);
    if (selectedItem) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredItems = currentItems.filter((item) => {
    const searchFields = [
      item._id,
      `${item.studentFirstName} ${item.studentLastName}`,
      item.number,
      item.country,
      item.course,
      item.preferredTeacher,
      item.assignedTeacher,
      item.time,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) => {
      const fullName =
        `${user.studentFirstName} ${user.studentLastName}`.toLowerCase();
      return (
        user.studentId.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        user.paymentStatus.toLowerCase().includes(query.toLowerCase()) ||
        user.number.includes(query) ||
        user.country.toLowerCase().includes(query.toLowerCase()) ||
        user.course.toLowerCase().includes(query.toLowerCase()) ||
        user.preferredTeacher.toLowerCase().includes(query.toLowerCase()) ||
        user.time.toLowerCase().includes(query.toLowerCase()) ||
        user.trialClassStatus.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };

  if (errorMessage) {
    return (
      <BaseLayout4>
        <div className="min-h-screen p-2">{errorMessage}</div>
      </BaseLayout4>
    );
  }

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
                    "Action",
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
                {evaluation.length > 0 ? (
                  evaluation.slice(0, 5).map((item, index) => (
                    <tr
                      key={item._id}
                      className={`${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
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
                        {item.student.preferredFromTime}
                      </td>
                      <td className="p-3 text-center">
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
                      <td className="p-3 text-center">
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
                      <td className="p-3 text-center">
                        <span
                          className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                            item.student.status === "Active"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                              : "bg-green-100 text-green-800 border border-green-900 px-2"
                          }`}
                        >
                          {item.student.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleClick(item._id.toString())}
                          className="bg-gray-800 hover:cursor-pointer text-white p-2 rounded-lg shadow hover:bg-gray-900"
                        >
                          <FaEdit size={10} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="p-4 text-center">
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[650px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold bg-gradient-to-r from-[#415075] via-[#1e273c] to-[#1e273c] text-transparent bg-clip-text">
                Student Details
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <form className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-black text-xs font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentFirstName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentLastName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData?.student.studentEmail}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentPhone}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-black text-xs font-medium">
                  City
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentCity ?? ""}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentCountry}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Trial ID */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Trial ID
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?._id}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Course
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.learningInterest}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Teacher */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Teacher
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.preferredTeacher}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Time
                </label>
                <input
                  type="text"
                  disabled
                  value={`${formData?.student.preferredFromTime} - ${formData?.student.preferredToTime}`}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Package */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Package
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.subscription?.subscriptionName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Comment */}
              <div className="col-span-2">
                <label className="block text-black text-xs font-medium">
                  Comment
                </label>
                <textarea
                  placeholder="Write your comment here..."
                  value={formData?.comments}
                  className="w-full mt-2 bg-gray-200 border border-gray-300 p-2 rounded-md text-[12px] text-gray-800"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#223857] text-white rounded-md hover:bg-[#1c2f49] text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout4>
  );
};

export default TrailManagement;
