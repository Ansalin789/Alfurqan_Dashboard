"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { VscGraphLeft } from "react-icons/vsc";
import Pagination from "@/components/Pagination";

import BaseLayout1 from "@/components/BaseLayout1";
import { MoreVertical, Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import AcademicHeader from "../../components/academicHeader";
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
    courseId: string;
    courseName: string;
  };
  classType: string;
  startDate: string;
  endDate: string;
  sessionClassType: string;
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
  isTrial?: boolean;
  trialclass?: TrialClass;
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
const TeacherDetails = () => {
  interface IProfessionalExperience {
    jobRole: string;
    organizationName: string;
    jobLocation: string;
    fromDate: string | null;
    toDate: string | null;
    jobDescription: string;
    _id: string;
  }

  interface ICandidateApplication {
    _id: string;
    candidateFirstName: string;
    candidateLastName: string;
    supervisor: {
      supervisorId: string;
      supervisorName: string;
      supervisorEmail: string;
      supervisorRole: string;
    };
    gender: string;
    applicationDate: string; // ISO date string
    candidateEmail: string;
    candidatePhoneNumber: number;
    candidateCountry: string;
    candidateCity: string;
    positionApplied: string;
    currency: string;
    expectedSalary: number;
    preferedWorkingHours: string;
    comments: string;
    applicationStatus: string;
    overallRating: number;
    professionalExperience: IProfessionalExperience[];
    skills: string;
    status: string;
    createdDate: string; // ISO date string
    createdBy: string;
    __v: number;
  }
  interface Student {
    studentId: string;
    studentFirstname: string;
    studentLastName: string;
  }

  interface StatsResponse {
    totalStudents: number;
    totalClasses: number;
    totalAttendance: number | string;
    totalWorkingHours: number | string;
    overallPerformance: number;
    students: Student[];
  }
  interface StudentInfo {
    fullName: string;
    courseName: string;
    studentId: string;
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams!.get("teacherId");
  const [studentInfoList, setStudentInfoList] = useState<StudentInfo[]>([]);
  const [scheduledClasses, setScheduledClasses] = useState<ClassSchedule[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassSchedule[]>([]);

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [teachers, setTeachers] = useState<ICandidateApplication>();
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">(
    "scheduled"
  );

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<ClassSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ClassSchedule[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [classScheduleData, setClassScheduleData] = useState<ClassSchedule[]>(
    []
  );

  const [paginatedData, setPaginatedData] = useState<ClassSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherRescheduleWrite, setTeacherRescheduleWrite] = useState(false);
  const [isCompletedDetailsModalOpen, setIsCompletedDetailsModalOpen] = useState(false);
  const [selectedCompletedClass, setSelectedCompletedClass] = useState<ClassSchedule | null>(null);

  //Rolebyaccess
  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("AcademicRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.academicmodules || roleAccess;

        setTeacherRescheduleWrite(modules?.manageteachers?.write === true); // ✅ already present
      } catch (error) {
        console.error("Invalid AcademicRolePermission JSON", error);
      }
    }
  }, []);

  const search = useSearchParams();
  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleReschedule = (_id: string) => {
    console.log("Navigating to reschedule page");
    router.push(`manageteachers?id=${_id}`);

    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleViewCompletedDetails = (classData: ClassSchedule) => {
    setSelectedCompletedClass(classData);
    setIsCompletedDetailsModalOpen(true);
  };

  // Calculate total pages based on active tab
  const totalPages =
    activeTab === "scheduled"
      ? Math.ceil(scheduledClasses.length / itemsPerPage)
      : Math.ceil(completedClasses.length / itemsPerPage);

  useEffect(() => {
    console.log("🔍 useEffect triggered. Current teacherId:", teacherId);

    const fetchTeachers = async () => {
      console.log("📢 fetchTeachers called with teacherId:", teacherId);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;

        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found");
          return;
        }

        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/applicants/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // ✅ Corrected typo
            },
          }
        );

        if (!response.ok) {
          console.error("❌ fetchTeachers response not OK:", response.status);
        }

        const data = await response.json();
        console.log("✅ Fetched teacher data:", data);
        setTeachers(data);
      } catch (error) {
        console.error("❌ Error fetching teachers:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;
        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found");
          return;
        }

        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/classstudentsattendancecounts?teacherId=${teacherId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data: StatsResponse = await response.json();
        console.log("Fetched stats:", data);
        setStats(data);
      } catch (err: any) {
        console.log(err.message ?? "Unknown error");
      }
    };
    fetchStats();
    fetchTeachers();
  }, [teacherId]);

  const fetchClassSchedule = async (): Promise<ClassSchedule[]> => {
    const token = localStorage.getItem("AcademicCoachAuthToken");
    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return [];
    }

    const idFromStorage = localStorage.getItem("TeacherPortalId");
    const finalTeacherId = teacherId || idFromStorage;

    if (!finalTeacherId) {
      console.warn("No teacherId found in query params or localStorage");
      return [];
    }

    try {
      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com/classShedule/teacher?teacherId=${finalTeacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Server responded with status:", res.status);
        return [];
      }

      const data = await res.json();
      console.log("API Response:", data);

      // Process regular classes
      const regularClasses = (data.classSchedule || []).map((cls: ClassSchedule) => ({
        ...cls,
        isTrial: false
      }));

      console.log("Processed Regular Classes:", regularClasses);

      // Process trial classes
      let trialClasses: ClassSchedule[] = [];

      if (Array.isArray(data.trialclasses)) {
        console.log("Raw Trial Classes Data:", data.trialclasses);

        trialClasses = data.trialclasses.map((trialClass: TrialClass) => ({
          _id: trialClass._id || trialClass.trialId || "",
          classLink: trialClass.meetingLink || "",
          classDay: trialClass.scheduledStartDate ? [trialClass.scheduledStartDate] : [],
          package: "", // Trial classes may not have package
          startDate: trialClass.scheduledStartDate || "",
          endDate: trialClass.scheduledEndDate || "",
          startTime: [trialClass.scheduledFrom || ""],
          endTime: [trialClass.scheduledTo || ""],
          scheduleStatus: trialClass.meetingStatus || "Scheduled",
          status: "Active",
          createdDate: trialClass.createdDate || "",
          createdBy: trialClass.createdBy || "System",
          lastUpdatedDate: trialClass.lastUpdatedDate || "",
          amount: "0",
          currency: "$",
          classType: trialClass.classType || "OneToOne",
          sessionClassType: "TRIALCLASS",

          student: {
            studentId: trialClass.student?.studentId || "N/A",
            studentFirstName: trialClass.student?.name?.split(" ")[0] || "Trial",
            studentLastName: trialClass.student?.name?.split(" ").slice(1).join(" ") || "Student",
            studentEmail: trialClass.student?.email || "",
            gender: "", // No gender in trial
          },

          teacher: {
            teacherId: trialClass.teacher?.teacherId || "",
            teacherName: trialClass.teacher?.name || "",
            teacherEmail: trialClass.teacher?.email || "",
          },

          course: {
            courseId: trialClass.course?.courseId || "",
            courseName: trialClass.course?.courseName || "",
          },

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
    
    // Sort by date in ascending order (oldest first)
      return allClasses.sort((a: ClassSchedule, b: ClassSchedule) => {
        const dateA = a.isTrial ? a.trialclass?.scheduledStartDate || a.startDate : a.startDate;
        const dateB = b.isTrial ? b.trialclass?.scheduledStartDate || b.startDate : b.startDate;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  } catch (err) {
    console.error("Failed to fetch class schedule", err);
    return [];
  }
};

  // 👇 Separate function to get unique students
 const getUniqueStudentsFromSchedule = (
  schedule: ClassSchedule[]
): StudentInfo[] => {
  const studentSet = new Set<string>();
  const studentInfoArray: StudentInfo[] = [];

  schedule.forEach((item: ClassSchedule) => {
    if (item.student && item.student.studentId) { // Add check for studentId
      const fullName = item.student.studentFirstName || "";
      const courseName = item.course?.courseName || "";
      const studentId = item.student.studentId;

      if (!studentSet.has(studentId)) {
        studentSet.add(studentId);
        studentInfoArray.push({ fullName, courseName, studentId });
      }
    }
  });

  return studentInfoArray;
};

  // 👇 Fetch class schedule and set Scheduled/Completed classes
  useEffect(() => {
    const fetchData = async () => {
      const schedule = await fetchClassSchedule();
      setClassScheduleData(schedule);

      setScheduledClasses(
        schedule.filter((c) =>  c.scheduleStatus === "Scheduled" ||
              c.scheduleStatus === "Rescheduled" ||
              c.scheduleStatus === "Reschedulerequested")
      );
      setCompletedClasses(
        schedule.filter((c) => c.scheduleStatus === "Completed" || c.scheduleStatus === "BothAbsent" || c.scheduleStatus === "TeacherAbsent" || c.scheduleStatus === "StudentAbsent")
      );
    };

    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);
  useEffect(() => {
    console.log("Scheduled:", scheduledClasses);
    console.log("Completed:", completedClasses);
    console.log("Active Tab:", activeTab);
    console.log("Current Page:", currentPage);

    const dataToPaginate =
      activeTab === "scheduled" ? scheduledClasses : completedClasses;

    const totalItems = dataToPaginate.length; // total count

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setPaginatedData(dataToPaginate.slice(startIndex, endIndex));
  }, [
    scheduledClasses,
    completedClasses,
    currentPage,
    activeTab,
    itemsPerPage,
  ]);

  // 👇 Fetch unique students separately
  useEffect(() => {
    if (classScheduleData.length > 0) {
      const uniqueStudents = getUniqueStudentsFromSchedule(classScheduleData);
      setStudentInfoList(uniqueStudents);
    }
  }, [classScheduleData]);

  useEffect(() => {
    const dataToPaginate =
      filteredUsers.length > 0
        ? filteredUsers
        : activeTab === "scheduled"
        ? scheduledClasses
        : completedClasses;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setPaginatedData(dataToPaginate.slice(startIndex, endIndex));
  }, [
    scheduledClasses,
    completedClasses,
    filteredUsers,
    currentPage,
    activeTab,
    itemsPerPage,
  ]);

  // Reset filters/search when switching tabs
  useEffect(() => {
    setFilteredUsers([]);
    setSearchQuery("");
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Choose the correct data source based on the active tab
    const currentUsers =
      activeTab === "scheduled" ? scheduledClasses : completedClasses;

    if (!query.trim()) {
      setFilteredUsers(currentUsers); // Show all if search is empty
      setCurrentPage(1);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = currentUsers.filter((user) => {
      const isTrial = user.isTrial;
      
      // Get student name - handle trial classes
      const studentName = isTrial
        ? user.trialclass?.student?.name?.toLowerCase() || 
          `${user.student?.studentFirstName || ""} ${user.student?.studentLastName || ""}`.toLowerCase()
        : `${user.student?.studentFirstName || ""} ${user.student?.studentLastName || ""}`.toLowerCase();

      // Get course name
      const courseName = isTrial
        ? user.trialclass?.course?.courseName?.toLowerCase() || user.course?.courseName?.toLowerCase()
        : user.course?.courseName?.toLowerCase();

      // Get class type
      const classType = (user.sessionClassType || user.classType || "").toLowerCase();

      // Get status
      const status = isTrial
        ? user.trialclass?.meetingStatus?.toLowerCase() || user.scheduleStatus?.toLowerCase()
        : user.scheduleStatus?.toLowerCase();

      // Get date for search
      const classDate = isTrial ? 
        (user.trialclass?.scheduledStartDate || user.startDate) : 
        user.startDate;
      const dateObj = classDate ? new Date(classDate) : null;
      const dateReadable = dateObj
        ? dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).toLowerCase()
        : "";

      // Get time for search
      const startTime = isTrial ? 
        (user.trialclass?.scheduledFrom || user.startTime?.[0]) : 
        user.startTime?.[0];
      const endTime = isTrial ? 
        (user.trialclass?.scheduledTo || user.endTime?.[0]) : 
        user.endTime?.[0];
      const timing = `${startTime || ""} - ${endTime || ""}`.toLowerCase();

      return (
        (user._id?.toLowerCase() || "").includes(lowerQuery) ||
        (user.student?.studentId?.toLowerCase() || "").includes(lowerQuery) ||
        studentName.includes(lowerQuery) ||
        (user.student?.gender?.toLowerCase() || "").includes(lowerQuery) ||
        (user.teacher?.teacherName?.toLowerCase() || "").includes(lowerQuery) ||
        (courseName || "").includes(lowerQuery) ||
        (status || "").includes(lowerQuery) ||
        (user.status?.toLowerCase() || "").includes(lowerQuery) ||
        (classType || "").includes(lowerQuery) ||
        (timing || "").includes(lowerQuery) ||
        (dateReadable || "").includes(lowerQuery)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page
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
          <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Filter by
              </h1>
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
                <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6] ">
                  Date
                </label>
                <input
                  type="date"
                  value={filters.Date}
                  onChange={(e) =>
                    setFilters({ ...filters, Date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434] dark:[color-scheme:dark]"
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
                  className="w-full px-3 py-2 border rounded text-sm dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434] dark:[color-scheme:dark]"
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
                  <option value="Online">Regular</option>
                  <option value="Offline">Group</option>
                  <option value="Offline">Trail</option>
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
                          user.course.courseName
                            ?.toLowerCase()
                            .includes(filters.course.toLowerCase())) &&
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
      filtered = filtered.filter((user) => {
        const isTrial = user.isTrial;
        const studentName = isTrial
          ? user.trialclass?.student?.name?.toLowerCase() || 
            `${user.student?.studentFirstName || ""} ${user.student?.studentLastName || ""}`.toLowerCase()
          : `${user.student?.studentFirstName ?? ""} ${user.student?.studentLastName ?? ""}`.toLowerCase();
        
        return studentName.includes(filters.studentName.toLowerCase());
      });
    }

    if (filters.Date) {
      filtered = filtered.filter((user) => {
        const isTrial = user.isTrial;
        const classDate = isTrial ? 
          (user.trialclass?.scheduledStartDate || user.startDate) : 
          user.startDate;
        return formatDate(classDate) === filters.Date;
      });
    }

    if (filters.status) {
      filtered = filtered.filter((user) => {
        const isTrial = user.isTrial;
        const status = isTrial
          ? user.trialclass?.meetingStatus || user.scheduleStatus
          : user.scheduleStatus;
        return status?.toLowerCase() === filters.status.toLowerCase();
      });
    }

    if (filters.Time) {
      filtered = filtered.filter((user) => {
        const isTrial = user.isTrial;
        const startTime = isTrial ? 
          (user.trialclass?.scheduledFrom || user.startTime?.[0]) : 
          user.startTime?.[0];
        return startTime?.includes(filters.Time);
      });
    }

    if (filters.course) {
      filtered = filtered.filter((user) => {
        const isTrial = user.isTrial;
        const courseName = isTrial
          ? user.trialclass?.course?.courseName || user.course?.courseName
          : user.course?.courseName;
        return courseName?.toLowerCase() === filters.course.toLowerCase();
      });
    }

    if (filters.classType) {
      filtered = filtered.filter((user) => {
        const classType = user.sessionClassType || user.classType;
        return classType?.toLowerCase() === filters.classType.toLowerCase();
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Calculate totalItems for use in JSX
  const totalItems =
    activeTab === "scheduled"
      ? scheduledClasses.length
      : completedClasses.length;

const handleViewDetails = (_id: string) => {
  localStorage.setItem("studentManageID", _id);
  router.push(`managestudentview?id=${_id}`);
};
  return (
    <BaseLayout1>
      <AcademicHeader
        currentSection="Teacher"
        showBackButton={true}
        showBackPath="/Academic-coach/ui/manageteacher"
      />
      <div className="p-2 mx-auto w-full">
        {/* Main Container */}
        <div className="flex gap-x-5 w-full">
          {/* Left Profile Card */}
          <div className="rounded-xl flex items-center p-6 w-[633px] h-[247px] border bg-[#5e6578] text-white ">
              {/* Profile Section */}
  <div className="flex flex-col items-center w-1/3 px-4 text-center">
  <div className="relative mb-1 w-[160px] h-[160px]">
  <Image
    src="/assets/images/student-portfolio.svg"
    alt="Profile"
    fill
    className="rounded-full object-cover"
  />
</div>

    <h2 className="text-lg font-semibold text-white break-words mb-1">
      {teachers?.candidateFirstName}
    </h2>
    <p className="text-[11px] text-[#C9C9C9] break-words word-wrap w-[200px] px-2">
      {teachers?.candidateEmail}
    </p>
  </div>

  {/* Divider */}
            <div className="w-px bg-gray-300 h-[150px] mx-10" />
     {/* Personal Info */}
            <div className="w-2/3">
              <h3 className="text-[16px] font-semibold mb-4 text-[#ffff]">
                Personal Info
              </h3>
              <ul className="text-sm space-y-2 text-[#ffff]">
                <li className="flex justify-between ">
                  <span>Contact</span>
                  <span className="text-[#DADADA]/80 text-left">
                    {teachers?.candidatePhoneNumber}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Country</span>
                  <span className="text-[#DADADA]/80">
                    {teachers?.candidateCountry}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Role</span>
                  <span className="text-[#DADADA]/80">
                    {teachers?.positionApplied}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Level</span>
                  <span className="text-[#DADADA]/80">
                    {teachers?.overallRating}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="rounded-xl w-full h-[220px] flex justify-between p-3 border dark:bg-[#252525] -mt-3 ">
            {/* Left Side - Performance and Attendance */}
            <div className="grid grid-cols-1 gap-3 w-full h-[247px]">
              {[
                {
                  title: "Performance",
                  value: stats?.overallPerformance?.toString(),
                  sub: "60% increase than Last Month",
                },
                {
                  title: "Total Attendance",
                  value: stats?.totalAttendance?.toString(),
                  sub: "90% Progressive than Last Month",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl flex flex-col justify-between h-full border text-[#010E30] bg-[#7689BD]"
                >
                  <h4 className="text-[16px] font-semibold text-[#ffff]">
                    {item.title}
                  </h4>
                  <p className="text-[14px] font-semibold mt-2 flex gap-1 items-center text-[#ffff]">
                    {item.value}{" "}
                    <VscGraphLeft className="rotate-180 text-[#ffff]" />
                  </p>
                  <p className="text-[10px] text-[#ffff]">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Right Side - Students List */}
            {/* Right Side - Students List */}
          </div>
  <div className="bg-white dark:bg-[#2f2f2f] rounded-2xl p-4 w-full h-[247px] flex flex-col gap-y-4 scrollbar-none">
  <div className="flex justify-between items-center">
    <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">
      Students List
    </h2>
    <span className="bg-[#576CBC] text-white text-[12px] font-semibold rounded-md px-2 py-1">
      {studentInfoList.length}
    </span>
  </div>

  {/* Students List */}
  <ul className="space-y-3 overflow-y-auto max-h-[180px] scrollbar-none">
    {studentInfoList.map((student, index) => (
      <li
        key={index}
        className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#ffff] flex items-center justify-center font-bold text-[10px]">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
          <span 
            className="text-[12px] font-medium text-[#111827] dark:text-white cursor-pointer hover:underline"
            onClick={() => handleViewDetails(student.studentId)}
          >
            {student.fullName}
          </span>
        </div>
        <span className="text-[11px] text-[#576CBC] font-medium whitespace-nowrap">
          {student.courseName || ""}
        </span>
      </li>
    ))}
  </ul>
</div>
        </div>
        
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
                value={searchQuery}
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
                Showing {paginatedData.length} Of {totalItems}
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
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] w-[90px] min-w-[90px] max-w-[90px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#343434] dark:divide-gray-600">
              {paginatedData.map((item, index) => {
                const isTrial = item.isTrial;
                
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

                // Get student name - handle trial classes
                const studentName = isTrial
                  ? item.trialclass?.student?.name?.split(" ")[0] || item.student?.studentFirstName || "Trial Student"
                  : item.student?.studentFirstName || "N/A";

                // Get course name
                const courseName = isTrial
                  ? item.trialclass?.course?.courseName || item.course?.courseName
                  : item.course?.courseName;

                // Get class type
                const classType = item.sessionClassType || item.classType || "N/A";

                // Get status
                const status = isTrial
                  ? item.trialclass?.meetingStatus || item.scheduleStatus
                  : item.scheduleStatus;

                return (
                <tr
                  key={item._id}
                  className={`text-[12px] ${
                    index % 2 === 0
                      ? "bg-[#fff] dark:bg-[#2C2C2C]"
                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                  }`}
                >
                  <td className="px-3 py-3 text-[#3D8FDE] font-medium text-left">
                      {studentName}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {courseName || "N/A"}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {formattedDate}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {timeDisplay}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {classType}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    <span
                      className={`font-semibold px-3 py-1 rounded-md text-[10px] inline-block text-center min-w-[120px] ${
                          status === "Scheduled"
                          ? "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36]"
                            : status === "Rescheduled" || status === "Reschedulerequested"
                          ? "bg-[#E4E4E4] text-[#000] dark:bg-[#555] dark:text-[#fff]"
                            : status === "Completed"
                            ? "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36]"
                            : "bg-[#FDECEC] dark:bg-[#D3464533] text-[#D34645]"
                      }`}
                    >
                        {status}
                    </span>
                  </td>
             {(
               <td
                 className="py-1 text-center relative w-[90px] min-w-[90px] max-w-[90px]"
                 ref={dropdownRef}
               >
                 <button
                   onClick={() => toggleDropdown(index)}
                   className={`$${
                     (activeTab === "scheduled" && ["Scheduled", "Reschedulerequested"].includes(item.scheduleStatus)) ||
                     activeTab === "completed"
                       ? "cursor-pointer"
                       : "cursor-default"
                   }`}
                   disabled={
                     !((activeTab === "scheduled" && ["Scheduled", "Reschedulerequested"].includes(item.scheduleStatus)) ||
                       activeTab === "completed")
                   }
                 >
                   <MoreVertical
                     className={`w-4 h-4 ${
                       (activeTab === "scheduled" && ["Scheduled", "Reschedulerequested"].includes(item.scheduleStatus)) ||
                       activeTab === "completed"
                         ? "text-slate-600 dark:text-[#FDFDFD]"
                         : "text-gray-400 dark:text-gray-600 opacity-50"
                     }`}
                   />
                 </button>

                 {activeDropdown === index && (
                   <div
                     className="py-1 bg-white rounded-md shadow-lg daerk absolute right-0 top-6 z-20 w-32 min-w-[120px] max-w-[160px]  dark:bg-[#252525]"
                     style={{ minWidth: "120px" }}
                   >
                     {activeTab === "completed" ? (
                       <button
                         className="w-full text-left px-4 py-2 text-[12px] text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444]"
                         onClick={() => {
                           handleViewCompletedDetails(item);
                           setActiveDropdown(null);
                         }}
                       >
                         View Details
                       </button>
                     ) : (
                       ["Scheduled", "Reschedulerequested"].includes(item.scheduleStatus) && (
                         <button
                           className={`w-full text-left px-4 py-2 text-[12px] ${
                             teacherRescheduleWrite
                               ? "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444]"
                               : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444] cursor-not-allowed"
                           }`}
                           onClick={
                             teacherRescheduleWrite ? () => handleReschedule(item._id) : undefined
                           }
                           disabled={!teacherRescheduleWrite}
                         >
                           Reschedule
                         </button>
                       )
                     )}
                     <button
                       onClick={() => setActiveDropdown(null)}
                       className="w-full text-left px-4 py-2 text-red-600"
                     >
                       Cancel
                     </button>
                   </div>
                 )}
               </td>
             )}
      </tr>
                );
              })}
  </tbody>
</table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          users={users}
        />

        {selectedCompletedClass && (
          <CompletedClassDetailsModal
            isOpen={isCompletedDetailsModalOpen}
            onClose={() => setIsCompletedDetailsModalOpen(false)}
            classData={selectedCompletedClass}
          />
        )}
      </div>
    </BaseLayout1>
  );
};

const CompletedClassDetailsModal = ({
  isOpen,
  onClose,
  classData,
}: {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassSchedule | null;
}) => {
  if (!classData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg w-[600px] max-h-[80vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg w-[580px] relative max-h-[80vh] overflow-y-auto border-2 border-gray-200 dark:border-[#404040] scrollbar-none shadow-xl dark:shadow-2xl">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-[#1a1a1a] ">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Class Details</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Student Name</label>
              <input
                type="text"
                value={`${classData.student.studentFirstName} ${classData.student.studentLastName}`}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Course</label>
              <input
                type="text"
                value={classData.course?.courseName || "N/A"}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</label>
              <input
                type="text"
                value={new Date(classData.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">End Date</label>
              <input
                type="text"
                value={new Date(classData.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Start Time</label>
              <input
                type="text"
                value={classData.startTime?.[0]?.replace(/ AM| PM/, "") || "--:--"}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">End Time</label>
              <input
                type="text"
                value={classData.endTime?.[0]?.replace(/ AM| PM/, "") || "--:--"}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Teacher Name</label>
              <input
                type="text"
                value={classData.teacher.teacherName}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Class Type</label>
              <input
                type="text"
                value={classData.sessionClassType}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Package</label>
              <input
                type="text"
                value={classData.package || "Not specified"}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
              <input
                type="text"
                value={classData.scheduleStatus}
                readOnly
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Class Days</label>
            <input
              type="text"
              value={classData.classDay?.join(", ") || "Not specified"}
              readOnly
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-[#505050] rounded text-xs bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white dark:bg-[#1a1a1a] pb-3 border-t border-gray-200 dark:border-[#404040]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-[#404040] dark:hover:bg-[#505050] dark:text-white rounded text-xs font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#576CBC] hover:bg-[#4A5CA8] dark:bg-[#4A5CA8] dark:hover:bg-[#3d4c8f] text-white rounded text-xs font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TeacherDetails;
