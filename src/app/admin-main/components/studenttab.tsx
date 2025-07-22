"use client";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import StudentsRecord from "./studentcourseprogress";
import axios from "axios";
import { MdTune } from "react-icons/md";
import { PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/navigation";
import { BsThreeDotsVertical } from "react-icons/bs";


type TabbedTableProps = {
  studentId: string;
  userId: string;
  courseName : string;
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
    studentEmail: string;
    studentPhone: number;
    course: string;
    package: string;
    city: string;
    country: string;
    gender: string;
  };
  course: {
    courseId: string;
    courseName: string;
  };
  teacher: {
    teacherId?: string;
    teacherName: string;
    teacherEmail?: string;
  };
}


// type Stats = {
//   level: number;
//   totalAttendance: number;
//   totalClasses: number;
//   totalduration: number;
// };

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
  course:string;
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

interface AssignmentType {
  _id: string;
  studentId: string;
  studentName: string;
  sessionClassType?: string;
  assignmentName: string;
  questionName?: string;
  questionType?: string;
  typeofQuestion?: string;
  title: string;
  assignedTeacher?: string;
  assignedTeacherId?: string;
  assignmentId: string;
  assignmentType?: {
    type?: string;
    name?: string;
    chooseType?: boolean;
    trueorfalseType?: boolean;
  };
  chooseType?: boolean;
  trueorfalseType?: boolean;
  question?: string;
  hasOptions?: boolean;
  options?: {
    optionOne?: string;
    optionTwo?: string;
    optionThree?: string;
    optionFour?: string;
  };
  status?: string;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  level?: string;
  courses?: string;
  assignedDate?: string;
  dueDate?: string;
  answer?: string;
  answerValidation?: string;
  assignmentStatus?: string;
  __v?: number;
  questions?: {
    _id: string;
    status: string;
  }[];
  
}

// Define the PaymentResponse interface
interface PaymentResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  // Add other fields from the paymentResponse object as needed
}

// Define the PaymentDetail interface
interface PaymentDetail {
  _id: string;
  userId: string;
  userName: string;
  paymentStatus: string;
  paymentAmount: string;
  paymentResponse: PaymentResponse;
  paymentDate: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

const TabbedTable: React.FC<TabbedTableProps> = ({ studentId , courseName , userId}) => {
  console.log(studentId);
  const [activeTab, setActiveTab] = useState("Class");
  const tabs = [
    "Class",
    "Courses",
    "Payment History",
    "Assignments",
    "Assessments",
  ];
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  // const [stats, setStats] = useState<Stats | null>(null);
  const [coursesData, setCoursesData] = useState<CourseRow[]>([]);

  const [transactions, setTransactions] = useState<PaymentRow[]>([]);
  const [searchClass, setSearchClass] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleLogin = (studentId: string, courseName: string) => {
    localStorage.setItem("StudentPortalId", studentId);
    localStorage.setItem("StudentCourseName", courseName);

  };

  const [dashboardCounts, setDashboardCounts] = useState({
    totalLevel: 0,
    totalAttendance: 0,
    totalClasses: 0,
    presentCount: 0,
    totalDuration: 0,
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentDetail[]>([]); // State to hold payment history


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const token = localStorage.getItem("AdminAuthToken");
       
        console.log("✅ tokenss:", token);
        console.log("✅ studentIdsss:", studentId);
        console.log("✅ courseNamesss:", courseName);
  
        if (!token || !studentId || !courseName) {
          console.error("❌ studentId or courseName missing in localStorage");
          return;
        }
  
        const response = await axios.get(`http://localhost:5001/dashboard/student/counts`, {
          params: { studentId, courseName },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            
          },
        });
  
        console.log("✅ FULL API response:", response);
        console.log("✅ Final Data:", JSON.stringify(response.data, null, 2));
  
        setDashboardCounts({
          totalLevel: Number(response.data.totalLevel) || 0,
          totalAttendance: Number(response.data.totalAttendance) || 0,
          totalClasses: Number(response.data.totalClasses) || 0,
          presentCount: 0,
          totalDuration: Number(response.data.totalDuration) || 0,
        });
      } catch (error) {
        console.error("❌ Error fetching dashboard counts:", error);
      }
    };
  
