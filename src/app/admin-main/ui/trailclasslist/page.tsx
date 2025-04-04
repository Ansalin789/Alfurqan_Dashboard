"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaEdit, FaFilter, FaSyncAlt } from "react-icons/fa";

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
];

const Trailclasslist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<EvaluationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>();

  const itemsPerPage = 5;
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

  const handleCloseModal = () => {
    setShowModal(false);
  };



  return (
    <BaseLayout4>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <div className="flex items-center space-x-2">
          <h2 className="text-[18px] font-semibold ">Trial Class Request</h2>
          <button
            className="bg-gray-800 text-white p-[4px] rounded-full shadow-2xl"
            onClick={handleSyncClick}
          >
            <FaSyncAlt />
          </button>
        </div>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[500px] overflow-y-scroll scrollbar-none flex flex-col justify-between mt-8">
          <div>
            <div className="flex flex-1 mb-4 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none p-6">
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
                    filteredItems.map((item) => (
                      <tr key={item._id} className="text-[9px] font-medium">
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
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[720px]">
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
