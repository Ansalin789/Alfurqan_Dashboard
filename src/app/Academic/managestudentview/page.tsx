"use client";

import { useRouter } from "next/navigation";
import BaseLayout1 from "@/components/BaseLayout1";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";

const ManageStudentView = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("scheduled");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);

  const [studentData, setStudentData] = useState<StudentData>();
  interface Teachers {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }

  interface TimeSlot {
    label: string;
    value: string;
  }
  interface StudentData {
    studentDetails: {
      _id: string;
      student: {
        studentId: string;
        studentEmail: string;
        studentPhone: number;
      };
      username: string;
      password: string;
      role: string;
      status: string;
      createdDate: string;
      createdBy: string;
      updatedDate: string;
      __v: number;
    };

    studentEvaluationDetails: {
      student: {
        studentId: string;
        studentFirstName: string;
        studentLastName: string;
        studentEmail: string;
        studentPhone: number;
        studentCountry: string;
        studentCountryCode: string;
        learningInterest: string;
        numberOfStudents: number;
        preferredTeacher: string;
        preferredFromTime: string;
        preferredToTime: string;
        timeZone: string;
        referralSource: string;
        preferredDate: string;
        evaluationStatus: string;
        status: string;
        createdDate: string;
        createdBy: string;
      };
      subscription: {
        subscriptionName: string;
      };
      teacher: Teachers;
      classDay: string[];
      startTime: string[];
      endTime: string[];
      _id: string;
      isLanguageLevel: boolean;
      languageLevel: string;
      isReadingLevel: boolean;
      readingLevel: string;
      isGrammarLevel: boolean;
      grammarLevel: string;
      hours: number;
      planTotalPrice: number;
      classStartDate: string;
      classEndDate: string;
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
      studentStatus: string;
      classStatus: string;
      comments: string;
      trialClassStatus: string;
      invoiceStatus: string;
      paymentLink: string;
      paymentStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
      updatedDate: string;
      updatedBy: string;
      expectedFinishingDate: number;
      assignedTeacherId: string;
      assignedTeacherEmail: string;
      __v: number;
    };
  }
  interface Teacher {
    _id: string;
    userName: string;
    email: string;
    password: string;
    role: string[]; // Array of roles, e.g., "TEACHER"
    profileImage: string | null; // Could be a URL or null
    status: string; // Active/Inactive status
    createdBy: string; // Who created the record
    lastUpdatedBy: string; // Who last updated the record
    userId: string; // Unique ID for the user
    lastLoginDate: string; // Last login timestamp
    createdDate: string; // Creation timestamp
    lastUpdatedDate: string; // Last update timestamp
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const studentId = localStorage.getItem("studentManageID");
    console.log(">>>>>", studentId);
    if (studentId) {
      const fetchData = async () => {
        try {
          const auth = localStorage.getItem("authToken");
          const response = await fetch(
            `http://localhost:5001/alstudents/${studentId}`,
            {
              headers: {
                Authorization: `Bearer ${auth}`,
              },
            }
          );
          const data = await response.json();
          setStudentData(data);
          console.log("student data form evalutional" + JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };
      fetchData();
    }
    const studentlist = async () => {
      try {
        const auth = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5001/classShedule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });
        const data = await response.json();
        setStudentllistdata(data);
        console.log(JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    studentlist();
  }, []);

  const scheduledClasses = Array.from({ length: 5 }).map(() => ({
    name: "Samantha William",
    course: "Tajweed Masterclass",
    date: "January 2, 2020",
    status: "Scheduled",
  }));

  const completedClasses = Array.from({ length: 50 }).map(() => ({
    name: "John Smith",
    course: "Advanced Quran Reading",
    date: "December 15, 2023",
    status: "Completed",
    grade: "A",
    performance: "95%",
  }));

  const totalPages = Math.ceil(
    (activeTab === "scheduled"
      ? scheduledClasses.length
      : completedClasses.length) / itemsPerPage
  );

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleReschedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Navigating to reschedule page");
    router.push("/Academic/studentreschedule");

    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };
  interface StudentListData {
    _id: string;
    classDay: string[];
    classLink: string;
    createdBy: string;
    createdDate: string;
    endDate: string;
    endTime: string[];
    lastUpdatedDate: string;
    package: string;
    preferedTeacher: string;
    scheduleStatus: string;
    startDate: string;
    startTime: string[];
    status: string;
    student: {
      gender: string;
      studentEmail: string;
      studentFirstName: string;
      studentId: string;
      studentLastName: string;
    };
    teacher: {
      teacherEmail: string;
      teacherId: string;
      teacherName: string;
    };
    totalHourse: number;
    __v: number;
  }

  interface StudentApiResponse {
    totalCount: number;
    students: StudentListData[]; // An array of StudentListData objects
  }

  const [filteredStudents, setFilteredStudents] = useState<StudentListData[]>(
    []
  );
  const [studentIdLocal, setStudentIdLocal] = useState<string | null>(null);
  const [studentllistdata, setStudentllistdata] =
    useState<StudentApiResponse | null>(null); // ✅ Use StudentApiResponse type
  useEffect(() => {
    const studentId = localStorage.getItem("studentManageID");
    setStudentIdLocal(studentId);
  }, []);

  useEffect(() => {
    console.log("studentIdLocal:", studentIdLocal);
    console.log("Raw studentllistdata:", studentllistdata);

    if (!studentIdLocal) {
      console.log("❌ studentIdLocal is null or undefined");
      setFilteredStudents([]);
      return;
    }

    if (!studentllistdata || typeof studentllistdata !== "object") {
      console.log("❌ studentllistdata is not an object:", studentllistdata);
      setFilteredStudents([]);
      return;
    }

    // Debugging students array
    console.log("Checking students type:", typeof studentllistdata.students);
    console.log(
      "Is students an array?:",
      Array.isArray(studentllistdata.students)
    );

    if (
      !studentllistdata.students ||
      !Array.isArray(studentllistdata.students)
    ) {
      console.log(
        "❌ studentllistdata.students is not an array OR is undefined:",
        studentllistdata.students
      );
      setFilteredStudents([]);
      return;
    }

    console.log(
      "✅ studentllistdata.students is an array with length:",
      studentllistdata.students.length
    );

    // Now filtering
    const filtered = studentllistdata.students.filter(
      (item) => item?.student?.studentId?.trim() === studentIdLocal.trim()
    );

    console.log("✅ Filtered students:", filtered);
    setFilteredStudents(filtered);
  }, [studentIdLocal, studentllistdata]);

  return (
    <BaseLayout1>
      <div className="flex flex-col md:flex-row pt-14 pl-4 min-h-screen">
        <div className="p-2">
          <IoArrowBackCircleSharp
            className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer"
            onClick={() => router.push("manageStudents")}
          />
        </div>
        <div className="flex flex-col items-center bg-[#fff] shadow-lg rounded-2xl md:w-[300px] h-[600px]">
          <div className="bg-[#012a4a] align-middle p-6 w-full h-1/4 rounded-t-2xl">
            <div className="justify-center">
              <Image
                src="/assets/images/proff.jpg"
                alt="Profile"
                className="rounded-full justify-center align-middle text-center ml-16 w-24 h-24 mb-4 mt-[60px]"
                width={150}
                height={150}
              />
            </div>
            <div className="justify-center text-center  border-b-2 border-b-black">
              <h2 className="text-2xl font-semibold mb-2">
                {studentData?.studentEvaluationDetails?.student
                  ?.studentFirstName ?? ""}
              </h2>
              <p className="text-gray-500 mb-4">Student</p>
            </div>

            <div className="text-left w-full p-2 pt-6">
              <h3 className="font-semibold mb-2">Personal Info</h3>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Full Name: </span>
                {
                  studentData?.studentEvaluationDetails?.student
                    ?.studentFirstName
                }
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Email: </span>
                {studentData?.studentEvaluationDetails?.student?.studentEmail}
              </p>
              <p className="text-gray-800 text-[13px] mb-1">
                <span className="font-semibold text-[14px]">
                  Phone Number:{" "}
                </span>
                {studentData?.studentEvaluationDetails?.student?.studentPhone}
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Level: </span>1
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Package: </span>
                {
                  studentData?.studentEvaluationDetails?.subscription
                    ?.subscriptionName
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:ml-28 w-full md:w-2/3 md:-mt-14 p-10 -mt-14">
          <div className="flex flex-wrap justify-between items-center mb-4 ml-28">
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-blue-500 text-3xl font-semibold">
                  97%
                </span>
                <span className="text-gray-800">Attendance</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-yellow-500 text-3xl font-semibold">
                  64%
                </span>
                <span className="text-gray-800">Performance</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-purple-500 text-3xl font-semibold">
                  Gold
                </span>
                <span className="text-gray-800">Package</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-pink-500 text-3xl font-semibold">
                  245
                </span>
                <span className="text-gray-800">Reward Points</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-[#1C3557] w-[700] h-[350px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
            <h2 className="text-[16px] font-medium p-4">Schedule Classes</h2>
            <div className="flex justify-start items-center border-b mb-2">
              <button
                className={`py-3 px-2 ml-5 text-[13px] ${
                  activeTab === "scheduled"
                    ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => {
                  setActiveTab("scheduled");
                  setCurrentPage(1);
                }}
              >
                Scheduled (
                {
                  filteredStudents.filter((item) => item.status !== "Completed")
                    .length
                }
                )
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-none">
              <table className="table-auto w-full">
                <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                  <tr>
                    <th className="py-2 text-[11px] text-center">Name</th>
                    <th className="py-2 text-[11px] text-center">Courses</th>
                    <th className="py-2 text-[11px] text-center">Date</th>
                    <th className="py-2 text-[11px] text-center">Status</th>
                    <th className="py-2 text-[11px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents
                    .filter((item) => item.status !== "Completed")
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((item, index) => (
                      <tr
                        key={item._id}
                        className={`text-[12px] font-medium mt-2 ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="py-1 text-[10px] text-center">
                          {item.student.studentFirstName}
                        </td>
                        <td className="py-1 text-[10px] text-center">
                          {
                            studentData?.studentEvaluationDetails?.student
                              ?.learningInterest
                          }
                        </td>
                        <td className="py-1 text-[10px] text-center">
                          {item.startDate
                            ? new Date(item.startDate)
                                .toISOString()
                                .slice(0, 10)
                            : "N/A"}
                        </td>
                        <td className="py-1 text-center">
                          <button
                            className={`px-2 py-1 rounded-md text-[10px] text-center ${
                              item.status === "Completed"
                                ? "bg-green-600"
                                : "bg-gray-900"
                            } text-white`}
                          >
                            {item.status || "N/A"}
                          </button>
                        </td>
                        <td
                          className="py-1 text-center relative"
                          ref={dropdownRef}
                        >
                          {activeTab === "scheduled" && (
                            <button onClick={() => toggleDropdown(index)}>
                              <FiMoreHorizontal className="inline-block text-xl cursor-pointer" />
                            </button>
                          )}
                          {activeDropdown === index &&
                            activeTab === "scheduled" && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                              >
                                <div className="py-1">
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleReschedule}
                                  >
                                    Reschedule
                                  </button>
                                </div>
                              </div>
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-1 pr-2 pl-2">
              <span className="text-[9px]">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredStudents.filter((item) => item.status !== "Completed")
                    .length
                )}{" "}
                of{" "}
                {
                  filteredStudents.filter((item) => item.status !== "Completed")
                    .length
                }{" "}
                entries
              </span>
              <div className="flex space-x-2">
                <button
                  className={`px-2 py-1 rounded text-[9px] ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {totalPages > 5 ? (
                  <>
                    <button
                      className={`px-2 py-1 rounded text-[9px] ${
                        currentPage === 1
                          ? "bg-[#1B2B65] text-white text-[9px]"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="px-2 py-1">...</span>}
                    {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                      .filter((page) => page > 1 && page < totalPages)
                      .map((page) => (
                        <button
                          key={page}
                          className={`px-2 py-1 rounded text-[9px] ${
                            currentPage === page
                              ? "bg-[#1B2B65] text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    {currentPage < totalPages - 2 && (
                      <span className="px-2 py-1">...</span>
                    )}
                    <button
                      className={`px-2 py-1 rounded text-[9px] ${
                        currentPage === totalPages
                          ? "bg-[#1B2B65] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : (
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`px-2 py-1 rounded text-[9px] ${
                        currentPage === index + 1
                          ? "bg-[#1B2B65] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                )}
                <button
                  className={`px-2 py-1 rounded text-[9px] ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ManageStudentView;
