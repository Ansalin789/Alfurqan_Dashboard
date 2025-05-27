"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, User } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import BaseLayout3 from "../../../../components/BaseLayout3";
import moment from "moment";
import axios from "axios";
import ApplicationChart from "../../components/applicantsbar";
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
      typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

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

    const fetchApplicants = axios.get("https://api.blackstoneinfomaticstech.com/applicants",
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const fetchDashboardCounts = axios.get(
      "https://api.blackstoneinfomaticstech.com/dashboard/supervisor/counts",
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
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
            color: ["#fbbf24", "#3b82f6", "#a855f7", "#ef4444", "#10b981"][
              index % 5
            ],
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
          typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get("https://api.blackstoneinfomaticstech.com/allMeetings",
          {
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}`, },


          });

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
        typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      const response = await axios.get("https://api.blackstoneinfomaticstech.com/applicants", {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        }

      });

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
      color: ["#1e40af", "#60a5fa", "#93c5fd", "#2563eb"][index % 4], // Assign different colors
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
    <BaseLayout3 >
      <div className="flex flex-col h-screen w-full">
        {/* //////Cards count Start ////////// */}
        <div className="flex">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
              <h3 className="text-[#010E30] font-medium text-[14px]  mb-2">
                Total <br /> Applications
              </h3>
              <div className="flex items-center">
                <div className="flex mt-0 gap-4">
                  <span className="text-[28px] text-[#010E30] font-semibold">
                    {dashboardCounts.totalApplication}
                  </span>
                  {/* <span className="flex items-center mt-1 bg-green-100 text-green-600 text-[10px] font-semibold px-2 py-[2px] rounded-full w-fit">
                    ↑ 12%
                  </span> */}
                </div>

                <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
                  <div className="relative w-[90px] h-[90px]">
                    <PieChart width={90} height={90}>
                      {/* Background ring */}
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={38}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={false}
                      >
                        <Cell fill="#E6EFF2" />
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
                      >
                        <Cell fill="#7DB5CB" />
                        <Cell fill="transparent" />
                      </Pie>
                    </PieChart>

                    {/* Centered Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
                      {percentageValue}%
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
              <h3 className="text-[#010E30] text-[14px] font-medium   mb-2">
                Shortlisted <br /> Candidates
              </h3>
              <div className="flex items-center">
                <div className="flex mt-0 gap-4">
                  <span className="text-[28px] text-[#010E30] font-semibold">
                    {dashboardCounts.shortlisted}
                  </span>
                  {/* <span className="text-red-500 text-xs flex items-center gap-1">
                    <span className="text-[10px]">↓</span> 16%
                  </span> */}
                </div>
                <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
                  <div className="relative w-[90px] h-[90px]">
                    <PieChart width={90} height={90}>
                      {/* Background ring */}
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={38}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={false}
                      >
                        <Cell fill="#9AD7D633" /> {/* 20% opacity */}
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
                      >
                        <Cell fill="#9AD7D6" />
                        <Cell fill="transparent" />
                      </Pie>
                    </PieChart>

                    {/* Centered Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
                      {percentageValue}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
              <h3 className="text-[#010E30] text-[14px] font-medium  mb-2">
                Rejected <br /> Candidates
              </h3>
              <div className="flex items-center">
                <div className="flex mt-0 gap-4">
                  <span className="text-[28px] text-[#010E30] font-semibold">
                    {dashboardCounts.rejected}
                  </span>
                  {/* <span className="flex items-center mt-1 bg-green-100 text-green-600 text-[10px] font-semibold px-2 py-[2px] rounded-full w-fit">
                    ↑ 14%
                  </span> */}
                </div>
                <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
                  <div className="relative w-[90px] h-[90px]">
                    <PieChart width={90} height={90}>
                      {/* Background ring */}
                      <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={38}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={false}
                      >
                        <Cell fill="#0D356D33" />
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
                      >
                        <Cell fill="#8B93D2" />
                        <Cell fill="transparent" />
                      </Pie>
                    </PieChart>

                    {/* Centered Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
                      {percentageValue}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* /////Cards count End ///// */}


            <ApplicationChart />
  
        {/* bar garph ends */}
      </div>
    </BaseLayout3>
  );
}
