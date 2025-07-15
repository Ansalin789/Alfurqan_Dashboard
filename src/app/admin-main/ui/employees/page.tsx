"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sun, Bell, FileText, Search } from "lucide-react";
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
import { Line } from "react-chartjs-2";
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
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import Flag from "react-world-flags";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

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
  position?: string;
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
  ADMIN: "#AFC0FF",
  ACADEMICCOACH: "#9FD0FF",
  SUPERVISOR: "#78A1DB",
  USER: "#B9DDFF",
};
interface GenderResponse {
  teacherPercentage: number;
  teacherMalePercentage: string; // or number if you convert it
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
// Replace COLORS object with array for correct indexing
const COLORS = ["#A3D3FF", "#FFD6F7", "#B4C7ED"];
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
  const [dashboardRead, setdashboardRead] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQuery1, setSearchQuery1] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [showTeacherfilterForm, setshowTeacherfilterForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterName, setFilterName] = useState("");
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const filteredTeachers = teachers.filter(
    (teacher) =>
      (filterCourse === "" || teacher.position === filterCourse) &&
      (filterName === "" ||
        teacher.userName.toLowerCase().includes(filterName.toLowerCase())) &&
      (teacher.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

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
      .get("http://localhost:5001/teacher/statuscount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data) {
          const count = data;
          const max = count.overallCount;

          const chartData = [
            {
              name: "Total Teachers",
              value: count.teacherTotalCount,
              scaledValue: (count.teacherTotalCount / max) * 100,
              color: "#AFC0FF",
            },
            {
              name: "Active Teachers",
              value: count.activeTeacher,
              scaledValue: (count.activeTeacher / max) * 100,
              color: "#9FD0FF",
            },
            {
              name: "Inactive Teachers",
              value: count.inActiveTeacher,
              scaledValue: (count.inActiveTeacher / max) * 100,
              color: "#78A1DB",
            },
            {
              name: "Teachers on Leave",
              value: count.leaveOnTeacher,
              scaledValue: (count.leaveOnTeacher / max) * 100,
              color: "#B9DDFF",
            },
          ];
          setBarData(chartData);
        }
      })

      .catch((error) => {
        console.error("Error fetching teacher status count:", error);
      });

    // Fetch teacher gender count
    axios
      .get<GenderResponse>(
        "http://localhost:5001/teacher/gendercount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const res = response.data;
        const chartData: GenderChartData[] = [
          {
            name: "Female",
            value: parseFloat(res.teacherFemalePercentage),
            color: "#FF82F5",
          },
          {
            name: "Male",
            value: parseFloat(res.teacherMalePercentage),
            color: "#00CFFF",
          },
        ];
        setGenderData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching gender count:", error);
      });

    // Fetch student count by country
    axios
      .get(
        "https://api.blackstoneinfomaticstech.com/applicants/countriescount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setCountryData(res.data.studentCountByCountry);
      })
      .catch((err) => console.error("Failed to fetch country stats", err));

    // Fetch teachers list
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/users?role=TEACHER",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const teacherData: Teacher[] = res.data.users.map((user: any) => ({
          _id: user._id,
          userId: user.userId,
          userName: user.userName,
          email: user.email,
          profileImage: user.profileImage ?? "/assets/images/proff.jpg",
          position: user.position ?? "General",
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
        const res = await fetch(
          "https://api.blackstoneinfomaticstech.com/otherempcount",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        const res = await fetch(
          "https://api.blackstoneinfomaticstech.com/otheremp/gendercount",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json: GenderCountResponse = await res.json();
        const data = [
          {
            name: "Female",
            value: parseFloat(json.employeeFemalePercentage),
            color: COLORS[0],
          },
          {
            name: "Male",
            value: parseFloat(json.employeeMalePercentage),
            color: COLORS[1],
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
        const res = await fetch(
          "https://api.blackstoneinfomaticstech.com/otheremployees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        const response = await axios.get<DashboardCounts>(
          "https://api.blackstoneinfomaticstech.com/dashboard/supervisor/counts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
          Authorization: `Bearer ${token}`,
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

  const handleViewEmployee = (employeeId: string, userId: string) => {
    if (!employeeId) {
      console.error("Employee ID is undefined.");
      return;
    }
    // Log employeeId (for debugging)
    console.log(employeeId);
    router.push(
      `/admin-main/ui/employees/otheremployees?employeeId=${employeeId}&userId=${userId}`
    );
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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const formatTime = (value: any) => {
    // if you're using a 24h input, convert to AM/PM
    const [hour, minute] = value.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${suffix}`;
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
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      await axios.post(
        "https://api.blackstoneinfomaticstech.com/otheremployee",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee added successfully!");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error adding employee.");
    }
  };

  // Preprocess countryData to standardize country names for flag display
  const preprocessCountryData = (data: typeof countryData) =>
    data.map((item) => ({
      ...item,
      country: item.country === "The Bahamas" ? "Bahamas" : item.country,
    }));

  const processedCountryData = preprocessCountryData(countryData);

  // Helper function to calculate label position for Pie segments
  function getPieLabelPosition(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) {
    const midAngle = (startAngle + endAngle) / 2;
    const radius = (innerRadius + outerRadius) / 2;
    const RADIAN = Math.PI / 180;
    return {
      x: cx + radius * Math.cos(-midAngle * RADIAN),
      y: cy + radius * Math.sin(-midAngle * RADIAN),
    };
  }

  return (
    <BaseLayout4>
      <TeacherHeader currentSection="Employees" />
      <div className="h-full w-full p-2 md:mr-10 scrollbar-none">
        <div className="max-w-7xl w-full mx-auto scrollbar-none">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 sm:space-x-4 border-b py-2 overflow-x-auto">
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "teachers"
                  ? "text-[#576CBC] border-b-2 border-b-[#576CBC]"
                  : ""
              }`}
              onClick={() => setActiveTab("teachers")}
            >
              Teachers
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "otheremployees"
                  ? "text-[#576CBC] border-b-2 border-b-[#576CBC]"
                  : ""
              }`}
              onClick={() => setActiveTab("otheremployees")}
            >
              Other Employees
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "recruitment"
                  ? "text-[#576CBC] border-b-2 border-b-[#576CBC]"
                  : ""
              }`}
              onClick={() => setActiveTab("recruitment")}
            >
              Recruitment
            </button>
            <button
              className={`px-3 py-2 text-xs sm:text-[14px] font-semibold whitespace-nowrap ${
                activeTab === "leave"
                  ? "text-[#576CBC] border-b-2 border-b-[#576CBC]"
                  : ""
              }`}
              onClick={() => setActiveTab("leave")}
            >
              Leave
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full py-2">
            {activeTab === "teachers" && (
              <div className="flex flex-col gap-3 w-full ">
                <div className="h-[600px] overflow-y-auto scrollbar-none">
                  <div className="flex flex-row gap-4 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-4  ">
                    {/* Teachers Records */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[370px] md:max-w-[390px] lg:max-w-[620px] h-[280px]">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19] mb-4">
                        Teachers Record
                      </h2>
                      <div className="flex items-start justify-between gap-10">
                        {/* Legend Section */}
                        <div className="space-y-8 text-[13px] mt-3 text-[#0B0F19]">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#AFC0FF]"></div>
                            <span>Total Teachers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#9FD0FF]"></div>
                            <span>Active Teachers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#78A1DB]"></div>
                            <span>Inactive Teachers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#B9DDFF]"></div>
                            <span>Teachers on Leave</span>
                          </div>
                        </div>

                        {/* Bar Chart Section */}
                        <div className="flex-1 h-[220px] pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} barSize={40}>
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tick={false}
                              />
                              <YAxis hide />
                              <Tooltip
                                cursor={{ fill: "transparent" }}
                                formatter={(value, name, props) => {
                                  // Show actual count in tooltip
                                  return [
                                    `${props.payload.value} Teachers`,
                                    "Count",
                                  ];
                                }}
                              />
                              <Bar
                                dataKey="scaledValue"
                                radius={[10, 10, 10, 10]}
                              >
                                {barData.map((entry) => (
                                  <Cell key={entry.name} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Gender Chart (Teachers section) */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[312px] h-[280px] flex flex-col items-center justify-between relative">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19] self-start">
                        Gender
                      </h2>
                      {/* Chart */}
                      <div className="relative flex items-center justify-center w-full h-[170px]">
                        <PieChart width={150} height={150}>
                          {/* Male Segment */}
                          {(() => {
                            const male =
                              genderData.find((g) => g.name === "Male")
                                ?.value || 0;
                            const female =
                              genderData.find((g) => g.name === "Female")
                                ?.value || 0;
                            const total = male + female;
                            const percent =
                              total > 0 ? Math.round((male / total) * 100) : 0;
                            const startAngle = -90;
                            const endAngle = -90 + (male / (total || 1)) * 360;
                            const pos = getPieLabelPosition(
                              75,
                              75,
                              0,
                              55,
                              startAngle,
                              endAngle
                            );
                            return (
                              <>
                                <Pie
                                  data={[{ name: "Male", value: male }]}
                                  cx={75}
                                  cy={75}
                                  innerRadius={0}
                                  outerRadius={55}
                                  startAngle={startAngle}
                                  endAngle={endAngle}
                                  dataKey="value"
                                  strokeWidth={0}
                                  fill={COLORS[0]}
                                  label={false}
                                  labelLine={false}
                                />
                                {male > 0 && (
                                  <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="14px"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {percent}%
                                  </text>
                                )}
                              </>
                            );
                          })()}
                          {/* Female Segment */}
                          {(() => {
                            const male =
                              genderData.find((g) => g.name === "Male")
                                ?.value || 0;
                            const female =
                              genderData.find((g) => g.name === "Female")
                                ?.value || 0;
                            const total = male + female;
                            const percent =
                              total > 0
                                ? Math.round((female / total) * 100)
                                : 0;
                            const startAngle =
                              -90 + (male / (total || 1)) * 360;
                            const endAngle = 270;
                            const pos = getPieLabelPosition(
                              75,
                              75,
                              0,
                              50,
                              startAngle,
                              endAngle
                            );
                            return (
                              <>
                                <Pie
                                  data={[{ name: "Female", value: female }]}
                                  cx={75}
                                  cy={75}
                                  innerRadius={0}
                                  outerRadius={50}
                                  startAngle={startAngle}
                                  endAngle={endAngle}
                                  dataKey="value"
                                  strokeWidth={0}
                                  fill={COLORS[1]}
                                  label={false}
                                  labelLine={false}
                                />
                                {female > 0 && (
                                  <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="13px"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {percent}%
                                  </text>
                                )}
                              </>
                            );
                          })()}
                          {/* Outline */}
                          {(() => {
                            const male =
                              genderData.find((g) => g.name === "Male")
                                ?.value || 0;
                            const female =
                              genderData.find((g) => g.name === "Female")
                                ?.value || 0;
                            const total = male + female;
                            const startAngle = -90;
                            const endAngle = -90 + (male / (total || 1)) * 360;
                            return (
                              <Pie
                                data={[{ name: "Male", value: male }]}
                                cx={75}
                                cy={75}
                                innerRadius={58}
                                outerRadius={62}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                dataKey="value"
                                strokeWidth={0}
                                fill={COLORS[2]}
                              />
                            );
                          })()}
                        </PieChart>
                      </div>
                      <div className="grid grid-cols-2 gap-1 w-full mt-10">
                        {/* Legend for Male and Female */}
                        <div className="flex flex-col items-center text-start">
                          <div className="flex items-center gap-[3px]">
                            <div
                              className="w-[12px] h-[12px] rounded-[2px]"
                              style={{ backgroundColor: COLORS[0] }}
                            ></div>
                            <span className="text-[10px] font-semibold text-[#010E30] dark:text-white">
                              Male
                            </span>
                          </div>
                          <div className="text-[10px] font-medium mt-[2px] text-[#010E30] dark:text-white/70">
                            {genderData.find((g) => g.name === "Male")?.value ||
                              0}
                          </div>
                        </div>
                        <div className="flex flex-col items-center text-start">
                          <div className="flex items-center gap-[3px]">
                            <div
                              className="w-[12px] h-[12px] rounded-[2px]"
                              style={{ backgroundColor: COLORS[1] }}
                            ></div>
                            <span className="text-[10px] font-semibold text-[#010E30] dark:text-white">
                              Female
                            </span>
                          </div>
                          <div className="text-[10px] font-medium mt-[2px] text-[#010E30] dark:text-white/70">
                            {genderData.find((g) => g.name === "Female")
                              ?.value || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Countries Block */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[312px] h-[280px] flex flex-col">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19]">
                        Countries
                      </h2>
                      <div className="space-y-2 mt-2 flex-1 overflow-y-auto scrollbar-none">
                        {processedCountryData.map((country) => {
                          const countryCode = countries.getAlpha2Code(
                            country.country,
                            "en"
                          );
                          return (
                            <div
                              key={country.country}
                              className="flex items-center justify-between border-b py-1 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                {countryCode ? (
                                  <Flag
                                    code={countryCode}
                                    style={{
                                      width: "24px",
                                      height: "16px",
                                      borderRadius: "10%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <div className="w-6 h-4 bg-gray-300 rounded" />
                                )}
                                <span className="text-[12px] text-gray-700">
                                  {country.country}
                                </span>
                              </div>
                              <span className="text-[12px] font-medium text-gray-900">
                                {country.count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Search & Cards Section */}
                  <div className="mt-6 w-full h-full shadow bg-[#f5f5f5] rounded-lg dark:bg-[#343434] dark:text-[#dedede]">
                    <div className="flex justify-between bg-[#fafafb] items-center px-4 py-0 rounded-md dark:bg-[#343434] h-12">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="bg-transparent outline-none text-[15px] w-52 py-3"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="relative ">
                        {/* Filter Button (opens your filter popup) */}
                        <button
                          className="flex items-center gap-2 text-sm text-gray-400 border-[#f5f5f5] dark:border-[#3b3b3b] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                          onClick={() => setshowTeacherfilterForm(true)}
                        >
                          <MdTune className="w-4 h-4" />
                          <span>Filter</span>
                        </button>
                        {/* Filter Popup */}
                        {showTeacherfilterForm && (
                          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center overflow-auto">
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden m-4 relative">
                              <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                                onClick={() => setshowTeacherfilterForm(false)}
                                aria-label="Close"
                              >
                                ×
                              </button>
                              <div className="p-6 space-y-4">
                                <h2 className="text-lg font-semibold mb-2">
                                  Filter by
                                </h2>
                                <div className="flex flex-col gap-3">
                                  <label className="text-sm font-medium text-gray-700">
                                    Course
                                  </label>
                                  <select
                                    className="border rounded px-3 py-2 text-sm"
                                    value={filterCourse}
                                    onChange={(e) =>
                                      setFilterCourse(e.target.value)
                                    }
                                  >
                                    <option value="">Select Course</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Math">Math</option>
                                    <option value="Science">Science</option>
                                    {/* Add more courses as needed */}
                                  </select>
                                  <label className="text-sm font-medium text-gray-700 mt-2">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    className="border rounded px-3 py-2 text-sm"
                                    placeholder="Enter name"
                                    value={filterName}
                                    onChange={(e) =>
                                      setFilterName(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="flex gap-3 mt-6">
                                  <button
                                    className="flex-1 border border-[#576CBC] text-[#576CBC] rounded-lg py-2 font-medium"
                                    onClick={() => {
                                      setFilterCourse("");
                                      setFilterName("");
                                    }}
                                  >
                                    Reset
                                  </button>
                                  <button
                                    className="flex-1 bg-[#576CBC] text-white rounded-lg py-2 font-medium"
                                    onClick={() =>
                                      setshowTeacherfilterForm(false)
                                    }
                                  >
                                    Show{" "}
                                    {
                                      filteredTeachers.filter(
                                        (t) =>
                                          (!filterCourse ||
                                            t.position === filterCourse) &&
                                          (!filterName ||
                                            t.userName
                                              .toLowerCase()
                                              .includes(
                                                filterName.toLowerCase()
                                              )) &&
                                          (t.userName
                                            .toLowerCase()
                                            .includes(
                                              searchQuery.toLowerCase()
                                            ) ||
                                            t.email
                                              .toLowerCase()
                                              .includes(
                                                searchQuery.toLowerCase()
                                              ))
                                      ).length
                                    }{" "}
                                    results
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                        <span className="text-left -ml-60 ">
                          Showing{" "}
                          {
                            teachers.filter(
                              (teacher) =>
                                (filterCourse === "" ||
                                  teacher.position === filterCourse) &&
                                (filterName === "" ||
                                  teacher.userName
                                    .toLowerCase()
                                    .includes(filterName.toLowerCase())) &&
                                (teacher.userName
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                  teacher.email
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()))
                            ).length
                          }{" "}
                          Of {teachers.length}
                        </span>
                      </div>
                    </div>

                    {/* Teacher Cards - manage teacher style, with Portal Access */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-7 overflow-y-auto">
                      {paginatedTeachers.map((teacher) => (
                        <div
                          key={teacher._id}
                          className="bg-white dark:bg-[#343434] h-full shadow-md rounded-lg p-4 flex flex-col justify-between"
                        >
                          <div className="items-center">
                            <div className="h-[126px] rounded-md bg-[#e8e8e8] dark:bg-[#dadada] flex items-center justify-center">
                              <Image
                                src={
                                  teacher.profileImage ??
                                  "/assets/images/proff.jpg"
                                }
                                alt="Teacher"
                                className="rounded-md"
                                width={90}
                                height={90}
                              />
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <h3 className="text-[12px] font-semibold text-[#010e30] dark:text-[#fff] mb-1">
                              {teacher.userName}
                            </h3>
                            <p className="text-[#717579] text-[10px] dark:text-[#fff]">
                              {teacher.position}
                            </p>
                            <div className="flex justify-center mb-2">
                              {/* Star rating placeholder */}
                              <svg
                                className="text-[#faab3c] text-[10px]"
                                width="12"
                                height="12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                              <svg
                                className="text-[#faab3c] text-[10px] mx-1"
                                width="12"
                                height="12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                              <svg
                                className="text-[#faab3c] text-[10px]"
                                width="12"
                                height="12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                              <svg
                                className="text-gray-300 text-[10px] mx-1"
                                width="12"
                                height="12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                              <svg
                                className="text-gray-300 text-[10px]"
                                width="12"
                                height="12"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                            </div>
                            <div className="flex flex-col justify-center gap-2 px-5 mt-2">
                              <button
                                className="text-[12px] border border-[#576CBC] text-[#576CBC] dark:text-[#fff] px-2 py-1 rounded-lg"
                                onClick={() => handlePortalAccess(teacher._id)}
                                disabled={!dashboardRead}
                              >
                                Portal Access
                              </button>
                              <button
                                className="text-[12px] bg-[#576CBC] text-white px-2 py-1 rounded-lg"
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
                  {/* Pagination */}
                  <div className="flex justify-end mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "otheremployees" && (
              <div className="flex flex-col gap-3 w-full ">
                <div className="h-[600px] overflow-y-auto scrollbar-none">
                  {/* Top analytics/statistics cards (Employees Record, Gender, Countries) - keep as is */}
                  <div className="flex flex-row gap-4 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-4">
                    {/* Employees Record card */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[370px] md:max-w-[390px] lg:max-w-[620px] h-[280px]">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19] mb-4">
                        Employees Record
                      </h2>
                      <div className="flex items-start justify-between gap-10">
                        {/* Legend Section */}
                        <div className="space-y-8 text-[13px] mt-3 text-[#0B0F19]">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#AFC0FF]"></div>
                            <span>Total Employees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#9FD0FF]"></div>
                            <span>Active Employees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#78A1DB]"></div>
                            <span>Inactive Employees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[4px] bg-[#B9DDFF]"></div>
                            <span>Employees on Leave</span>
                          </div>
                        </div>

                        {/* Bar Chart Section */}
                        <div className="flex-1 h-[220px] pt-2">
                   <ResponsiveContainer width="100%" height="100%">
  <BarChart data={chartData} barSize={40}>
    <XAxis dataKey="name" axisLine={false} tick={false} />
    <YAxis hide domain={[0, 100]} /> {/* Set Y-axis as percentage */}
    <Tooltip cursor={{ fill: "transparent" }} />
    <Bar dataKey="value" radius={[10, 10, 10, 10]}>
      {chartData.map((entry) => (
        <Cell key={entry.name} fill={entry.color} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

                        </div>
                      </div>
                    </div>

                    {/* Gender Chart (Employees section) */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[312px] h-[280px] flex flex-col items-center justify-between relative">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19] self-start">
                        Gender
                      </h2>
                      {/* Chart */}
                      <div className="relative flex items-center justify-center w-full h-[170px]">
                        <PieChart width={150} height={150}>
                          {/* Male Segment */}
                          {(() => {
                            const male =
                              empData.find((g) => g.name === "Male")?.value ||
                              0;
                            const female =
                              empData.find((g) => g.name === "Female")?.value ||
                              0;
                            const total = male + female;
                            const percent =
                              total > 0 ? Math.round((male / total) * 100) : 0;
                            const startAngle = -90;
                            const endAngle = -90 + (male / (total || 1)) * 360;
                            const pos = getPieLabelPosition(
                              75,
                              75,
                              0,
                              55,
                              startAngle,
                              endAngle
                            );
                            return (
                              <>
                                <Pie
                                  data={[{ name: "Male", value: male }]}
                                  cx={75}
                                  cy={75}
                                  innerRadius={0}
                                  outerRadius={55}
                                  startAngle={startAngle}
                                  endAngle={endAngle}
                                  dataKey="value"
                                  strokeWidth={0}
                                  fill={COLORS[0]}
                                  label={false}
                                  labelLine={false}
                                />
                                {male > 0 && (
                                  <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="14px"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {percent}%
                                  </text>
                                )}
                              </>
                            );
                          })()}
                          {/* Female Segment */}
                          {(() => {
                            const male =
                              empData.find((g) => g.name === "Male")?.value ||
                              0;
                            const female =
                              empData.find((g) => g.name === "Female")?.value ||
                              0;
                            const total = male + female;
                            const percent =
                              total > 0
                                ? Math.round((female / total) * 100)
                                : 0;
                            const startAngle =
                              -90 + (male / (total || 1)) * 360;
                            const endAngle = 270;
                            const pos = getPieLabelPosition(
                              75,
                              75,
                              0,
                              50,
                              startAngle,
                              endAngle
                            );
                            return (
                              <>
                                <Pie
                                  data={[{ name: "Female", value: female }]}
                                  cx={75}
                                  cy={75}
                                  innerRadius={0}
                                  outerRadius={50}
                                  startAngle={startAngle}
                                  endAngle={endAngle}
                                  dataKey="value"
                                  strokeWidth={0}
                                  fill={COLORS[1]}
                                  label={false}
                                  labelLine={false}
                                />
                                {female > 0 && (
                                  <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="13px"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {percent}%
                                  </text>
                                )}
                              </>
                            );
                          })()}
                          {/* Outline */}
                          {(() => {
                            const male =
                              empData.find((g) => g.name === "Male")?.value ||
                              0;
                            const female =
                              empData.find((g) => g.name === "Female")?.value ||
                              0;
                            const total = male + female;
                            const startAngle = -90;
                            const endAngle = -90 + (male / (total || 1)) * 360;
                            return (
                              <Pie
                                data={[{ name: "Male", value: male }]}
                                cx={75}
                                cy={75}
                                innerRadius={58}
                                outerRadius={62}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                dataKey="value"
                                strokeWidth={0}
                                fill={COLORS[2]}
                              />
                            );
                          })()}
                        </PieChart>
                      </div>
                      <div className="grid grid-cols-2 gap-1 w-full mt-10">
                        {/* Legend for Male and Female */}
                        <div className="flex flex-col items-center text-start">
                          <div className="flex items-center gap-[3px]">
                            <div
                              className="w-[12px] h-[12px] rounded-[2px]"
                              style={{ backgroundColor: COLORS[0] }}
                            ></div>
                            <span className="text-[10px] font-semibold text-[#010E30] dark:text-white">
                              Male
                            </span>
                          </div>
                          <div className="text-[10px] font-medium mt-[2px] text-[#010E30] dark:text-white/70">
                            {empData.find((g) => g.name === "Male")?.value || 0}
                          </div>
                        </div>
                        <div className="flex flex-col items-center text-start">
                          <div className="flex items-center gap-[3px]">
                            <div
                              className="w-[12px] h-[12px] rounded-[2px]"
                              style={{ backgroundColor: COLORS[1] }}
                            ></div>
                            <span className="text-[10px] font-semibold text-[#010E30] dark:text-white">
                              Female
                            </span>
                          </div>
                          <div className="text-[10px] font-medium mt-[2px] text-[#010E30] dark:text-white/70">
                            {empData.find((g) => g.name === "Female")?.value ||
                              0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Countries Block */}
                    <div className="bg-[#F7FBFF] p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[312px] h-[280px] flex flex-col">
                      <h2 className="text-[16px] font-semibold text-[#0B0F19]">
                        Countries
                      </h2>
                      <div className="space-y-2 mt-2 flex-1 overflow-y-auto scrollbar-none">
                        {processedCountryData.map((country) => {
                          const countryCode = countries.getAlpha2Code(
                            country.country,
                            "en"
                          );
                          return (
                            <div
                              key={country.country}
                              className="flex items-center justify-between border-b py-1 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                {countryCode ? (
                                  <Flag
                                    code={countryCode}
                                    style={{
                                      width: "24px",
                                      height: "16px",
                                      borderRadius: "10%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <div className="w-6 h-4 bg-gray-300 rounded" />
                                )}
                                <span className="text-[12px] text-gray-700">
                                  {country.country}
                                </span>
                              </div>
                              <span className="text-[12px] font-medium text-gray-900">
                                {country.count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="flex items-end justify-end gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#576CBC] text-white text-xs font-medium px-4 py-2 rounded-lg shadow"
                        disabled={!dashboardRead}
                      >
                        <span className="text-lg">+</span> Add new
                      </button>
                    </div>
                    <div className="mt-3 w-full h-full shadow bg-[#f5f5f5] rounded-lg dark:bg-[#343434] dark:text-[#dedede]">
                      <div className="flex justify-between bg-[#fafafb] items-center px-4 py-0 rounded-md dark:bg-[#343434] h-12">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none text-[15px] w-52 py-3"
                            value={searchQuery1}
                            onChange={(e) => setSearchQuery1(e.target.value)}
                          />
                        </div>
                        <div className="relative ">
                          {/* Filter Button (opens your filter popup) */}
                          <button
                            className="flex items-center gap-2 text-sm text-gray-400 border-[#f5f5f5] dark:border-[#3b3b3b] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                            onClick={() => setshowTeacherfilterForm(true)}
                          >
                            <MdTune className="w-4 h-4" />
                            <span>Filter</span>
                          </button>
                          {showTeacherfilterForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center overflow-auto">
                              <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden m-4 relative">
                                <button
                                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                                  onClick={() =>
                                    setshowTeacherfilterForm(false)
                                  }
                                  aria-label="Close"
                                >
                                  ×
                                </button>
                                <div className="p-6 space-y-4">
                                  <h2 className="text-lg font-semibold mb-2">
                                    Filter by
                                  </h2>
                                  <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-gray-700">
                                      Role
                                    </label>
                                    <select
                                      className="border rounded px-3 py-2 text-sm"
                                      value={filterCourse}
                                      onChange={(e) =>
                                        setFilterCourse(e.target.value)
                                      }
                                    >
                                      <option value="">Select Role</option>
                                      <option value="ADMIN">Admin</option>
                                      <option value="ACADEMICCOACH">
                                        Academic Coach
                                      </option>
                                      <option value="SUPERVISOR">
                                        Supervisor
                                      </option>
                                      <option value="OTHERS">Others</option>
                                    </select>
                                    <label className="text-sm font-medium text-gray-700 mt-2">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      className="border rounded px-3 py-2 text-sm"
                                      placeholder="Enter name"
                                      value={filterName}
                                      onChange={(e) =>
                                        setFilterName(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="flex gap-3 mt-6">
                                    <button
                                      className="flex-1 border border-[#576CBC] text-[#576CBC] rounded-lg py-2 font-medium"
                                      onClick={() => {
                                        setFilterCourse("");
                                        setFilterName("");
                                      }}
                                    >
                                      Reset
                                    </button>
                                    <button
                                      className="flex-1 bg-[#576CBC] text-white rounded-lg py-2 font-medium"
                                      onClick={() =>
                                        setshowTeacherfilterForm(false)
                                      }
                                    >
                                      Show{" "}
                                      {
                                        employees.filter(
                                          (emp) =>
                                            (!filterCourse ||
                                              emp.role.includes(
                                                filterCourse
                                              )) &&
                                            (!filterName ||
                                              emp.userName
                                                .toLowerCase()
                                                .includes(
                                                  filterName.toLowerCase()
                                                ))
                                        ).length
                                      }{" "}
                                      results
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-left gap-2 text-sm text-gray-400 border-[#f5f5f5] dark:border-[#3b3b3b] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                          Showing{" "}
                          {
                            employees.filter(
                              (emp) =>
                                (!filterCourse ||
                                  emp.role.includes(filterCourse)) &&
                                (!filterName ||
                                  emp.userName
                                    .toLowerCase()
                                    .includes(filterName.toLowerCase())) &&
                                (emp.userName
                                  .toLowerCase()
                                  .includes(searchQuery1.toLowerCase()) ||
                                  emp.email
                                    .toLowerCase()
                                    .includes(searchQuery1.toLowerCase()))
                            ).length
                          }{" "}
                          Of {employees.length}
                        </span>
                      </div>
                      {/* Employee Cards - match Teachers card grid */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-7 overflow-y-auto">
                        {employees
                          .filter(
                            (emp) =>
                              (!filterCourse ||
                                emp.role.includes(filterCourse)) &&
                              (!filterName ||
                                emp.userName
                                  .toLowerCase()
                                  .includes(filterName.toLowerCase())) &&
                              (emp.userName
                                .toLowerCase()
                                .includes(searchQuery1.toLowerCase()) ||
                                emp.email
                                  .toLowerCase()
                                  .includes(searchQuery1.toLowerCase()))
                          )
                          .slice(0, 50) // limit for performance
                          .map((employee) => (
                            <div
                              key={employee._id}
                              className="bg-white dark:bg-[#343434] h-full shadow-md rounded-lg p-4 flex flex-col justify-between"
                            >
                              <div className="items-center">
                                <div className="h-[126px] rounded-md bg-[#e8e8e8] dark:bg-[#dadada] flex items-center justify-center">
                                  <Image
                                    src={
                                      employee.profileImage ??
                                      "/assets/images/proff.jpg"
                                    }
                                    alt="Employee"
                                    className="rounded-md"
                                    width={90}
                                    height={90}
                                  />
                                </div>
                              </div>
                              <div className="mt-2 text-center">
                                <h3 className="text-[12px] font-semibold text-[#010e30] dark:text-[#fff] mb-1">
                                  {employee.userName}
                                </h3>
                                <p className="text-[#717579] text-[10px] dark:text-[#fff]">
                                  Role: {employee.role.join(", ")}
                                </p>
                                <p className="text-[#717579] text-[10px] dark:text-[#fff]">
                                  {employee.gender}
                                </p>
                                <div className="flex flex-col justify-center gap-2 px-5 mt-2">
                                  <button
                                    className="text-[12px] border border-[#576CBC] text-[#576CBC] dark:text-[#fff] px-2 py-1 rounded-lg"
                                    onClick={() =>
                                      handlePortalAccessforemployee(
                                        employee._id
                                      )
                                    }
                                    disabled={!dashboardRead}
                                  >
                                    Portal Access
                                  </button>
                                  <button
                                    className="text-[12px] bg-[#576CBC] text-white px-2 py-1 rounded-lg"
                                    onClick={() =>
                                      handleViewEmployee(
                                        employee.userId,
                                        employee._id
                                      )
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
                    {/* Pagination (if needed, match Teachers section) */}
                    <div className="flex justify-end mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(employees.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                      />
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
                  {
                    label: "Phone number",
                    name: "phoneNumber",
                    type: "number",
                  },
                  { label: "City", name: "city", type: "text" },
                  { label: "Nationality", name: "nationality", type: "text" },
                  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                  { label: "Country", name: "country", type: "text" },
                  { label: "Gender", name: "gender", type: "text" },
                  {
                    label: "Residential Address",
                    name: "residentialAddress",
                    type: "text",
                    full: true,
                  },
                  {
                    label: "Highest Qualification",
                    name: "higherQualification",
                    type: "text",
                  },
                  {
                    label: "University/Institute Name",
                    name: "universityName",
                    type: "text",
                  },
                  {
                    label: "Previous Job Title",
                    name: "previousJob",
                    type: "text",
                  },
                  {
                    label: "Experience (in years)",
                    name: "experience",
                    type: "text",
                  },
                  { label: "Bank Name", name: "bankName", type: "text" },
                  {
                    label: "Account Number",
                    name: "accountNumber",
                    type: "number",
                  },
                  {
                    label: "Bank Code",
                    name: "bankCode",
                    type: "text",
                    full: true,
                  },
                  {
                    label: "Passport Number",
                    name: "passportNumber",
                    type: "text",
                  },
                  {
                    label: "Emergency Contact Number",
                    name: "emergencyContactNumber",
                    type: "number",
                  },
                  {
                    label: "Relationship with Employee",
                    name: "relationshipWithEmployee",
                    type: "text",
                  },
                  {
                    label: "Address",
                    name: "address",
                    type: "text",
                    full: true,
                  },
                  { label: "Designation", name: "designation", type: "text" },
                  { label: "Department", name: "department", type: "text" },
                  {
                    label: "Preferred Working Hours",
                    name: "preferedWorkingHours",
                    type: "number",
                  },
                ].map((field, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      field.full ? "col-span-2" : ""
                    }`}
                  >
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        Array.isArray(
                          formData[field.name as keyof OtherEmployeess]
                        )
                          ? (
                              formData[
                                field.name as keyof OtherEmployeess
                              ] as string[]
                            ).join(", ")
                          : formData[field.name as keyof OtherEmployeess] ?? ""
                      }
                      onChange={(e) => {
                        if (
                          field.name === "languagesKnown" ||
                          field.name === "preferedWorkingDays"
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: e.target.value
                              .split(",")
                              .map((item) => item.trim()),
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
                      {name === "preferedShiftFrom"
                        ? "Preferred Shift From"
                        : "Preferred Shift To"}
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
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Languages Known
                  </label>
                  <input
                    type="text"
                    name="languagesKnown"
                    value={formData.languagesKnown.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        languagesKnown: e.target.value
                          .split(",")
                          .map((item) => item.trim()),
                      }))
                    }
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-xs"
                  />
                </div>

                {/* Currency Dropdown */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block">
                    Currency
                  </label>
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
                  <label className="text-xs font-medium text-gray-700 block">
                    Expected Salary
                  </label>
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
                  <label className="text-xs font-medium text-gray-700 block">
                    Preferred Working Days
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 text-xs"
                      >
                        <input
                          type="checkbox"
                          value={day}
                          checked={formData.preferedWorkingDays.includes(day)}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setFormData((prev) => {
                              const days = new Set(prev.preferedWorkingDays);
                              checked ? days.add(value) : days.delete(value);
                              return {
                                ...prev,
                                preferedWorkingDays: Array.from(days),
                              };
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
                  <label className="text-xs font-medium text-gray-700 block">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs bg-gray-100 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                {/* Comments */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700 block">
                    Additional Comments
                  </label>
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
