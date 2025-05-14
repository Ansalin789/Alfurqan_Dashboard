"use client";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import StudentsRecord from "./studentcourseprogress";
import axios from "axios";

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
  const tabs = ["Class", "Courses", "Payment", "Assessments"];
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [coursesData, setCoursesData] = useState<CourseRow[]>([]);

  const [transactions, setTransactions] = useState<PaymentRow[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
////////////////courses///////////////////
useEffect(() => {
  if (typeof window !== 'undefined' && studentId) {
    const token = localStorage.getItem('AdminAuthToken');
    if (token) {
      fetchStudentDetails(token, studentId);
    } else {
      alert("No auth token found.");
    }
  }
}, [studentId]);

const fetchStudentDetails = async (token: string, studentId: string) => {
  try {
    const response = await axios.get<StudentResponse>(
      `http://localhost:5001/alstudents/${studentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
  if (typeof window !== 'undefined' && studentId) {
    const token = localStorage.getItem('AdminAuthToken');
    if (token) {
      fetchStudentInvoice(token, studentId);
    } else {
      alert("No auth token found.");
    }
  }
}, [studentId]);

const fetchStudentInvoice = async (token: string, studentId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/studentinvoice/${studentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log("Raw API response:", response.data);

    // Make sure it's an array even if one object is returned
    const data = Array.isArray(response.data) ? response.data : [response.data];

    const formatted = data.map((item) => {
      const created = new Date(item.createdDate);
      const today = new Date();
      const diff = Math.floor((today.getTime() - created.getTime()) / (1000 * 3600 * 24)); // duebydays

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
    if (typeof window !== 'undefined' && studentId) {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchClassSchedule(token, studentId);
      } else {
        alert("No auth token found.");
      }
    }
  }, [studentId]);
  
  const fetchClassSchedule = async (token: string, studentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5001/classShedule/students?studentId=${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
    if (typeof window !== 'undefined' && studentId) {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchStatsData(token, studentId);
      } else {
        alert("No auth token found.");
        setLoading(false);
      }
    }
  }, [studentId]);
  
  const fetchStatsData = async (token: string, studentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/classShedule/studentsclasscount?studentId=${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'

          },
        }
      );
  
      const data: Stats = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };
   // Depend on studentId to refetch stats when it changes

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  if (!stats) {
    return <div>Error: Stats could not be loaded.</div>; // Handle case where stats are not available
  }

  // Define progressData using the fetched stats
  const progressData = [
    { label: "Level", value: stats.level, color: "#00C8FF" },
    { label: "Attendance", value: stats.totalAttendance, color: "#003F88" },
    { label: "Total Classes", value: stats.totalClasses, color: "#503291" },
    { label: "Duration", value: stats.totalduration, color: "#72A4F7" },
  ];
 
  const assessment = [
    {
      subject: "islamic hisztory",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Completed",
    },
    {
      subject: "islamic hisztory",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Retake Required",
    },
  ];
  // Calculate paginated assignments

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClassData = classData.slice(
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


  return (
    <div className=" overflow-x-auto mt-4 bg-white shadow-md rounded-lg p-3 ">
      {/* Tabs */}
      <div className="flex space-x-4  pb-1 text-sm text-black mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 ${
              activeTab === tab
                ? "text-white bg-[#002c5f] rounded-lg"
                : "text-black "
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table for 'Class' Tab */}
      {activeTab === "Class" && (
        <div className="p-1">
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full mx-auto  ">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Teacher</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClassData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedClassData.map((row, index) => (
                    <tr
                      key={row._id}
                      className={`text-[9px] text-center font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-2">{row.student.studentId}</td>
                      <td className="p-2">{row.teacher.teacherName}</td>
                      <td className="p-2">{row.package}</td>
                      <td className="p-2">
                        {new Date(row.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded-2xl whitespace-nowrap ${
                            row.scheduleStatus === "Rescheduled"
                              ? "bg-green-200 text-green-700"
                              : "bg-[#002c5f] text-white"
                          }`}
                        >
                          {row.scheduleStatus === "Rescheduled"
                            ? "Rescheduled"
                            : `${row.startTime[0]} - ${row.endTime[0]}`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1">
              <p className="text-[11px]">
                Showing {paginatedClassData.length} of {classData.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(classData.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
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
          </div>
        </div>
      )}

{/* Courses Tab */}
{activeTab === "Courses" && (
  <div className="mt-4 p-4">
    <div className="grid grid-cols-4 gap-4 text-center">
      {progressData.map((item) => {
        let suffix = "";
        let isPercentage = false; // Default value

        // Check conditions to determine if the item is a percentage or needs a suffix
        if (item.label === "Attendance") {
          suffix = "%";
          isPercentage = true; // Set isPercentage to true for Attendance
        } else if (item.label === "Duration") {
          suffix = "hrs";
        }

        return (
          <div key={item.label} className="flex flex-col items-center">
            <div className="relative w-24 h-20 flex items-center justify-center">
              <CircularProgressbar
                value={item.value}
                maxValue={isPercentage ? 100 : undefined} 
                strokeWidth={15}
                styles={buildStyles({
                  pathColor: item.color,
                  trailColor: "#D3D3D3",
                  strokeLinecap: "round",
                })}
              />
              <div className="absolute text-sm font-semibold text-black">
                {item.value}
                {suffix} {/* Display the suffix */}
              </div>
            </div>
            <p className="mt-4 text-xs font-medium">{item.label}</p>
          </div>
        );
      })}
    </div>

    {/* Course Table */}
    <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto mt-3">
      <table className="w-full text-[12px]">
        <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
          <tr>
            <th className="p-2">Course ID</th>
            <th className="p-2">Course Name</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">Package</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
       <tbody>
          {paginatedCourseData.map((row, index) => (
            <tr
              key={row.id}
              className={`text-[9px] text-center font-medium mt-0 ${
                index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
              }`}
            >
              <td className="p-2">{row.id}</td>
              <td className="p-2">{row.name}</td>
              <td className="p-2">{row.date}</td>
              <td className="p-2">{row.package}</td>
              <td className="p-2">
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
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1">
        <p className="text-[11px]">
          Showing {paginatedCourseData.length} of {coursesData.length}{" "}
          classes
        </p>
        <div className="flex gap-2">
          {Array.from(
            { length: Math.ceil(coursesData.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
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
    </div>
  </div>
)}


      {/* Table for 'Payment' Tab */}
      {activeTab === "Payment" && (
        <div className="overflow-hidden   p-4">
          {/* Search Bar */}
          <div className="relative mb-4 flex justify-end">
            <input
              type="text"
              placeholder="Search"
              className="w-40 px-3 h-8 py-1.5 pl-8 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              className="absolute left-auto right-3 top-2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M15 10a5 5 0 10-10 0 5 5 0 0010 0z"
              />
            </svg>
          </div>
          {/* Transactions Table */}
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1275px] mx-auto">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Invoice ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Due By Days</th>
                  <th className="p-2">Paid Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPaymentData.map((row, index) => {
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
                      className={`text-[9px] text-center font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-2">{row.invoiceid}</td>
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.course}</td>
                      <td className="p-2">{row.duebydays}</td>
                      <td className="p-2">{row.paiddate}</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1 ">
              <p className="text-[11px]">
                Showing {paginatedPaymentData.length} of {transactions.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(transactions.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
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
          </div>
        </div>
      )}

      {/* Table for 'Assessments' Tab */}
      {activeTab === "Assessments" && (
        <div className="overflow-hidden rounded-lg  p-4">
          {/* Search Bar */}
          <div className="relative mb-4 flex justify-left">
            <StudentsRecord />
          </div>
          {/* Transactions Table */}
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssessmentData.map((row, index) => {
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
                      key={row.subject}
                      className={`text-[9px] text-center font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-2">{row.subject}</td>
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.score}</td>
                      <td className="p-2">{row.grade}</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center justify-center w-28 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1 ">
              <p className="text-[11px]">
                Showing {paginatedAssessmentData.length} of {assessment.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(assessment.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TabbedTable;
