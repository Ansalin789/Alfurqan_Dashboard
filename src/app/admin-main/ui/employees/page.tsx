"use client";
import BaseLayout4 from "@/components/BaseLayout4";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sun, Bell, FileText } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Line, Line as LineChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  Filler,
} from "chart.js";
import ApplicantsPage from "../../components/employeesrecruitment";

// Register chart.js modules
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Filler
);

const datas = [
  { name: "Female", value: 40, color: "#FF82F5" }, // Pink for Female
  { name: "Male", value: 60, color: "#00CCFF" }, // Blue for Male
];
const empdatas = [
  { name: "Female", value: 40, color: "#FF82F5" }, // Pink for Female
  { name: "Male", value: 60, color: "#00CCFF" }, // Blue for Male
];
const data = [
  { name: "Total Teachers", value: 100, color: "#012A4A" },
  { name: "Active Teachers", value: 80, color: "#6256BA" },
  { name: "Inactive Teachers", value: 50, color: "#00CCFF" },
  { name: "Students on Leave", value: 60, color: "#0074FF" },
];

const empdata = [
  { name: "Academic Coach", value: 100, color: "#012A4A" },
  { name: "Supervisor", value: 50, color: "#A6C3E5" },
];

const countriesData = [
  { name: "United States", flag: "/assets/images/flags/us.png", value: 110002 },
  { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499 },
  {
    name: "United Kingdom",
    flag: "/assets/images/flags/united-kingdom.png",
    value: 96998,
  },
  { name: "England", flag: "/assets/images/flags/england.png", value: 89061 },
  { name: "France", flag: "/assets/images/flags/france.png", value: 82000 },
];

const empcountriesData = [
  { name: "United States", flag: "/assets/images/flags/us.png", value: 110002 },
  { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499 },
  {
    name: "United Kingdom",
    flag: "/assets/images/flags/united-kingdom.png",
    value: 96998,
  },
  { name: "England", flag: "/assets/images/flags/england.png", value: 89061 },
  { name: "France", flag: "/assets/images/flags/france.png", value: 82000 },
];

interface Teacher {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profileImage?: string | null;
  level: string;
  subject: string;
  rating: number;
}
interface OtherEmployees {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profileImage?: string | null;
  level: string;
  subject: string;
  rating: number;
}

