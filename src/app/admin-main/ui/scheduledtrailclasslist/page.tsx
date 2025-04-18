"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaFilter,
} from "react-icons/fa";

interface EvaluationItem {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentPhone: number;
    studentCountry: string;
    learningInterest: string;
    preferredTeacher: string;
    assignedAcademicCoach: string;
    preferredFromTime: string;
    preferredToTime: string;
    classStatus: string;
    status: string;
    trialClassStatus: string;
  };
  assignedTeacher: string;
  paymentStatus: string;
  trialClassStatus: string;
  paymentLink: string;
}

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

const evaluation: EvaluationItem[] = [
  {
    _id: "0983867",
    student: {
      studentId: "stu001",
      studentFirstName: "Robert",
      studentLastName: "James",
      studentPhone: 9347653567,
      studentCountry: "USA",
      learningInterest: "Arabic",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "9:00 AM",
      preferredToTime: "10:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Cole Walter",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link1",
  },
  {
    _id: "0983868",
    student: {
      studentId: "stu002",
      studentFirstName: "Emily",
      studentLastName: "Clark",
      studentPhone: 9876543210,
      studentCountry: "UK",
      learningInterest: "Quran",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "8:00 AM",
      preferredToTime: "9:00 AM",
      classStatus: "Scheduled",
      status: "Active",
      trialClassStatus: "Completed",
    },
    assignedTeacher: "Hana Yusuf",
    paymentStatus: "Completed",
    trialClassStatus: "Completed",
    paymentLink: "https://payment.example.com/link2",
  },
  {
    _id: "0983869",
    student: {
      studentId: "stu003",
      studentFirstName: "Liam",
      studentLastName: "Williams",
      studentPhone: 9123456780,
      studentCountry: "Canada",
      learningInterest: "Arabic",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "10:00 AM",
      preferredToTime: "11:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Omar Khalid",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link3",
  },
  {
    _id: "0983870",
    student: {
      studentId: "stu004",
      studentFirstName: "Sophia",
      studentLastName: "Brown",
      studentPhone: 9988776655,
      studentCountry: "Australia",
      learningInterest: "Tajweed",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "11:00 AM",
      preferredToTime: "12:00 PM",
      classStatus: "Completed",
      status: "Active",
      trialClassStatus: "Completed",
    },
    assignedTeacher: "Fatima Noor",
    paymentStatus: "Completed",
    trialClassStatus: "Completed",
    paymentLink: "https://payment.example.com/link4",
  },
  {
    _id: "0983871",
    student: {
      studentId: "stu005",
      studentFirstName: "Noah",
      studentLastName: "Davis",
      studentPhone: 9123456701,
      studentCountry: "USA",
      learningInterest: "Arabic",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "1:00 PM",
      preferredToTime: "2:00 PM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Ahmed Saleh",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link5",
  },
  {
    _id: "0983872",
    student: {
      studentId: "stu006",
      studentFirstName: "Ava",
      studentLastName: "Moore",
      studentPhone: 9347653523,
      studentCountry: "UK",
      learningInterest: "Quran",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "3:00 PM",
      preferredToTime: "4:00 PM",
      classStatus: "Scheduled",
      status: "Inactive",
      trialClassStatus: "Rescheduled",
    },
    assignedTeacher: "Mariam Zainab",
    paymentStatus: "Pending",
    trialClassStatus: "Rescheduled",
    paymentLink: "https://payment.example.com/link6",
  },
  {
    _id: "0983873",
    student: {
      studentId: "stu007",
      studentFirstName: "William",
      studentLastName: "Taylor",
      studentPhone: 9871234567,
      studentCountry: "USA",
      learningInterest: "Tajweed",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "5:00 PM",
      preferredToTime: "6:00 PM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Yusuf Khan",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link7",
  },
  {
    _id: "0983874",
    student: {
      studentId: "stu008",
      studentFirstName: "Isabella",
      studentLastName: "Anderson",
      studentPhone: 9356473829,
      studentCountry: "Canada",
      learningInterest: "Quran",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "6:00 PM",
      preferredToTime: "7:00 PM",
      classStatus: "Scheduled",
      status: "Active",
      trialClassStatus: "Completed",
    },
    assignedTeacher: "Layla Hassan",
    paymentStatus: "Completed",
    trialClassStatus: "Completed",
    paymentLink: "https://payment.example.com/link8",
  },
  {
    _id: "0983875",
    student: {
      studentId: "stu009",
      studentFirstName: "James",
      studentLastName: "Martin",
      studentPhone: 9234567890,
      studentCountry: "USA",
      learningInterest: "Arabic",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "7:00 AM",
      preferredToTime: "8:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Imran Malik",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link9",
  },
  {
    _id: "0983876",
    student: {
      studentId: "stu010",
      studentFirstName: "Mia",
      studentLastName: "White",
      studentPhone: 9874563210,
      studentCountry: "UK",
      learningInterest: "Quran",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "4:00 PM",
      preferredToTime: "5:00 PM",
      classStatus: "Scheduled",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Aisha Omar",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link10",
  },
  {
    _id: "0983877",
    student: {
      studentId: "stu011",
      studentFirstName: "Benjamin",
      studentLastName: "Lee",
      studentPhone: 9874561200,
      studentCountry: "USA",
      learningInterest: "Tajweed",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "12:00 PM",
      preferredToTime: "1:00 PM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Ali Kareem",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link11",
  },
  {
    _id: "0983878",
    student: {
      studentId: "stu012",
      studentFirstName: "Charlotte",
      studentLastName: "Scott",
      studentPhone: 9981234567,
      studentCountry: "Canada",
      learningInterest: "Quran",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "2:00 PM",
      preferredToTime: "3:00 PM",
      classStatus: "Scheduled",
      status: "Active",
      trialClassStatus: "Completed",
    },
    assignedTeacher: "Nadia Farooq",
    paymentStatus: "Completed",
    trialClassStatus: "Completed",
    paymentLink: "https://payment.example.com/link12",
  },
  {
    _id: "0983879",
    student: {
      studentId: "stu013",
      studentFirstName: "Elijah",
      studentLastName: "King",
      studentPhone: 9765432100,
      studentCountry: "Australia",
      learningInterest: "Arabic",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "9:00 AM",
      preferredToTime: "10:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Zaid Ansari",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link13",
  },
  {
    _id: "0983880",
    student: {
      studentId: "stu014",
      studentFirstName: "Amelia",
      studentLastName: "Young",
      studentPhone: 9001234567,
      studentCountry: "UK",
      learningInterest: "Tajweed",
      preferredTeacher: "Female",
      assignedAcademicCoach: "Sarah Miller",
      preferredFromTime: "10:00 AM",
      preferredToTime: "11:00 AM",
      classStatus: "Scheduled",
      status: "Inactive",
      trialClassStatus: "Rescheduled",
    },
    assignedTeacher: "Sumayya Bashir",
    paymentStatus: "Pending",
    trialClassStatus: "Rescheduled",
    paymentLink: "https://payment.example.com/link14",
  },
  {
    _id: "0983881",
    student: {
      studentId: "stu015",
      studentFirstName: "Lucas",
      studentLastName: "Walker",
      studentPhone: 9445566778,
      studentCountry: "USA",
      learningInterest: "Quran",
      preferredTeacher: "Male",
      assignedAcademicCoach: "Cole Walter",
      preferredFromTime: "8:00 AM",
      preferredToTime: "9:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    assignedTeacher: "Muhammad Tariq",
    paymentStatus: "Pending",
    trialClassStatus: "Scheduled",
    paymentLink: "https://payment.example.com/link15",
  },
];

const Trailclasslist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<EvaluationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);


  const itemsPerPage = 11;
  const router = useRouter();

  useEffect(() => {
    setFilteredUsers(evaluation);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filteredItems = filteredUsers
    .filter((item) => {
      const searchFields = [
        item._id,
        `${item.student.studentFirstName} ${item.student.studentLastName}`,
        item.student.studentPhone.toString(),
        item.student.studentCountry,
        item.student.learningInterest,
        item.student.preferredTeacher,
        item.assignedTeacher,
        item.student.trialClassStatus,
      ];
      return searchFields.some((field) =>
        field
          ? field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false
      );
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSyncClick = () => {
    router.push("/admin-main/ui/trailmanagement");
  };

  const handleClick = (id: string) => {
    const selectedItem = evaluation.find((item) => item._id === id);
    if (selectedItem) {
      setShowModal(true);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page, and last page with ellipses
      const leftBound = Math.max(1, currentPage - 1);
      const rightBound = Math.min(totalPages, currentPage + 1);

      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) {
          pageNumbers.push(-1); // -1 represents ellipsis
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pageNumbers.push(-1); // -1 represents ellipsis
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
};

const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <BaseLayout4>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <div className="flex items-center space-x-2">
          <h2 className="text-[18px] font-semibold ">Scheduled Trial Class</h2>
        </div>
        <div className="flex flex-1 mt-8 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none ">
          <div className="flex">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-lg px-2 text-[12px] mr-4 shadow"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]">
              <FaFilter className="mr-2" /> Filter
            </button>
          </div>
          <div className="flex">
            <select className="border rounded-lg p-2 shadow text-[12px]">
              <option>Duration: Last month</option>
              <option>Duration: Last week</option>
              <option>Duration: Last year</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[580px] overflow-y-scroll scrollbar-none flex flex-col justify-between mt-4">
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg shadow bg-[#fff]">
                <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                  <tr>
                    <th className="p-3 py-5 text-center">Trial ID</th>
                    <th className="p-3 py-5 text-center">Student Name</th>
                    <th className="p-3 py-5 text-center">Mobile</th>
                    <th className="p-3 py-5 text-center">Country</th>
                    <th className="p-3 py-5 text-center">Course</th>
                    <th className="p-3 py-5 text-center">Preferred Teacher</th>
                    <th className="p-3 py-5 text-center">
                      Assigned Academic Coach
                    </th>
                    <th className="p-3 py-5 text-center">Date</th>
                    <th className="p-3 py-5 text-center">Time</th>
                    <th className="p-3 py-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`text-[9px] font-medium mt-0 ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="p-2 text-center">{item._id}</td>
                        <td className="p-2 text-center">
                          {item.student.studentFirstName}{" "}
                          {item.student.studentLastName}
                        </td>
                        <td className="p-2 text-center">
                          {item.student.studentPhone}
                        </td>
                        <td className="p-2 text-center">
                          {item.student.studentCountry}
                        </td>
                        <td className="p-2 text-center">
                          {item.student.learningInterest}
                        </td>
                        <td className="p-2 text-center">
                          {item.student.preferredTeacher}
                        </td>
                        <td className="p-2 text-center">
                          {item.student.assignedAcademicCoach}
                        </td>
                        <td className="p-2 text-center">11/02/2024</td>
                        <td className="p-2 text-center">
                          {item.student.preferredFromTime} -{" "}
                          {item.student.preferredToTime}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleClick(item._id.toString())}
                            className="bg-gray-800 hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-gray-900"
                          >
                            <FaEdit size={10} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <p className="text-[11px] text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} data
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronLeft size={8} />
              </button>

              {getPageNumbers().map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <span key={index} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-5 h-5 rounded-lg shadow text-[11px] ${
                      currentPage === pageNumber
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronRight size={8} />
              </button>
            </div>
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

export default Trailclasslist;
