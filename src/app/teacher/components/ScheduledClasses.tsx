// updated
"use client";

import React, { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { MoreVertical, Search } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import Modal from "react-modal";
import { FaEye } from "react-icons/fa";
import { getSocket } from "@/app/utils/socket";



interface ClassData {
  isTrial: boolean;
  classType: string;
  trialclass: any;
  _id: string;
  classDay: string[]; // ISO date strings
  package: string;
  totalHourse: number;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  teacherAttendee: string;
  studentAttendee: string;
  classhour: string;
  currency: string;
  amount: string;
  earnings: number;
  isSalaryProcessed: boolean;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  sessionStatus: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;

  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
    level: string;
    studnetSessionStart: string[];
    studnetSessionEnd: string[];
  };

  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
    teacherSessionStart: string | null;
    teacherSessionEnd: string | null;
  };

  course: {
    courseId: string;
    courseName: string;
  };

  alfstudent: {
    _id: string;
    username: string;
    password: string;
    sessionClassType: string;
    role: string;
    level: string;
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
}


interface TrialClass {
  academicCoach: {
    academicCoachId: string | null;
    name: string | null;
    email: string | null;
  };
  teacher: {
    teacherId: string;
    name: string;
    email: string;
  };
  student: {
    studentId: string;
    name: string;
    email: string;
    city: string;
    country: string;
    phonenumber: string;
  };
  course: {
    courseId: string;
    courseName: string;
  };
  _id: string;
  trialId: string;
  subject: string;
  meetingLocation: string;
  classType: string;
  meetingType: string;
  meetingLink: string;
  isScheduledMeeting: boolean;
  scheduledStartDate: string;
  scheduledEndDate: string;
  scheduledFrom: string;
  scheduledTo: string;
  timeZone: string;
  description: string;
  meetingStatus: string;
  studentResponse: string;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
  trialclasses: TrialClass;
}

const ScheduledClasses = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    courseName: "",
    teacher: "",
    scheduleStatus: "",
    studentName: "",
    fromDate: "",
    toDate: "",
  });

  const itemsPerPage = 10;
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [completedData, setCompletedData] = useState<ClassData[]>([]);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