    fetchData();
  }, [studentId, courseName]); // Add studentId as a dependency
  

  const data = [
    {
      title: "Level",
      value: `${Math.floor(dashboardCounts.totalLevel)}`,
      percentage: Math.floor(dashboardCounts.totalLevel),
      ringColor: "#7DB5CB",
      bgColor: "#E7EFF2",
    },

    {
      title: "Attendance",
      value: `${Math.floor(dashboardCounts.totalAttendance)}%`,
      percentage: Math.floor(dashboardCounts.totalAttendance),
      ringColor: "#9AD7D6",
      bgColor: "#E7EFF2",
    },

    {
      title: "Total Classes",
      value: `${Math.floor(dashboardCounts.totalClasses)}`, // No % sign here
      // Cap percentage to 100 for pie chart to avoid overflow
      percentage:
        dashboardCounts.totalClasses > 100
          ? 100
          : Math.floor(dashboardCounts.totalClasses),
      ringColor: "#8B93D2",
      bgColor: "#E7EFF2",
    },

    {
      title: "Duration",
      value: `${Math.floor(dashboardCounts.totalDuration)} Hr`,
      percentage: Math.floor(dashboardCounts.totalDuration),
      ringColor: "#B690D5",
      bgColor: "#E7EFF2",
    },
  ];
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
        `http://localhost:5001/alstudents/${studentId}`,
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
        `http://localhost:5001/studentinvoice/${studentId}`,
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
  }, []);

  const fetchClassSchedule = async (token: string, studentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5001/classShedule/students?studentId=${studentId}`,
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

  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const router = useRouter();
  const [backendScore, setBackendScore] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Filter state variables
  const [filters, setFilters] = useState({
    assignmentName: "",
    course: "",
    level: "",
    assignedDateFrom: "",
    assignedDateTo: "",
    dueDateFrom: "",
    dueDateTo: "",
    status: ""
  });

  // Get unique values for filter options
  const getUniqueCourses = () => {
    const values = assignments.map(assignment => assignment.courses).filter(Boolean) as string[];
    return Array.from(new Set(values));
  };
  
  const getUniqueLevels = () => {
    const values = assignments.map(assignment => assignment.level).filter(Boolean) as string[];
    return Array.from(new Set(values));
  };

  // Map assignment status for display and filtering
  const mapStatus = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
      case "INPROGRESS":
        return "Assigned";
      case "COMPLETED":
        return "Completed";
      case "PENDING":
      case "NOT ASSIGNED":
      default:
        return "Pending";
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("AdminAuthToken");

        if (!token || !studentId) {
          console.error("Missing token or student ID");
          return;
        }

        const res = await fetch(`http://localhost:5001/assignments/student?studentId=${studentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        console.log("Fetched Assignments Data:", data); // Log the fetched data

        // Ensure that the data is being set correctly
        setAssignments(data.data || []); // Set the assignments data
      } catch (err: any) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]); // Ensure studentId is in the dependency array

  // Filter assignments based on current filters
  const filterAssignments = (assignments: AssignmentType[]) => {
    return assignments.filter(assignment => {
      // Search by keyword in all table data (case-insensitive)
      if (
        searchKeyword &&
        !Object.values(assignment)
          .map(val => (typeof val === 'string' ? val.toLowerCase() : ''))
          .join(' ')
          .includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
      // Assignment Name filter
      if (filters.assignmentName && !assignment.title?.toLowerCase().includes(filters.assignmentName.toLowerCase())) {
        return false;
      }
      // Course filter
      if (filters.course && assignment.courses !== filters.course) {
        return false;
      }
      // Level filter
      if (filters.level && assignment.level !== filters.level) {
        return false;
      }
      // Status filter (use mapped status)
      if (filters.status && mapStatus(assignment.assignmentStatus) !== filters.status) {
        return false;
      }
      // Assigned Date range filter
      if (filters.assignedDateFrom && assignment.assignedDate) {
        const assignedDate = new Date(assignment.assignedDate);
        const fromDate = new Date(filters.assignedDateFrom);
        if (assignedDate < fromDate) {
          return false;
        }
      }
      if (filters.assignedDateTo && assignment.assignedDate) {
        const assignedDate = new Date(assignment.assignedDate);
        const toDate = new Date(filters.assignedDateTo);
        if (assignedDate > toDate) {
          return false;
        }
      }
      // Due Date range filter
      if (filters.dueDateFrom && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        const fromDate = new Date(filters.dueDateFrom);
        if (dueDate < fromDate) {
          return false;
        }
      }
      if (filters.dueDateTo && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        const toDate = new Date(filters.dueDateTo);
        if (dueDate > toDate) {
          return false;
        }
      }
      return true;
    });
  };

  // Tab logic (if you want to filter by assignmentStatus)
  const pendingAssignments = assignments.filter(a => mapStatus(a.assignmentStatus) !== "Completed");
  const completedAssignments = assignments.filter(a => {
    const isAssignmentCompleted = mapStatus(a.assignmentStatus) === "Completed";
    // If there are questions, check that none are "ASSIGNED"
    const allQuestionsNotAssigned = !a.questions || a.questions.every(q => mapStatus(q.status) !== "Assigned");
    return isAssignmentCompleted && allQuestionsNotAssigned;
  });

  // Apply filters to the appropriate tab
  const filteredPendingAssignments = filterAssignments(pendingAssignments);
  const filteredCompletedAssignments = filterAssignments(completedAssignments);
  const studentsToDisplay = activeTab === "Pending" ? filteredPendingAssignments : filteredCompletedAssignments;

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-[#ECFDF3] text-[#377E36] dark:bg-[#2E3D2E] dark:text-[#377E36]";
      case "INPROGRESS":
        return "bg-[#FDF6EC] text-[#F0AD4E] dark:bg-[#534634] dark:text-[#F0AD4E]";
      case "ASSIGNED":
        return "bg-[#FDECEC] text-[#D34645] dark:bg-[#4D3131] dark:text-[#D34645]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      assignmentName: "",
      course: "",
      level: "",
      assignedDateFrom: "",
      assignedDateTo: "",
      dueDateFrom: "",
      dueDateTo: "",
      status: ""
    });
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem("AdminAuthToken");
        if (!token || !studentId) {
          console.error("Missing token or student ID");
          return;
        }

        const response = await axios.get(`http://localhost:5001/student/paymenthistory`, {
          params: { userId: userId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data.paymentDetails) {
          setPaymentHistory(response.data.paymentDetails);
        }
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      }
    };

    fetchPaymentHistory();
  }, [studentId, userId]); // Added userId as a dependency

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
                        <td className="p-3">{row._id}</td>
                        <td className="p-3">{row.teacher.teacherName}</td>
                        <td className="p-3">{row.course.courseName}</td>
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
        {data.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-lg w-full bg-gradient-to-b from-white to-[#F9FAFB] dark:from-[#343434] dark:to-[#2A2A2A]"
          >
            <h3 className="text-[#010E30] dark:text-white text-[14px] font-medium mb-2">
              {item.title}
            </h3>
            <div className="flex justify-center">
              <div className="relative w-[80px] h-[80px]">
                <PieChart width={80} height={80}>
                  <Pie
                    data={[{ value: 100 }]}
                    dataKey="value"
                    innerRadius={26}
                    outerRadius={35}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.bgColor} />
                  </Pie>
                  <Pie
                    data={[
                      { value: item.percentage },
                      { value: 100 - item.percentage },
                    ]}
                    dataKey="value"
                    innerRadius={24}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.ringColor} />
                    <Cell fill="transparent" />
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#010E30] dark:text-white">
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
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

      {/* Table for 'Payment History' Tab */}
      {activeTab === "Payment History" && (
        <div className="">
          <div className="rounded-xl overflow-hidden">
            <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                // Implement search functionality if needed
                disabled
              />
              <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer">
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                Showing {paymentHistory.length} of {paymentHistory.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-none">
              <table className="w-full min-w-[900px] text-sm text-left table-auto">
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-center">Invoice ID</th>
                    <th className="p-4 font-semibold text-[12px] text-center">Date</th>
                    <th className="p-4 font-semibold text-[12px] text-center">Course</th>
                    <th className="p-4 font-semibold text-[12px] text-center">Amount</th>
                    <th className="p-4 font-semibold text-[12px] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((payment, index) => (
                      <tr key={payment._id} className={`text-center dark:text-white ${index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C]" : "bg-[#F8F8F8] dark:bg-[#303030]"}`}>
                        <td className="p-3">{payment.paymentResponse.id}</td>
                        <td className="p-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                        <td className="p-3">{payment.userName}</td>
                        <td className="p-3">{payment.paymentAmount}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${payment.paymentStatus === "succeeded" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            {payment.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">No data available</td>
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
            <table className="table-fixed w-full">
                <thead className="text-[13px] bg-[#4C6993] text-white">
                  <tr>
                    {[
                      "Assignment ID",
                      "Assigned By",
                      "Course",
                      "Level",
                      "Assignemnt Name",
                       "Class Type",
                      "Assigned Date",
                      "Due Date",
                      "Status"
                    ].map((header, idx) => (
                      <th
                        key={idx}
                        className="px-2 py-1 border border-[#4C6993] text-left text-wrap break-words"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment, index) => {
                      const status = assignment.assignmentStatus; // Use the assignmentStatus directly
                      const rowBgClass = index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C]" : "bg-[#F8F8F8] dark:bg-[#303030]";

                      return (
                        <tr key={assignment._id || index} className={`text-[10px] ${rowBgClass}`}>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.assignmentId}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.assignedTeacher}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.courses}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.level}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.title}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.sessionClassType}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}</td>
                          <td className="px-3 py-4 break-words text-[11px]">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}</td>
                          <td className="px-3 py-4 break-words text-[11px]">
                            <span className={`py-1 px-2 rounded-md text-[8px] flex items-center justify-center min-w-[80px] ${getStatusStyle(mapStatus(assignment.assignmentStatus))}`}>
                              {mapStatus(assignment.assignmentStatus)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
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
      )}
    </div>
  );
};

export default TabbedTable;
