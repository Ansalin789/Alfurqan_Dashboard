"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseLayout1 from "../../../../components/BaseLayout1";
import TotalList from "../../components/TotalList";
import NextEvaluationClass from "../../components/NextEvaluationClass";
import TeachersStudents from "../../components/TeachersStudent";
import Countries from "../../components/Countries";
import Teacherscard from "../../components/Teachercard";
import Calender from "../../components/Calender";
import UpcomingClasses from "../../components/UpcommingClasses";
import AcademicHeader from "../../components/academicHeader";
import { useRouter } from "next/navigation";

import { getSocket } from "@/app/utils/socket";

// Define the transformed user structure
interface TransformedUser {
  _id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  number: string;
  country: string;
  city: string;
  course: string; // Assuming this corresponds to `learningInterest`
  preferredTeacher: string;
  time: string;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
  paymentStatus: string;
  assignedTeacher: string;
  paymentLink: string;
  studentStatus: string; // Optional if not always present
  createdDate: Date; // Optional if not always present
}
// Define the return type of the getAllUsers function
interface User {
  sortTimestamp: any;
  id: string;
  studentId: string;
  fname: string;
  lname: string;
  email: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
  status?: string;
  evaluationStatus?: string;
  city: string;
  students?: number;
  comment?: string;
  createdDate: Date;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string; // Make message optional
}
interface ClassPayload {
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
    learningInterest?: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime?: string;
    preferredToTime?: string;
    timeZone: string;
    referralSource: string;
    preferredDate?: string;
    evaluationStatus: string;
    status: string;
    createdDate: Date;
    createdBy: string;
  };
  classType: string;
  teacher: {
    teacherName: string;
  };
  classDay?: string[]; // assuming it's an array of days like ['Monday', 'Wednesday']
  startTime?: string[];
  endTime?: string[];
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
  classStartDate: Date | string;
  classEndDate: Date | string;
  classStartTime: string;
  classEndTime: string;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  accomplishmentTime?: string;
  studentRate: number;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  teacherStatus: string;
  status: string;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}

