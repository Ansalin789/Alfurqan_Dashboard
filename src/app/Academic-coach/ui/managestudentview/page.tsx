"use client";

import BaseLayout1 from "@/components/BaseLayout1";
import React, { useState, useRef, useEffect } from "react";
import { MdTune } from "react-icons/md";
import { MoreVertical, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import AcademicHeader from "../../components/academicHeader";
import Modal from "react-modal";

interface StudentDetails {
  studentDetails: {
    _id: string;
    username: string;
    password: string;
    role: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    __v: number;
    student: {
      studentId: string;
      studentEmail: string;
      studentPhone: number;
      course: string;
      package: string;
      city: string;
      country: string;
      gender: string;
    };
  };
  studentEvaluationDetails: {
    _id: string;
    academicCoachId: string;
    teacher: {
      teacherName: string;
    };
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
      preferredDate: string;
      evaluationStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
    };
    classType: string;
    classDay: string[];
    startTime: string[];
    endTime: string[];
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    subscription: {
      subscriptionId: string;
      subscriptionName: string;
      subscriptionPricePerHr: number;
      subscriptionDays: number;
      subscriptionStartDate: string;
      subscriptionEndDate: string;
    };
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
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    expectedFinishingDate: number;
    __v: number;
    teacherStatus: string;
  };
}

interface ClassSchedule {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  course: {
    courseName: string;
  };
  startDate: string;
  sessionClassType: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  status: string;
  classLink: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  amount: string;
  currency: string;
  classDay: string[];
  package: string;
}

type CardProps = {
  title: string;
  value: string | number;
  description: string;
};

const Card = ({ title, value, description }: CardProps) => (
  <div className="bg-[#7689BD] rounded-lg shadow-md p-4">
    <div className="text-[20px] text-[#fff] font font-semibold mb-4">
      {title}
    </div>
    <div className="text-[14px] text-[#fff] font-semibold ">{value}</div>
    <div className="text-[12px] text-[#fff] ">{description}</div>
  </div>
);

