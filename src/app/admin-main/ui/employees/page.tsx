"use client";


import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sun, Bell, FileText } from "lucide-react";
import Link from "next/link";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
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
import { Line} from "react-chartjs-2";
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
import axios from "axios";

// Register chart.js modules
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Filler
);
interface OtherEmployeess {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  nationality: string;
  country: string;
  city: string;
  dateOfBirth: string;
  gender: string;
  residentialAddress: string;
  higherQualification: string;
  universityName: string;
  previousJob: string;
  experience: string;
  bankName: string;
  accountNumber: number;
  bankCode: string;
  passportNumber: string;
  languagesKnown: string[];
  emergencyContactNumber: number;
  relationshipWithEmployee: string;
  address: string;
  designation: string;
  department: string;
  preferedWorkingHours: number;
  preferedShiftFrom: string;
  preferedShiftTo: string;
  comments: string;
  profileImage: string | null;
  applicationDate: string;
  currency: string;
  expectedSalary: number;
  applicationStatus: string;
  preferedWorkingDays: string[];
  status: string;
}

interface EmpCountryData {
  country: string;
  count: number;
  percentage: number;
}



interface Teacher {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profileImage: string | null;
  level?: string;
  subject?: string;
  rating?: number;
  gender?: string;
}
interface OtherEmployee {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profileImage: string | null;
  role: string[];
  status: string;
  gender: string;
  createdBy: string;
  lastUpdatedBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  lastLoginDate: string;
}

interface OtherEmployeesResponse {
  users: OtherEmployee[];
  totalCount: number;
}
type ChartData = {
  name: string;
  value: number;
  color: string;
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#012A4A",
  ACADEMICCOACH: "#6256BA",
  SUPERVISOR: "#00CCFF",
  USER: "#0074FF",
};
interface GenderResponse {
  teacherPercentage: number;
  teacherMalePercentage: string;   // or number if you convert it
  teacherFemalePercentage: string; // or number
}

interface GenderChartData {
  name: string;
  value: number;
  color: string;
}
countries.registerLocale(enLocale);

interface CountryStat {
  country: string;
  count: number;
  percentage: number;
}
interface OtherEmpCountResponse {
  totalOtherEmpCount: number;
  otherEmpCount: OtherEmpEntry[];
}

interface OtherEmpEntry {
  country: string[]; // e.g., ["ADMIN"]
  count: number;
  percentage: number;
}
const formatRole = (role: string) => {
  switch (role) {
    case "ACADEMICCOACH":
      return "Academic Coach";
    case "SUPERVISOR":
      return "Supervisor";
    case "USER":
      return "User";
    case "ADMIN":
      return "Admin";
    default:
      return role;
  }
};
const COLORS = {
  Female: "#FF82F5", // Pink
  Male: "#00CCFF",   // Blue
};
interface GenderCountResponse {
  employeePercentage: number;
  employeeMalePercentage: string;
  employeeFemalePercentage: string;
}
interface DashboardCounts {
  totalApplication: number;
  shortlisted: number;
  rejected: number;
  waiting: number;
}


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
  },
];