const getAllUser = async (): Promise<{
  success: boolean;
  data: TransformedUser[];
  message: string;
}> => {
  try {
    const academicId = localStorage.getItem("AcademicCoachPortalId");
    console.log("academicId>>", academicId);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
    }
    const response = await axios.get(
      `https://api.alfurqanapp.com/evaluationlist`,
      {
        params: { academicCoachId: academicId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Add debug log for raw API response
    console.log("Raw API Response:", response.data.evaluation);

    // Transform API data to match TransformedUser interface
    const transformedData: TransformedUser[] = response.data.evaluation.map(
      (item: any) => {
        // Debug log for each item's studentStatus
        console.log("Item studentStatus before transform:", item.studentStatus);
        return {
          _id: item._id,
          studentId: item.student.studentId,
          studentFirstName: item.student.studentFirstName,
          studentLastName: item.student.studentLastName,
          number: item.student.studentPhone
            ? item.student.studentPhone.toString()
            : "",
          country: item.student.studentCountry,
          city: item.city,
          course: item.student.learningInterest,
          preferredTeacher: item.student.preferredTeacher,
          time: item.student.preferredFromTime,
          classStatus: item.student.classStatus,
          status: item.student.status,
          trialClassStatus: item.trialClassStatus,
          paymentStatus: item.paymentStatus,
          assignedTeacher: item.assignedTeacher,
          paymentLink: item.paymentLink,
          studentStatus: item.studentStatus,
        };
      }
    );

    // Debug log for transformed data
    console.log("Transformed Data:", transformedData);

    return {
      success: true,
      data: transformedData,
      message: "Users fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
};

// Update the getAllUsers function to fetch from your API
const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const academicId = localStorage.getItem("AcademicCoachPortalId");
    console.log("academicId>>", academicId);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
    }
    const response = await axios.get(
      `https://api.alfurqanapp.com/studentlist`,
      {
        params: { academicCoachId: academicId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Raw API Response:", JSON.stringify(response.data, null, 2));
    console.log(
      "First student data:",
      JSON.stringify(response.data.students[0], null, 2)
    );
    console.log("First student status:", response.data.students[0]?.status);
    console.log(
      "First student studentStatus:",
      response.data.students[0]?.studentStatus
    );

    if (!response.data.students || !Array.isArray(response.data.students)) {
      throw new Error("Invalid data structure received from API");
    }

    // Transform API data to match User interface
    const transformedData = response.data.students.map(
      (item: {
        _id: string;
        studentId: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        city: string;
        country: string;
        learningInterest: string;
        preferredTeacher: string;
        startDate: string;
        preferredFromTime: string;
        preferredToTime: string;
        evaluationStatus?: string;
        status?: string;
        createdDate: string;
      }) => {
        console.log("Processing item - Original data:", {
          status: item.status,
          allFields: Object.keys(item),
        });
        const transformed = {
          id: item._id,
          studentId: item.studentId,
          fname: item.firstName,
          lname: item.lastName,
          email: item.email,
          city: item.city,
          number: item.phoneNumber.toString(),
          country: item.country,
          course: item.learningInterest,
          preferredTeacher: item.preferredTeacher,
          date: new Date(item.startDate).toLocaleDateString(),
          time: item.preferredFromTime,
          evaluationStatus: item.evaluationStatus,
          createdDate: new Date(item.createdDate),
        };
        console.log("Transformed item - Final data:", {
          allFields: Object.keys(transformed),
        });
        return transformed;
      }
    );

    return {
      success: true,
      data: transformedData,
      message: "Users fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log(setItemsPerPage);

  const [evaluationUsers, setEvaluationUsers] = useState<TransformedUser[]>([]);

  useEffect(() => {
    const fetchEvaluationUsers = async () => {
      const result = await getAllUser();
      if (result.success) {
        setEvaluationUsers(result.data);
      }
    };
    fetchEvaluationUsers();
  }, []);
  useEffect(() => {
    const academicId =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
    if (!academicId) return;
    const socket = getSocket(academicId);
    const handleList = (data: {
      event: string;
      data: User | ClassPayload;
      sender: string;
    }) => {
      console.log("📩 Received WebSocket Data:", data);
      if ("studentId" in data.data) {
        const user = data.data as User;
        const formatted: User = {
          sortTimestamp: user.sortTimestamp,
          id: user.id,
          studentId: user.studentId,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          number: user.number,
          country: user.country,
          city: user.city,
          course: user.course,
          preferredTeacher: user.preferredTeacher,
          date: new Date(user.date).toLocaleDateString(),
          time: user.time,
          evaluationStatus: user.evaluationStatus ?? "PENDING",
          status: "PENDING",
          createdDate: new Date(user.createdDate),
        };

        console.log("➡️ Action: create", formatted.studentId);
        setFilteredUsers((prev) => [...prev, formatted]);
        setUsers((pre) => [...pre, formatted]);
      } else {
        const classPayload = data.data as ClassPayload;
        const student = classPayload.student;

        console.log("➡️ Action: update", student.studentId);

        setFilteredUsers((prev) =>
          prev.map((user) =>
            user.studentId === student.studentId
              ? {
                ...user,
                evaluationStatus: student.evaluationStatus ?? "PENDING",
                status: classPayload.studentStatus ?? "NOT JOINED",
              }
              : user
          )
        );
        setUsers((prev) =>
          prev.map((user) =>
            user.studentId === student.studentId
              ? {
                ...user,
                evaluationStatus: student.evaluationStatus ?? "PENDING",
                status: classPayload.studentStatus ?? "NOT JOINED",
              }
              : user
          )
        );
      }
    };

    socket.on("academicStudentList", handleList);
    return () => {
      socket.off("academicStudentList", handleList);
    };
  }, []);

  const router = useRouter();
  const handleSyncClick = () => {
    if (router) {
      router.push("TrailSection");
    } else {
      console.error("Router is not available");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllUsers();
        if (allData.success && allData.data) {
          setUsers(allData.data);
          setFilteredUsers(allData.data);
        } else {
          setErrorMessage(allData.message ?? "Failed to fetch users");
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred");
        console.error("An unexpected error occurred", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Modal.setAppElement("body");
  }, []);


  useEffect(() => {
    console.log("Current users data:", users);
  }, [users]);


  // if (error) return <div>Error: {error}</div>;


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const recentItems = [...filteredUsers]
    .sort((a, b) => b.sortTimestamp - a.sortTimestamp)
    .slice(0, 5);
  return (
    <BaseLayout1>
      <AcademicHeader currentSection="Dashboard" />
      <div className="flex flex-row gap-4 p-0 min-h-screen">
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <TotalList />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <NextEvaluationClass />
          </div>

          <div className="flex gap-4">
            <div className="w-[33%] bg-white dark:bg-[#343434] rounded-xl h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <TeachersStudents />
            </div>
            <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <Countries />
            </div>
            <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <Teacherscard />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg dark:bg-[#343434]">
            <h2 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-0 px-5 py-3">Student Evaluation</h2>
            <div className="overflow-x-auto scrollbar-none h-full">
              <div className="overflow-y-auto h-[325px] rounded-b-xl scrollbar-none">
                <table className="min-w-full text-xs border-collapse table-fixed px-4">
                  <thead className=" text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d]">
                    <tr>
                      {[
                        { label: "Student ID" },
                        { label: "Student Name" },
                        { label: "Date" },
                        { label: "Mobile" },
                        { label: "Country" },
                        { label: "Course" },
                        { label: "Preferred Teacher" },
                        { label: "EvaluationStatus" },
                      ].map((header) => (
                        <th
                          key={header.label}
                          className="py-4 px-2 font-semibold text-left border border-[#466993] dark:border-[#466993]"
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.length > 0 ? (
                      recentItems.map((item, index) => (
                        <tr
                          key={item.studentId}
                          className="text-[11px] px-2 py-4 border-none outline-none odd:bg-[#f8f8f8] even:bg-[#ffffff] dark:odd:bg-[#2c2c2c] dark:even:bg-[#303030]"
                        >
                          <td className="py-4 px-2 text-left">{item.studentId}</td>
                          <td className="py-4 px-2 text-left">{item.fname} {item.lname}</td>
                          <td className="py-4 px-2 text-left">{new Date(item.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          <td className="py-4 px-2 text-left">{item.number}</td>
                          <td className="py-4 px-2 text-left">{item.country}</td>
                          <td className="py-4 px-2 text-left">{item.course}</td>
                          <td className="py-4 px-2 text-left">
                            {item.preferredTeacher}
                          </td>
                          <td className="py-4 px-2 text-left"><span
                            className={`px-1 text-[10px] text-center py-[3px] rounded-md ${item.evaluationStatus === "COMPLETED"
                                ? "bg-[#ECFDF3] text-[#377E36] px-2 dark:bg-[#377E3633]"
                                : item.evaluationStatus === "INPROGRESS"
                                  ? " bg-[#FDECEC] text-[#D34645]  px-3 dark:bg-[#D3464533]"
                                  : "bg-[#FDF6EC] text-[#F0AD4E] px-3 dark:bg-[#F0AD4E33]"
                              }`}
                          >
                            {item.evaluationStatus === "COMPLETED"
                              ? "COMPLETED"
                              : item.evaluationStatus === "INPROGRESS"
                                ? "IN PROGRESS"
                                : "PENDING"}
                          </span></td>
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
          </div>
        </div>

        <div className="w-[310px] flex flex-col gap-4">
          <div className="rounded-xl shadow-lg">
            <div className="h-[320px] bg-white rounded-xl flex items-center justify-center text-gray-400 dark:bg-[#343434]">
              <Calender />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-2 dark:bg-[#343434] h-[640px]">
            <div className="flex justify-between items-center pr-2">
              <h3 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-2 px-3 py-2">
                Upcoming Class
              </h3>
              <button className="px-2 py-1 rounded flex font-medium items-center gap-1 text-[10px] dark:text-[#576CBC] dark:bg-[#3D414A] bg-[#ebefff] text-[#576CBC]">
                Today
              </button>
            </div>

            <div className="relative pl-4 space-y-4 h-full overflow-y-auto scrollbar-none">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}
