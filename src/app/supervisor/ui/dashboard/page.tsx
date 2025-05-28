// "use client";
// import React, { useEffect, useState } from "react";
// import { Search, Bell, Sun, Moon, User } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Label,
// } from "recharts";
// import BaseLayout3 from "../../../../components/BaseLayout3";
// import moment from "moment";
// import axios from "axios";
// import ApplicationChart from "../../components/applicantsbar";
// interface Applicant {
//   _id: string;
//   candidateFirstName: string;
//   candidateLastName: string;
//   applicationDate: string;
//   candidateEmail: string;
//   candidatePhoneNumber: number;
//   candidateCountry: string;
//   candidateCity: string;
//   positionApplied: string;
//   currency: string;
//   expectedSalary: number;
//   preferedWorkingHours: string;
//   uploadResume: { type: string; data: number[] };
//   comments: string;
//   applicationStatus: string;
//   status: string;
//   createdDate: string;
//   createdBy: string;
//   gender: string;
// }

// interface DashboardCounts {
//   totalApplication: number;
//   shortlisted: number;
//   rejected: number;
// }
// interface Meeting {
//   _id: string;
//   meetingId: string;
//   meetingName: string;
//   meetingStatus: "Scheduled" | "Reschedule" | "Completed";
//   selectedDate: string;
//   startTime: string;
//   endTime: string;
//   description: string;
//   createdDate: string;
//   createdBy: string;
//   supervisor: {
//     supervisorId: string;
//     supervisorName: string;
//     supervisorEmail: string;
//     supervisorRole: string;
//   };
//   teacher: {
//     teacherId: string;
//     teacherName: string;
//     teacherEmail: string;
//   }[];
// }

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString();
// };

// export default function Dashboard() {
//   const [pieData, setPieData] = useState<
//     {
//       name: string;
//       value: number;
//       female: number;
//       male: number;
//       color: string;
//     }[]
//   >([]);
// const [mounted, setMounted] = useState(false);
// const [applicants, setApplicants] = useState<Applicant[]>([]);
// const [barData, setBarData] = useState<any[]>([]);
// const [selectedWeek, setSelectedWeek] = useState<string>(""); // Store the selected week label
// const [weekRange, setWeekRange] = useState<{
//   startDate: Date;
//   endDate: Date;
// }>({
//   startDate: moment().startOf("week").toDate(), // Start of the current week (Sunday)
//   endDate: moment().endOf("week").toDate(), // End of the current week (Saturday)
// });
// const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
//   totalApplication: 0,
//   shortlisted: 0,
//   rejected: 0,
// });
// const [filteredPositions, setFilteredPositions] = useState<
//   { name: string; color: string; count: number }[]
// >([]);

//   useEffect(() => {
//     setMounted(true);
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

//     if (!token) {
//       console.error("❌ SupervisorAuthToken not found");
//       return;
//     }
//     const fetchData = async () => {

//       const applicants = await fetchApplicantsData(token ?? " ");
//       console.log("Fetched Applicants:", applicants); // ✅ Debugging
//       const filteredData = processApplicants(applicants);
//       console.log("Filtered Pie Data:", filteredData); // ✅ Debugging
//       setPieData(filteredData);
//     };

//     const fetchApplicants = axios.get("https://api.blackstoneinfomaticstech.com/applicants",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     );

//     const fetchDashboardCounts = axios.get(
//       "https://api.blackstoneinfomaticstech.com/dashboard/supervisor/counts",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     );

//     Promise.all([fetchApplicants, fetchDashboardCounts])
//       .then(([applicantsResponse, dashboardResponse]) => {
//         const applicants = applicantsResponse.data.applicants;

//         // ✅ Filter and count applicants by position
//         const positionCounts = applicants.reduce(
//           (
//             acc: Record<string, number>,
//             applicant: { positionApplied: string }
//           ) => {
//             const position = applicant.positionApplied;
//             acc[position] = (acc[position] || 0) + 1;
//             return acc;
//           },
//           {} as Record<string, number>
//         );

