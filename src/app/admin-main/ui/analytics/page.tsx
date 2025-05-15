"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  DotProps,
} from "recharts";
import BaseLayout4 from "@/components/BaseLayout4";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { io, Socket } from "socket.io-client";

interface CountryStat {
  revenue: number;
  count: number;
  country: string;
  percentage?: number;
}
countries.registerLocale(enLocale);

interface ChartDataItem {
  courseName: string;
  revenue: number;
  color: string;
}

interface StudentInvoice {
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: number;
  };
  _id: string;
  courseName: string;
  amount: number;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: Date;
  invoiceStatus: string;
}

interface ApiResponse {
  totalCount: number;
  invoice: StudentInvoice[];
}

const visitorData = [
  {
    name: "Jan",
    Friend: 420,
    SocialMedia: 300,
    EMail: 280,
    Google: 210,
    Other: 190,
  },
  {
    name: "Feb",
    Friend: 380,
    SocialMedia: 270,
    EMail: 250,
    Google: 190,
    Other: 170,
  },
  {
    name: "Mar",
    Friend: 460,
    SocialMedia: 310,
    EMail: 290,
    Google: 220,
    Other: 200,
  },
  {
    name: "Apr",
    Friend: 400,
    SocialMedia: 260,
    EMail: 275,
    Google: 215,
    Other: 180,
  },
  {
    name: "May",
    Friend: 440,
    SocialMedia: 280,
    EMail: 300,
    Google: 240,
    Other: 210,
  },
  {
    name: "Jun",
    Friend: 410,
    SocialMedia: 290,
    EMail: 310,
    Google: 230,
    Other: 195,
  },
  {
    name: "Jul",
    Friend: 430,
    SocialMedia: 320,
    EMail: 295,
    Google: 225,
    Other: 185,
  },
  {
    name: "Aug",
    Friend: 450,
    SocialMedia: 330,
    EMail: 315,
    Google: 235,
    Other: 205,
  },
  {
    name: "Sep",
    Friend: 470,
    SocialMedia: 340,
    EMail: 320,
    Google: 245,
    Other: 215,
  },
  {
    name: "Oct",
    Friend: 490,
    SocialMedia: 350,
    EMail: 330,
    Google: 250,
    Other: 220,
  },
  {
    name: "Nov",
    Friend: 460,
    SocialMedia: 300,
    EMail: 310,
    Google: 230,
    Other: 200,
  },
  {
    name: "Dec",
    Friend: 440,
    SocialMedia: 250,
    EMail: 306,
    Google: 200,
    Other: 233,
  },
];