const Page = () => {
  const [activeTab, setActiveTab] = useState<
    "teachers" | "otheremployees" | "recruitment" | "leave"
  >("teachers");
 
  const router = useRouter();
  const [dashboardRead,setdashboardRead]=useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQuery1, setSearchQuery1] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<{
    id: string;
    name: string;
    designation: string;
    leaveType: string;
    dateRange: string;
    reason: string;
    status: string;
  } | null>(null);
  const [barData, setBarData] = useState<ChartData[]>([]);
  const [genderData, setGenderData] = useState<GenderChartData[]>([]);
  const [countryData, setCountryData] = useState<CountryStat[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [chartData, setChartData] = useState<
  { name: string; value: number; color: string }[]
>([]);
const [empData, setEmpData] = useState<
{ name: string; value: number; color: string }[]
>([]);
const [employees, setEmployees] = useState<OtherEmployee[]>([]);
const [counts, setCounts] = useState<DashboardCounts>({
  totalApplication: 0,
  shortlisted: 0,
  rejected: 0,
  waiting: 0,
});
const [formData, setFormData] = useState<OtherEmployeess>({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: 0,
  nationality: "",
  country: "",
  city: "",
  dateOfBirth: "",
  gender: "",
  residentialAddress: "",
  higherQualification: "",
  universityName: "",
  previousJob: "",
  experience: "",
  bankName: "",
  accountNumber: 0,
  bankCode: "",
  passportNumber: "",
  languagesKnown: [],
  emergencyContactNumber: 0,
  relationshipWithEmployee: "",
  address: "",
  designation: "",
  department: "",
  preferedWorkingHours: 8,
  preferedShiftFrom: "09:00 AM",
  preferedShiftTo: "09:00 PM",
  comments: "",
  profileImage: null,
  applicationDate: new Date().toISOString(),
  currency: "USD",
  expectedSalary: 0,
  applicationStatus: "Pending",
  preferedWorkingDays: [],
  status: "Active",
});
const [countryDataemp, setCountryDataemp] = useState<EmpCountryData[]>([]);
useEffect(() => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
  const roleAccessRaw = localStorage.getItem("AdminRolePermission");

 if (roleAccessRaw) {
        try {
          const roleAccess = JSON.parse(roleAccessRaw);
          const hasRead = roleAccess?.employees?.write ?? false;
          console.log(hasRead);
          setdashboardRead(hasRead);
        } catch (error) {
          console.error("Invalid JSON in AdminRolePermission:", error);
        }
      }

  // Fetch teacher status count
  axios
    .get("https://api.blackstoneinfomaticstech.com/teacher/statuscount", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data && data.length > 0) {
        const count = data[0];
        const chartData = [
          { name: "Total", value: count.teacherTotalCount, color: "#012A4A" },
          { name: "Active", value: count.activeTeacher, color: "#6D5DD3" },
          { name: "Inactive", value: count.inActiveTeacher, color: "#00CFFF" },
          { name: "Leave", value: count.leaveOnTeacher, color: "#007BFF" },
        ];
        setBarData(chartData);
      }
    })
    .catch((error) => {
      console.error("Error fetching teacher status count:", error);
    });

  // Fetch teacher gender count
  axios
    .get<GenderResponse>("https://api.blackstoneinfomaticstech.com/teacher/gendercount", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      const res = response.data;
      const chartData: GenderChartData[] = [
        { name: "Female", value: parseFloat(res.teacherFemalePercentage), color: "#FF82F5" },
        { name: "Male", value: parseFloat(res.teacherMalePercentage), color: "#00CFFF" },
      ];
      setGenderData(chartData);
    })
    .catch((error) => {
      console.error("Error fetching gender count:", error);
    });

  // Fetch student count by country
  axios
    .get("https://api.blackstoneinfomaticstech.com/applicants/countriescount", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((res) => {
      setCountryData(res.data.studentCountByCountry);
    })
    .catch((err) => console.error("Failed to fetch country stats", err));

  // Fetch teachers list
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("https://api.blackstoneinfomaticstech.com/users?role=TEACHER", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const teacherData: Teacher[] = res.data.users.map((user: any) => ({
        _id: user._id,
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage ?? "/assets/images/proff.jpg",
        level: "Junior", // mock default or pull from another source
        subject: "General", // same here
        rating: 1.0, // optionally calculate or default
        gender: user.gender,
      }));
      setTeachers(teacherData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };
  fetchTeachers();

  // Fetch other employee count data
  const fetchDataemp = async () => {
    try {
      const res = await fetch("https://api.blackstoneinfomaticstech.com/otherempcount", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const json: OtherEmpCountResponse = await res.json();
      const transformed = json.otherEmpCount.map((entry) => {
        const role = entry.country[0];
        return {
          name: formatRole(role),
          value: entry.count,
          color: ROLE_COLORS[role] || "#999999",
        };
      });
      setChartData(transformed);
    } catch (error) {
      console.error("Error fetching role data", error);
    }
  };
  fetchDataemp();

  // Fetch gender data for employees
  const fetchGenderData = async () => {
    try {
      const res = await fetch("https://api.blackstoneinfomaticstech.com/otheremp/gendercount", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const json: GenderCountResponse = await res.json();
      const data = [
        {
          name: "Female",
          value: parseFloat(json.employeeFemalePercentage),
          color: COLORS.Female,
        },
        {
          name: "Male",
          value: parseFloat(json.employeeMalePercentage),
          color: COLORS.Male,
        },
      ];
      setEmpData(data);
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };
  fetchGenderData();

  // Fetch employees list
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://api.blackstoneinfomaticstech.com/otheremployees", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data: OtherEmployeesResponse = await res.json();
      setEmployees(data.users);
      console.log(data.users);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  fetchEmployees();

  // Fetch supervisor dashboard counts
  const fetchCounts = async () => {
    try {
      const response = await axios.get<DashboardCounts>("https://api.blackstoneinfomaticstech.com/dashboard/supervisor/counts", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setCounts(response.data);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };
  fetchCounts();

  // Fetch other employee count by country
  axios
    .get("https://api.blackstoneinfomaticstech.com/otheremp/countriescount", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((res) => {
      setCountryDataemp(res.data.otherEmpCountByCountry);
    })
    .catch((err) => console.error("Failed to fetch country stats", err));

}, []); // Empty dependency array means this effect runs once on component mount



  const handleViewTeacher = (teacherId: string) => {
    if (!teacherId) {
      console.error("Teacher ID is undefined.");
      return;
    }
    
    console.log("Teacher ID:", teacherId);
    router.push(`/admin-main/ui/employees/teacher?teacherId=${teacherId}`);
  };

  const handleViewEmployee = (employeeId: string,userId :string) => {
    if (!employeeId) {
      console.error("Employee ID is undefined.");
      return;
    }
  // Log employeeId (for debugging)
  console.log(employeeId);
    router.push(`/admin-main/ui/employees/otheremployees?employeeId=${employeeId}&userId=${userId}`);
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

    const portalURL = `https://blackstoneinfomaticstech.com/teacher/ui/sign?username=${username}&password=${password}`;
    window.location.href = portalURL;
  }
  function handlePortalAccessforemployee(employeeID: string) {
    const username = encodeURIComponent("Arthi");
    const password = encodeURIComponent("Supervisor@123");

    const portalURL = `https://blackstoneinfomaticstech.com/supervisor/ui/sign?username=${username}&password=${password}`;
    window.location.href = portalURL;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      
    }));
  };
  const formatTime = (value:any) => {
    // if you're using a 24h input, convert to AM/PM
    const [hour, minute] = value.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const form = new FormData();
      for (const key in formData) {
        const value = (formData as any)[key];
        form.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      }
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
      await axios.post("https://api.blackstoneinfomaticstech.com/otheremployee", form, {
        headers: { "Content-Type": "multipart/form-data" ,
          "Authorization" :`Bearer ${token}`
         },
      });

      alert("Employee added successfully!");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error adding employee.");
    }
  };

  return (
    <BaseLayout4>
      <div className="h-full w-full px-4 py-4 md:mr-10 scrollbar-none">
        <div className="max-w-7xl w-full mx-auto scrollbar-none">
          {/* Header Section */}
          <div className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative">
              <h2 className="text-lg sm:text-xl font-semibold">Employees</h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                <Sun size={16} className="text-black" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
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

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 sm:space-x-4 border-b py-2 overflow-x-auto">
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "teachers"
                  ? "bg-[#012A4A] text-white rounded-lg"
                  : ""
              }`}
              onClick={() => setActiveTab("teachers")}
            >
              Teachers
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "otheremployees"
                  ? "bg-[#012A4A] text-white rounded-lg"
                  : ""
              }`}
              onClick={() => setActiveTab("otheremployees")}
            >
              Other Employees
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "recruitment"
                  ? "bg-[#012A4A] text-white rounded-lg"
                  : ""
              }`}
              onClick={() => setActiveTab("recruitment")}
            >
              Recruitment
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "leave"
                  ? "bg-[#012A4A] text-white rounded-lg"
                  : ""
              }`}
              onClick={() => setActiveTab("leave")}
            >
              Leave
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full py-6">
            {activeTab === "teachers" && (
              <div className="flex flex-col gap-6 w-full ">
                <div className="h-[600px] overflow-y-auto scrollbar-none">
                  <div className="flex flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14  ">
                    {/* Teachers Records */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[380px] md:max-w-[400px] lg:max-w-[620px] h-[280px]">
                      <h2 className="text-[16px] font-semibold text-gray-800 mb-4">
                        Teachers Record
                      </h2>
                      <div className="flex items-center">
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
                              <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                              />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tick={false}
                              />
                              <YAxis hide />
                              <Tooltip cursor={{ fill: "transparent" }} />
                              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                {barData.map((entry) => (
                                  <Cell key={entry.name} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gender Chart */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[280px] flex flex-col items-center justify-between relative">
  <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>

  {/* Chart */}
  <div className="relative w-[170px] h-[100px] flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={genderData}
          dataKey="value"
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
        >
          {genderData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    {/* Optional center line below pie */}
    <div className="absolute left-1/2 bottom-0 w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
  </div>

  {/* Labels */}
  <div className="flex justify-between w-full px-5 text-gray-700 text-[14px] mb-5">
    {genderData.map((item) => (
      <div key={item.name} className="flex flex-col items-center">
        <span className="text-[18px] font-bold">{item.value}%</span>
        <span className="text-[12px]">{item.name}</span>
        <div
          className="w-10 h-1 mt-1 rounded-full"
          style={{ backgroundColor: item.color }}
        ></div>
      </div>
    ))}
  </div>
</div>

                 
                    {/* Countries Block */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[280px] space-y-3">
      <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
      {countryData.map((country, i) => {
        // Get 2-letter country code
        const countryCode = countries.getAlpha2Code(country.country, "en");
        // Construct the flag URL
        const flagUrl = countryCode
          ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
          : "/assets/images/flags/default.png"; // Use a default image if no flag is found

        return (
          <div key={country.country} className="flex items-center gap-2">
            {/* Flag */}
            <img
              src={flagUrl}
              alt={country.country}
              className="w-5 h-5 rounded-full"
            />

            <div className="w-full">
              {/* Country name and value */}
              <div className="flex justify-between text-[13px] font-medium text-gray-800">
                <span>{country.country}</span>
                <span className="text-[#809FB8]">
                  {country.count.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-2 bg-[#012A4A] rounded-full"
                  style={{
                    width: `${country.percentage}%`, // Using percentage directly from response
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
                  </div>

                  {/* Search & Cards Section */}
                  <div className="mt-6 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <input
                        type="text"
                        placeholder="Search here..."
                        className="border rounded-lg px-3 py-2 text-sm shadow w-full md:w-1/2 lg:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-semibold whitespace-nowrap">
                          Duration:
                        </span>
                        <select className="border rounded-lg p-2 text-sm shadow w-full md:w-auto">
                          <option>Last month</option>
                          <option>Last week</option>
                          <option>Last year</option>
                        </select>
                      </div>
                    </div>

                    {/* Teacher Cards */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-7 overflow-y-auto">
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
                            className="bg-white shadow-md rounded-lg p-5 sm:p-5"
                          >
                            <div className="flex justify-center">
                              <Image
                                src="/assets/images/proff.jpg"
                                alt="Teacher"
                                className="w-10 h-10 mt-2 rounded-full"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="mt-3 text-center">
                              <h3 className="text-sm font-bold text-[#223857]">
                                {teacher.userName}
                              </h3>
                              <p className="text-xs mt-2 text-[#717579]">
                                Level: {teacher.level}
                              </p>
                              <p className="text-xs mt-2 text-[#717579]">
                                {teacher.subject}
                              </p>
                              <div className="flex flex-col justify-center gap-3 px-5 mt-2">
                                <button
                                  className="text-[12px] bg-[#c95b45] text-white px-2 py-1 rounded-lg"
                                  onClick={() =>
                                    handlePortalAccess(teacher._id)
                                    
                                  }
                                  disabled={!dashboardRead}

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
                </div>
              </div>
            )}

            {activeTab === "otheremployees" && (
              <div className="flex flex-col gap-6 w-full ">
                <div className="h-[600px] overflow-y-auto scrollbar-none">
                  <div className="flex flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14  ">
                    {/* Teachers Records */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[380px] md:max-w-[400px] lg:max-w-[620px] h-[280px]">
                      <h2 className="text-[16px] font-semibold text-gray-800 mb-4">
                        Employees Record
                      </h2>
                      <div className="flex items-center">
                        <div className="space-y-6 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#012A4A]"></div>
                            <span>Admin</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6D5DD3]"></div>
                            <span>Academic coach</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#00CFFF]"></div>
                            <span>Supervisor</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#007BFF]"></div>
                            <span>Others</span>
                          </div>
                        </div>
                        <div className="flex-1 h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={40}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tick={false} />
          <YAxis hide />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
                      </div>
                    </div>

                    {/* Gender Chart */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[280px] flex flex-col items-center justify-between relative">
  <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>

  {/* Chart */}
  <div className="relative w-[170px] h-[100px] flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={empData}
          dataKey="value"
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
        >
          {empData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    {/* Optional center line below pie */}
    <div className="absolute left-1/2 bottom-0 w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
  </div>

  {/* Labels */}
  <div className="flex justify-between w-full px-5 text-gray-700 text-[14px] mb-5">
    {empData.map((item) => (
      <div key={item.name} className="flex flex-col items-center">
        <span className="text-[18px] font-bold">{item.value}%</span>
        <span className="text-[12px]">{item.name}</span>
        <div
          className="w-10 h-1 mt-1 rounded-full"
          style={{ backgroundColor: item.color }}
        ></div>
      </div>
    ))}
  </div>
</div>

                    {/* Countries Block */}
                    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[280px] space-y-3">
      <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
      {countryDataemp.map((country, i) => {
        // Get 2-letter country code
        const countryCode = countries.getAlpha2Code(country.country, "en");
        // Construct the flag URL
        const flagUrl = countryCode
          ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
          : "/assets/images/flags/default.png"; // Use a default image if no flag is found

        return (
          <div key={country.country} className="flex items-center gap-2">
            {/* Flag */}
            <img
              src={flagUrl}
              alt={country.country}
              className="w-5 h-5 rounded-full"
            />

            <div className="w-full">
              {/* Country name and value */}
              <div className="flex justify-between text-[13px] font-medium text-gray-800">
                <span>{country.country}</span>
                <span className="text-[#809FB8]">
                  {country.count.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-2 bg-[#012A4A] rounded-full"
                  style={{
                    width: `${country.percentage}%`, // Using percentage directly from response
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                      {/* Search Input */}
                      <input
                        type="text"
                        placeholder="Search here..."
                        className="border rounded-lg px-2 py-2 text-sm shadow w-full lg:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      {/* Right Side Controls */}
                      <div className="flex items-center gap-3">
                        {/* Add New Button */}
                        <button
                          onClick={() => setShowForm(true)}
                          className="flex items-center gap-2 bg-[#0D2444] text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
                          disabled={!dashboardRead}
>
                          <span className="text-sm">+</span> Add new
                        </button>

                        {/* Duration Dropdown */}
                        <div className="flex items-center bg-white border rounded-xl px-4 py-2 shadow text-sm text-[#0D2444]">
                          <span className="font-normal mr-1">Duration :</span>
                          <select className="bg-transparent focus:outline-none font-semibold">
                            <option>Last month</option>
                            <option>Last week</option>
                            <option>Last year</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7 max-h-[300px] ">
                      {employees
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
                            <div className="flex  justify-center ">
                              <Image
                                src={
                                  employee.profileImage ??
                                  "/assets/images/proff.jpg"
                                }
                                alt="Employee"
                                className="w-10 h-10  mt-2 rounded-full"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="mt-3 text-center">
                              <h3 className="text-sm font-bold text-[#223857] mb-2">
                                {employee.userName}
                              </h3>
                              <p className="text-[#717579] text-xs">
                                {employee.role}
                              </p>
                              <p className="text-[#717579] p-1 text-xs">
                                {employee.gender}
                              </p>
                              <div className="flex flex-col justify-center gap-3 px-5 mt-2">
                                <button
                                  className="text-[12px] bg-[#c95b45] text-white px-2 py-1 rounded-lg"
                                  onClick={() =>
                                    handlePortalAccessforemployee(employee._id)
                                  }
                                  disabled={!dashboardRead}
                                >
                                  Portal Access
                                </button>
                                <button
                                  className="text-[12px] bg-[#223857] text-white px-2 py-1 rounded-lg"
                                  onClick={() =>
                                    handleViewEmployee(employee.userId,employee._id)
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
                </div>
              </div>
            )}

            {activeTab === "recruitment" && (
              <div className="flex flex-col overflow-y-auto scrollbar-none ">
                <main className="flex-grow">
                  {/* ✅ Section 1: Stats Card Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Total Applications",
                        count: counts.totalApplication,
                        color: "gray",
                        iconBg: "bg-gray-100",
                        iconColor: "text-gray-500",
                        chartColor: "#64748b",
                      },
                      {
                        title: "Shortlisted Candidates",
                        count: counts.shortlisted,
                        color: "indigo",
                        iconBg: "bg-indigo-100",
                        iconColor: "text-indigo-500",
                        chartColor: "#6366f1",
                      },
                      {
                        title: "Rejected Candidates",
                        count: counts.rejected,
                        color: "cyan",
                        iconBg: "bg-cyan-100",
                        iconColor: "text-cyan-500",
                        chartColor: "#06b6d4",
                      },
                      {
                        title: "Waiting Candidates",
                        count: counts.waiting,
                        color: "blue",
                        iconBg: "bg-blue-100",
                        iconColor: "text-blue-500",
                        chartColor: "#3b82f6",
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
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
                            <p className="text-sm text-gray-500">
                              {card.title}
                            </p>
                          </div>
                        </div>
                        <div className="h-16">
                          <Line
                            data={chartTemplate(card.chartColor)}
                            options={smallChartOptions}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ✅ Section 2: Applicants Table */}
                  <div className="mt-6 overflow-x-auto">
                    <div className="min-w-[800px]">
                      <ApplicantsPage />
                    </div>
                  </div>
                </main>
              </div>
            )}

            {activeTab === "leave" && (
              <div className="space-y-4 overflow-y-auto scrollbar-none">
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
                      <tr className="text-center">
                        {[
                          "Employee ID",
                          "Employee Name",
                          "Designation",
                          "Leave Type",
                          "Date Range",
                          "Reason For Leave",
                          "Status",
                        ].map((title) => (
                          <th
                            key={title}
                            className="px-6 py-3 text-sm font-semibold text-center bg-[#F4F5F7] text-gray-700 whitespace-nowrap"
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-center">
                      {leaveData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 align-middle border-b border-gray-300"
                        >
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.id}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.name}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.designation}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.leaveType}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.dateRange}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            {item.reason}
                          </td>
                          <td className="px-6 py-3 text-xs whitespace-nowrap text-center align-middle border-b border-gray-300">
                            <button
                              onClick={() => setSelectedLeave(item)}
                              className="w-[110px] h-[30px] flex items-center justify-center border rounded-md cursor-pointer hover:bg-gray-100 transition"
                            >
                              {getStatusBadge(item.status)}
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
                          <label
                            htmlFor="todate"
                            className="font-medium text-sm"
                          >
                            To Date
                          </label>
                          <input
                            className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-gray-600 text-xs "
                            value="16/02/2024"
                            disabled
                          />

                          {/* Reason For Leave */}
                          <label
                            htmlFor="reason"
                            className="font-medium text-sm"
                          >
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
                                <select className="w-full border border-[#a6b0c3] rounded-md px-4 py-2 text-[#0d1b3e] shadow-sm  appearance-none pr-10">
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center overflow-auto">
          <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden m-4">
            <div className="h-full overflow-y-auto p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "First name", name: "firstName", type: "text" },
                  { label: "Last name", name: "lastName", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone number", name: "phoneNumber", type: "number" },
                  { label: "City", name: "city", type: "text" },
                  { label: "Nationality", name: "nationality", type: "text" },
                  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                  { label: "Country", name: "country", type: "text" },
                  { label: "Gender", name: "gender", type: "text" },
                  { label: "Residential Address", name: "residentialAddress", type: "text", full: true },
                  { label: "Highest Qualification", name: "higherQualification", type: "text" },
                  { label: "University/Institute Name", name: "universityName", type: "text" },
                  { label: "Previous Job Title", name: "previousJob", type: "text" },
                  { label: "Experience (in years)", name: "experience", type: "text" },
                  { label: "Bank Name", name: "bankName", type: "text" },
                  { label: "Account Number", name: "accountNumber", type: "number" },
                  { label: "Bank Code", name: "bankCode", type: "text", full: true },
                  { label: "Passport Number", name: "passportNumber", type: "text" },
                  { label: "Emergency Contact Number", name: "emergencyContactNumber", type: "number" },
                  { label: "Relationship with Employee", name: "relationshipWithEmployee", type: "text" },
                  { label: "Address", name: "address", type: "text", full: true },
                  { label: "Designation", name: "designation", type: "text" },
                  { label: "Department", name: "department", type: "text" },
                  { label: "Preferred Working Hours", name: "preferedWorkingHours", type: "number" },
                ].map((field, index) => (
                  <div key={index} className={`flex flex-col ${field.full ? "col-span-2" : ""}`}>
                    <label className="text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        Array.isArray(formData[field.name as keyof OtherEmployeess])
                          ? (formData[field.name as keyof OtherEmployeess] as string[]).join(", ")
                          : formData[field.name as keyof OtherEmployeess] ?? ""
                      }
                      onChange={(e) => {
                        if (field.name === "languagesKnown" || field.name === "preferedWorkingDays") {
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: e.target.value.split(",").map((item) => item.trim()),
                          }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                    />
                  </div>
                ))}

                {/* Time Picker with Formatting */}
                {["preferedShiftFrom", "preferedShiftTo"].map((name, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      {name === "preferedShiftFrom" ? "Preferred Shift From" : "Preferred Shift To"}
                    </label>
                    <input
                      type="time"
                      name={name}
                      onChange={(e) => {
                        const formatted = formatTime(e.target.value);
                        setFormData((prev) => ({ ...prev, [name]: formatted }));
                      }}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                    />
                  </div>
                ))}

                {/* Language Input */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Languages Known</label>
                  <input
                    type="text"
                    name="languagesKnown"
                    value={formData.languagesKnown.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        languagesKnown: e.target.value.split(",").map((item) => item.trim()),
                      }))
                    }
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                  />
                </div>

                {/* Currency Dropdown */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    <option value="AED">AED</option>
                  </select>
                </div>

                {/* Expected Salary */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block">Expected Salary</label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                  />
                </div>

                {/* Working Days Checkbox */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 block">Preferred Working Days</label>
                  <div className="flex flex-wrap gap-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          value={day}
                          checked={formData.preferedWorkingDays.includes(day)}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setFormData((prev) => {
                              const days = new Set(prev.preferedWorkingDays);
                              checked ? days.add(value) : days.delete(value);
                              return { ...prev, preferedWorkingDays: Array.from(days) };
                            });
                          }}
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Profile Image */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 block">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs bg-gray-100 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                {/* Comments */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 block">Additional Comments</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-400 rounded-lg text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm hover:bg-blue-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </BaseLayout4>
  );
};

export default Page;