//         // ✅ Convert to array format (for UI rendering)
//         const filteredData = Object.entries(positionCounts).map(
//           ([name, count], index) => ({
//             name,
//             count: count as number, // ✅ Explicitly cast count to number
//             color: ["#fbbf24", "#3b82f6", "#a855f7", "#ef4444", "#10b981"][
//               index % 5
//             ],
//           })
//         );
//         fetchData();
//         setApplicants(applicants);
//         setFilteredPositions(filteredData); // ✅ Store filtered positions
//         setDashboardCounts(dashboardResponse.data);
//       })
//       .catch((error) => {
//         console.error("🚨 Error fetching data:", error);
//       });
//   }, []);

//   useEffect(() => {
//     // Update the week range label (e.g., "08-14 Nov") dynamically
//     const start = moment(weekRange.startDate);
//     const end = moment(weekRange.endDate);
//     const weekLabel = `${start.format("DD MMM")} - ${end.format("DD MMM")}`;
//     setSelectedWeek(weekLabel);

//     // Process applicants data based on the selected week range
//     const processedData: any = [];
//     const { startDate, endDate } = weekRange;

//     applicants.forEach((applicant) => {
//       const applicationDate = new Date(applicant.applicationDate);

//       // Convert startDate and endDate to JavaScript Date objects for comparison
//       const startDateObject = moment(startDate).toDate();
//       const endDateObject = moment(endDate).toDate();

//       // Filter applicants based on the selected week
//       if (
//         applicationDate >= startDateObject &&
//         applicationDate <= endDateObject
//       ) {
//         const formattedDate = `${applicationDate.getDate()} ${applicationDate.toLocaleString(
//           "default",
//           {
//             month: "short",
//           }
//         )}`;

//         // Find if the date already exists in the processedData
//         let existingData = processedData.find(
//           (data: any) => data.name === formattedDate
//         );

//         if (!existingData) {
//           // If not, add a new entry for the date
//           existingData = { name: formattedDate, Applied: 0, Shortlisted: 0 };
//           processedData.push(existingData);
//         }

//         // Increment Applied count for each applicant
//         existingData.Applied += 1;

//         // Increment Shortlisted count if the applicant is shortlisted
//         if (applicant.applicationStatus === "SHORTLISTED") {
//           existingData.Shortlisted += 1;
//         }
//       }
//     });

