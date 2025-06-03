"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Label,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import BaseLayout3 from "../../../../components/BaseLayout3";
import ApplicationChart from "../../components/applicantsbar";
import moment from "moment";
import axios from "axios";
import Calendar from "../../../supervisor/components/Calender";
import SupervisorHeader from "../../components/supervisorHeader";
interface Applicant {
  _id: string;
  candidateFirstName: string;
  candidateLastName: string;
  applicationDate: string;
  candidateEmail: string;
  candidatePhoneNumber: number;
  candidateCountry: string;
  candidateCity: string;
  positionApplied: string;
  currency: string;
  expectedSalary: number;
  preferedWorkingHours: string;
  uploadResume: { type: string; data: number[] };
  comments: string;
  applicationStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  gender: string;
}

interface DashboardCounts {
  totalApplication: number;
  shortlisted: number;
  rejected: number;
}
interface Meeting {
  _id: string;
  meetingId: string;
  meetingName: string;
  meetingStatus: "Scheduled" | "Reschedule" | "Completed";
  selectedDate: string;
  startTime: string;
  endTime: string;
  description: string;
  createdDate: string;
  createdBy: string;
  supervisor: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorRole: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function Dashboard() {
  const [pieData, setPieData] = useState<
    {
      name: string;
      value: number;
      female: number;
      male: number;
      color: string;
    }[]
  >([]);
  const colorMap = [
    {
      dot: "#3778AD",
      bg: "#F3FAFF",
      text: "#3778AD",
      icon: "/assets/images/S1.png",
    },
    {
      dot: "#7772D7",
      bg: "#F3F6FF",
      text: "#7772D7",
      icon: "/assets/images/S2.png",
    },
    {
      dot: "#DE7283",
      bg: "#FFF5F3",
      text: "#DE7283",
      icon: "/assets/images/S4.png",
    },
    {
      dot: "#BF8C63",
      bg: "#FFF9F3",
      text: "#BF8C63",
      icon: "/assets/images/S3.png",
    },
  ];

  const ringThickness = 6; // thickness of each ring
  const ringGap = 4; // gap between rings
  const [mounted, setMounted] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // Store the selected week label
  const [weekRange, setWeekRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: moment().startOf("week").toDate(), // Start of the current week (Sunday)
    endDate: moment().endOf("week").toDate(), // End of the current week (Saturday)
  });
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
    totalApplication: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [filteredPositions, setFilteredPositions] = useState<
    { name: string; color: string; count: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorAuthToken")
        : null;

    if (!token) {
      console.error("❌ SupervisorAuthToken not found");
      return;
    }
    const fetchData = async () => {
      const applicants = await fetchApplicantsData(token ?? " ");
      console.log("Fetched Applicants:", applicants); // ✅ Debugging
      const filteredData = processApplicants(applicants);
      console.log("Filtered Pie Data:", filteredData); // ✅ Debugging
      setPieData(filteredData);
    };

    const fetchApplicants = axios.get(
      "https://api.blackstoneinfomaticstech.com/applicants",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fetchDashboardCounts = axios.get(
      "https://api.blackstoneinfomaticstech.com/dashboard/supervisor/counts",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Promise.all([fetchApplicants, fetchDashboardCounts])
      .then(([applicantsResponse, dashboardResponse]) => {
        const applicants = applicantsResponse.data.applicants;

        // ✅ Filter and count applicants by position
        const positionCounts = applicants.reduce(
          (
            acc: Record<string, number>,
            applicant: { positionApplied: string }
          ) => {
            const position = applicant.positionApplied;
            acc[position] = (acc[position] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        // ✅ Convert to array format (for UI rendering)
        const filteredData = Object.entries(positionCounts).map(
          ([name, count], index) => ({
            name,
            count: count as number, // ✅ Explicitly cast count to number
            color: ["#F4AAFF", "#FFC4A1", "#A6A9FF"][index % 5],
          })
        );
        fetchData();
        setApplicants(applicants);
        setFilteredPositions(filteredData); // ✅ Store filtered positions
        setDashboardCounts(dashboardResponse.data);
      })
      .catch((error) => {
        console.error("🚨 Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Update the week range label (e.g., "08-14 Nov") dynamically
    const start = moment(weekRange.startDate);
    const end = moment(weekRange.endDate);
    const weekLabel = `${start.format("DD MMM")} - ${end.format("DD MMM")}`;
    setSelectedWeek(weekLabel);

    // Process applicants data based on the selected week range
    const processedData: any = [];
    const { startDate, endDate } = weekRange;

    applicants.forEach((applicant) => {
      const applicationDate = new Date(applicant.applicationDate);

      // Convert startDate and endDate to JavaScript Date objects for comparison
      const startDateObject = moment(startDate).toDate();
      const endDateObject = moment(endDate).toDate();

      // Filter applicants based on the selected week
      if (
        applicationDate >= startDateObject &&
        applicationDate <= endDateObject
      ) {
        const formattedDate = `${applicationDate.getDate()} ${applicationDate.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}`;

        // Find if the date already exists in the processedData
        let existingData = processedData.find(
          (data: any) => data.name === formattedDate
        );

        if (!existingData) {
          // If not, add a new entry for the date
          existingData = { name: formattedDate, Applied: 0, Shortlisted: 0 };
          processedData.push(existingData);
        }

        // Increment Applied count for each applicant
        existingData.Applied += 1;

        // Increment Shortlisted count if the applicant is shortlisted
        if (applicant.applicationStatus === "SHORTLISTED") {
          existingData.Shortlisted += 1;
        }
      }
    });

    setBarData(processedData);
  }, [applicants, weekRange]);
  const [meetingDays, setMeetingDays] = useState<number[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<
    { time: string; title: string; type: string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/allMeetings",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allMeetings: Meeting[] = response.data.data.meetings;

        console.log("✅ Full Meetings Data:", allMeetings);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ✅ Extract all meeting dates
        const allMeetingDays = allMeetings.map((meeting) =>
          new Date(meeting.selectedDate).getDate()
        );

        setMeetingDays(allMeetingDays);

        // ✅ Filter today's meetings
        const todayMeetings = allMeetings
          .filter((meeting) => {
            const meetingDate = new Date(meeting.selectedDate);
            return meetingDate.toDateString() === today.toDateString();
          })
          .map((meeting) => {
            let color = "bg-blue-100 text-blue-800"; // Default color

            if (meeting.meetingStatus === "Scheduled") {
              color = "bg-amber-100 text-amber-800";
            } else if (meeting.meetingStatus === "Reschedule") {
              color = "bg-green-100 text-green-800";
            }

            return {
              time: meeting.startTime,
              title: meeting.meetingName,
              type: meeting.meetingStatus.toLowerCase(),
              color,
            };
          });

        setTodayMeetings(todayMeetings);
      } catch (error) {
        console.error("🚨 Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const today = new Date();
  const currentMonth = today
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const currentYear = today.getFullYear();
  const fetchApplicantsData = async (auth: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      const response = await axios.get(
        "https://api.blackstoneinfomaticstech.com/applicants",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      // Check if response.data has an 'applicants' property that is an array
      if (response.data && Array.isArray(response.data.applicants)) {
        return response.data.applicants;
      } else {
        console.error("Unexpected API response format:", response.data);
        return []; // Return an empty array to prevent errors
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      return []; // Return empty array on error
    }
  };

  const processApplicants = (applicants: any[]) => {
    if (!Array.isArray(applicants)) {
      console.error("Unexpected data format:", applicants);
      return []; // Prevent crash
    }

    // ✅ Filter only approved applications
    const approvedApplicants = applicants.filter(
      (app) => app.applicationStatus === "APPROVED"
    );

    const groupedData: {
      [key: string]: { value: number; female: number; male: number };
    } = {};

    approvedApplicants.forEach((app) => {
      const key = app.positionApplied;
      if (!groupedData[key]) {
        groupedData[key] = { value: 0, female: 0, male: 0 };
      }
      groupedData[key].value += 1;
      if (app.gender?.toLowerCase() === "female") {
        groupedData[key].female += 1;
      } else {
        groupedData[key].male += 1;
      }
    });

    return Object.entries(groupedData).map(([name, data], index) => ({
      name,
      value: data.value,
      female: data.female,
      male: data.male,
      color: ["#AFC0FF", "#9FD0FF", "#B9DDFF"][index % 4], // Assign different colors
    }));
  };

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setWeekRange({ startDate, endDate });
  };

  if (!mounted) return null;
  const data = [
    { name: "Islamic Studies", value: 60, color: "#fbbf24" },
    { name: "Arabic", value: 110, color: "#3b82f6" },
    { name: "Quran", value: 80, color: "#a855f7" },
  ];

  const totals = filteredPositions.reduce((sum, item) => sum + item.count, 0);

  const totalApplications = dashboardCounts.totalApplication || 0;
  const totalShortlisted = dashboardCounts.shortlisted || 0;
  const totalRejected = dashboardCounts.rejected || 0;

  const total = totalApplications + totalShortlisted + totalRejected + 100; // Adjusted to account for total applications, shortlisted, and rejected

  const percentageApplications = (totalApplications / total) * 100;
  const percentageShortlisted = (totalShortlisted / total) * 100;
  const percentageRejected = (totalRejected / total) * 100;
  const percentageValue = 100;

  const remainingApplications = 100 - percentageApplications;
  const remainingShortlisted = 100 - percentageShortlisted;
  const remainingRejected = 100 - percentageRejected;
  console.log(remainingApplications);
  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Dashboard" />
      <div className="flex flex-row gap-4 p-0 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Total Applications",
                value: dashboardCounts.totalApplication,
                bgColor: "#9AD7D633",
                ringColor: "#7DB5CB",
              },
              {
                title: "Shortlisted Candidates",
                value: dashboardCounts.shortlisted,
                bgColor: "#9AD7D633",
                ringColor: "#9AD7D6",
              },
              {
                title: "Rejected Candidates",
                value: dashboardCounts.rejected,
                bgColor: "#9AD7D633",
                ringColor: "#8B93D2",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] dark:bg-[#343434] p-4 rounded-lg shadow-lg w-full"
              >
                <h3 className="text-[#010E30] dark:text-white text-[14px] font-medium mb-2">
                  {item.title.split(" ")[0]} <br /> {item.title.split(" ")[1]}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[28px] text-[#010E30] font-semibold dark:text-white">
                    {item.value}
                  </span>
                  <div className="relative w-[90px] h-[70px]">
                    <PieChart
                      width={90}
                      height={90}
                      style={{ marginTop: "-20px" }}
                    >
                      {/* Background ring */}
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={38}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={false}
                        stroke="none"
                      >
                        <Cell fill={item.bgColor} />
                      </Pie>

                      {/* Foreground ring */}
                      <Pie
                        data={[{ value: 76 }, { value: 24 }]}
                        dataKey="value"
                        innerRadius={28}
                        outerRadius={42}
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={2}
                        isAnimationActive={false}
                        stroke="none"
                      >
                        <Cell fill={item.ringColor} />
                        <Cell fill="transparent" />
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333] dark:text-white mb-4">
                      {percentageValue}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="flex gap-4">
            <div className="w-[67%] rounded-xl h-[270px] flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <ApplicationChart />
              </div>
            </div>
            <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[270px] flex flex-col">
              <div className="bg-[#FFFFFF] dark:bg-[#343434] rounded-xl shadow p-4 h-[270px]">
                {/* Header */}
                <div className="w-full flex justify-between items-center">
                  <h3 className="text-[#010E30] text-[13px] font-semibold dark:text-[#ffff]">
                    Subject
                  </h3>
                  <div className="flex gap-1">
                    <div className="flex items-center gap-[3px]">
                      <div className="w-[6px] h-[6px] bg-pink-400 rounded-sm"></div>
                      <span className="text-[9px] text-[#010E30] dark:text-white/70">
                        Female
                      </span>
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <div className="w-[6px] h-[6px] bg-blue-400 rounded-sm"></div>
                      <span className="text-[9px] text-[#010E30] dark:text-white/70">
                        Male
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="flex justify-center items-center mt-1">
                  <PieChart width={150} height={150}>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white shadow rounded px-2 py-1 text-[9px] text-gray-700">
                              <div className="font-semibold dark:text-[#FFFFFFB3]">
                                {item.name}
                              </div>
                              <div>F: {item.female}%</div>
                              <div>M: {item.male}%</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={70}
                      dataKey="value"
                      labelLine={false}
                      stroke="none"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>

                {/* Bottom Legend */}
                <div className="grid grid-cols-3 gap-1 w-full mt-6">
                  {pieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="flex items-center gap-[1px]">
                        <div
                          className="w-[10px] h-[10px] rounded-[2px]"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-[9px] font-semibold text-[#010E30] dark:text-[#FFFF]">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-[2px]">
                        <div className="flex flex-col items-center gap-[1px]">
                          <div className="w-[3px] h-[8px] bg-pink-400 rounded-[2px]"></div>
                          <span className="text-[8px] font-medium">
                            {item.female}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px]">
                          <div className="w-[3px] h-[8px] bg-blue-400 rounded-sm"></div>
                          <span className="text-[8px] font-medium">
                            {item.male}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow dark:bg-[#343434]">
            {/* Table wrapper: horizontal scroll */}
            <div className="overflow-x-auto scrollbar-none h-full">
              {/* Vertical scroll with fixed height */}
              <div className="overflow-y-auto h-[460px] rounded-xl scrollbar-none">
                <table className="min-w-full text-xs border-collapse table-fixed px-4">
                  {/* Table Head sticky */}
                  <thead className="sticky top-0 px-2 z-10 text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d] shadow-md">
                    <tr>
                      {[
                        "Name",
                        "Contact",
                        "Country",
                        "Course",
                        "Gender",
                        "Date",
                        "Time",
                        "Resume",
                        "Status",
                      ].map((col) => (
                        <th
                          key={col}
                          className="py-4 px-2 font-semibold text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {applicants.map((applicant, index: number) => (
                      <tr
                        key={applicant._id}
                        className={`text-[10px] px-2 py-4 border-none outline-none ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2c2c2c]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="py-4 px-2 text-left">
                          {applicant.candidateFirstName}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.candidatePhoneNumber}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.candidateCountry}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.positionApplied}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.gender}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {formatDate(applicant.applicationDate)}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.preferedWorkingHours}
                        </td>
                        <td className="py-2 px-2 text-left">
                          <button className="text-blue-600 flex items-center gap-1">
                            📎 Resume
                          </button>
                        </td>
                        <td className="py-2 px-2 text-left">
                          <span className="text-gray-800 rounded-full dark:text-[#fff]">
                            {applicant.applicationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[310px] flex flex-col gap-4">
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow p-0">
            <div className="h-[350px] flex items-center justify-center text-gray-400 dark:bg-[#343434]">
              <Calendar />
            </div>
          </div>
          {/* Teachers */}
          <div className="bg-white rounded-xl shadow p-4 dark:bg-[#343434] h-[200px]">
            <h3 className="text-[16px] font-semibold text-gray-800 mb-1 dark:text-[#fff]">
              Teachers
            </h3>

            <div className="flex items-center justify-between">
              {/* Circular Chart */}
              <div className="relative w-[90px] h-[90px] flex items-center justify-center mb-5 ml-7">
                <PieChart width={120} height={120}>
                  <Pie
                    data={[{ value: 100 }]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={-270}
                    fill="#f0f0f0"
                  />
                  {filteredPositions.map((item, index) => (
                    <Pie
                      key={index}
                      data={[
                        { value: item.count },
                        { value: total - item.count },
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={30 + index * (ringThickness + ringGap)}
                      outerRadius={
                        30 + index * (ringThickness + ringGap) + ringThickness
                      }
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={5}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      <Cell fill={item.color} stroke="none" />
                      <Cell fill="transparent" stroke="none" />
                    </Pie>
                  ))}
                </PieChart>

                {/* Centered Total Teachers Count */}
                <div className="absolute flex flex-col items-center justify-between">
                  <span className="mt-3 ml-2 text-[26px] font-bold text-[#010E30] dark:text-[#fff]">
                    {totals}
                  </span>
                  <p className="ml-8 text-[9px] text-[#010E30] dark:text-[#fff]">
                    Number of Teachers
                  </p>
                </div>
              </div>

              {/* Teacher Stats */}
              <div className="space-y-3 mr-1 ">
                {filteredPositions.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between w-32 dark:text-[#fff]"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-[11px] text-[#010E30CC] font-semibold dark:text-[#fff] ">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[#010E30CC] text-[10px] font-medium dark:text-[#fff]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Schedule */}
          <div className="bg-white rounded-xl shadow p-4 dark:bg-[#343434] h-[332px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-semibold text-gray-700 dark:text-[#ffff]">
                Schedule
              </h3>
              <button className="px-2 py-1 bg-[#efefef] rounded flex items-center gap-1 text-[10px] dark:bg-[#747474]">
                Today <span className="text-[#747474]">▼</span>
              </button>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-4 h-[260px] overflow-y-auto scrollbar-none">
              {/* Vertical dotted line */}

              {todayMeetings.map((item, index) => {
                const colors = colorMap[index % colorMap.length];

                return (
                  <div
                    key={item.title + index}
                    className="flex items-start gap-3 relative"
                  >
                    {/* Time */}
                    <span className="text-[10px] text-gray-500 w-[50px] mt-[22px] dark:text-[#ffff]">
                      {item.time}
                    </span>

                    {/* Dot */}
                    <div className="absolute left-[65px] top-0 bottom-0 border-l-2 border-dotted border-gray-300 z-0"></div>

                    <div
                      className="w-[8px] h-[8px] rounded-full mt-[25px] z-10"
                      style={{ backgroundColor: colors.dot }}
                    ></div>

                    {/* Meeting Box */}
                    <div
                      className="flex items-center px-3 py-2 rounded-lg flex-1 text-[10px] font-medium gap-2 "
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      <img
                        src={colors.icon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
}