const CountriesCard = () => {
  const [countryData, setCountryData] = useState<CountryStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

 useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchData(token);
      
      } else {
        alert("No auth token found.");
      }
    }
  }, []);    
  const fetchData = async (token:string) => {
      try {
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/amountbycountry",
{
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          // Assuming the expected structure is an array of objects
          setCountryData(result);
          // Calculate total revenue after setting country data
          const total = result.reduce(
            (acc, country) => acc + country.revenue,
            0
          );
          setTotalRevenue(total);
        } else {
          throw new Error("Data structure is missing or incorrect!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };



  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full border border-gray-200">
      <h2 className="text-base font-semibold mb-3 text-gray-700">Countries</h2>
      <div className="space-y-5 h-[240px]">
        {countryData && countryData.length > 0 ? (
          <>
            {(() => {
              const totalAllCountriesRevenue =
                countryData?.find(
                  (country) => country.country === "TotalAllCountries"
                )?.revenue || 0;
              return countryData
                .filter((country) => country.country !== "TotalAllCountries")
                .map((country, i) => {
                  const percentage =
                    totalAllCountriesRevenue > 0
                      ? (country.revenue / totalAllCountriesRevenue) * 100
                      : 0;
                  const countryCode = countries.getAlpha2Code(
                    country.country,
                    "en"
                  );
                  const flagUrl = countryCode
                    ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
                    : "/assets/images/flags/default.png";

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 group relative"
                    >
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
                            ${country.revenue.toLocaleString()}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-2 bg-[#012A4A] rounded-full"
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Tooltip for revenue */}
                      <div className="absolute top-[-30px] left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        Revenue: ${country.revenue} / Total: $
                        {totalAllCountriesRevenue}
                      </div>
                    </div>
                  );
                });
            })()}
          </>
        ) : (
          <p>Loading country data...</p>
        )}
      </div>
    </div>
  );
};

const CoursesChart = () => {
  const [barData, setBarData] = useState<ChartDataItem[]>([]);

 useEffect(() => {
  const fetchData = async (token: string) => {
    try {
      const response = await axios.get("https://api.blackstoneinfomaticstech.com/amountbycourse", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const allCourses = response.data;

      const filteredCourses = allCourses.filter((course: any) =>
        ["Quran Studies", "Islamic Studies", "Arabic Studies"].includes(course.courseName)
      );

      const colorMap: Record<string, string> = {
        "Quran Studies": "#7f9cb6",
        "Islamic Studies": "#4a90e2",
        "Arabic Studies": "#001d3d",
      };

      const chartData: ChartDataItem[] = filteredCourses.map(
        (course: { courseName: string; revenue: any }) => ({
          courseName: course.courseName.replace(" Studies", ""),
          revenue: course.revenue,
          color: colorMap[course.courseName] || "#ccc",
        })
      );

      setBarData(chartData);
    } catch (error) {
      console.error("Error fetching course revenue data:", error);
    }
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('AdminAuthToken');
    if (token) {
      fetchData(token);
    } else {
      console.log("No auth token found.");
    }
  }
}, []);


  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full border border-gray-200">
      <h2 className="text-base font-semibold mb-3 text-gray-700">Courses</h2>

      <ResponsiveContainer width="100%" height={195}>
        <BarChart data={barData} barCategoryGap={30}>
          <XAxis hide />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className="bg-white text-gray-800 text-sm px-2 py-1 rounded shadow border border-gray-200">
                  ${payload[0]?.value}
                </div>
              ) : null
            }
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="revenue"
            radius={[15, 15, 15, 15]}
            barSize={35}
            activeBar={false}
          >
            {barData.map((entry) => (
              <Cell key={entry.courseName} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-6">
        {barData.map((entry) => (
          <div key={entry.courseName} className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[12px] text-gray-700">
              {entry.courseName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomDot = (props: DotProps & { payload?: any }) => {
  const { cx, cy, payload } = props;
  // This assumes July is the 7th item (index 6) and you're plotting 'Instagram'
  if (payload?.name === "Jul" && cx !== undefined && cy !== undefined) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#0F172A"
        stroke="#fff"
        strokeWidth={2}
      />
    );
  }
  return null;
};

const CustomLegend = () => (
  <div className="flex justify-center mt-4 space-x-8 text-sm font-medium text-slate-700">
    {[
      { label: "Friend", color: "#0F172A" },
      { label: "SocialMedia", color: "#94A3B8" },
      { label: "Email", color: "#3B82F6" },
      { label: "Google", color: "#66b16c" },
      { label: "Other", color: "#848e56" },
    ].map((item) => (
      <div key={item.label} className="flex items-center space-x-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: item.color }}
        ></span>
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

const revenueDatas = [
  { month: "Jan", amount: 15 },
  { month: "Feb", amount: 19 },
  { month: "Mar", amount: 13 },
  { month: "Apr", amount: 12 },
  { month: "May", amount: 15 },
  { month: "Jun", amount: 19 },
  { month: "Jul", amount: 28 },
  { month: "Aug", amount: 21 },
  { month: "Sep", amount: 16 },
  { month: "Oct", amount: 10 },
  { month: "Nov", amount: 13 },
  { month: "Dec", amount: 15 },
];

const getBarColor: (
  value: number,
  maxValue: number
) => "#0ea5e9" | "#38bdf8" | "#7dd3fc" | "#bae6fd" | "#e0f2fe" = (
  value,
  maxValue
) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  if (percentage >= 90) return "#0ea5e9";
  if (percentage >= 70) return "#38bdf8";
  if (percentage >= 50) return "#7dd3fc";
  if (percentage >= 30) return "#bae6fd";
  return "#e0f2fe";
};

export default function Home() {
   const socketRef = useRef<Socket | null>(null);
    const userId = "6805da8c06542aa33858b889";
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [barData, setBarData] = useState<ChartDataItem[]>([]);
  const [data, setData] = useState<StudentInvoice[]>([]);
  useEffect(() => {
    if (!socketRef.current) {
          socketRef.current = io("https://api.blackstoneinfomaticstech.com", {
            transports: ["websocket"],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });
  
      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO:", socketRef.current?.id);
        socketRef.current?.emit("subscribe", userId);
      });
  
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from Socket.IO");
      });
  
      socketRef.current.on("connect_error", (err: any) => {
        console.error("Socket.IO connection error:", err);
      });
    }
  
    const handleRevenueUpdate = (updatedRevenue: any) => {
      console.log("💸 Live revenue update:", updatedRevenue);
    
      // Extracting the 'TotalAllCourses' value from the updatedRevenue array
      const totalAllCourses = updatedRevenue.find((item: any) => item.courseName === 'TotalAllCourses');
      
      // If the 'TotalAllCourses' exists, set the totalRevenue
      if (totalAllCourses) {
        setTotalRevenue(totalAllCourses.revenue);
      }
    };
    
  
    socketRef.current.on("revenueUpdated", handleRevenueUpdate);
  
    return () => {
      socketRef.current?.off("revenueUpdate", handleRevenueUpdate);
    };
  }, [userId]);
  
useEffect(() => {
  const fetchMeetings = async (token: string) => {
    try {
      const response = await axios.get("https://api.blackstoneinfomaticstech.com/amountbycourse", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const allCourses = response.data;

      // Set total revenue from TotalAllCourses entry
      const totalCourse = allCourses.find(
        (course: any) => course.courseName === "TotalAllCourses"
      );
      if (totalCourse) setTotalRevenue(totalCourse.revenue);

      // Filter and map for chart
      const filteredCourses = allCourses.filter((course: any) =>
        ["Quran Studies", "Islamic Studies", "Arabic Studies"].includes(
          course.courseName
        )
      );

      const colorMap: Record<string, string> = {
        "Quran Studies": "#7f9cb6",
        "Islamic Studies": "#4a90e2",
        "Arabic Studies": "#001d3d",
      };

      const chartData: ChartDataItem[] = filteredCourses.map(
        (course: { courseName: string; revenue: any }) => ({
          courseName: course.courseName.replace(" Studies", ""),
          revenue: course.revenue,
          color: colorMap[course.courseName] || "#ccc",
        })
      );

      setBarData(chartData);
    } catch (error) {
      console.error("Error fetching course revenue data:", error);
    }
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('AdminAuthToken');
    if (token) {
      fetchMeetings(token);
    } else {
      alert("No auth token found.");
    }
  }
}, []);

useEffect(() => {
  const fetchInvoices = async (token: string) => {
    try {
      const response = await fetch("https://api.blackstoneinfomaticstech.com/studentinvoice", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      const filteredData = data.invoice
        .filter((invoice) => invoice.invoiceStatus === "Paid")
        .sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        )
        .slice(0, 3);

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('AdminAuthToken');
    if (token) {
      fetchInvoices(token);
    } else {
      alert("No auth token found.");
    }
  }
}, []);


  type VisitorDataPoint = {
    date: string; // e.g., "2025-04-25"
    Friend: number;
    SocialMedia: number;
    Email: number;
    Google: number;
    Other: number;
  };
  const [visitorData, setVisitorData] = useState<VisitorDataPoint[]>([]);

  type RevenueDataPoint = {
    date: string; // "Jan-2025"
    label: string; // "Jan-2025"
    revenue: number; // 14500
  };

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [revenueDatas, setRevenueDatas] = useState<RevenueDataPoint[]>([]);

  const maxRevenue = Math.max(...revenueDatas.map((d) => d.revenue), 0); // Place this before render

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchVisitorData(token);
      } else {
        alert("No auth token found.");
      }
    }
  }, []);
    const fetchVisitorData = async (token: string) => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/studentvisitor", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
  
        console.log("API raw response:", data);
  
        data.forEach((item: VisitorDataPoint, index: number) => {
          console.log(`Item ${index + 1}:`, item);
          console.log("Date:", item.date);
          console.log("Friend:", item.Friend);
          console.log("SocialMedia:", item.SocialMedia);
          console.log("Email:", item.Email);
          console.log("Google:", item.Google);
          console.log("Other:", item.Other);
        });
  
        setVisitorData(data);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('AdminAuthToken');
        if (token) {
          fetchRevenueData(selectedYear, token); // ✅ pass both year and token
        } else {
          alert("No auth token found.");
        }
      }
    }, [selectedYear]); // ✅ fetch whenever year changes
    
    const fetchRevenueData = async (year: number, token: string) => {
      try {
        const res = await fetch(
          `https://api.blackstoneinfomaticstech.com/studentrevenue?year=${year}`,
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(`Revenue for ${year}:`, data);
        setRevenueDatas(data.data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };
    

  return (
    <BaseLayout4>
      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="py-2 px-5">
          <div className="mb-3">
            <h1 className="text-lg font-bold mb-4">Analytics</h1>
          </div>
          {/* Revenue Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-3">
            {/* Total Income Card */}
            <div className="bg-[#203e7b] text-white rounded-2xl p-3 relative overflow-hidden flex flex-col justify-left items-center h-40 w-full">
              <h3 className="text-sm font-medium mb-1">Total Income</h3>
              <div className="text-2xl md:text-3xl font-bold mb-1">
                ${totalRevenue.toLocaleString()}
              </div>

              <div className="flex items-center text-sm text-white gap-1">
                <div className="rounded-full border border-white p-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5l5 5H5l5-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>15%</span>
              </div>

              {/* Decorative Wave Background */}
              <div className="absolute bottom-0 left-0 w-full">
                <svg
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                  className="w-full h-16"
                >
                  <path
                    d="M0.00,49.98 C150.00,150.00 350.00,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                    fill="rgba(255,255,255,0.1)"
                  />
                  <path
                    d="M0.00,49.98 C150.00,150.00 350.00,-50.00 500.00,49.98"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Table Section */}
            <div className="col-span-3">
              <div className="bg-white rounded-xl shadow-lg overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-xs">
                  <thead className="bg-[#203e7b] text-white">
                    <tr>
                      <th className="py-3 px-4 text-center font-semibold">
                        Clients
                      </th>
                      <th className="py-3 px-4 text-center font-semibold">
                        Course
                      </th>
                      <th className="py-3 px-4 text-center font-semibold">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-center font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {data.map((row) => (
                      <tr key={row._id} className="border-b last:border-none">
                        <td className="py-3 px-4 text-center">
                          {row.student.studentName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.courseName}
                        </td>
                        <td className="py-3 px-4 text-center">{row.amount}</td>
                        <td className="py-3 px-4 text-center">
                          {row.invoiceStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Visitor Insights & Countries/Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Visitor Insights spans 2 columns on lg+ */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg">
              <h3 className="text-base font-semibold text-slate-800 mb-4">
                Visitor Insights
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={visitorData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, "dataMax + 2"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      padding: "10px",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Friend"
                    stroke="#0F172A"
                    strokeWidth={3.5}
                    dot={<CustomDot />}
                  />
                  <Line
                    type="monotone"
                    dataKey="SocialMedia"
                    stroke="#94A3B8"
                    strokeWidth={3.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Email" // 👈 corrected here
                    stroke="#3B82F6"
                    strokeWidth={3.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Google"
                    stroke="#66b16c"
                    strokeWidth={3.5}
                    dot={<CustomDot />}
                  />
                  <Line
                    type="monotone"
                    dataKey="Other"
                    stroke="#848e56"
                    strokeWidth={3.5}
                    dot={<CustomDot />}
                  />
                </LineChart>
              </ResponsiveContainer>

              <CustomLegend />
            </div>

            {/* Countries */}
            <div className="lg:col-span-1">
              <CountriesCard />
            </div>

            {/* Courses */}
            <div className="lg:col-span-1">
              <CoursesChart />
            </div>
          </div>

          {/* Recent Transactions & Trials */}
          <div className="col-span-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-slate-700">
                Revenue
              </h3>
              <select
                className="bg-transparent border rounded-lg px-2 py-1 text-xs text-slate-500"
                value={selectedYear}
                onChange={async (e) => {
                  const year = Number(e.target.value);
                  setSelectedYear(year); // Update selected year
                  const token = localStorage.getItem("AdminAuthToken");
                  if (token) {
                    await fetchRevenueData(year, token);
                  } else {
                    alert("No auth token found.");
                  }
                }}              
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={170}>
              <BarChart
                data={revenueDatas}
                margin={{ top: 15, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey="label" // <-- updated
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis hide />
                <CartesianGrid vertical={false} horizontal={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [`$${value}`, "Revenue"]}
                />
                <Bar
                  dataKey="revenue" // <-- updated
                  radius={[15, 15, 15, 15]}
                  barSize={32}
                  label={{
                    position: "top",
                    formatter: (value: number) => `$${value}`,
                    fill: "#0f172a",
                    fontSize: 10,
                  }}
                >
                  {revenueDatas.map((entry) => (
                    <Cell
                      key={`cell-${entry.label}`}
                      fill={getBarColor(entry.revenue, maxRevenue)} // ✅ now passing both args
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
}