//     setBarData(processedData);
//   }, [applicants, weekRange]);
//   const [meetingDays, setMeetingDays] = useState<number[]>([]);
//   const [todayMeetings, setTodayMeetings] = useState<
//     { time: string; title: string; type: string; color: string }[]
//   >([]);

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       try {
//         const token =
//           typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

//         if (!token) {
//           console.error("❌ SupervisorAuthToken not found");
//           return;
//         }
//         const response = await axios.get("https://api.blackstoneinfomaticstech.com/allMeetings",
//           {
//             headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}`, },


//           });

//         const allMeetings: Meeting[] = response.data.data.meetings;

//         console.log("✅ Full Meetings Data:", allMeetings);

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // ✅ Extract all meeting dates
//         const allMeetingDays = allMeetings.map((meeting) =>
//           new Date(meeting.selectedDate).getDate()
//         );

//         setMeetingDays(allMeetingDays);

//         // ✅ Filter today's meetings
//         const todayMeetings = allMeetings
//           .filter((meeting) => {
//             const meetingDate = new Date(meeting.selectedDate);
//             return meetingDate.toDateString() === today.toDateString();
//           })
//           .map((meeting) => {
//             let color = "bg-blue-100 text-blue-800"; // Default color

//             if (meeting.meetingStatus === "Scheduled") {
//               color = "bg-amber-100 text-amber-800";
//             } else if (meeting.meetingStatus === "Reschedule") {
//               color = "bg-green-100 text-green-800";
//             }

//             return {
//               time: meeting.startTime,
//               title: meeting.meetingName,
//               type: meeting.meetingStatus.toLowerCase(),
//               color,
//             };
//           });

//         setTodayMeetings(todayMeetings);
//       } catch (error) {
//         console.error("🚨 Error fetching meetings:", error);
//       }
//     };

//     fetchMeetings();
//   }, []);

//   const today = new Date();
//   const currentMonth = today
//     .toLocaleString("default", { month: "long" })
//     .toUpperCase();
//   const currentYear = today.getFullYear();
//   const fetchApplicantsData = async (auth: string) => {
//     try {
//       const token =
//         typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

//       if (!token) {
//         console.error("❌ SupervisorAuthToken not found");
//         return;
//       }

//       const response = await axios.get("https://api.blackstoneinfomaticstech.com/applicants", {
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': `Bearer ${token}`,
//         }

//       });

//       console.log("API Response:", response.data);

//       // Check if response.data has an 'applicants' property that is an array
//       if (response.data && Array.isArray(response.data.applicants)) {
//         return response.data.applicants;
//       } else {
//         console.error("Unexpected API response format:", response.data);
//         return []; // Return an empty array to prevent errors
//       }
//     } catch (error) {
//       console.error("Error fetching applicants:", error);
//       return []; // Return empty array on error
//     }
//   };

//   const processApplicants = (applicants: any[]) => {
//     if (!Array.isArray(applicants)) {
//       console.error("Unexpected data format:", applicants);
//       return []; // Prevent crash
//     }

//     // ✅ Filter only approved applications
//     const approvedApplicants = applicants.filter(
//       (app) => app.applicationStatus === "APPROVED"
//     );

//     const groupedData: {
//       [key: string]: { value: number; female: number; male: number };
//     } = {};

//     approvedApplicants.forEach((app) => {
//       const key = app.positionApplied;
//       if (!groupedData[key]) {
//         groupedData[key] = { value: 0, female: 0, male: 0 };
//       }
//       groupedData[key].value += 1;
//       if (app.gender?.toLowerCase() === "female") {
//         groupedData[key].female += 1;
//       } else {
//         groupedData[key].male += 1;
//       }
//     });

//     return Object.entries(groupedData).map(([name, data], index) => ({
//       name,
//       value: data.value,
//       female: data.female,
//       male: data.male,
//       color: ["#AFC0FF", "#9FD0FF", "#93c5fd", "#2563eb"][index % 4], // Assign different colors
//     }));
//   };

//   const handleWeekChange = (startDate: Date, endDate: Date) => {
//     setWeekRange({ startDate, endDate });
//   };

//   if (!mounted) return null;
//   const data = [
//     { name: "Islamic Studies", value: 60, color: "#fbbf24" },
//     { name: "Arabic", value: 110, color: "#3b82f6" },
//     { name: "Quran", value: 80, color: "#a855f7" },
//   ];

//   const totalApplications = dashboardCounts.totalApplication || 0;
//   const totalShortlisted = dashboardCounts.shortlisted || 0;
//   const totalRejected = dashboardCounts.rejected || 0;

//   const total = totalApplications + totalShortlisted + totalRejected + 100; // Adjusted to account for total applications, shortlisted, and rejected

//   const percentageApplications = (totalApplications / total) * 100;
//   const percentageShortlisted = (totalShortlisted / total) * 100;
//   const percentageRejected = (totalRejected / total) * 100;
//   const percentageValue = 100;

//   const remainingApplications = 100 - percentageApplications;
//   const remainingShortlisted = 100 - percentageShortlisted;
//   const remainingRejected = 100 - percentageRejected;
//   console.log(remainingApplications);
//   return (
//     <BaseLayout3 >
//       <div className="flex flex-col h-screen w-full">
//         {/* //////Cards count Start ////////// */}
//         <div className="flex">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
//             <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
//               <h3 className="text-[#010E30] font-medium text-[14px]  mb-2">
//                 Total <br /> Applications
//               </h3>
//               <div className="flex items-center">
//                 <div className="flex mt-0 gap-4">
//                   <span className="text-[28px] text-[#010E30] font-semibold">
//                     {dashboardCounts.totalApplication}
//                   </span>
//                   {/* <span className="flex items-center mt-1 bg-green-100 text-green-600 text-[10px] font-semibold px-2 py-[2px] rounded-full w-fit">
//                     ↑ 12%
//                   </span> */}
//                 </div>

//                 <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
//                   <div className="relative w-[90px] h-[90px]">
//                     <PieChart width={90} height={90}>
//                       {/* Background ring */}
//                       <Pie
//                         data={[{ value: 100 }]}
//                         dataKey="value"
//                         innerRadius={30}
//                         outerRadius={38}
//                         startAngle={90}
//                         endAngle={-270}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#E6EFF2" />
//                       </Pie>

//                       {/* Foreground ring */}
//                       <Pie
//                         data={[{ value: 76 }, { value: 24 }]}
//                         dataKey="value"
//                         innerRadius={28}
//                         outerRadius={42}
//                         startAngle={90}
//                         endAngle={-270}
//                         cornerRadius={2}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#7DB5CB" />
//                         <Cell fill="transparent" />
//                       </Pie>
//                     </PieChart>

//                     {/* Centered Percentage Text */}
//                     <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
//                       {percentageValue}%
//                     </div>
//                   </div>
//                 </div>


//               </div>
//             </div>

//             <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
//               <h3 className="text-[#010E30] text-[14px] font-medium   mb-2">
//                 Shortlisted <br /> Candidates
//               </h3>
//               <div className="flex items-center">
//                 <div className="flex mt-0 gap-4">
//                   <span className="text-[28px] text-[#010E30] font-semibold">
//                     {dashboardCounts.shortlisted}
//                   </span>
//                   {/* <span className="text-red-500 text-xs flex items-center gap-1">
//                     <span className="text-[10px]">↓</span> 16%
//                   </span> */}
//                 </div>
//                 <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
//                   <div className="relative w-[90px] h-[90px]">
//                     <PieChart width={90} height={90}>
//                       {/* Background ring */}
//                       <Pie
//                         data={[{ value: 100 }]}
//                         dataKey="value"
//                         innerRadius={30}
//                         outerRadius={38}
//                         startAngle={90}
//                         endAngle={-270}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#9AD7D633" /> {/* 20% opacity */}
//                       </Pie>

//                       {/* Foreground ring */}
//                       <Pie
//                         data={[{ value: 76 }, { value: 24 }]}
//                         dataKey="value"
//                         innerRadius={28}
//                         outerRadius={42}
//                         startAngle={90}
//                         endAngle={-270}
//                         cornerRadius={2}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#9AD7D6" />
//                         <Cell fill="transparent" />
//                       </Pie>
//                     </PieChart>

//                     {/* Centered Percentage Text */}
//                     <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
//                       {percentageValue}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-lg w-[270px] h-[132px]">
//               <h3 className="text-[#010E30] text-[14px] font-medium  mb-2">
//                 Rejected <br /> Candidates
//               </h3>
//               <div className="flex items-center">
//                 <div className="flex mt-0 gap-4">
//                   <span className="text-[28px] text-[#010E30] font-semibold">
//                     {dashboardCounts.rejected}
//                   </span>
//                   {/* <span className="flex items-center mt-1 bg-green-100 text-green-600 text-[10px] font-semibold px-2 py-[2px] rounded-full w-fit">
//                     ↑ 14%
//                   </span> */}
//                 </div>
//                 <div className="w-[90px] h-[90px] ml-[120px] -mt-10">
//                   <div className="relative w-[90px] h-[90px]">
//                     <PieChart width={90} height={90}>
//                       {/* Background ring */}
//                       <Pie
//                         data={[{ value: 100 }]}
//                         dataKey="value"
//                         innerRadius={30}
//                         outerRadius={38}
//                         startAngle={90}
//                         endAngle={-270}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#0D356D33" />
//                       </Pie>

//                       {/* Foreground ring */}
//                       <Pie
//                         data={[{ value: 76 }, { value: 24 }]}
//                         dataKey="value"
//                         innerRadius={28}
//                         outerRadius={42}
//                         startAngle={90}
//                         endAngle={-270}
//                         cornerRadius={2}
//                         isAnimationActive={false}
//                       >
//                         <Cell fill="#8B93D2" />
//                         <Cell fill="transparent" />
//                       </Pie>
//                     </PieChart>

//                     {/* Centered Percentage Text */}
//                     <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333]">
//                       {percentageValue}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//         {/* /////Cards count End ///// */}


//         <div className="flex gap-2 mt-2">
//           {/* Application Chart Starts */}
//           <div>
//             <ApplicationChart />
//           </div>
//           {/* Application Chart Ends */}
//           {/* Subject Pie Chart  Starts*/}
//           <div className="bg-white p-4 rounded-xl shadow-md w-[269px] h-[270px] flex flex-col items-center">
//             {/* Header */}
//             <div className="w-full flex justify-between items-center mb-2">
//               <h3 className="text-[#010E30] text-[16px] font-semibold sm:text-sm">Subject</h3>
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-pink-400 rounded-sm"></div>
//                   <span className="text-[10px] font-normal text-[#010E30]">Female</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
//                   <span className="text-[10px] font-normal text-[#010E30]">Male</span>
//                 </div>
//               </div>
//             </div>

//             {/* Pie Chart Centered */}
//             <div className="flex justify-center items-center w-full mb-2">
//               <PieChart width={150} height={150}>
//                 <Tooltip
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length) {
//                       const item = payload[0].payload;
//                       return (
//                         <div className="bg-white shadow-md rounded px-2 py-1 text-xs text-gray-700">
//                           <div className="font-semibold">{item.name}</div>
//                           <div>Female: {item.female}%</div>
//                           <div>Male: {item.male}%</div>
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={40}
//                   outerRadius={60}
//                   dataKey="value"
//                 >
//                   {pieData.map((entry) => (
//                     <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                   ))}
//                   {/* Center Label */}
//                   <Label
//                     value="100%"
//                     position="center"
//                     fill="#1e293b" // slate-800
//                     style={{ fontSize: '16px', fontWeight: 'bold' }}
//                   />
//                 </Pie>
//               </PieChart>
//             </div>

//             {/* Legend Below Chart */}
//             {/* Bottom Labels (Legend) */}
//             {/* Bottom Labels (Legend) */}
//             <div className="grid grid-cols-3 gap-2 text-[11px] w-full mt-2">
//               {pieData.map((item) => (
//                 <div key={item.name} className="flex flex-col items-center">
//                   {/* Subject Name with Color Dot */}
//                   <div className="flex items-center gap-1">
//                     <div
//                       className="w-3 h-3 rounded bg-white border"
//                       style={{ backgroundColor: item.color }}
//                     ></div>
//                     <span className="font-semibold text-gray-800 text-xs">{item.name}</span>
//                   </div>

//                   {/* Female & Male Percentages with Colored Dots */}
//                   <div className="flex gap-2 mt-1 items-center">
//                     {/* Female */}
//                     <div className="flex items-center gap-1">
//                       <div className="w-1 h-3 bg-pink-400 rounded-full"></div>
//                       <span className="text-pink-400 font-semibold">
//                         {String(item.female).padStart(2, '0')}%
//                       </span>
//                     </div>

//                     {/* Male */}
//                     <div className="flex items-center gap-1">
//                       <div className="w-1 h-3 bg-blue-400 rounded-full"></div>
//                       <span className="text-blue-400 font-semibold">
//                         {String(item.male).padStart(2, '0')}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>


//           </div>
//           {/* Subject Pie Chart  Ends*/}
//         </div>



//         {/* Table starts */}
// <div className="bg-white  rounded-lg h-[calc(390px-2rem)] shadow-lg w-[835px] mt-4">
//   {/* Table */}
//   <div className="overflow-x-auto scrollbar-none rounded-xl h-[calc(40vh-2rem)] gap-5">
//     <table className="w-full text-xs border-collapse">
//       {/* Table Head */}
//       <thead className="sticky top-0 z-10 bg-[#4C6993] text-white text-[12px]">
//         <tr className="bg-[#4C6993] text-[#FFFFFF] text-[12px]">
//           {[
//             "Name",
//             "Contact",
//             "Country",
//             "Course",
//             "Gender",
//             "Date",
//             "Time",
//             "Resume",
//             "Status",
//           ].map((col) => (
//             <th
//               key={col}
//               className="py-2 px-2 font-semibold text-center"
//             >
//               {col}{" "}
//             </th>
//           ))}
//         </tr>
//       </thead>

//       {/* Table Body */}
//       <tbody>
//         {applicants.map((applicant) => (
//           <tr
//             key={applicant._id}
//             className="hover:bg-gray-100 text-[9px]"
//           >
//             <td className="py-2 px-2 text-center t ">
//               {applicant.candidateFirstName}
//             </td>
//             <td className="py-2 px-2 text-center">
//               {applicant.candidatePhoneNumber}
//             </td>
//             <td className="py-2 px-2 text-center">
//               {applicant.candidateCountry}
//             </td>
//             <td className="py-2 px-2 text-center">
//               {applicant.positionApplied}
//             </td>
//             <td className="py-2 px-2 text-center">
//               {applicant.gender}
//             </td>

//             <td className="py-2 px-2 text-center">
//               {formatDate(applicant.applicationDate)}
//             </td>
//             <td className="py-2 px-2 text-center">
//               {applicant.preferedWorkingHours}
//             </td>
//             <td className="py-2 px-2 text-center">
//               <button className="text-blue-600  flex items-center gap-1">
//                 📎 Resume
//               </button>
//             </td>
//             <td className="py-2 px-2 text-center">
//               <span className="px-2 py-1 text-gray-800 rounded-full">
//                 {applicant.applicationStatus}
//               </span>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>
//         {/* Table ends */}


//         {/* calendar start */}
//         <aside className="w-[310px] h-[314px] hidden lg:block space-y-[16px] mt-1">
//           {/* Calendar Section */}
//           <div className="bg-[#fff] p-2 rounded-lg shadow w-[310px] h-[314px]">
//             {/* Calendar Header */}
//             {/* Calendar Section */}
//             <div className="bg-[#fff] p-2 rounded-lg">
//               {/* Calendar Header */}
//               <div className="relative flex flex-col items-center pb-2">
//                 <div className="w-full h-5 bg-gray-300 rounded-t-md"></div>
//                 <h3 className="text-sm font-semibold text-gray-700 mt-1">
//                   {`${currentMonth}, ${currentYear}`}
//                 </h3>
//               </div>

//               {/* Days of the Week */}
//               <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mt-2">
//                 {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
//                   <div key={day}>{day}</div>
//                 ))}
//               </div>

//               {/* Calendar Dates */}
//               <div className="grid grid-cols-7 gap-1 text-center mt-1">
//                 {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
//                   <button
//                     key={date}
//                     className={`p-2 text-xs rounded-md ${meetingDays.includes(date)
//                       ? "bg-blue-900 text-white font-semibold"
//                       : "text-gray-700"
//                       }`}
//                   >
//                     {date}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Teachers Section */}
//           <div className="bg-white p-2 h-[216px] rounded-xl shadow-lg w-[310px]">
//             <h3 className="text-[13px] font-semibold text-gray-800 mb-1">
//               Teachers
//             </h3>

//             <div className="flex items-center justify-between">
//               {/* Circular Chart */}
//               <div className="relative w-[90px] h-[90px] flex items-center justify-center mb-5">
//                 <PieChart width={90} height={90}>
//                   <Pie
//                     data={data}
//                     cx={45}
//                     cy={45}
//                     innerRadius={25}
//                     outerRadius={35}
//                     startAngle={90}
//                     endAngle={-270}
//                     dataKey="value"
//                   >
//                     {data.map((entry) => (
//                       <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>

//                 {/* Centered Total Teachers Count */}
//                 <div className="absolute flex flex-col items-center justify-center">
//                   <span className="mt-3 ml-2 text-xs font-bold text-gray-900 "></span>
//                   <p className="ml-3 text-[8px] text-gray-500">Teachers</p>
//                 </div>
//               </div>

//               {/* Teacher Stats */}
//               <div className="space-y-2">
//                 {filteredPositions.map((item) => (
//                   <div
//                     key={item.name}
//                     className="flex items-center justify-between w-32 bg-gray-100 p-1 rounded-lg"
//                   >
//                     <div className="flex items-center gap-1">
//                       <div
//                         className="w-2 h-2 rounded-full"
//                         style={{ backgroundColor: item.color }}
//                       ></div>
//                       <span className="text-[10px] font-semibold text-gray-800">
//                         {item.name}
//                       </span>
//                     </div>
//                     <span className="text-gray-600 text-[10px] font-medium">
//                       {item.count}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Schedule Section */}
//           <div className="bg-white p-2 rounded-lg h-[352px] w-[310px]">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="text-[13px] font-semibold text-gray-700">
//                 Schedule
//               </h3>
//               <button className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1 text-[10px]">
//                 Today <span className="text-gray-500">▼</span>
//               </button>
//             </div>

//             <div className="space-y-3 overflow-y-scroll h-[15vh] scrollbar-none">
//               {todayMeetings.map((item) => (
//                 <div key={item.title} className="flex items-start gap-2">
//                   <span className="text-[10px] text-gray-500 w-8">
//                     {item.time}
//                   </span>
//                   <div
//                     className={`flex items-center px-3 py-2 rounded-lg flex-1 ${item.color} text-[10px] font-medium`}
//                   >
//                     <span className="mr-2 text-[10px]">📅</span> {item.title}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </aside>
//         {/* calendar ends */}
//       </div>
//     </BaseLayout3>
//   );
// }













"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, User } from "lucide-react";
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

  const renderCustomizedLabel = ({ percent }) => {
  return `${(percent * 100).toFixed(0)}%`;
};



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
        {/* Header - Made more compact on small screens */}
        

        <div className="flex flex-1 min-h-0">
          <main className="flex-1 p-2 sm:p-3">
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

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-[20px] mb-2 w-full">
              {/* Header */}
              <div className="flex gap-2 mt-2">
                {/* Application Chart Starts */}
                <div>
                  <ApplicationChart />
                </div>
                {/* Application Chart Ends */}
                {/* Subject Pie Chart  Starts*/}
                <div className="bg-[#FFFFFF] w-[310px] h-[270px] rounded-2xl shadow-md flex flex-col items-center px-3 py-2 gap-1">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <h3 className="text-[#010E30] text-[13px] font-semibold">Subject</h3>
        <div className="flex gap-1">
          <div className="flex items-center gap-[3px]">
            <div className="w-[6px] h-[6px] bg-pink-400 rounded-sm"></div>
            <span className="text-[9px] text-[#010E30]">Female</span>
          </div>
          <div className="flex items-center gap-[3px]">
            <div className="w-[6px] h-[6px] bg-blue-400 rounded-sm"></div>
            <span className="text-[9px] text-[#010E30]">Male</span>
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
                    <div className="font-semibold">{item.name}</div>
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
            label={renderCustomizedLabel}
            labelLine={false}
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
          <div key={item.name} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-[1px]">
              <div
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[9px] font-semibold text-[#010E30]">{item.name}</span>
            </div>
            <div className="flex gap-1 mt-[2px]">
              <div className="flex flex-col items-center gap-[1px]">
                <div className="w-[3px] h-[8px] bg-pink-400 rounded-[2px]"></div>
                <span className="text-[8px] font-medium">{item.female}%</span>
              </div>
              <div className="flex flex-col items-center gap-[1px]">
                <div className="w-[3px] h-[8px] bg-blue-400 rounded-sm"></div>
                <span className="text-[8px] font-medium">{item.male}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>



                {/* Subject Pie Chart  Ends*/}
              </div>
            </div>

            <div className="bg-white  rounded-lg h-[calc(390px-2rem)] shadow-lg w-[835px] mt-4">
              {/* Table */}
              <div className="overflow-x-auto scrollbar-none rounded-xl h-[calc(40vh-2rem)] gap-5">
                <table className="w-full text-xs border-collapse">
                  {/* Table Head */}
                  <thead className="sticky top-0 z-10 bg-[#4C6993] text-white text-[12px]">
                    <tr className="bg-[#4C6993] text-[#FFFFFF] text-[12px]">
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
                          className="py-2 px-2 font-semibold text-center"
                        >
                          {col}{" "}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {applicants.map((applicant) => (
                      <tr
                        key={applicant._id}
                        className="hover:bg-gray-100 text-[9px]"
                      >
                        <td className="py-2 px-2 text-center t ">
                          {applicant.candidateFirstName}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {applicant.candidatePhoneNumber}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {applicant.candidateCountry}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {applicant.positionApplied}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {applicant.gender}
                        </td>

                        <td className="py-2 px-2 text-center">
                          {formatDate(applicant.applicationDate)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {applicant.preferedWorkingHours}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button className="text-blue-600  flex items-center gap-1">
                            📎 Resume
                          </button>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-1 text-gray-800 rounded-full">
                            {applicant.applicationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <aside className="w-[310px] h-[314px] hidden lg:block space-y-[16px] mt-3">
            {/* Calendar Section */}
      <div className="bg-[#fff] p-2 rounded-lg shadow h-[230px]">
  {/* Calendar Section */}
  <div className="bg-[#fff] p-2 rounded-lg h-full flex flex-col">
    {/* Calendar Header */}
    <div className="relative flex flex-col items-center pb-1">
      {/* <div className="w-full h-4 bg-gray-300 rounded-t-md"></div> */}
      <h3 className="text-xs font-semibold text-gray-700 mt-1">
        {`${currentMonth}, ${currentYear}`}
      </h3>
    </div>
<br/>
    {/* Days of the Week */}
    <div className="grid grid-cols-7 gap-[2px] text-[10px] text-center text-gray-500 mt-1">
      {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>

    {/* Calendar Dates */}
    <div className="grid grid-cols-7 gap-[2px] text-center mt-1 text-[10px]">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
        <button
          key={date}
          className={`py-1 rounded-[4px] transition duration-150 ${
            meetingDays.includes(date)
              ? "bg-blue-900 text-white font-semibold"
              : "text-gray-700"
          }`}
          onMouseEnter={(e) => {
            if (!meetingDays.includes(date)) {
              e.currentTarget.style.backgroundColor = "#5882BE";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            if (!meetingDays.includes(date)) {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.color = "";
            }
          }}
        >
          {date}
        </button>
      ))}
    </div>
  </div>
</div>


            {/* Teachers Section */}
            <div className="bg-white p-2 h-[200px] rounded-xl shadow-lg">
              <h3 className="text-[13px] font-semibold text-gray-800 mb-1">
                Teachers
              </h3>

              <div className="flex items-center justify-between">
                {/* Circular Chart */}
                <div className="relative w-[90px] h-[90px] flex items-center justify-center mb-5">
                  <PieChart width={90} height={90}>
                    <Pie
                      data={data}
                      cx={45}
                      cy={45}
                      innerRadius={25}
                      outerRadius={35}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>

                  {/* Centered Total Teachers Count */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="mt-3 ml-2 text-xs font-bold text-gray-900 "></span>
                    <p className="ml-3 text-[8px] text-gray-500">Teachers</p>
                  </div>
                </div>

                {/* Teacher Stats */}
                <div className="space-y-2">
                  {filteredPositions.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between w-32 bg-gray-100 p-1 rounded-lg"
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-[10px] font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-gray-600 text-[10px] font-medium">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-white p-2 rounded-lg h-[389px]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[13px] font-semibold text-gray-700">
                  Schedule
                </h3>
                <button className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1 text-[10px]">
                  Today <span className="text-gray-500">▼</span>
                </button>
              </div>

              <div className="space-y-3 overflow-y-scroll h-[15vh] scrollbar-none">
                {todayMeetings.map((item) => (
                  <div key={item.title} className="flex items-start gap-2">
                    <span className="text-[10px] text-gray-500 w-8">
                      {item.time}
                    </span>
                    <div
                      className={`flex items-center px-3 py-2 rounded-lg flex-1 ${item.color} text-[10px] font-medium`}
                    >
                      <span className="mr-2 text-[10px]">📅</span> {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BaseLayout3>
  );
}