const ManageStudentView = () => {
  const itemsPerPage = 5;
  const router = useRouter();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [data, setData] = useState<StudentDetails | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ClassSchedule[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassSchedule[]>([]);
  const [paginatedData, setPaginatedData] = useState<ClassSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">(
    "scheduled"
  );
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [studentListWrite, setStudentListWrite] = useState(false); // For Assign Group Class

  //Rolebyaccess
  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("AcademicRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.academicmodules || roleAccess;

        setStudentListWrite(modules?.managestudents?.write === true); // ✅ already present
      } catch (error) {
        console.error("Invalid AcademicRolePermission JSON", error);
      }
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paginatedData.slice(indexOfFirstItem, indexOfLastItem);

  const dataToShow =
    activeTab === "scheduled" ? scheduledClasses : completedClasses;

  // Calculate total pages once, outside useEffect
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  //search

  const handleSearch = (query: string) => {
    setSearchText(query);
    const queryLower = query.toLowerCase();

    const filtered = dataToShow.filter((item) => {
      const studentFullName = `${item.student?.studentFirstName || ""} ${
        item.student?.studentLastName || ""
      }`;
      const course = item.package || "";
      const date = new Date(item.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const time = `${item.startTime?.[0] || ""} - ${item.endTime?.[0] || ""}`;
      const status = item.scheduleStatus || "";
      const classType = "Group Class"; // static in your code

      const combinedText =
        `${studentFullName} ${course} ${date} ${time} ${status} ${classType}`.toLowerCase();

      return combinedText.includes(queryLower);
    });

    setPaginatedData(filtered.slice(0, itemsPerPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    let filtered = dataToShow;

    if (searchText.trim() !== "") {
      const queryLower = searchText.toLowerCase();
      filtered = dataToShow.filter((item) => {
        const studentFullName = `${item.student?.studentFirstName || ""} ${
          item.student?.studentLastName || ""
        }`;
        const course = item.package || "";
        const date = new Date(item.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        const time = `${item.startTime?.[0] || ""} - ${
          item.endTime?.[0] || ""
        }`;
        const status = item.scheduleStatus || "";
        const classType = "Group Class";

        const combinedText =
          `${studentFullName} ${course} ${date} ${time} ${status} ${classType}`.toLowerCase();
        return combinedText.includes(queryLower);
      });
    }

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedData(paginated);
  }, [dataToShow, currentPage, searchText]);

  // Optional: reset page to 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  //Student data gettingby ID
  useEffect(() => {
    const fetchData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ Academicoach not found");
        return;
      }
      const alstudentsId = localStorage.getItem("studentManageID");
      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com/alstudents/${alstudentsId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  //Classschedule against the studentId

  useEffect(() => {
    const studentId =
      searchParams?.get("studentId") || localStorage.getItem("studentManageID");

    const fetchClassSchedule = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }

      if (!studentId) {
        console.warn("No studentId found in query params or localStorage");
        return;
      }

      console.log("Fetching class schedule for studentId:", studentId);

      try {
        const res = await fetch(
          `https://api.blackstoneinfomaticstech.com/classShedule/students?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Server responded with status:", res.status);
          return;
        }

        const data = await res.json();
        console.log("Fetched data from API:", data);

        const allSchedules: ClassSchedule[] = data.classSchedule;

        setScheduledClasses(
          allSchedules.filter(
            (c) =>
              c.scheduleStatus === "Scheduled" ||
              c.scheduleStatus === "Rescheduled" || 
              c.scheduleStatus === "RequestReschedule"
          )
        );

        setCompletedClasses(
          allSchedules.filter((c) => c.scheduleStatus === "Completed")
        );
      } catch (err) {
        console.error("Failed to fetch class schedule", err);
      }
    };

    fetchClassSchedule();
  }, [searchParams]);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleReschedule = (_id: string,course:string) => {
    console.log("Navigating to reschedule page");
    router.push(`studentreschedule?id=${_id}&course=${course}`);

    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };
  const FilterModal = ({
    isOpen,
    onClose,
    onApplyFilters,
    users,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
      studentName: string;
      course: string;
      Date: string;
      Time: string;
      classType: string;
      status: string;
    }) => void;
    users: ClassSchedule[];
  }) => {
    const [filters, setFilters] = useState({
      studentName: "",
      course: "",
      Date: "",
      Time: "",
      classType: "",
      status: "",
    });

    const handleApply = () => {
      onApplyFilters(filters);
      onClose();
    };

    const handleReset = () => {
      setFilters({
        studentName: "",
        course: "",
        Date: "",
        Time: "",
        classType: "",
        status: "",
      });
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-lg  w-[500px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[320px] relative dark:bg-[#252525]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                Filter by
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 text-xl absolute top-4 right-4"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Student Name
                </label>
                <input
                  type="text"
                  value={filters.studentName}
                  onChange={(e) =>
                    setFilters({ ...filters, studentName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>

              {/* Course */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Course
                </label>
                <select
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                >
                  <option value="">Select Course</option>
                  <option value="QURAN">Quran</option>
                  <option value="ARABIC">Arabic</option>
                  <option value="ISLAMIC STUDIES">Islamic Studies</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Date
                </label>
                <input
                  type="date"
                  value={filters.Date}
                  onChange={(e) =>
                    setFilters({ ...filters, Date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Time
                </label>
                <input
                  type="time"
                  value={filters.Time}
                  onChange={(e) =>
                    setFilters({ ...filters, Time: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>

              {/* Class Type */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Class Type
                </label>
                <select
                  value={filters.classType}
                  onChange={(e) =>
                    setFilters({ ...filters, classType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                >
                  <option value="">Select Class Type</option>
                  <option value="REGULAR">Regular Class</option>
                  <option value="GROUP">Group Class</option>
                  <option value="TRAIL">Trail Class</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                >
                  <option value="">Select Status</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 ">
                <button
                  onClick={handleReset}
                  className="w-[45%] py-2 border border-[#576CBC] text-[#576CBC] rounded-md text-sm font-medium hover:bg-blue-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="w-[50%] py-2 bg-[#576CBC] text-white rounded-md text-sm font-medium"
                >
                  Show{" "}
                  {
                    (activeTab === "scheduled"
                      ? scheduledClasses
                      : completedClasses
                    ).filter((user) => {
                      return (
                        (!filters.studentName ||
                          `${user.student?.studentFirstName ?? ""} ${
                            user.student?.studentLastName ?? ""
                          }`
                            .toLowerCase()
                            .includes(filters.studentName.toLowerCase())) &&
                        (!filters.course ||
                          user.course.courseName?.toLowerCase() ===
                            filters.course.toLowerCase()) &&
                        (!filters.Date ||
                          new Date(user.startDate).toLocaleDateString() ===
                            new Date(filters.Date).toLocaleDateString()) &&
                        (!filters.Time ||
                          (user.startTime &&
                            user.startTime.includes(filters.Time))) &&
                        (!filters.classType ||
                          user.sessionClassType?.toLowerCase() ===
                            filters.classType.toLowerCase()) &&
                        (!filters.status ||
                          user.scheduleStatus?.toLowerCase() ===
                            filters.status.toLowerCase())
                      );
                    }).length
                  }{" "}
                  results
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  // Add filter handling function
  const handleApplyFilters = (filters: {
    studentName: string;
    course: string;
    Date: string;
    Time: string;
    classType: string;
    status: string;
  }) => {
    const formatDate = (date: Date | string) =>
      new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'

    let filtered =
      activeTab === "scheduled" ? [...scheduledClasses] : [...completedClasses];

    if (filters.studentName) {
      filtered = filtered.filter((user) =>
        `${user.student?.studentFirstName ?? ""} ${
          user.student?.studentLastName ?? ""
        }`
          .toLowerCase()
          .includes(filters.studentName.toLowerCase())
      );
    }

    if (filters.Date) {
      filtered = filtered.filter(
        (user) => formatDate(user.startDate) === filters.Date
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (user) =>
          user.scheduleStatus?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.Time) {
      filtered = filtered.filter((user) =>
        user.startTime.includes(filters.Time)
      );
    }

    if (filters.course) {
      filtered = filtered.filter(
        (user) =>
          user.course.courseName?.toLowerCase() === filters.course.toLowerCase()
      );
    }

    if (filters.classType) {
      filtered = filtered.filter(
        (user) =>
          user.sessionClassType?.toLowerCase() ===
          filters.classType.toLowerCase()
      );
    }

    setPaginatedData(filtered);
    setCurrentPage(1); // Reset to first page
  };
  return (
    <BaseLayout1>
      <div>
        <AcademicHeader
          currentSection="Student"
          showBackButton={true}
          showBackPath="managestudents"
        />

        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Profile Card */}
          <div className="w-[560px] h-[246px] bg-[#5E6578] rounded-lg text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start">
            {/* Profile Image + Name */}
            <div className="flex flex-col items-center sm:pr-6 sm:border-r border-white/30">
              <img
                src="/assets/images/alstudent.jpg"
                alt="profile"
                className="w-[150px] h-[150px] rounded-full object-cover"
              />
              <h2 className="text-center text-[18px] font-semibold mt-3">
                {data?.studentDetails?.username}
              </h2>
              <p className="text-[14px] text-[#C9C9C9]">
                {data?.studentDetails?.student?.studentEmail}
              </p>
            </div>

            {/* Personal Info */}
            <div className="pt-8 sm:pl-6 w-full">
              <h3 className="text-[16px] font-semibold mb-3">Personal Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Contact</span>
                  <span className="text-[#DADADACC] text-[14px]">
                    {data?.studentDetails?.student?.studentPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Level</span>
                  <span className="text-[#DADADACC] text-[14px]">
                    {data?.studentEvaluationDetails?.readingLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Package</span>
                  <span className="text-[#DADADACC] text-[14px]">
                    {data?.studentDetails?.student?.package}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Class Type</span>
                  <span className="text-[#DADADACC] text-[14px]">
                    {data?.studentEvaluationDetails?.classType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <Card
              title="Performance"
              value="72%"
              description="60% increase than Last Month"
            />
            <Card
              title="Package"
              value="Standard"
              description="Upgraded from Basic"
            />
            <Card
              title="Total Attendance"
              value="97%"
              description="90% Progressive than Last Month"
            />
            <Card
              title="Total Reward Points"
              value="500"
              description="95% Progressive than Last Month"
            />
          </div>
        </div>

        {/* Tabs and Table Section */}

        <div className="flex space-x-6  px-4 py-2 rounded-md">
          <button
            className={`relative text-[14px] transition font-medium ${
              activeTab === "scheduled"
                ? "text-[#576CBC] font-semibold"
                : "text-[#0A0A12] dark:text-[#fff] opacity-80"
            }`}
            onClick={() => {
              setActiveTab("scheduled");
              setCurrentPage(1);
            }}
          >
            Scheduled ({scheduledClasses.length})
            {activeTab === "scheduled" && (
              <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC] dark:text-[#576CBC]" />
            )}
          </button>

          <button
            className={`relative text-[14px] transition font-medium ${
              activeTab === "completed"
                ? "text-[#576CBC] font-semibold"
                : "text-[#0A0A12] dark:text-[#fff] opacity-80"
            }`}
            onClick={() => {
              setActiveTab("completed");
              setCurrentPage(1);
            }}
          >
            Completed ({completedClasses.length})
            {activeTab === "completed" && (
              <span className="absolute left-0 ml-3 -bottom-1 w-[60px] h-[3px] rounded-full bg-[#576CBC]" />
            )}
          </button>
        </div>

        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-[15px] w-52 py-3 "
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div
              className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
            >
              {/* <BsFilterLeft /> */}
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                Showing {currentItems.length} of {paginatedData.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <table
            className="table-auto xw-full"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
              <tr className="font-medium">
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Student Name
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Course
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Time
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Class Type
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white  dark:bg-[#343434] dark:divide-gray-600">
              {paginatedData.map((item, index) => (
                <tr
                  key={item._id}
                  className={`text-[12px] h-[50px] ${
                    index % 2 === 0
                      ? "bg-[#fff] dark:bg-[#2C2C2C]"
                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                  }`}
                >
                  <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                    {item.student.studentFirstName}{" "}
                    {item.student.studentLastName}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    {item.course.courseName}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    {new Date(item.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {item.startTime?.[0]?.replace(/ AM| PM/, "") || "--:--"} -{" "}
                      {item.endTime?.[0]?.replace(/ AM| PM/, "") || "--:--"}
                    </td>
                  </td>

                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">{item.sessionClassType}</td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    <span
                      className={`font-semibold px-3 py-1 rounded-md text-[10px] ${
                        item.scheduleStatus === "Scheduled"
                          ? "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36] px-[18px]"
                          : item.scheduleStatus === "Rescheduled"
                          ? "bg-[#E4E4E4] text-[#000] dark:bg-[#555] dark:text-[#fff]"
                          : "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36]"
                      }`}
                    >
                      {item.scheduleStatus}
                    </span>
                  </td>
                  <td className="py-1 text-center relative" ref={dropdownRef}>
                    <button
                      onClick={
                        item.scheduleStatus === "Scheduled"
                          ? () => toggleDropdown(index)
                          : undefined
                      }
                      className={`${
                        item.scheduleStatus === "Scheduled"
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <MoreVertical
                        className={`w-4 h-4 mr-12 ${
                          item.scheduleStatus === "Scheduled"
                            ? "text-slate-600 dark:text-[#FDFDFD]"
                            : "text-gray-500 dark:text-gray-200 opacity-50"
                        }`}
                      />
                    </button>

                    {/* Only show dropdown if status is Scheduled and activeDropdown is set */}
                    {item.scheduleStatus === "Scheduled" &&
                      activeDropdown === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border dark:border-[#5c5c5c] dark:bg-[#343434]"
                        >
                          <div className="py-1">
                            <button
                              className={`w-full text-left px-4 py-2 text-[12px] ${
                                studentListWrite
                                  ? "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444]"
                                  : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444] cursor-not-allowed"
                              }`}
                              onClick={
                                studentListWrite
                                  ? () => handleReschedule(item._id,item.course.courseName)
                                  : undefined
                              }
                              disabled={!studentListWrite}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => setActiveDropdown(null)}
                              className="w-full text-left px-4 py-2 text-red-600"
                            >
                              Cancel
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/*filterform  */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        users={activeTab === "scheduled" ? scheduledClasses : completedClasses}
      />
    </BaseLayout1>
  );
};

export default ManageStudentView;
