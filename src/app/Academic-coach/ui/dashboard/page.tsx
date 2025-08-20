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

// Define the return type of the getAllUsers function
interface User {
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
  city?: string;
  students?: number;
  comment?: string;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string; // Make message optional
}

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
      `https://api.blackstoneinfomaticstech.com/studentlist`,
      {
        params: { academicCoachId: academicId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response>>>", response);

    // const rawData = JSON.stringify(response.data);
    // console.log('Raw API Response:', rawData); // Debug log
    // Check if rawData.students exists and is an array
    if (!response.data.students || !Array.isArray(response.data.students)) {
      throw new Error("Invalid data structure received from API");
    }

    // Transform API data to match User interface
    const transformedData = response.data.students.map(
      (item: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        country: string;
        learningInterest: string;
        preferredTeacher: string;
        startDate: string;
        preferredFromTime: string;
        preferredToTime: string;
        evaluationStatus?: string;
      }) => ({
        studentId: item._id,
        fname: item.firstName,
        lname: item.lastName,
        email: item.email,
        number: item.phoneNumber.toString(),
        country: item.country,
        course: item.learningInterest,
        preferredTeacher: item.preferredTeacher,
        date: new Date(item.startDate).toLocaleDateString(),
        time: item.preferredFromTime,
        evaluationStatus: item.evaluationStatus,
      })
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log(setItemsPerPage);

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

  const openModal = (user: User | null = null) => {
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

  const fetchStudents = async () => {
    try {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data);
      } else {
        setErrorMessage(allData.message ?? "Failed to fetch users");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error("An unexpected error occurred", error);
    }
  };

  const handleEditClick = (studentId: User) => {
    setSelectedUserData(studentId);
    setModalIsOpen(true);
  };

  // Add filter handling function
  const handleApplyFilters = (filters: {
    country: string;
    course: string;
    teacher: string;
    status: string;
    trailId: string;
    studentName: string;
    email: string;
    mobile: string;
    time: string;
    evaluationStatus: string;
  }) => {
    let filtered = [...users];

    if (filters.country) {
      filtered = filtered.filter((user) => user.country === filters.country);
    }
    if (filters.course) {
      filtered = filtered.filter((user) => user.course === filters.course);
    }
    if (filters.teacher) {
      filtered = filtered.filter(
        (user) => user.preferredTeacher === filters.teacher
      );
    }
    if (filters.status) {
      filtered = filtered.filter(
        (user) => user.evaluationStatus === filters.status
      );
    }
    if (filters.trailId) {
      filtered = filtered.filter((user) =>
        user.studentId.includes(filters.trailId)
      );
    }
    if (filters.studentName) {
      filtered = filtered.filter((user) =>
        `${user.fname} ${user.lname}`
          .toLowerCase()
          .includes(filters.studentName.toLowerCase())
      );
    }
    if (filters.email) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.mobile) {
      filtered = filtered.filter((user) =>
        user.number.includes(filters.mobile)
      );
    }
    if (filters.time) {
      filtered = filtered.filter((user) => user.time.includes(filters.time));
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) => {
      const fullName = `${user.fname} ${user.lname}`.toLowerCase();
      return (
        user.studentId.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.number.includes(query) ||
        user.country.toLowerCase().includes(query.toLowerCase()) ||
        user.course.toLowerCase().includes(query.toLowerCase()) ||
        user.preferredTeacher.toLowerCase().includes(query.toLowerCase()) ||
        user.time.toLowerCase().includes(query.toLowerCase()) ||
        user.evaluationStatus?.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // if (error) return <div>Error: {error}</div>;


    // Pagination logic: calculate currentItems based on filteredUsers, currentPage, and itemsPerPage
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  return (
    <BaseLayout1>
      <AcademicHeader currentSection="Dashboard" />
      <div className="flex flex-row gap-4 p-0 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <TotalList />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <NextEvaluationClass />
          </div>

          {/* Charts Row */}
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

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-lg dark:bg-[#343434]">
            <h2 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-0 px-5 py-3">Student Evaluation</h2>
            <div className="overflow-x-auto scrollbar-none h-full">
              <div className="overflow-y-auto h-[335px] rounded-b-xl scrollbar-none">
                <table className="min-w-full text-xs border-collapse table-fixed px-4">
                  <thead className=" text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d]">
                    <tr>
                      {[
                        { label: "Trial ID" },
                        { label: "Name" },
                        { label: "Mobile" },
                        { label: "Country" },
                        { label: "Course" },
                        { label: "Preferred Teacher" },
                        { label: "Date" },
                        { label: "Time" },
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
                  {currentItems.length > 0 ? (
                        currentItems.slice(-5).reverse().map((item, index) => (
                      <tr
                        key={item.studentId}
                        className="text-[11px] px-2 py-4 border-none outline-none odd:bg-[#f8f8f8] even:bg-[#ffffff] dark:odd:bg-[#2c2c2c] dark:even:bg-[#303030]"
                      >
                        <td className="py-4 px-2 text-left">{item.studentId}</td>
                        <td className="py-4 px-2 text-left">{item.fname} {item.lname}</td>
                        <td className="py-4 px-2 text-left">{item.number}</td>
                        <td className="py-4 px-2 text-left">{item.country}</td>
                        <td className="py-4 px-2 text-left">{item.course}</td>
                        <td className="py-4 px-2 text-left">
                          {item.preferredTeacher}
                        </td>
                        <td className="py-4 px-2 text-left">{item.date}</td>
                        <td className="py-4 px-2 text-left">{item.time}</td>
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
            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                {/* Showing {applicants.length} of {totalApplications} */}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[310px] flex flex-col gap-4">
          {/* Calendar */}
          <div className="rounded-xl shadow-lg">
            <div className="h-[320px] bg-white rounded-xl flex items-center justify-center text-gray-400 dark:bg-[#343434]">
              <Calender />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-2 dark:bg-[#343434] h-[640px]">
            {/* Header */}
            <div className="flex justify-between items-center pr-2">
              <h3 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-2 px-3 py-2">
                Upcoming Class
              </h3>
              <button className="px-2 py-1 rounded flex font-medium items-center gap-1 text-[10px] dark:text-[#576CBC] dark:bg-[#3D414A] bg-[#ebefff] text-[#576CBC]">
                Today 
              </button>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-4 h-full overflow-y-auto scrollbar-none">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}