// Mock data for teachers
const mockTeachers: Teacher[] = [
  {
    _id: "1",
    userId: "user1",
    userName: "John Smith",
    email: "john.smith@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Senior",
    subject: "Mathematics",
    rating: 4.5,
  },
  {
    _id: "2",
    userId: "user2",
    userName: "Sarah Johnson",
    email: "sarah.j@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Physics",
    rating: 4.2,
  },
  {
    _id: "3",
    userId: "user3",
    userName: "Michael Brown",
    email: "michael.b@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Senior",
    subject: "Chemistry",
    rating: 4.8,
  },
  {
    _id: "4",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
  {
    _id: "5",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
  {
    _id: "6",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
  {
    _id: "7",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
  {
    _id: "8",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
  {
    _id: "9",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Biology",
    rating: 4.0,
  },
];

// Mock data for other employees
const mockOtherEmployees: OtherEmployees[] = [
  {
    _id: "1",
    userId: "user5",
    userName: "David Wilson",
    email: "david.w@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Senior",
    subject: "Administration",
    rating: 4.3,
  },
  {
    _id: "2",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "HR",
    rating: 4.1,
  },
  {
    _id: "3",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Teacher",
    rating: 4.1,
  },
  {
    _id: "4",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Supervisor",
    rating: 4.1,
  },
  {
    _id: "5",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "HR",
    rating: 4.1,
  },
  {
    _id: "6",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Teacher",
    rating: 4.1,
  },
  {
    _id: "7",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "Academic",
    rating: 4.1,
  },
  {
    _id: "8",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "HR",
    rating: 4.1,
  },
  {
    _id: "9",
    userId: "user6",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    profileImage: "/assets/images/proff.jpg",
    level: "Junior",
    subject: "HR",
    rating: 4.1,
  },
];

const leaveData = [
  {
    id: "#0983867",
    name: "Robert James",
    designation: "Supervisor",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Pending",
  },
  {
    id: "#0983867",
    name: "Stefan Salvatore",
    designation: "Admin",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Approved",
  },
  {
    id: "#0983867",
    name: "Gia Rose",
    designation: "Admin",
    leaveType: "Privilege Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Vacation",
    status: "Declined",
  },
  {
    id: "#0983867",
    name: "Robert James",
    designation: "Supervisor",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Pending",
  },
  {
    id: "#0983867",
    name: "Stefan Salvatore",
    designation: "Admin",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Approved",
  },
  {
    id: "#0983867",
    name: "Gia Rose",
    designation: "Admin",
    leaveType: "Privilege Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Vacation",
    status: "Declined",
  },
  {
    id: "#0983867",
    name: "Robert James",
    designation: "Supervisor",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Pending",
  },
  {
    id: "#0983867",
    name: "Stefan Salvatore",
    designation: "Admin",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Approved",
  },
  {
    id: "#0983867",
    name: "Gia Rose",
    designation: "Admin",
    leaveType: "Privilege Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Vacation",
    status: "Declined",
  },
  {
    id: "#0983867",
    name: "Robert James",
    designation: "Supervisor",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Pending",
  },
  {
    id: "#0983867",
    name: "Stefan Salvatore",
    designation: "Admin",
    leaveType: "Sick Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Sickness",
    status: "Approved",
  },
  {
    id: "#0983867",
    name: "Gia Rose",
    designation: "Admin",
    leaveType: "Privilege Leave",
    dateRange: "Jan 2, 2022 - Jan 5, 2022",
    reason: "Vacation",
    status: "Declined",
  }
];
const barData = [
  { name: "Total", value: 100, color: "#012A4A" },
  { name: "Active", value: 80, color: "#6D5DD3" },
  { name: "Inactive", value: 50, color: "#00CFFF" },
  { name: "Leave", value: 60, color: "#007BFF" }
];

const genderData = [
  { name: "Female", value: 40, color: "#FF82F5" },
  { name: "Male", value: 60, color: "#00CFFF" }
];



const maxValue = Math.max(...countriesData.map(c => c.value));


const Page = () => {
  const [activeTab, setActiveTab] = useState<
    "teachers" | "otheremployees" | "recruitment" | "leave"
  >("teachers");
  const maxValue = Math.max(...countriesData.map((c) => c.value));
  const maxValue1 = Math.max(...empcountriesData.map((c) => c.value));

  const needleValue = 40; // Adjust needle based on percentage

  const cx = 90; // Center X (Adjusted for new size)
  const cy = 90; // Center Y
  const needleLength = 35; // Adjusted needle length
  const angle = (needleValue / 100) * 180; // Rotate needle based on percentage
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [otherEmployees, setOtherEmployees] =
    useState<OtherEmployees[]>(mockOtherEmployees);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQuery1, setSearchQuery1] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<{
    id: string;
    name: string;
    designation: string;
    leaveType: string;
    dateRange: string;
    reason: string;
    status: string;
  } | null>(null);

  const [newTeacher, setNewTeacher] = useState({
    userName: "",
    email: "",
    password: "",
    role: ["TEACHER"],
    status: "Active",
    createdBy: "SYSTEM",
    profileImage: null,
    lastUpdatedBy: "SYSTEM",
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("New Teacher Data:", newTeacher);
    try {
      const response = await fetch(`https://alfurqanacademy.tech/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });
      const responseData = await response.json();
      console.log("Response:", response.status, responseData);
    } catch {
      console.error("Error saving new teacher:");
    }
    closeModal();
  };

  const handleViewTeacher = (teacherId: string) => {
    if (!teacherId) {
      console.error("Teacher ID is undefined.");
      return;
    }
    localStorage.setItem("manageTeacherId", teacherId);
    console.log("Teacher ID:", teacherId);
    router.push("/admin-main/ui/employees/teacher");
  };

  const handleViewEmployee = (employeeId: string) => {
    if (!employeeId) {
      console.error("Employee ID is undefined.");
      return;
    }
    localStorage.setItem("manageTeacherId", employeeId);
    console.log("Employee ID:", employeeId);
    router.push("/admin-main/ui/employees/otheremployees");
  };
  // Generate month names for the chart labels
  const chartTemplate = (color: string) => ({
    labels: Array(6).fill(""),
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3], // Dummy data, you can replace with real values
        borderColor: color,
        backgroundColor: color + "33", // '33' = ~20% opacity for hex
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });

  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };
  

  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center  px-3 py-2 w-full text-xs font-medium";
    if (status === "Pending")
      return (
        <span className={`${base} text-yellow-600 bg-yellow-100`}>
          ⚠ Pending
        </span>
      );
    if (status === "Approved")
      return (
        <span className={`${base} text-green-600 bg-green-100`}>
          ✅ Approved
        </span>
      );
    if (status === "Declined")
      return (
        <span className={`${base} text-red-600 bg-red-100`}>❌ Declined</span>
      );
  };

  function handlePortalAccess(teacherId: string) {
    const username = encodeURIComponent("David");
    const password = encodeURIComponent("David@123");
  
    const portalURL = `http://localhost:3000/teacher/ui/sign?username=${username}&password=${password}`;
    window.location.href = portalURL;
  }
  function handlePortalAccessforemployee(employeeID: string) {
    const username = encodeURIComponent("Arthi");
    const password = encodeURIComponent("Supervisor@123");
  
    const portalURL = `http://localhost:3000/supervisor/ui/sign?username=${username}&password=${password}`;
    window.location.href = portalURL;
  }

  return (
    <BaseLayout4>
    <div className="min-h-screen w-full px-4 py-4 mr-10">
      <div className="max-w-7xl w-full mx-auto">
        <div className="p-0 flex items-center justify-between">
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4">Employees</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
              <Sun size={16} className="text-black" />
            </button>
            <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
              <Bell size={16} className="text-black" />
            </button>
            <Link href="#">
              <img
                src="/assets/images/student-profile.png"
                alt="Profile"
                className="w-8 h-8 rounded-lg border border-gray-300 shadow"
              />
            </Link>
          </div>
        </div>
        <div className="flex space-x-4 border-b py-2">
          <button
            className={`px-4 py-2 text-[14px] font-semibold ${
              activeTab === "teachers"
                ? "bg-[#012A4A] text-white rounded-lg"
                : ""
            }`}
            onClick={() => setActiveTab("teachers")}
          >
            Teachers
          </button>
          <button
            className={`px-4 py-2 text-[14px] font-semibold ${
              activeTab === "otheremployees"
                ? "bg-[#012A4A] text-white rounded-lg"
                : ""
            }`}
            onClick={() => setActiveTab("otheremployees")}
          >
            Other Employees
          </button>
          <button
            className={`px-4 py-2 text-[14px] font-semibold ${
              activeTab === "recruitment"
                ? "bg-[#012A4A] text-white rounded-lg"
                : ""
            }`}
            onClick={() => setActiveTab("recruitment")}
          >
            Recruitment
          </button>
          <button
            className={`px-4 py-2 text-[14px] font-semibold ${
              activeTab === "leave" ? "bg-[#012A4A] text-white rounded-lg" : ""
            }`}
            onClick={() => setActiveTab("leave")}
          >
            Leave
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full py-6">
  {activeTab === "teachers" && (
    <div className="flex flex-col gap-6 w-full overflow-y-auto scrollbar-none ">
      <main className="w-full">
        {/* Charts & Stats Section */}
        <div className="flex flex-wrap gap-11 w-full">
          {/* Teachers Records */}
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 min-w-[580px] max-w-[650px] h-[280px]">
  <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Teachers Record</h2>
  <div className="flex  items-center">
    <div className="space-y-6 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#012A4A]"></div>
        <span>Total Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#6D5DD3]"></div>
        <span>Active Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#00CFFF]"></div>
        <span>Inactive Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#007BFF]"></div>
        <span>Teachers on Leave</span>
      </div>
    </div>
    <div className="flex-1 h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} barSize={40}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tick={false} />
          <YAxis hide />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {barData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


  {/* Gender Chart */}
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-[280px] h-[280px] flex flex-col items-center  relative">
  <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>
  <div className="relative w-full h-[170px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={genderData}
          dataKey="value"
          cx="50%"
          cy="90%"
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={90}
        >
          {genderData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Needle - static for now */}
    <div className="absolute left-1/2 bottom-[25px] w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
  </div>

  {/* Labels */}
  <div className="flex justify-between w-full px-6 text-gray-700 text-[14px] mb-5">
    <div className="flex flex-col items-center">
      <span className="text-[18px] font-bold">40%</span>
      <span className="text-[12px]">Female</span>
      <div className="w-10 h-1 bg-[#FF82F5] mt-1 rounded-full"></div>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-[18px] font-bold">60%</span>
      <span className="text-[12px]">Male</span>
      <div className="w-10 h-1 bg-[#00CFFF] mt-1 rounded-full"></div>
    </div>
  </div>
</div>




  {/* Countries Block */}
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-[280px] h-[280px] space-y-3">
  <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
  {countriesData.map((country, i) => (
    <div key={i} className="flex items-center gap-2">
      <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
      <div className="w-full">
        <div className="flex justify-between text-[13px] font-medium text-gray-800">
          <span>{country.name}</span>
          <span className="text-[#809FB8]">{country.value.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div
            className="h-2 bg-[#012A4A] rounded-full"
            style={{ width: `${(country.value / maxValue) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
  

        {/* Search & Cards Section */}
        <div className="mt-6 w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-lg px-2 py-2 text-sm shadow w-full lg:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Duration:</span>
              <select className="border rounded-lg p-2 text-sm shadow">
                <option>Last month</option>
                <option>Last week</option>
                <option>Last year</option>
              </select>
            </div>
          </div>

          {/* Teacher Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7 max-h-[300px] ">
            {teachers
              .filter(
                (teacher) =>
                  teacher.userName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  teacher.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((teacher) => (
                <div
                  key={teacher._id}
                  className="bg-white shadow-md rounded-lg p-5"
                >
                  <div className="flex  items-center">
                    <Image
                      src="/assets/images/proff.jpg"
                      alt="Teacher"
                      className="w-10 h-10 ml-[80px] mt-3 rounded-full"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-sm mt-3 font-semibold text-[#223857]">
                      {teacher.userName}
                    </h3>
                    <p className="text-xs mt-3 text-[#717579]">
                      Level: {teacher.level}
                    </p>
                    <p className="text-xs mt-1 text-[#717579]">{teacher.subject}</p>
                    <div className="flex flex-col justify-center gap-3 px-5 mt-2">
                      <button
                        className="text-[12px] bg-[#c95b45] text-white px-2 py-1 rounded-lg"
                        onClick={() => handlePortalAccess(teacher._id)}
                      >
                        Portal Access
                      </button>
                      <button
                        className="text-[12px] bg-[#223857] text-white px-2 py-1 rounded-lg"
                        onClick={() => handleViewTeacher(teacher._id)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )}

          {activeTab === "otheremployees" && (
            <div className="flex flex-col gap-6 w-full overflow-y-auto scrollbar-none ">
            <main className="w-full">
              {/* Charts & Stats Section */}
              <div className="flex flex-wrap gap-11 w-full">
          {/* Teachers Records */}
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 min-w-[580px] max-w-[650px] h-[280px]">
  <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Teachers Record</h2>
  <div className="flex  items-center">
    <div className="space-y-6 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#012A4A]"></div>
        <span>Total Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#6D5DD3]"></div>
        <span>Active Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#00CFFF]"></div>
        <span>Inactive Teachers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#007BFF]"></div>
        <span>Teachers on Leave</span>
      </div>
    </div>
    <div className="flex-1 h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={40}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tick={false} />
          <YAxis hide />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


  {/* Gender Chart */}
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-[280px] h-[280px] flex flex-col items-center  relative">
  <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>
  <div className="relative w-full h-[170px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={empdatas}
          dataKey="value"
          cx="50%"
          cy="90%"
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={90}
        >
          {empdatas.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Needle - static for now */}
    <div className="absolute left-1/2 bottom-[25px] w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
  </div>

  {/* Labels */}
  <div className="flex justify-between w-full px-6 text-gray-700 text-[14px] mb-5">
    <div className="flex flex-col items-center">
      <span className="text-[18px] font-bold">40%</span>
      <span className="text-[12px]">Female</span>
      <div className="w-10 h-1 bg-[#FF82F5] mt-1 rounded-full"></div>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-[18px] font-bold">60%</span>
      <span className="text-[12px]">Male</span>
      <div className="w-10 h-1 bg-[#00CFFF] mt-1 rounded-full"></div>
    </div>
  </div>
</div>




  {/* Countries Block */}
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-[280px] h-[280px] space-y-3">
  <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
  {empcountriesData.map((country, i) => (
    <div key={i} className="flex items-center gap-2">
      <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
      <div className="w-full">
        <div className="flex justify-between text-[13px] font-medium text-gray-800">
          <span>{country.name}</span>
          <span className="text-[#809FB8]">{country.value.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div
            className="h-2 bg-[#012A4A] rounded-full"
            style={{ width: `${(country.value / maxValue) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  ))}
</div>

</div>
<div className="mt-6 w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-lg px-2 py-2 text-sm shadow w-full lg:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Duration:</span>
              <select className="border rounded-lg p-2 text-sm shadow">
                <option>Last month</option>
                <option>Last week</option>
                <option>Last year</option>
              </select>
            </div>
          </div>

          {/* Teacher Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7 max-h-[300px] ">
          {otherEmployees
                            .filter(
                              (employee) =>
                                employee.userName
                                  .toLowerCase()
                                  .includes(searchQuery1.toLowerCase()) ||
                                employee.email
                                  .toLowerCase()
                                  .includes(searchQuery1.toLowerCase())
                            )
                            .map((employee) => (
                              <div
                                key={employee._id}
                                className="bg-white shadow-md rounded-lg p-5"
                              >
                                <div className="flex  items-center ">
                                  <Image
                                    src={
                                      employee.profileImage ??
                                      "/assets/images/proff.jpg"
                                    }
                                    alt="Employee"
                                    className="w-10 h-10 ml-[80px] mt-3 rounded-full"
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <div className="mt-3 text-center">
                                  <h3 className="text-sm font-bold text-[#223857] mb-2">
                                    {employee.userName}
                                  </h3>
                                  <p className="text-[#717579] text-xs">
                                    {employee.level}
                                  </p>
                                  <p className="text-[#717579] p-1 text-xs">
                                    {employee.subject}
                                  </p>
                                  <div className="flex flex-col justify-center gap-3 px-5 mt-2">
                                    <button
                                      className="text-[12px] bg-[#c95b45] text-white px-2 py-1 rounded-lg"
                                      onClick={() =>
                                        handlePortalAccessforemployee(employee._id)
                                      }
                                    >
                                      Portal Access
                                    </button>
                                    <button
                                      className="text-[12px] bg-[#223857] text-white px-2 py-1 rounded-lg"
                                      onClick={() =>
                                        handleViewEmployee(employee._id)
                                      }
                                    >
                                      View Profile
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
          </div>
        </div>
              </main>
            </div>
          )}
          {activeTab === "recruitment" && (
  <div className="flex flex-col ">
    <main className="flex-grow">
      {/* ✅ Section 1: Stats Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Applications",
            count: "250",
            color: "gray",
            iconBg: "bg-gray-100",
            iconColor: "text-gray-500",
            chartColor: "#64748b",
          },
          {
            title: "Shortlisted Candidates",
            count: "135",
            color: "indigo",
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500",
            chartColor: "#6366f1",
          },
          {
            title: "Rejected Candidates",
            count: "100",
            color: "cyan",
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-500",
            chartColor: "#06b6d4",
          },
          {
            title: "Waiting Candidates",
            count: "15",
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500",
            chartColor: "#3b82f6",
          },
          
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl flex flex-col justify-between w-full"
          >
            <div className="flex items-start justify-between px-4 mt-4 mb-2">
              <div
                className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}
              >
                <FileText size={20} className={card.iconColor} />
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-800">
                  {card.count}
                </h3>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            </div>
            <div className="h-16">
              <Line data={chartTemplate(card.chartColor)} options={smallChartOptions} />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Section 2: Applicants Table */}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[900px]">
          <ApplicantsPage />
        </div>
      </div>
    </main>
  </div>
)}




          {activeTab === "leave" && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="flex gap-5 ">
                <div className="bg-[#012A4A] text-white rounded-xl shadow p-5 w-[200px]">
                  <p className="text-sm">Total Leave Requests</p>
                  <h2 className="text-2xl font-semibold ">150</h2>
                </div>
                <div className="bg-[#2D49AD] text-white rounded-xl shadow p-5 w-[200px]">
                  <p className="text-sm">Total Approved</p>
                  <h2 className="text-2xl font-semibold">125</h2>
                </div>
                <div className="bg-[#667085] text-white rounded-xl shadow p-5 w-[200px]">
                  <p className="text-sm">Total Declined</p>
                  <h2 className="text-2xl font-semibold">25</h2>
                </div>
              </div>
              <div className="flex flex-1 space-x-0 items-center justify-between mt-8">
  {/* Search Bar */}
  <div className="flex ml-0">
    <div className="relative">
      <input
        type="text"
        placeholder="Search here..."
        className="border rounded-lg px-10 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={searchQuery1}
        onChange={(e) => setSearchQuery1(e.target.value)}
      />
      <span className="absolute left-3 top-2.5 text-gray-400 text-xs">
        🔍
      </span>
    </div>
    <button className="ml-2 px-4 py-2 bg-white border rounded-lg shadow text-sm font-base hover:bg-gray-100">
      Filter
    </button>
  </div>

  {/* Duration Dropdown */}
  <div className="flex">
    <select className="border rounded-lg p-2 shadow text-sm">
      <option>Duration : March</option>
      <option>Last Month</option>
      <option>Last Week</option>
      <option>Last Year</option>
    </select>
  </div>
</div>

{/* Table Section */}
<div className="bg-white shadow-md border border-gray-900 rounded-lg h-[500px] overflow-x-auto mt-4 scrollbar-none">
  <table className="min-w-full text-sm text-[#0d1b3e] table-fixed">
    <thead className="bg-white">
      <tr className="text-left">
        {[
          "Employee ID",
          "Employee Name",
          "Designation",
          "Leave Type",
          "Date Range",
          "Reason For Leave",
          "Status",
          "",
        ].map((title, idx) => (
          <th key={idx} className="px-6 py-3 text-sm font-medium text-left bg-[#F4F5F7] text-gray-700  whitespace-nowrap">
            {title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {leaveData.map((item, idx) => (
        <tr key={idx} className="hover:bg-gray-50 text-left align-middle border-b border-gray-300 ">
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.id}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.name}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.designation}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.leaveType}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.dateRange}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">{item.reason}</td>
          <td className="px-6 py-3 text-xs whitespace-nowrap align-middle border-b border-gray-300">
            <div className="w-[110px] h-[30px] flex items-center justify-center border rounded-md border-b border-gray-300">
              {getStatusBadge(item.status)}
            </div>
          </td>
          <td className="px-6 py-3 text-right text-xs align-middle border-b border-gray-300">
            <button
              onClick={() => setSelectedLeave(item)}
              className="hover:text-gray-600 text-sm"
            >
              ⋯
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



              {selectedLeave && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-xl relative">
                    <h2 className="text-lg font-semibold text-[#0d1b3e] mb-6">
                      Leave Request Approval
                    </h2>

                    <button
                      onClick={() => setSelectedLeave(null)}
                      className="absolute top-4 right-4 text-xl text-[#0d1b3e] hover:text-gray-600"
                    >
                      ✕
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Section */}
                      <div className="grid grid-cols-[160px_1fr] items-center">
                        {/* Employee ID */}
                        <label
                          htmlFor="employeeID"
                          className="font-medium text-sm"
                        >
                          Employee ID
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          value={selectedLeave.id}
                          disabled
                        />

                        {/* Employee Name */}
                        <label
                          htmlFor="employeeName"
                          className="font-medium text-sm"
                        >
                          Employee Name
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          value={selectedLeave.name}
                          disabled
                        />

                        {/* Designation */}
                        <label
                          htmlFor="Designation"
                          className="font-medium text-sm"
                        >
                          Designation
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          value={selectedLeave.designation}
                          disabled
                        />

                        {/* Leave Type */}
                        <label
                          htmlFor="Leavetype"
                          className="font-medium text-sm"
                        >
                          Leave Type
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          value={selectedLeave.leaveType}
                          disabled
                        />

                        {/* From Date */}
                        <label
                          htmlFor="from date"
                          className="font-medium text-sm"
                        >
                          From Date
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          value="11/02/2024"
                          disabled
                        />

                        {/* To Date */}
                        <label htmlFor="todate" className="font-medium text-sm">
                          To Date
                        </label>
                        <input
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs "
                          value="16/02/2024"
                          disabled
                        />

                        {/* Reason For Leave */}
                        <label htmlFor="reason" className="font-medium text-sm">
                          Reason For Leave
                        </label>
                        <textarea
                          className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs"
                          rows={3}
                          value={selectedLeave.reason}
                          disabled
                        />
                      </div>

                      {/* Right Section */}
                      <div className="space-y-4 text-[#0d1b3e] text-sm">
                        <h3 className="font-semibold text-[#1e2a50]">
                          Leave Records
                        </h3>

                        {/* Leave Records Box */}
                        <div className="border rounded-xl p-4 space-y-3">
                          {[
                            { label: "Sick Leave", value: "2" },
                            { label: "Casual Leave", value: "2" },
                            { label: "Loss of Pay", value: "1" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between"
                            >
                              <span>{item.label}</span>
                              <input
                                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center text-[#0d1b3e] shadow-sm focus:outline-none"
                                value={item.value}
                                readOnly
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4 text-[#0d1b3e] text-sm">
                          {/* Deductions */}
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="deductions"
                              className="w-32 font-medium"
                            >
                              Deductions
                            </label>
                            <input
                              type="checkbox"
                              checked
                              className="w-5 h-5 border border-gray-400 rounded accent-[#0d1b3e]"
                              readOnly
                            />
                          </div>

                          {/* Approved Days */}
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="approveddays"
                              className="w-32 font-medium"
                            >
                              Approved Days
                            </label>
                            <div className="relative w-full">
                              <select
                                className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-[#0d1b3e] shadow-sm  appearance-none pr-10"
                                
                              >
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                              </select>
                            </div>
                          </div>

                          {/* From Date */}
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="fromdate"
                              className="w-32 font-medium"
                            >
                              From Date
                            </label>
                            <div className="relative w-full">
                              <input
                                type="text"
                                value="11/02/2024"
                                className="w-full border border-[#bfc6db] rounded-md px-4 py-2 text-[#0d1b3e] pr-10 shadow-sm"
                                readOnly
                              />
                              
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"></div>
                            </div>
                          </div>

                          {/* To Date */}
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="todate"
                              className="w-32 font-medium"
                            >
                              To Date
                            </label>
                            <div className="relative w-full">
                              <input
                                type="text"
                                value="14/02/2024"
                                className="w-full border border-[#bfc6db] rounded-md px-4 py-2 text-[#0d1b3e] pr-10 shadow-sm"
                                readOnly
                              />
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"></div>
                            </div>
                          </div>

                          {/* Deduction Days */}
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="deductiondays"
                              className="w-32 font-medium"
                            >
                              Deduction Days
                            </label>
                            <div className="relative w-full">
                              <input
                                type="text"
                                value="2"
                                className="w-full border border-[#bfc6db] rounded-md px-4 py-2 text-[#0d1b3e] pr-10 shadow-sm"
                                readOnly
                              />
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      {selectedLeave.status === "Pending" ? (
                        <>
                          {/* Decline Button */}
                          <button
                           onClick={() => setSelectedLeave(null)}
                            className="px-4 py-1 border border-[#0d1b3e] text-[#0d1b3e] rounded-lg hover:bg-gray-100 transition"
                          >
                            Decline
                          </button>

                          {/* Approve Button */}
                          <button className="px-4 py-1 bg-[#0d1b3e] text-white rounded-lg hover:bg-[#1b2e5f] transition">
                            Approve
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-1 bg-[#0d1b3e] text-white rounded-lg hover:bg-[#1b2e5f] transition">
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </BaseLayout4>
  );
};

export default Page;
