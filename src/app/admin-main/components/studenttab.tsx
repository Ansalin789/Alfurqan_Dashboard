"use client";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import StudentsRecord from "./studentcourseprogress";
import axios from "axios";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";


type TabbedTableProps = {
  studentId: string;
};
// types.ts (or wherever you define your types)
interface ClassSchedule {
  _id: string;
  package: string;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  createdDate: string;
  lastUpdatedDate: string;
  amount: string;
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
}

type Stats = {
  level: number;
  totalAttendance: number;
  totalClasses: number;
  totalduration: number;
};

interface StudentResponse {
  students: StudentItem[];
}

interface StudentItem {
  avatar?: string;
  rating?: number;
  percentage?: any;
  _id: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
  classScheduleCount?: number;
  student: StudentDetails;
  studentEvaluationDetails?: EvaluationDetails;
}

interface StudentDetails {
  studentId: string;
  studentEmail: string;
  studentPhone: number;
  course: string;
  package: string;
  city: string;
  country: string;
  gender: string;
}

interface EvaluationDetails {
  classStartDate: string;
  subscription: {
    subscriptionName: string;
  };
  status: string;
  [key: string]: any; // You can extend this as needed
}
interface StudentResponse {
  studentDetails: any;
}

interface CourseRow {
  id: string;
  name: string;
  date: string;
  package: string;
  status: string;
}

interface Invoice {
  _id: string;
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: number;
  };
  courseName: string;
  amount: number;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  invoiceStatus: string;
}

interface PaymentRow {
  invoiceid: string;
  date: string;
  course: string;
  duebydays: number;
  paiddate: string;
  status: string;
}