const fetchClasses = async () => {
  try {
    const teacherId = localStorage.getItem("TeacherPortalId");
    const token = localStorage.getItem("TeacherAuthToken");

    console.log("Fetching classes...");
    console.log("Teacher ID:", teacherId);
    console.log("Auth Token Present:", !!token);

    if (!token || !teacherId) {
      console.warn("Missing token or teacher ID.");
      return;
    }

    const response = await axios.get<ApiResponse>(
      "https://api.blackstoneinfomaticstech.com/classShedule/teacher",
      {
        params: { teacherId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);

    // Process regular classes
    const regularClasses = response.data.classSchedule.map(cls => ({
      ...cls,
      isTrial: false
    }));

    console.log("Processed Regular Classes:", regularClasses);

   

// Process trial classes
let trialClasses: ClassData[] = [];

if (Array.isArray(response.data.trialclasses)) {
  console.log("Raw Trial Classes Data:", response.data.trialclasses);

  trialClasses = response.data.trialclasses.map((trialClass) => ({
    _id: trialClass._id || trialClass.trialId || "",
    classLink: trialClass.meetingLink || "",
    classDay: trialClass.scheduledStartDate ? [trialClass.scheduledStartDate] : [],
    package: "", // Trial classes may not have package
    totalHourse: 0.5,
    startDate: trialClass.scheduledStartDate || "",
    endDate: trialClass.scheduledEndDate || "",
    startTime: [trialClass.scheduledFrom || ""],
    endTime: [trialClass.scheduledTo || ""],
    scheduleStatus: trialClass.meetingStatus || "Scheduled",
    classhour: "0.5",
    currency: "$",
    amount: "0",
    earnings: 0,
    isSalaryProcessed: false,
    status: "Active",
    createdDate: trialClass.createdDate || "",
    createdBy: trialClass.createdBy || "System",
    lastUpdatedDate: trialClass.lastUpdatedDate || "",
    lastUpdatedBy: trialClass.lastUpdatedBy || "",
    __v: trialClass.__v || 0,

    sessionClassType: "TRIALCLASS",
    classType: trialClass.classType || "OneToOne",
    sessionStarttime: trialClass.scheduledFrom || "",
    sessionsEndtime: trialClass.scheduledTo || "",
    sessionStatus: trialClass.meetingStatus === "Completed" ? "Completed" : "NotCompleted",

    student: {
      studentId: trialClass.student?.studentId || "N/A",
      studentFirstName: trialClass.student?.name?.split(" ")[0] || "Trial",
      studentLastName: trialClass.student?.name?.split(" ").slice(1).join(" ") || "Student",
      studentEmail: trialClass.student?.email || "",
      gender: "", // No gender in trial
      level: "", // No level in trial
      studnetSessionStart: [], // Provide empty array to match ClassData type
      studnetSessionEnd: [],   // Provide empty array to match ClassData type
    },

    teacher: {
      teacherId: trialClass.teacher?.teacherId || "",
      teacherName: trialClass.teacher?.name || "",
      teacherEmail: trialClass.teacher?.email || "",
      teacherSessionStart: null,
      teacherSessionEnd: null,
    },

    course: {
      courseId: trialClass.course?.courseId || "",
      courseName: trialClass.course?.courseName || "",
    },

    alfstudent: {
      _id: "",
      username: "",
      password: "",
      sessionClassType: "",
      role: "",
      level: "",
      status: "",
      createdDate: "",
      createdBy: "",
      updatedDate: "",
      __v: 0,
      student: {
        studentId: "",
        studentEmail: "",
        studentPhone: 0,
        course: "",
        package: "",
        city: "",
        country: "",
        gender: "",
      },
    },

    teacherAttendee: "",
    studentAttendee: "",
    isTrial: true,
    trialclass: trialClass,
  }));

  console.log("Processed Trial Classes:", trialClasses);
} else {
  console.log("No trial classes found or incorrect format.");
}



    // Combine both types
    const allClasses = [...regularClasses, ...trialClasses];
    console.log("All Classes Combined:", allClasses);

    // Filter upcoming classes
    // const upcoming = allClasses.filter(cls =>
    //   ["Scheduled", "Rescheduled", "RequestReschedule", "BothAbsent", "StudentAbsent", "TeacherAbsent"].includes(cls.scheduleStatus)
    // );

    // console.log("Upcoming Classes:", upcoming);

    // Filter completed classes
    const now = new Date();

   const completed = allClasses
  .filter(cls => {
    const endDate = new Date(cls.endDate);
    return (
      ["Completed", "BothAbsent", "StudentAbsent", "TeacherAbsent"].includes(cls.scheduleStatus) &&
      endDate < now
    );
  })
  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

const upcoming = allClasses
  .filter(cls => {
    const endDate = new Date(cls.endDate);
    return (
      ["Scheduled", "Rescheduled", "RequestReschedule"].includes(cls.scheduleStatus) &&
      endDate >= now
    );
  })
  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());


    
    console.log("Completed Classes:", completed);

    setUpcomingClasses(upcoming);
    setCompletedData(completed);
    setFilteredClasses(activeTab === "upcoming" ? upcoming : completed);

    console.log("Class data successfully set to state.");
  } catch (error) {
    console.error("Error fetching class data:", error);
  }
};

// Add this useEffect to load data on component mount
useEffect(() => {
  fetchClasses();
}, []);



  useEffect(() => {
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("TeacherPortalId")
        : null;
    if (!userId) return;
    const socket = getSocket(userId);
    const handleUpcoming = (data: ClassData) => {
      console.log("Update student");
      setUpcomingClasses((prev) =>
        prev.map((app) =>
          app._id.toString() === data._id.toString() ? data : app
        )
      );
    };
    socket.on("academicStudentReSchedule", handleUpcoming);
    return () => {
      socket.off("academicStudentReSchedule", handleUpcoming);
    };
  }, []);
  const handleRescheduleRedirect = (id: string) => {
    alert(`Reschedule for ${id}`);
    setOpenDropdownId(null);
    router.push(`/teacher/ui/teacherreschedule?classId=${id}`);
  };
  const dataToShow: ClassData[] =
    activeTab === "upcoming" ? upcomingClasses : completedData;

  useEffect(() => {
    setFilteredClasses(dataToShow);
    setSearchQuery("");
    setCurrentPage(1);
  }, [activeTab, upcomingClasses, completedData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    const filtered = dataToShow.filter((item) => {
      const combinedFields = [
        item._id,
        item.student?.studentFirstName,
        item.student?.studentLastName,
        item.student?.studentEmail,
        item.scheduleStatus,
        item.package,
        item.status,
        item.startDate,
        item.endDate,
        ...(item.startTime || []),
        ...(item.endTime || []),
      ]
        .map((v) => (v ? String(v).toLowerCase() : ""))
        .join(" ");

      return combinedFields.includes(lowerQuery);
    });

    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const latestDataToShow =
      activeTab === "upcoming" ? upcomingClasses : completedData;
    let filtered = [...latestDataToShow];

    if (filters.courseName) {
      filtered = filtered.filter((c) =>
        c.course?.courseName
          ?.toLowerCase()
          .includes(filters.courseName.toLowerCase())
      );
    }

  
    if (filters.scheduleStatus) {
      filtered = filtered.filter(
        (c) =>
          c.scheduleStatus?.toLowerCase() ===
          filters.scheduleStatus.toLowerCase()
      );
    }
    if (filters.studentName) {
      filtered = filtered.filter((c) => {
        const fullName =
          `${c.student.studentFirstName} ${c.student.studentLastName}`.toLowerCase();
        return fullName.includes(filters.studentName.toLowerCase());
      });
    }
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      filtered = filtered.filter((c) => {
        const date = new Date(c.startDate);
        return date >= from && date <= to;
      });
    }
    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      courseName: "",
      teacher: "",
      scheduleStatus: "",
      studentName: "",
      fromDate: "",
      toDate: "",
    });
    const latestDataToShow =
      activeTab === "upcoming" ? upcomingClasses : completedData;
    setFilteredClasses(latestDataToShow);
    setIsFilterModalOpen(true);
  };

  const studentNames = Array.from(
    new Set(
      dataToShow.map(
        (c) => `${c.student.studentFirstName} `
      )
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <div className="md:p-0 mt-4 mx-auto">
      <div className="h-full w-full flex flex-col justify-between">
        <div className="p-0 justify-between flex flex-col">
          <div className="flex space-x-6 px-4 py-2 rounded-md">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`relative text-[15px] transition font-medium ${
                activeTab === "upcoming"
                  ? "text-[#576CBC] font-semibold"
                  : "text-[#0A0A12] dark:text-[#fff] opacity-80"
              }`}
            >
              Scheduled ({upcomingClasses.length})
              {activeTab === "upcoming" && (
                <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`relative text-[15px] transition font-medium ${
                activeTab === "completed"
                  ? "text-[#576CBC] font-semibold"
                  : "text-[#0A0A12] dark:text-[#fff] opacity-80"
              }`}
            >
              Completed ({completedData.length})
              {activeTab === "completed" && (
                <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC]" />
              )}
            </button>
          </div>

          <div className="mt-2">
            <div className=" w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-t-lg justify-between  flex flex-col md:flex-row items-start md:items-center px-4 relative gap-4 md:gap-0">
                        <div className="flex-1 flex items-center gap-2 text-sm text-gray-500 justify-start px-4">
                          <Search className="w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search by Student name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
                          />
                        </div>
                        <button
                          onClick={() => setIsFilterModalOpen(true)}
                          className="flex-1 flex items-center gap-2 text-sm text-gray-400 cursor-pointer justify-start border-y-0 border-l-2 border-r-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4"
                        >
                          <MdTune className="w-5 h-5" />
                          <span>Filter</span>
                        </button>
                        <div className="flex-1 flex items-center text-sm  px-4 text-gray-500 justify-start">
                          <span>
                            Showing {currentItems.length} Of {filteredClasses.length}
                          </span>
                        </div>
                      </div>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table
              className="w-full table-auto border-collapse text-[12px]"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="px-4 py-3.5 text-center border text-[14px] border-[#4C6993] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                <tr className="font-extralight">
                  <th className="text-left px-4 py-3 w-[180px] font-normal">Class ID</th>
                  <th className="text-left px-4 py-3 font-normal">Student Name</th>
                  <th className="text-left px-4 py-3 font-normal">Course</th>
                  <th className="text-left px-4 py-3 font-normal">Class Type</th>
                  <th className="text-left px-4 py-3 font-normal">Date</th>
                  <th className="text-left px-4 py-3 font-normal">Timing</th>
                  <th className="text-left px-4 py-3 w-[180px] font-normal">Status</th>
                  <th className="text-left px-4 py-3 font-normal">Action</th>
                </tr>
              </thead>
              {/* <thead>
                <tr>
                  {[
                    "Class ID",
                    "Student Name",
                    "Course",
                    "Class Type",
                    "Date",
                    "Time",
                    "Status",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3.5 text-center font-light border border-[#4C6993] bg-[#4C6993] text-white dark:bg-[#6087C0]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead> */}


<tbody>
  {currentItems.length > 0 ? (
    currentItems.map((item, index) => {
      const isTrial = item.classType === "Trail class" || item.isTrial;
      
      // Get the appropriate date
      const classDate = isTrial ? 
        (item.trialclass?.scheduledStartDate || item.startDate) : 
        item.startDate;
      
      // Format the date
      const dateObj = classDate ? new Date(classDate) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "N/A";

      // Get time - prioritize trial class time if available
      const startTime = isTrial ? 
        (item.trialclass?.scheduledFrom || item.startTime?.[0]) : 
        item.startTime?.[0];
      const endTime = isTrial ? 
        (item.trialclass?.scheduledTo || item.endTime?.[0]) : 
        item.endTime?.[0];
      const timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : "N/A";

const hideLastNameStatuses = [
  "Scheduled",
  "Rescheduled",
  "RequestReschedule",
  "BothAbsent",
  "StudentAbsent",
  "TeacherAbsent",
];

const studentName =
  isTrial || hideLastNameStatuses.includes(item.scheduleStatus)
    ? item.student?.studentFirstName || item.trialclass?.student?.name?.split(" ")[0] || "Student"
    : `${item.student?.studentFirstName || ""} ${item.student?.studentLastName || ""}`.trim();
       
    const classType = item .sessionClassType || item.classType || "N/A";

      // Get course name
      const courseName = isTrial
        ? item.trialclass?.course?.courseName || item.course?.courseName
        : item.course?.courseName;

      // Get status
      const status = isTrial
        ? item.trialclass?.meetingStatus || item.scheduleStatus
        : item.scheduleStatus;

      return (
        <tr
          key={item._id}
          className={`text-[12px] justify-center ${
            index % 2 === 0
              ? "bg-[#fff] dark:bg-[#2C2C2C]"
              : "bg-[#F8F8F8] dark:bg-[#303030]"
          }`}
        >
          <td className="px-3 py-2 text-[10px] text-left w-[200px] break-words whitespace-normal">
            {isTrial ? item.trialclass?.trialId || item._id : item._id || "N/A"}
          </td>
          <td className="text-[#3D8FDE] px-3 py-2 text-left w-[180px] break-words whitespace-normal">
            {studentName || "N/A"}
          </td>
          <td className="px-3 py-2 text-left w-[170px] break-words whitespace-normal">
            {courseName || "N/A"}
          </td>
          <td className="px-3 py-2 text-left w-[170px] break-words whitespace-normal">
            {classType || "N/A"}
          </td>
          <td className="px-3 py-2 text-left w-[170px] break-words whitespace-normal">
            {formattedDate}
          </td>
          <td className="px-3 py-2 text-left w-[170px] break-words whitespace-normal">
            {timeDisplay}
          </td>
          <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-xs w-[200px] break-words whitespace-normal">
  <span
    className={`inline-block text-center rounded-md font-semibold text-[11px] px-3 py-1
      ${
        status === "Scheduled"
          ? "bg-green-100 text-green-800 dark:bg-green-800/20"
          : status === "Rescheduled" || status === "RequestReschedule"
          ? "bg-gray-200 text-gray-800 dark:bg-gray-500/20"
          : status === "BothAbsent"
          ? "bg-red-100 text-red-700 dark:bg-red-700/20"
          : "bg-gray-300 text-gray-600 dark:bg-gray-500/20"
      }
    `}
  >
    {status}
  </span>
</td>

        <td className="px-3 py-2 relative w-[10px] break-words whitespace-normal">
          <div className="relative inline-block text-left">
            <button
              onClick={() =>
                setOpenDropdownId(openDropdownId === item._id ? null : item._id)
              }
              className="p-2 rounded-md"
            >
              <MoreVertical className="w-4 h-4 text-slate-600 dark:text-white" />
            </button>

            {activeTab !== "completed" && openDropdownId === item._id && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-[#2C2C2C] shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1 text-sm text-gray-700 dark:text-white">
                  <button
                    onClick={() => handleRescheduleRedirect(item._id)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#404040]"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setOpenDropdownId(null)}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-[#404040]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  })
    ) : (
    <tr>
      <td colSpan={7} className="text-center py-4 text-gray-500">
        No classes found
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={() => setIsFilterModalOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl bg-white  dark:bg-[#343434] w-[650px] "
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div>
          <h2 className="text-[16px] font-semibold mb-6 text-[#2D2D2D] dark:text-white">
            Filter by
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Student
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-[#343434] dark:text-whited text-[#5C5C5C] dark:border-[#5C5C5C]"
                value={filters.studentName}
                onChange={(e) =>
                  setFilters({ ...filters, studentName: e.target.value })
                }
              >
                <option value=" ">Select Student</option>
                {studentNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Course
              </label>
              <select
                className="w-full px-3 py-2 border text-[#5C5C5C] border-gray-300 rounded-lg text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
                value={filters.courseName}
                onChange={(e) =>
                  setFilters({ ...filters, courseName: e.target.value })
                }
              >
                <option value="">Select Course</option>
                <option value="Quran">Quran</option>
                <option value="Arabic">Arabic</option>
                <option value="Tajweed">Tajweed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm 
              text-[#5C5C5C] dark:text-white 
               bg-white dark:bg-[#343434] 
               border-gray-300 dark:border-[#5C5C5C]
               [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm 
              text-[#5C5C5C] dark:text-white 
               bg-white dark:bg-[#343434] 
               border-gray-300 dark:border-[#5C5C5C]
               [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-[#343434] text-[#5C5C5C] dark:text-white dark:border-[#5C5C5C]"
                value={filters.scheduleStatus}
                onChange={(e) =>
                  setFilters({ ...filters, scheduleStatus: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 border border-[#576CBC] text-[#576CBC] bg-white rounded-lg text-sm font-medium hover:bg-[#f6f8ff]"
            >
              Reset
            </button>
            <button
              onClick={() => {
                handleApplyFilters();
                setIsFilterModalOpen(false);
              }}
              className="px-5 py-2 bg-[#576CBC] text-white rounded-lg text-sm font-medium hover:bg-[#475ab1]"
            >
              Show {filteredClasses.length} results
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduledClasses;