const TabbedTable: React.FC<TabbedTableProps> = ({ studentId }) => {
  console.log(studentId);
  const [activeTab, setActiveTab] = useState("Class");
  const tabs = [
    "Class",
    "Courses",
    "Payment History",
    "Assessments",
    "Assignments",
  ];
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [coursesData, setCoursesData] = useState<CourseRow[]>([]);

  const [transactions, setTransactions] = useState<PaymentRow[]>([]);
  const [searchClass, setSearchClass] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  ////////////////courses///////////////////
  useEffect(() => {
    if (typeof window !== "undefined" && studentId) {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchStudentDetails(token, studentId);
      } else {
        console.log("No auth token found.");
      }
    }
  }, [studentId]);

  const fetchStudentDetails = async (token: string, studentId: string) => {
    try {
      const response = await axios.get<StudentResponse>(
        `https://api.blackstoneinfomaticstech.com/alstudents/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const student = response.data.studentDetails;

      const formatted: CourseRow = {
        id: "1234",
        name: student.student.course,
        package: student.student.package,
        status: student.status,
        date: new Date(student.createdDate).toLocaleDateString(),
      };

      setCoursesData([formatted]);
    } catch (err) {
      console.error("Failed to fetch student data", err);
    }
  };

  /////////////////transaction//////////////
  useEffect(() => {
    if (typeof window !== "undefined" && studentId) {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchStudentInvoice(token, studentId);
      } else {
        console.log("No auth token found.");
      }
    }
  }, [studentId]);

  const fetchStudentInvoice = async (token: string, studentId: string) => {
    try {
      const response = await axios.get(
        `https://api.blackstoneinfomaticstech.com/studentinvoice/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Raw API response:", response.data);

      // Make sure it's an array even if one object is returned
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const formatted = data.map((item) => {
        const created = new Date(item.createdDate);
        const today = new Date();
        const diff = Math.floor(
          (today.getTime() - created.getTime()) / (1000 * 3600 * 24)
        ); // duebydays

        return {
          invoiceid: item._id,
          date: created.toLocaleDateString(),
          course: item.courseName,
          duebydays: diff,
          paiddate: new Date(item.lastUpdatedDate).toLocaleDateString(),
          status: item.invoiceStatus,
        };
      });

      setTransactions(formatted);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  ////////////////classdata////////////////////
  useEffect(() => {
    if (typeof window !== "undefined" && studentId) {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchClassSchedule(token, studentId);
      } else {
        console.log("No auth token found.");
      }
    }
  }, [studentId]);

  const fetchClassSchedule = async (token: string, studentId: string) => {
    try {
      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com/classShedule/students?studentId=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("API Response Data:", data);

      setClassData(data.classSchedule);
      console.log("State after setting classData:", data.classSchedule);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  /////////////////////////counts in course///////////////////
  // Fetch stats data from an API
  useEffect(() => {
    if (typeof window !== "undefined" && studentId) {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchStatsData(token, studentId);
      } else {
        console.log("No auth token found.");
      }
    }
  }, [studentId]);

  const fetchStatsData = async (token: string, studentId: string) => {
    try {
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/classShedule/studentsclasscount?studentId=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: Stats = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  // Depend on studentId to refetch stats when it changes


  if (!stats) {
    return <div>Error: Stats could not be loaded.</div>; // Handle case where stats are not available
  }

  // Define progressData using the fetched stats
  const progressData = [
    { label: "Level", value: stats.level, color: "#7DB5CB" },
    { label: "Attendance", value: stats.totalAttendance, color: "#9AD7D6" },
    { label: "Total Classes", value: stats.totalClasses, color: "#8B93D2" },
    { label: "Duration", value: stats.totalduration, color: "#B48BD2" },
  ];

  const assessment = [
    {
      subject: "islamic Studies",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Completed",
    },
    {
      subject: "islamic history",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Retake Required",
    },
  ];
  // Filtered class data based on search
  const filteredClassData = classData.filter((row) => {
    const search = searchClass.toLowerCase();
    return (
      row.student.studentId.toLowerCase().includes(search) ||
      row.teacher.teacherName.toLowerCase().includes(search) ||
      row.package.toLowerCase().includes(search)
    );
  });

  // Calculate paginated assignments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClassData = filteredClassData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedCourseData = coursesData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedPaymentData = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedAssessmentData = assessment.slice(
    startIndex,
    startIndex + itemsPerPage
  );



  const donutColors = [
    "#7DB5CB",
    "#9AD7D6",
    "#8B93D2",
    "#B48BD2",
  ];


  const handleViewDetails = (studentId : string) => {
    router.push(`/admin-main/ui/studentclass?studentId=${studentId}`);
  };

  return (
    <div className=" overflow-x-auto mt-4">
      {/* Tabs */}
      <div className="flex space-x-4  pb-1 text-sm text-black mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 ${
              activeTab === tab
                ? "border-b-2 border-b-[#576CBC] text-[#576CBC]"
                : "text-[#010E30] dark:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Class" && (
        <div className="">
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                value={searchClass}
                onChange={(e) => {
                  setSearchClass(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div
                className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing{" "}
                {filteredClassData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {Math.min(currentPage * itemsPerPage, filteredClassData.length)}{" "}
                of {filteredClassData.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">
                     Class ID
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Teacher Name
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Course
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Time
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paginatedClassData.length > 0 ? (
                    paginatedClassData.map((row, index) => (
                      <tr
                        key={row._id}
                        className={`text-center dark:text-white ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="p-3">{row.student.studentId}</td>
                        <td className="p-3">{row.teacher.teacherName}</td>
                        <td className="p-3">{row.package}</td>
                        <td className="p-3">
                          {new Date(row.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit"
                          })}
                        </td>
                        <td className="p-3">
                          {row.startTime[0]} - {row.endTime[0]}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded whitespace-nowrap ${
                              row.scheduleStatus === "Rescheduled"
                                ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                : row.scheduleStatus === "Scheduled"
                                ? "bg-[#ececfd] text-[#002c5f] dark:bg-[#2e333c] dark:text-[#fff]"
                                : " bg-[#ECFDF3] dark:bg-[#2E3C2E] dark:text-[#377E36] text-[#377E36]"
                            }`}
                          >
                            {row.scheduleStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end mt-4">
                  <button
                    className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
                    onClick={()=>handleViewDetails(studentId)}
                  >
                    View All
                  </button>
                </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "Courses" && (
        <div className="">
          {/* Donut/Progress Grid */}
          <div className="grid grid-cols-4 gap-4 text-center mb-6">
            {progressData.map((item, idx) => {
              let suffix = "";
              let isPercentage = false;
              if (item.label === "Attendance") {
                suffix = "%";
                isPercentage = true;
              } else if (item.label === "Duration") {
                suffix = "hrs";
              }
              return (
                <div
                  key={item.label}
                  className="flex flex-row justify-between items-center p-4 rounded-xl  dark:bg-[#343434]"
                >
                  <p className="mt-4 text-xs font-medium align-top text-white">{item.label}</p>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <CircularProgressbar
                      value={item.value}
                      maxValue={isPercentage ? 100 : undefined}
                      strokeWidth={12}
                      styles={buildStyles({
                        pathColor: donutColors[idx],
                        trailColor: "#393939",
                        strokeLinecap: "round",
                      })}
                    />
                    <div className="absolute text-base font-bold text-white flex items-center justify-center w-full h-full">
                      {Math.round(item.value)}
                      {suffix}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                // value and onChange can be implemented if you want search for courses
                disabled
              />
              <div
                className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />

                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing{" "}
                {paginatedCourseData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to {Math.min(currentPage * itemsPerPage, coursesData.length)} of{" "}
                {coursesData.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Course ID
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Course Name
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Start Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Package
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paginatedCourseData.length > 0 ? (
                    paginatedCourseData.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`text-center dark:text-white ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="p-3">{row.id}</td>
                        <td className="p-3">{row.name}</td>
                        <td className="p-3">{row.date}</td>
                        <td className="p-3">{row.package}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${
                              row.status === "Active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {Math.ceil(coursesData.length / itemsPerPage) > 1 && (
            <div className="flex justify-end mt-4">
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(coursesData.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-6 h-6 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table for 'Payment' Tab */}
      {activeTab === "Payment History" && (
        <div className="">
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                // value and onChange can be implemented if you want search for payments
                disabled
              />
              <div
                className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />

                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing{" "}
                {paginatedPaymentData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to {Math.min(currentPage * itemsPerPage, transactions.length)}{" "}
                of {transactions.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Invoice ID
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Course
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Due By Days
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Paid Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paginatedPaymentData.length > 0 ? (
                    paginatedPaymentData.map((row, index) => {
                      let statusClass = "";
                      switch (row.status) {
                        case "Paid":
                          statusClass = "bg-green-500 text-white";
                          break;
                        case "Pending":
                          statusClass = "bg-red-500 text-white";
                          break;
                        case "Void":
                          statusClass = "bg-yellow-500 text-white";
                          break;
                        case "Cancelled":
                          statusClass = "bg-gray-500 text-white";
                          break;
                      }
                      return (
                        <tr
                          key={row.invoiceid}
                          className={`text-center dark:text-white ${
                            index % 2 === 0
                              ? "bg-[#fff] dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="p-3">{row.invoiceid}</td>
                          <td className="p-3">{row.date}</td>
                          <td className="p-3">{row.course}</td>
                          <td className="p-3">{row.duebydays}</td>
                          <td className="p-3">{row.paiddate}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Table for 'Assessments' Tab */}
      {activeTab === "Assessments" && (
        <div className="">
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                // value and onChange can be implemented if you want search for assessments
                disabled
              />
              <div
                className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />

                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing{" "}
                {paginatedAssessmentData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to {Math.min(currentPage * itemsPerPage, assessment.length)} of{" "}
                {assessment.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Subject
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Score
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Grade
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paginatedAssessmentData.length > 0 ? (
                    paginatedAssessmentData.map((row, index) => {
                      let statusClass = "";
                      switch (row.status) {
                        case "Completed":
                          statusClass = "bg-green-500 text-white";
                          break;
                        case "Retake Required":
                          statusClass = "bg-red-500 text-white";
                          break;
                      }
                      return (
                        <tr
                          key={row.subject + row.date + index}
                          className={`text-center dark:text-white ${
                            index % 2 === 0
                              ? "bg-[#fff] dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="p-3">{row.subject}</td>
                          <td className="p-3">{row.date}</td>
                          <td className="p-3">{row.score}</td>
                          <td className="p-3">{row.grade}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center justify-center w-28 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {Math.ceil(assessment.length / itemsPerPage) > 1 && (
            <div className="flex justify-end mt-4">
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(assessment.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-6 h-6 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table for 'Assignments' Tab */}
      {activeTab === "Assignments" && (
        <div className="">
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                // value and onChange can be implemented if you want search for assignments
                disabled
              />
              <div
                className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />

                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing{" "}
                {paginatedAssessmentData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to {Math.min(currentPage * itemsPerPage, assessment.length)} of{" "}
                {assessment.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Subject
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Score
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Grade
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paginatedAssessmentData.length > 0 ? (
                    paginatedAssessmentData.map((row, index) => {
                      let statusClass = "";
                      switch (row.status) {
                        case "Completed":
                          statusClass = "bg-green-500 text-white";
                          break;
                        case "Retake Required":
                          statusClass = "bg-red-500 text-white";
                          break;
                      }
                      return (
                        <tr
                          key={row.subject + row.date + index}
                          className={`text-center dark:text-white ${
                            index % 2 === 0
                              ? "bg-[#fff] dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="p-3">{row.subject}</td>
                          <td className="p-3">{row.date}</td>
                          <td className="p-3">{row.score}</td>
                          <td className="p-3">{row.grade}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center justify-center w-28 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabbedTable;
