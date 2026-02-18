// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { CountryDropdown } from "react-country-region-selector";
// import ISO6391 from "iso-639-1";
// import {
//   CalendarDays,
//   Clock3,
//   Trash2,
//   PlusCircle,
//   CheckCircle,
// } from "lucide-react";
// import TimezoneSelect from "react-timezone-select";
// import { getSocket } from "@/app/utils/socket";
// import moment from "moment";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface AcademicCoach {
//   academicCoachId: string; // Assuming it's a string or number
//   name: string;
//   role: string;
//   email: string;
// }

// interface StudentData {
//   _id: string; // Assuming _id is a string, or use ObjectId if you're using MongoDB
//   studentId:string;
//   firstName: string;
//   lastName: string;
//   academicCoach: AcademicCoach;
//   email: string;
//   gender: string; // Assuming it's a string
//   phoneNumber: string;
//   city: string; // If it's a number, you can change this to `number`
//   country: string;
//   countryCode: string; // Assuming it's a string
//   learningInterest: string; // Assuming it's a string, could be an array of strings if needed
//   numberOfStudents: number; // Assuming this is a number
//   preferredTeacher: string; // Assuming it's a string, or can be an object if needed
//   preferredFromTime: string; // Or use `Date` if it's a Date object
//   preferredToTime: string; // Or use `Date` if it's a Date object
//   timeZone: string; // Assuming it's a string
//   referralSource: string; // Assuming it's a string, could be an enum if fixed
//   startDate: string; // Or use `Date` if it's a Date object
//   evaluationStatus: string; // Assuming it's a string (e.g., "Completed", "Pending")
//   status: string; // Assuming it's a string (e.g., "Active", "Inactive")
//   createdDate: string; // Or use `Date` if it's a Date object
//   createdBy: string; // Assuming it's a string (could be an object or ID if needed)
//   lastUpdatedBy: string; // Same as createdBy
//   lastUpdatedDate: string; // Or use `Date` if it's a Date object
// }

// // Interface for Evaluation Data
// interface EvaluationData {
//   studentId: string;
//   studentFirstName: string;
//   studentLastName: string;
//   studentEmail: string;
//   studentGender: string;
//   studentCity: string;
//   studentPhone: number;
//   studentCountry: string;
//   studentCountryCode: string;
//   learningInterest: string;
//   numberOfStudents: number;
//   preferredTeacher: string;
//   preferredFromTime: string;
//   preferredToTime: string;
//   timeZone: string;
//   referralSource: string;
//   preferredDate: Date;
//   evaluationStatus: string;
//   status: string;
//   createdDate: Date;
//   createdBy: string;
// }

// // Step 1 Component
// const Step1: React.FC<{ nextStep: (data: any) => void }> = ({ nextStep }) => {
//   const steps = [
//     {
//       id: "step1",
//       step: "1",
//       title: "Clarify",
//       description: "Clarify your interest from our experienced teacher",
//       color: "bg-gradient-to-br from-purple-600 to-blue-600",
//       icon: "👋",
//     },
//     {
//       id: "step2",
//       step: "2",
//       title: "Assess",
//       description: "Assess your level with our best evaluation test exams",
//       color: "bg-gradient-to-br from-blue-500 to-teal-400",
//       icon: "🖊️",
//     },
//     {
//       id: "step3",
//       step: "3",
//       title: "Schedule",
//       description: "Schedule a time for your evaluation",
//       color: "bg-gradient-to-br from-orange-400 to-pink-500",
//       icon: "📅",
//     },
//     {
//       id: "step4",
//       step: "4",
//       title: "Question",
//       description: "Ask and clarify all your doubts",
//       color: "bg-gradient-to-br from-red-500 to-purple-500",
//       icon: "❓",
//     },
//   ];

//   const handleStartEvaluations = () => {
//     console.log("1>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...");
//     const validData = {
//       /* your valid data here */
//     };
//     nextStep(validData);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden p-6">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//          src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
//           Purpose of{" "}
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             Evaluation
//           </span>
//         </h1>
//         <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
//           Begin your learning journey with a personalized evaluation process
//           designed just for you.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {steps.map((item) => (
//             <div
//               key={item.id}
//               className="group relative rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
//             >
//               <div
//                 className={`absolute inset-0 ${item.color} opacity-90`}
//               ></div>
//               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

//               <div className="relative p-6 h-full flex flex-col items-center text-center">
//                 <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
//                   {item.icon}
//                 </div>
//                 <h2 className="text-xl font-bold text-white mb-2">
//                   {item.title}
//                 </h2>
//                 <p className="text-white/80 text-sm">{item.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <p className="text-gray-400 text-sm mb-6">
//             Unlocking Knowledge Anywhere Anytime Lets Learn Together
//           </p>
//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full
//                      font-semibold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 
//                      transition-all duration-200 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 
//                      focus:ring-offset-gray-900"
//             onClick={handleStartEvaluations}
//           >
//             Start Evaluations →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 2 Component

// // Step 2 Component
// const Step2: React.FC<{
//   prevStep: () => void;
//   nextStep: (data: StudentData) => void;
//   studentDatas?: StudentData;
// }> = ({ prevStep, nextStep, studentDatas }) => {
//   const [studentData, setStudentData] = useState<StudentData>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   // Make details editable in Step2 and propagate to later steps
//   const [editableStudentData, setEditableStudentData] = useState<StudentData | null>(null);
//   const id = window.location.href;
//   const queryString = id.split("?")[1]; // Extract the query string
//   const params = new URLSearchParams(queryString);
//   const studentId = params.get("studentId");

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);
//         const token =
//           typeof window !== "undefined"
//             ? localStorage.getItem("AcademicCoachAuthToken")
//             : null;

//         if (!token) {
//           console.error("❌ AdminAuthToken not found");
//           return;
//         }
//         const response = await fetch(
//           `https://api.blackstoneinfomaticstech.com/studentlist/${studentId}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("response>>>", response);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("Fetched student data:", data);
//         setStudentData(data);
//         setEditableStudentData(data); // initialize editable copy
//         localStorage.setItem("studentData", JSON.stringify(data));
//         console.log(studentData);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//         setError(error instanceof Error ? error.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, []);

//   const handleStudentDataChange = (field: keyof StudentData, value: any) => {
//     setEditableStudentData((prev) => (prev ? { ...prev, [field]: value } as StudentData : prev));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
//         <div className="text-white text-xl">Loading student data...</div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
//         <div className="text-red-500 text-xl">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!studentData || !editableStudentData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
//         <div className="text-white text-xl">No student data available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//           Student Details
//         </h1>

//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
//           <div
//             key={editableStudentData.email || editableStudentData.phoneNumber?.toString()}
//             className="mb-8 last:mb-0"
//           >
//             <h2 className="text-2xl font-semibold text-white mb-4">
//               {editableStudentData.firstName || "N/A"} {editableStudentData.lastName || "N/A"}
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[
          
//                 { label: "Email", field: "email", type: "email" },
//                 { label: "Phone Number", field: "phoneNumber", type: "tel" },
//                 { label: "City", field: "city", type: "text" },
//                 { label: "Country", field: "country", type: "text" },
//                 { label: "Country Code", field: "countryCode", type: "text" },
//                 { label: "Learning Interest", field: "learningInterest", type: "text" },
//                 { label: "Number of Students", field: "numberOfStudents", type: "number" },
//                 { label: "Preferred Teacher", field: "preferredTeacher", type: "text" },
//                 { label: "Preferred From Time", field: "preferredFromTime", type: "time" },
//                 { label: "Preferred To Time", field: "preferredToTime", type: "time" },
//                 { label: "Time Zone", field: "timeZone", type: "text" },
//                 { label: "Referral Source", field: "referralSource", type: "text" },
//                 { label: "Evaluation Status", field: "evaluationStatus", type: "text" },
//               ].map(({ label, field, type }) => (
//                 <div key={label} className="group">
//                   <div className="flex items-center space-x-2 mb-1">
//                     <span className="text-white/60 group-hover:text-white/90 transition-colors">
//                       {label === "Email"
//                         ? "📧"
//                         : label === "Phone Number"
//                         ? "📞"
//                         : label.includes("Time")
//                         ? "⏰"
//                         : label === "City" || label === "Country" || label === "Country Code"
//                         ? "🌍"
//                         : label === "Time Zone"
//                         ? "🌐"
//                         : label === "Referral Source"
//                         ? "📢"
//                         : label === "Preferred Teacher"
//                         ? "👨‍🏫"
//                         : label === "Number of Students"
//                         ? "👥"
//                         : label === "Evaluation Status"
//                         ? "📋"
//                         : ""}
//                     </span>
//                     <label className="text-sm font-semibold text-white/60 group-hover:text-white/90 transition-colors">
//                       {label}
//                     </label>
//                   </div>
//                   <input
//                     type={type}
//                     value={(editableStudentData as any)[field] ?? ""}
//                     onChange={(e) =>
//                       handleStudentDataChange(field as keyof StudentData, type === "number" ? Number(e.target.value) : e.target.value)
//                     }
//                     className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white
//                        focus:bg-white/10 focus:border-white/20 focus:ring-2 focus:ring-purple-500/20
//                        transition-all duration-200"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex items-center justify-between mt-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           <button
//             onClick={() => {
//               console.log("Passing edited studentData to next step:", editableStudentData);
//               nextStep(editableStudentData as StudentData);
//             }}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-gradient-to-r from-blue-500 to-purple-500 
//                      hover:from-blue-600 hover:to-purple-600 rounded-lg group"
//           >
//             <span>Next</span>
//             <span className="transform group-hover:translate-x-1 transition-transform duration-300">
//               →
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 3 Component
// const Step3 = ({
//   prevStep,
//   nextStep,
//   studentData,
// }: {
//   prevStep: () => void;
//   nextStep: (studentData: StudentData) => void;
//   studentData: StudentData;
// }) => {
//   console.log("Student Data in Step3:", studentData);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//          src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {studentData.firstName}&nbsp;{studentData.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         {/* Skills Selection */}
//         <div className="flex items-center justify-between mb-12">
//           <div className="relative group">
//             <select
//               className="appearance-none bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg
//                            border border-white/20 focus:border-white/30 focus:ring-2 focus:ring-purple-500/20
//                            transition-all duration-200 pr-12"
//             >
//               <option>Skills: Arabic</option>
//               <option>Skills: English</option>
//               <option>Skills: French</option>
//             </select>
//             <div
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none
//                           group-hover:text-white/90 transition-colors"
//             >
//               ▼
//             </div>
//           </div>
//           <div
//             className="text-white/80 font-medium px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg
//                          border border-white/20"
//           >
//             Skills: Reading & Listening
//           </div>
//         </div>

//         {/* Word Display Card */}
//         <div
//           className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center mb-12
//                      transform hover:scale-105 transition-all duration-300"
//         >
//           <h1 className="text-3xl font-bold text-white mb-8">
//             Read the following word
//           </h1>
//           <div className="relative">
//             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur"></div>
//             <div className="relative bg-gray-900 rounded-lg p-8">
//               <div
//                 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
//                            from-blue-400 to-purple-400 arabic-text"
//               >
//                 رسلها
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Audio Controls */}
//         <div className="flex justify-center mb-12">
//           <button
//             className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full
//                          hover:bg-white/20 transition-all duration-200 group"
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white/60 group-hover:text-white/90">
//                 🎙️
//               </span>
//               <span className="text-white/80 group-hover:text-white">
//                 Click to Record
//               </span>
//             </div>
//           </button>
//         </div>

//         {/* Navigation Buttons - Add this at the bottom of the main content div */}
//         <div className="flex items-center justify-between mt-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                        bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           {/* Progress Indicators */}
//           <div className="flex space-x-2">
//             {Array.from({ length: 5 }, (_, index) => (
//               <div
//                 key={index}
//                 className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
//                   index === 1
//                     ? "bg-gradient-to-r from-blue-400 to-purple-400 w-8"
//                     : "bg-white/20"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                      hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                      flex items-center space-x-2"
//             onClick={() => {
//               nextStep(studentData);
//             }}
//           >
//             <span>Next</span>
//             <span>→</span>
//           </button>
//         </div>
//       </div>

//       {/* Optional: Add floating decorative elements */}
//       <div className="absolute top-20 right-20 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
//       <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
//     </div>
//   );
// };
// // Step 4 Component
// const Step4 = ({
//   prevStep,
//   nextStep,
//   studentData,
// }: {
//   prevStep: () => void;
//   nextStep: (studentData: StudentData) => void;
//   studentData: StudentData;
// }) => {
//   const [time, setTime] = useState(120); // 120 seconds = 2 minutes
//   const [isActive, setIsActive] = useState(false);
//   console.log(studentData);
//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;
//     if (isActive && time > 0) {
//       intervalId = setInterval(() => {
//         setTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }
//     if (time === 0) {
//       setIsActive(false);
//     }
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isActive, time]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleStart = () => {
//     setTime(120);
//     setIsActive(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {studentData.firstName}&nbsp;{studentData.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         {/* Skills Selection */}
//         <div className="flex items-center justify-between mb-12">
//           <div className="relative group">
//             <select
//               className="appearance-none bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg
//                            border border-white/20 focus:border-white/30 focus:ring-2 focus:ring-purple-500/20
//                            transition-all duration-200 pr-12"
//             >
//               <option>Skills: Arabic</option>
//               <option>Skills: English</option>
//               <option>Skills: French</option>
//             </select>
//             <div
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none
//                           group-hover:text-white/90 transition-colors"
//             >
//               ▼
//             </div>
//           </div>
//           <div
//             className="text-white/80 font-medium px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg
//                          border border-white/20"
//           >
//             Skills: Speaking
//           </div>
//         </div>

//         {/* Timer Card */}
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center mb-12">
//           <h1
//             className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
//                       from-blue-400 to-purple-400 mb-8"
//           >
//             Talk about yourself within two minutes
//           </h1>

//           {/* Timer Display */}
//           <div className="relative mb-12">
//             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md"></div>
//             <div className="relative bg-gray-900/80 backdrop-blur-md rounded-full p-8 inline-block">
//               <div
//                 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
//                            from-blue-400 to-purple-400 tabular-nums"
//               >
//                 {formatTime(time)}
//               </div>
//             </div>
//           </div>

//           {/* Recording Button */}
//           <button
//             className={`relative group px-8 py-4 rounded-full transition-all duration-300 
//                      ${
//                        isActive
//                          ? "bg-red-500/20 hover:bg-red-500/30"
//                          : "bg-white/10 hover:bg-white/20"
//                      }`}
//             onClick={handleStart}
//             disabled={isActive}
//           >
//             <div className="flex items-center space-x-3">
//               {isActive && (
//                 <span className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
//               )}
//               <span
//                 className={`text-2xl ${
//                   isActive ? "text-red-400" : "text-white/60"
//                 } 
//                             group-hover:scale-110 transition-transform`}
//               >
//                 🎙️
//               </span>
//               <span className="text-white/80 group-hover:text-white">
//                 {isActive ? "Recording..." : "Click to Start Recording"}
//               </span>
//             </div>
//           </button>
//         </div>

//         {/* Navigation Buttons - Add this at the bottom of the main content div */}
//         <div className="flex items-center justify-between mt-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                        bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           {/* Progress Indicators */}
//           <div className="flex space-x-2">
//             {Array.from({ length: 5 }, (_, index) => (
//               <div
//                 key={index}
//                 className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
//                   index === 2
//                     ? "bg-gradient-to-r from-blue-400 to-purple-400 w-8"
//                     : "bg-white/20"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                      hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                      flex items-center space-x-2"
//             onClick={() => {
//               nextStep(studentData);
//             }}
//           >
//             <span>Next</span>
//             <span>→</span>
//           </button>
//         </div>
//       </div>

//       {/* Decorative Elements */}
//       <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
//       <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
//       {isActive && (
//         <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 transition-all duration-500"></div>
//       )}
//     </div>
//   );
// };

// // Step 5 Component
// const Step5 = ({
//   prevStep,
//   nextStep,
//   studentData,
// }: {
//   prevStep: () => void;
//   nextStep: (updatedStudentData: any) => void;
//   studentData: StudentData;
// }) => {
//   const [isLanguageChecked, setIsLanguageChecked] = useState(false);
//   const [isReadingChecked, setIsReadingChecked] = useState(false);
//   const [isGrammarChecked, setIsGrammarChecked] = useState(false);
//   const [languageLevel, setLanguageLevel] = useState("");
//   const [readingLevel, setReadingLevel] = useState("");
//   const [grammarLevel, setGrammarLevel] = useState<string>("");
//   const [accomplishmentTime, setAccomplishmentTime] = useState<number>(0);
//   const [studentRate, setStudentRate] = useState(0);
//   const [expectedFinishingDate] = useState(28);
//   const [subscriptionName, setSubscriptionName] = useState<string>();
//   const [planTotalPrice, setPlanTotalPrice] = useState<number>();
//   const [selectedHours, setSelectedHours] = useState<number>(0); 

//   // First, add state to track which plan's total is being calculated
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const [classType, setClassType] = useState<string | null>(null);

//   const handleSelect = (type: string) => {
//     setClassType(type.toUpperCase());
//   };
//   console.log(selectedPlan);
//   // Modify the calculatePrice function to return null if plan isn't selected
//   const calculatePrice = (rate: number, planLabel: string) => {
//     if (selectedPlan !== planLabel) {
//       return "";
//     }
//     return selectedHours * rate * 4;
//   };
//   useEffect(() => {
//     // Only set planTotalPrice when a plan is selected
//     if (selectedPlan) {
//       const plan = pricingPlans.find((p) => p.label === selectedPlan);
//       if (plan) {
//         const price = calculatePrice(plan.rate, plan.label);
//         setPlanTotalPrice(price || 0);
//       }
//     }
//   }, [selectedPlan, selectedHours]);

//   // Pricing plans data
//   const pricingPlans = [
//     { label: "Simple", rate: 8, basePrice: "$8/h" },
//     { label: "Essential", rate: 9, basePrice: "$9/h" },
//     { label: "Pro", rate: 11, basePrice: "$11/h" },
//     { label: "Elite", rate: 16, basePrice: "$16/h" },
//   ];
//   const handleNextStep = () => {
//     const updatedStudentData = {
//       ...studentData,
//       isLanguageChecked,
//       isReadingChecked,
//       isGrammarChecked,
//       languageLevel,
//       readingLevel,
//       grammarLevel,
//       accomplishmentTime,
//       studentRate,
//       expectedFinishingDate,
//       subscriptionName,
//       selectedHours,
//       planTotalPrice,
//       classType,
//     };
//     nextStep(updatedStudentData); // Pass updated data to nextStep
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {studentData.firstName}&nbsp;{studentData.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-2xl">
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
//           <h1 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             Arabic Language Course Selection
//           </h1>

//           <h2 className="text-white/90 font-light hover:text-white transition-colors mb-2">
//             Level
//           </h2>

//           {/* Level Section */}
//           <div className="flex items-center justify-between mb-2 bg-white/5 p-3 rounded-xl">
//             {/* My Beautiful Language Section */}
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   id="my-beautiful-language"
//                   checked={isLanguageChecked}
//                   onChange={(e) => setIsLanguageChecked(e.target.checked)}
//                   className="w-3 h-3 border-white/20 bg-white/10
//                            checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500
//                            focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//                 />
//                 &nbsp; &nbsp;
//                 <label
//                   htmlFor="my-beautiful-language"
//                   className="text-white/90 font-normal text-[12px] hover:text-white transition-colors"
//                 >
//                   My Beautiful Language
//                 </label>
//               </div>
//               {isLanguageChecked && (
//                 <select
//                   className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
//                                 focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]"
//                   onChange={(e) => setLanguageLevel(e.target.value)}
//                 >
//                    <option className="bg-gray-900">Select</option>
//                   <option className="bg-gray-900">Level: A1</option>
//                   <option className="bg-gray-900">Level: A2</option>
//                   <option className="bg-gray-900">Level: A3</option>
//                   <option className="bg-gray-900">Level: A4</option>
//                 </select>
//               )}
//             </div>

//             {/* Reading Section */}
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="reading"
//                 checked={isReadingChecked}
//                 onChange={(e) => setIsReadingChecked(e.target.checked)}
//                 className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label
//                 htmlFor="reading"
//                 className="text-white font-normal text-[12px]"
//               >
//                 Reading
//               </label>
//               {isReadingChecked && (
//                 <select
//                   className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
//                                 focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]"
//                   onChange={(e) => setReadingLevel(e.target.value)}
//                 >
//                   <option className="bg-gray-900">Select</option>
//                   <option className="bg-gray-900">1</option>
//                   <option className="bg-gray-900">2</option>
//                   <option className="bg-gray-900">3</option>
//                   <option className="bg-gray-900">4</option>
//                   <option className="bg-gray-900">5</option>
//                 </select>
//               )}
//             </div>

//             {/* Grammar Section */}
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="grammar"
//                 checked={isGrammarChecked}
//                 onChange={(e) => setIsGrammarChecked(e.target.checked)}
//                 className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label
//                 htmlFor="grammar"
//                 className="text-white font-normal text-[12px]"
//               >
//                 Grammar
//               </label>
//               {isGrammarChecked && (
//                 <select
//                   className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2
//                                 focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]"
//                   onChange={(e) => setGrammarLevel(e.target.value)}
//                 >
//                   <option className="bg-gray-900">Select</option>
//                   <option className="bg-gray-900">0</option>
//                   <option className="bg-gray-900">1</option>
//                   <option className="bg-gray-900">2</option>
//                   <option className="bg-gray-900">3</option>
//                   <option className="bg-gray-900">4</option>
//                   <option className="bg-gray-900">5</option>
//                 </select>
//               )}
//             </div>
//           </div>

//           {/* Hours Section */}
//           <div className="mb-4">
//             <h2 className="text-base font-light text-white/90 mb-2">
//               Select Preferred Hours / week
//             </h2>
//             <div className="flex flex-wrap gap-3">
//               {[1, 1.5, 2, 2.5, 3, 4, 5].map((hour) => (
//                 <button
//                   key={hour}
//                   onClick={() => {
//                     setSelectedHours(hour);
//                     setAccomplishmentTime(hour * 4);
//                     setStudentRate(hour);
//                   }}
//                   className={`px-4 py-1 rounded-xl transition-all duration-300 transform hover:scale-105
//                            ${
//                              hour === selectedHours
//                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
//                                : "bg-white/10 text-white/80 hover:bg-white/20"
//                            }`}
//                 >
//                   {hour}h
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Pricing Section */}
//           <div className="mb-2">
//             <h2 className="text-base font-light text-white/90 mb-2">
//               Select Preferred Pricing per month
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {pricingPlans.map((plan) => (
//                 <button
//                   key={plan.label}
//                   className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
//                   onClick={() => {
//                     if (selectedHours > 0) {
//                       setSelectedPlan(plan.label);
//                       setSubscriptionName(plan.label); // Set the selected plan when clicked
//                     } else {
//                       alert("Please select preferred hours first"); // Alert if no hours are selected
//                     }
//                   }}
//                 >
//                   <div
//                     className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 
//                             group-hover:opacity-100 transition-opacity duration-300"
//                   ></div>
//                   <div
//                     className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10
//                             group-hover:border-white/20 transition-all duration-300"
//                   >
//                     {/* Plan Name Section */}
//                     <div className="border-b border-white/10 pb-3 mb-3">
//                       <h3 className="text-sm font-bold text-white">
//                         {plan.label}
//                       </h3>
//                     </div>

//                     {/* Rate Per Hour Section */}
//                     <div className="border-b border-white/10 pb-3 mb-3">
//                       <div
//                         className="text-lg text-center font-bold text-transparent bg-clip-text bg-gradient-to-r 
//                                 from-blue-400 to-purple-400"
//                       >
//                         {plan.basePrice}
//                       </div>
//                     </div>

//                     {/* Total Section */}
//                     <div className="bg-white/5 rounded-lg p-3">
//                       <div className="text-sm text-white/60 mb-1">Total</div>
//                       <div className="text-xl font-semibold text-white">
//                         {(() => {
//                           if (
//                             selectedPlan === plan.label &&
//                             planTotalPrice !== undefined
//                           ) {
//                             return `$${planTotalPrice.toFixed(2)}`;
//                           }
//                           return ""; // Return an empty string if conditions are not met
//                         })()}
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Completion Section */}
//           <div className="flex flex-wrap items-center justify-between mt-3 bg-white/5 p-3 rounded-xl">
//             <div className="text-white/80 text-[12px]">
//               Accomplishment Time:{" "}
//               <span className="font-normal text-white text-[10px]">
//                 {accomplishmentTime} Hours
//               </span>
//             </div>
//             <div className="text-white/80 text-[12px]">
//               Your Rate:{" "}
//               <span className="font-normal text-white text-[10px]">
//                 {studentRate} hr/week
//               </span>
//             </div>
//             <div className="text-white/80 text-[12px]">
//               Expected Finishing Date:{" "}
//               <span className="font-normal text-[10px] text-white">
//                 28 Days
//               </span>
//             </div>
//           </div>
//           <div className="mb-2 mt-2">
//             <h2 className="text-base font-light text-white/90 mb-3">
//               Class Type :
//             </h2>
//             <div className="flex gap-3">
//               {["REGULARCLASS", "GROUPCLASS"].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => handleSelect(type)}
//                   className={`px-3 py-1 rounded-md text-sm font-light uppercase transition-colors duration-200
//               ${
//                 classType === type
//                   ? "bg-white text-black"
//                   : "bg-white/10 text-white hover:bg-white/20"
//               }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons - Add this at the bottom of the main content div */}
//         <div className="flex items-center justify-between mt-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                        bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           {/* Progress Indicators */}
//           <div className="flex space-x-2">
//             {Array.from({ length: 5 }, (_, index) => (
//               <div
//                 key={index}
//                 className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
//                   index === 3
//                     ? "bg-gradient-to-r from-blue-400 to-purple-400 w-8"
//                     : "bg-white/20"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                      hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                      flex items-center space-x-2"
//             onClick={handleNextStep}
//           >
//             <span>Next</span>
//             <span>→</span>
//           </button>
//         </div>
//       </div>

//       {/* Decorative Elements */}
//       <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
//       <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
//     </div>
//   );
// };
// const Step6 = ({
//   prevStep,
//   nextStep,
//   updatedStudentData,
// }: {
//   prevStep: (updatedStudentData: any) => void;
//   nextStep: (updatedStudentDatas: any) => void;
//   updatedStudentData: any;
// }) => {
//   console.log(updatedStudentData);
//   interface TimeSlot {
//     startTime: string;
//     endTime: string;
//   }

//   interface ScheduleItem {
//     day: string;
//     times: TimeSlot[];
//     isSelected: boolean;
//   }
//   const [teachers, setTeachers] = useState<TeacherList[]>([]);
//   interface TeacherList {
//     teacherId: string;
//     teacherName: string;
//   }
//   interface Teacher {
//     _id: string;
//     userName: string;
//     email: string;
//     password: string;
//     role: string[];
//     profileImage: string | null;
//     status: string;
//     createdBy: string;
//     lastUpdatedBy: string;
//     userId: string;
//     lastLoginDate: string;
//     createdDate: string;
//     lastUpdatedDate: string;
//   }
//   type WeeklySlotMap = {
//     [day: string]: { from: string; to: string }[];
//   };
//   interface TimeSlot {
//     startTime: string;
//     endTime: string;
//   }

//   interface ScheduleItem {
//     day: string;
//     times: TimeSlot[];
//     isSelected: boolean;
//   }
//   const [selectedTeacher, setSelectedTeacher] = useState<TeacherList | null>(
//     null
//   );
//   const [startDate, setStartDate] = useState("");
//   const [trailStartDate, setTrailStartDate] = useState("");
//   const [fromTime, setFromTime] = useState("");
//   const [toTime, setToTime] = useState("");
//   const [fromHour, setFromHour] = useState("");
//   const [fromMinute, setFromMinute] = useState("");
//   const [suggestedSlots, setSuggestedSlots] = useState<WeeklySlotMap>({});
//   const [schedule, setSchedule] = useState<ScheduleItem[]>(
//     [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ].map((day) => ({
//       day,
//       times: [],
//       isSelected: false,
//     }))
//   );
//   const weeklyHourLimit = updatedStudentData.selectedHours;
//   const isGroupClass = updatedStudentData.classType === "GROUPCLASS";
//   const buildWeeklySlots = () => {
//     const map: WeeklySlotMap = {};
//     schedule.forEach((item) => {
//       if (item.isSelected && item.times.length > 0) {
//         map[item.day] = item.times.map((t) => ({
//           from: t.startTime,
//           to: t.endTime,
//         }));
//       }
//     });
//     return map;
//   };

//   const calculateTotalHours = () => {
//     let totalHours = 0;

//     schedule.forEach((item) => {
//       if (item.isSelected) {
//         item.times.forEach((time) => {
//           if (time.startTime && time.endTime) {
//             const start = new Date(`2023-01-01T${time.startTime}`);
//             const end = new Date(`2023-01-01T${time.endTime}`);
//             const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
//             totalHours += diff;
//           }
//         });
//       }
//     });

//     return totalHours;
//   };
//   const showRemainingHoursPopup = () => {
//     const totalHours = calculateTotalHours();
//     const remainingHours = weeklyHourLimit - totalHours;

//     if (remainingHours === 0) {
//       toast.warning(" You've reached your weekly hour limit.", {
//         className:
//           "w-[340px] px-4 py-3 text-sm rounded-lg shadow bg-yellow-600 text-white",
//       });
//     } else {
//       toast.info(
//         `You have ${remainingHours.toFixed(2)} hours remaining this week.`,
//         {
//           className:
//             "w-[340px] px-4 py-3 text-sm rounded-lg shadow bg-blue-600 text-white",
//         }
//       );
//     }
//   };

//   const handleNextStep = () => {
//     const updatedStudentDatas = {
//       ...updatedStudentData,
//       joiningDate: isGroupClass ? new Date() : startDate,
//       preferredTrialDate: trailStartDate,
//       preferredTrialFromTime: fromTime,
//       preferredTrialToTime: toTime,
//       weeklySlots: buildWeeklySlots(),
//       teacher:{
//             teacherId: selectedTeacher?.teacherId ?? "",
//             teacherName: selectedTeacher?.teacherName ?? "",
//             teacherEmail: "demoteacher@gmail.com",
//           },
//       classDay: isGroupClass
//         ? []
//         : schedule
//             .filter((item) => item.isSelected)
//             .map((item) => ({ label: item.day, value: item.day })),
//       startTime: isGroupClass
//         ? []
//         : schedule
//             .filter((item) => item.isSelected)
//             .flatMap((item) =>
//               item.times.map((time) => ({
//                 label: time.startTime,
//                 value: time.startTime,
//               }))
//             ),
//       endTime: isGroupClass
//         ? []
//         : schedule
//             .filter((item) => item.isSelected)
//             .flatMap((item) =>
//               item.times.map((time) => ({
//                 label: time.endTime,
//                 value: time.endTime,
//               }))
//             ),
//     };

//     nextStep(updatedStudentDatas);
//   };

//   useEffect(() => {
//     if (!trailStartDate || !fromTime) return;
//     const calculatedToTime = moment(fromTime, "HH:mm")
//       .add(30, "minutes")
//       .format("HH:mm");
//     setToTime(calculatedToTime);
//     const academicId =
//       typeof window !== "undefined"
//         ? localStorage.getItem("AcademicCoachPortalId")
//         : null;
//     if (!academicId || !trailStartDate) return;
//     const socket = getSocket(academicId);
//      const position =
//   updatedStudentData.learningInterest === "Islamic Studies"
//     ? "Islamic Teacher"
//     : `${updatedStudentData.learningInterest} Teacher`;
//     console.log("📤 Sending academicTrialClassTeacherListRequest");
//     console.log("📤 Sending with payload:", {
//       startDate: trailStartDate,
//       from: fromTime,
//       to: calculatedToTime,
//       position :position,
//     });
//     socket.emit("academicTrailClassTeacherListRequest", {
//       requestId: academicId,
//       startDate: trailStartDate,
//       from: fromTime,
//       to: calculatedToTime,
//       position :position,
//     });

//     const handleResponse = (data: Record<string, string>) => {
//       const teacherArray = Object.entries(data).map(
//         ([teacherId, teacherName]) => ({
//           teacherId,
//           teacherName,
//         })
//       );
//       setTeachers(teacherArray);
//     };

//     socket.on("academicTrailClassTeacherListResponse", handleResponse);
//     return () => {
//       socket.off("academicTrailClassTeacherListResponse", handleResponse);
//     };
//   }, [trailStartDate, fromTime]);
//   useEffect(() => {
//     const academicId =
//       typeof window !== "undefined"
//         ? localStorage.getItem("AcademicCoachPortalId")
//         : null;
//     if (!academicId || !startDate) return;
//     const socket = getSocket(academicId);
//     console.log("📤 Sending academicTeacherWeeklySlotsListRequest");
//     socket.emit("academicTeacherWeeklySlotsListRequest", {
//       requestId: academicId,
//       startDate: startDate,
//       teacherId: selectedTeacher?.teacherId,
//     });

//     const handleResponse = (data: WeeklySlotMap) => {
//       console.log("weekyl", data);
//       setSuggestedSlots(data);
//     };

//     socket.on("academicTeacherWeeklySlotsListResponse", handleResponse);
//     return () => {
//       socket.off("academicTeacherWeeklySlotsListResponse", handleResponse);
//     };
//   }, [startDate, selectedTeacher]);

//   const normalizeTime = (time: string) => time.slice(0, 5);

//   const handleAddSuggestedSlot = (day: string, from: string, to: string) => {
//     if (calculateTotalHours() >= weeklyHourLimit) {
//       toast.warning(" You've reached your weekly hour limit.");
//       return;
//     }
//     const index = schedule.findIndex((item) => item.day === day);
//     if (index === -1) return;

//     const updated = [...schedule];
//     const times = updated[index].times;

//     const isDuplicate = times.some(
//       (t) =>
//         normalizeTime(t.startTime) === normalizeTime(from) &&
//         normalizeTime(t.endTime) === normalizeTime(to)
//     );

//     if (isDuplicate) {
//       alert("⛔ Already added.");
//       return;
//     }

//     updated[index].isSelected = true;
//     updated[index].times.push({
//       startTime: normalizeTime(from),
//       endTime: normalizeTime(to),
//     });

//     updated[index].times.sort((a, b) => a.startTime.localeCompare(b.startTime));

//     setSchedule(updated);
//     showRemainingHoursPopup();
//   };

//   const handleRemoveSlot = (day: string, from: string, to: string) => {
//     const index = schedule.findIndex((item) => item.day === day);
//     if (index === -1) return;

//     const updated = [...schedule];

//     updated[index].times = updated[index].times.filter(
//       (t) =>
//         !(
//           normalizeTime(t.startTime) === normalizeTime(from) &&
//           normalizeTime(t.endTime) === normalizeTime(to)
//         )
//     );

//     if (updated[index].times.length === 0) {
//       updated[index].isSelected = false;
//     }

//     setSchedule(updated);
//     showRemainingHoursPopup();
//   };

//   const handleTimeChange = (
//     dayIndex: number,
//     timeIndex: number,
//     field: "startTime" | "endTime",
//     value: string
//   ) => {
//     const updatedSchedule = [...schedule];
//     updatedSchedule[dayIndex].times[timeIndex][field] = value;
//     setSchedule(updatedSchedule);
//   };
//   const handleTimeChange1 = (hour: any, minute: any) => {
//     setFromHour(hour);
//     setFromMinute(minute);

//     if (hour && minute) {
//       setFromTime(`${hour}:${minute}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative overflow-hidden scrollbar-none">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-28 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {updatedStudentData.firstName} &nbsp; {updatedStudentData.lastName}
//         </div>
//       </div>
//       <div className={`relative z-10 w-full max-w-4xl `}>
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
//           <div className="flex items-center  mb-5">
//             <h2 className="text-[18px] font-medium text-white">Trial Class</h2>
//           </div>
//           <div className="flex flex-wrap gap-4 justify-between items-center">
//             <div className="flex items-center gap-2">
//               <label htmlFor="ugcuc" className="font-medium text-white text-sm">
//                 Date:
//               </label>
//               <input
//                 type="date"
//                 id="ugcuc"
//                 className="border rounded text-sm px-1 bg-white/5 border-[#4f5154] text-[#c9c7c7]"
//                 value={trailStartDate}
//                 onChange={(e) => setTrailStartDate(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="fromTime"
//                 className="font-medium text-white text-sm"
//               >
//                 From:
//               </label>

//               {/* Hours Dropdown */}
//               <select
//                 value={fromHour}
//                 onChange={(e) => handleTimeChange1(e.target.value, fromMinute)}
//                 size={1}
//                 style={{
//                   scrollbarWidth: "none",
//                   overflow: "hidden",
//                   WebkitOverflowScrolling: "touch",
//                 }}
//                 className="h-8 w-16 text-sm px-2 rounded border border-[#4f5154] bg-white/5 text-black appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500  dark:text-white"
//               >
//                 <option value="">HH</option>
//                 {Array.from({ length: 24 }, (_, i) => (
//                   <option key={i} value={i.toString().padStart(2, "0")}>
//                     {i.toString().padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>

//               {/* Minutes Dropdown */}
//               <select
//                 value={fromMinute}
//                 onChange={(e) => handleTimeChange1(fromHour, e.target.value)}
//                 className="h-8 w-16 text-sm px-2 rounded border border-[#4f5154] bg-white/5 text-black appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500  dark:text-white"
//               >
//                 <option value="">MM</option>
//                 <option value="00">00</option>
//                 <option value="30">30</option>
//               </select>
//             </div>

//             {/* Teacher Dropdown */}
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="teacher"
//                 className="font-medium text-white text-sm"
//               >
//                 Teacher:
//               </label>
//               <select
//                 className="form-select w-full text-xs  text-black border-[#4f5154] bg-white/5 p-1 rounded-lg dark:text-[#c1c1c1] dark:bg-white/5"
//                 onChange={(e) => {
//                   const selected = teachers.find(
//                     (teacher) => teacher.teacherId === e.target.value
//                   );
//                   setSelectedTeacher(selected || null);
//                 }}
//               >
//                 <option value="">Select a Teacher</option>
//                 {teachers.length === 0 ? (
//                   <option disabled>🔍 Searching...</option>
//                 ) : (
//                   teachers.map((teacher) => (
//                     <option key={teacher.teacherId} value={teacher.teacherId}>
//                       {teacher.teacherName}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>
//           </div>
//           <div className="flex items-center justify-between my-5">
//             <h2 className="text-[18px] font-medium text-white">
//               Schedule Classes
//             </h2>

//             <div className="flex items-center gap-2">
//               <label htmlFor="ugcuc" className="font-medium text-white text-sm">
//                 Join Date:
//               </label>
//               <input
//                 type="date"
//                 id="ugcuc"
//                 className="border rounded text-sm px-1 bg-white/5 border-[#4f5154] text-[#c9c7c7]"
//                 value={startDate}
//                 disabled={isGroupClass}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </div>
//           </div>
//           <div
//             className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
//               updatedStudentData.classType === "GROUPCLASS"
//                 ? "pointer-events-none opacity-30"
//                 : ""
//             }`}
//           >
//             {schedule.map((item, index) => (
//               <div
//                 key={item.day}
//                 className="flex flex-col justify-between bg-white/10 border border-[#2c3444] rounded-2xl p-4 shadow-lg transition-transform hover:scale-[1.01] duration-200"
//               >
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-3">
//                   <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-wide">
//                     <CalendarDays size={18} className="text-blue-400" />
//                     {item.day}
//                   </div>
//                 </div>

//                 {/* Added Slots */}
//                 {item.times.length > 0 && (
//                   <div className="flex flex-col gap-2 mb-3 max-h-28 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
//                     {item.times.map((time, timeIndex) => (
//                       <div
//                         key={`${time.startTime}-${timeIndex}`}
//                         className="flex items-center gap-2 bg-[#2a3142] px-3 py-2 rounded-xl"
//                       >
//                         <input
//                           type="time"
//                           value={time.startTime}
//                           onChange={(e) =>
//                             handleTimeChange(
//                               index,
//                               timeIndex,
//                               "startTime",
//                               e.target.value
//                             )
//                           }
//                           className="bg-[#12161f] border border-gray-600 text-white text-xs rounded-lg px-1 py-1 w-15 focus:ring-2 focus:ring-blue-500"
//                         />
//                         <span className="text-white text-xs">⏤</span>
//                         <input
//                           type="time"
//                           value={time.endTime}
//                           onChange={(e) =>
//                             handleTimeChange(
//                               index,
//                               timeIndex,
//                               "endTime",
//                               e.target.value
//                             )
//                           }
//                           className="bg-[#12161f] border border-gray-600 text-white text-xs rounded-lg px-1 py-1 w-15 focus:ring-2 focus:ring-blue-500"
//                         />

//                         {/* Remove Button */}
//                         <button
//                           onClick={() =>
//                             handleRemoveSlot(
//                               item.day,
//                               time.startTime,
//                               time.endTime
//                             )
//                           }
//                           className="ml-auto text-xs px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
//                           title="Remove slot"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Suggested Slots */}
//                 {suggestedSlots[item.day] && (
//                   <div className="flex flex-col gap-2 max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
//                     {suggestedSlots[item.day].map((slot, i) => {
//                       const isAlready = item.times.some(
//                         (t) =>
//                           normalizeTime(t.startTime) ===
//                             normalizeTime(slot.from) &&
//                           normalizeTime(t.endTime) === normalizeTime(slot.to)
//                       );

//                       return (
//                         <div
//                           key={i}
//                           className="flex items-center justify-between bg-[#242b38] px-3 py-2 rounded-xl"
//                         >
//                           <div className="flex items-center gap-1 text-white text-xs">
//                             <Clock3 size={14} className="text-blue-400" />
//                             {slot.from} - {slot.to}
//                           </div>
//                           <button
//                             disabled={isAlready}
//                             onClick={() =>
//                               handleAddSuggestedSlot(
//                                 item.day,
//                                 slot.from,
//                                 slot.to
//                               )
//                             }
//                             className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg transition-all ${
//                               isAlready
//                                 ? "bg-gray-600 text-white cursor-not-allowed"
//                                 : "bg-[#576CBC] hover:bg-[#4459A9] text-white"
//                             }`}
//                           >
//                             {isAlready ? (
//                               <>
//                                 <CheckCircle size={14} /> Added
//                               </>
//                             ) : (
//                               <>
//                                 <PlusCircle size={14} /> Add
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl mt-4">
//         <div className="flex items-center text-right justify-between mb-8">
//           <button
//             onClick={() => prevStep(updatedStudentData)}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>
//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                         hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                         flex items-center space-x-2"
//             onClick={handleNextStep}
//           >
//             <span>→</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 6 Component
// const Step7 = ({
//   prevStep,
//   nextStep,
//   updatedStudentDatas,
// }: {
//   prevStep: () => void;
//   nextStep: (updatedStudentDatass: any) => void;
//   updatedStudentDatas: any;
// }) => {
//   const [guardianName, setGuardianName] = useState<string>("");
//   const [guardianEmail, setGuardianEmail] = useState<string>("");
//   const [guardianPhone, setGuardianPhone] = useState<string>("");
//   const [guardianCountry, setGuardianCountry] = useState<string>("");
//   const [guardianCity, setGuardianCity] = useState<string>("");
//   const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   const [guardianTimeZone, setGuardianTimeZone] =
//     useState<string>(defaultTimezone);
//   const [cities, setCities] = useState([]);
//   const countriesCities = require("countries-cities");
//   const [guardianLanguage, setGuardianLanguage] = useState("");

//   // Get all languages
//   const languages = ISO6391.getAllNames();
//   const languageCodes = ISO6391.getAllCodes();

//   console.log(updatedStudentDatas);
//   const handleNextStep = () => {
//     const updatedStudentDatass = {
//       ...updatedStudentDatas,
//       guardianName,
//       guardianEmail,
//       guardianPhone,
//       guardianCountry,
//       guardianCity,
//       guardianLanguage,
//       guardianTimeZone,
//     };
//     nextStep(updatedStudentDatass); // Pass updated data to nextStep
//   };

//   useEffect(() => {
//     const fetchedCities = countriesCities.getCities(guardianCountry);
//     setCities(fetchedCities);
//     setGuardianCity("");
//   }, [guardianCountry]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {updatedStudentDatas.firstName} &nbsp;{updatedStudentDatas.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
//           <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             Guardian Information
//           </h1>

//           <div className="space-y-6">
//             {/* Guardian's Details Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Guardian's Name */}
//               <div className="group">
//                 <label
//                   htmlFor="guardian-name"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>👤</span>
//                     <span>Guardian&apos;s Name</span>
//                   </span>
//                   <input
//                     id="guardian-name"
//                     type="text"
//                     placeholder="Enter guardian's name"
//                     value={guardianName}
//                     onChange={(e) => setGuardianName(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                            placeholder-white/30 focus:bg-white/10 focus:border-white/20 
//                            focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//                     aria-labelledby="guardian-name"
//                   />
//                 </label>
//               </div>

//               {/* Guardian's Email */}
//               <div className="group">
//                 <label
//                   htmlFor="guardianEmail"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>📧</span>
//                     <span>Guardian Email</span>
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Enter guardian's email"
//                     value={guardianEmail}
//                     onChange={(e) => setGuardianEmail(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                            placeholder-white/30 focus:bg-white/10 focus:border-white/20 
//                            focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//                     aria-labelledby="guardian-email"
//                   />
//                 </label>
//               </div>

//               {/* Phone Number */}
//               <div className="group">
//                 <label
//                   htmlFor="guardianPhone"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>📱</span>
//                     <span>Phone Number</span>
//                   </span>

//                   <input
//                     type="tel"
//                     placeholder="Enter phone number"
//                     value={guardianPhone}
//                     onChange={(e) => setGuardianPhone(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                            placeholder-white/30 focus:bg-white/10 focus:border-white/20 
//                            focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//                     aria-labelledby="guardian-phone"
//                   />
//                 </label>
//               </div>

//               {/* Country */}
//               <div className="group relative">
//                 <label
//                   htmlFor="guardianCountry"
//                   aria-label="Select your country"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-0 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>🌍</span>
//                     <span>Country</span>
//                   </span>
//                 </label>
//                 <CountryDropdown
//                   value={guardianCountry}
//                   onChange={(val) => {
//                     setGuardianCountry(val);
//                   }}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                                 placeholder-white/30 focus:bg-white/10 focus:border-white/20 
//                                 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 
//                                 text-[13px] font-semibold appearance-none cursor-pointer"
//                   style={{
//                     backgroundColor: "", // Background of the select
//                     color: "white", // Text color of the select
//                   }}
//                 />
//                 {/* Inline styles for options (workaround using JS) */}
//                 <style>
//                   {`
//                         select option {
//                           background-color: black !important; 
//                           color: white !important;
//                         }
//                       `}
//                 </style>
//               </div>
//             </div>

//             {/* City and Language Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* City */}
//               <div className="group">
//                 <label
//                   htmlFor="guardianCity"
//                   aria-label="Select your countrys"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-0 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>🏙️</span>
//                     <span>City</span>
//                   </span>
//                 </label>
//                 <select
//                   id="city"
//                   value={guardianCity}
//                   onChange={(e) => setGuardianCity(e.target.value)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                               focus:bg-white/10 focus:border-white/20 focus:ring-2 
//                               focus:ring-purple-500/20 transition-all duration-200"
//                   aria-labelledby="city"
//                 >
//                   <option value="" className="bg-gray-900">
//                     Select a city
//                   </option>
//                   {cities?.map((cityName) => (
//                     <option
//                       key={cityName}
//                       value={cityName}
//                       className="bg-gray-900"
//                     >
//                       {cityName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Language */}
//               <div className="group">
//                 <label
//                   htmlFor="guardianLanguage"
//                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
//                 >
//                   <span className="flex items-center gap-2">
//                     <span>🗣️</span>
//                     <span>Preferred Language</span>
//                   </span>
//                   <select
//                     value={guardianLanguage}
//                     onChange={(e) => setGuardianLanguage(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
//                               focus:bg-white/10 focus:border-white/20 focus:ring-2 
//                               focus:ring-purple-500/20 transition-all duration-200"
//                     aria-labelledby="guardian-language"
//                   >
//                     <option value="" className="bg-gray-900">
//                       Select language
//                     </option>
//                     {languages.map((lang, index) => (
//                       <option
//                         key={languageCodes[index]}
//                         value={languageCodes[index]}
//                         className="bg-gray-900"
//                       >
//                         {lang}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               </div>
//             </div>

//             {/* Time Zone Section */}
//             <div className="group relative">
//               <label
//                 htmlFor="guardianTimeZone"
//                 aria-label="Select your countrzczy"
//                 className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
//               >
//                 <span className="flex items-center gap-2">
//                   <span>🕒</span>
//                   <span>Time Zone</span>
//                 </span>
//               </label>

//               <TimezoneSelect
//                 value={{
//                   value: guardianTimeZone,
//                   label: guardianTimeZone.replace("_", " "),
//                 }}
//                 onChange={(timezone) => setGuardianTimeZone(timezone.value)} // ✅ Store only string
//                 styles={{
//                   control: (provided) => ({
//                     ...provided,
//                     backgroundColor: "#444A60", // ✅ Input box background color
//                     borderColor: "#444A60", // ✅ Border color
//                     color: "#fff", // ✅ Text color inside input
//                   }),
//                   menu: (provided) => ({
//                     ...provided,
//                     backgroundColor: "#444A60", // ✅ Dropdown menu background color
//                   }),
//                   option: (provided, state) => ({
//                     ...provided,
//                     backgroundColor: state.isFocused ? "#5A6080" : "#444A60", // ✅ Hover & default color
//                     color: "#fff", // ✅ Text color
//                   }),
//                   singleValue: (provided) => ({
//                     ...provided,
//                     color: "#fff", // ✅ Selected value text color
//                   }),
//                 }}
//               />
//             </div>

//             {/* Terms and Conditions */}
//             <div className="flex items-center space-x-3 group">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 className="w-5 h-5 rounded border-white/20 bg-white/10
//                          checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500
//                          focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               />
//               <label
//                 htmlFor="terms"
//                 className="text-white/60 group-hover:text-white/90 text-sm transition-colors"
//               >
//                 I agree to the terms and conditions
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons - Add this at the bottom of the main content div */}
//         <div className="flex items-center justify-between mt-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                        bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           {/* Progress Indicators */}
//           <div className="flex space-x-2">
//             {Array.from({ length: 5 }, (_, index) => (
//               <div
//                 key={index}
//                 className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
//                   index === 4
//                     ? "bg-gradient-to-r from-blue-400 to-purple-400 w-8"
//                     : "bg-white/20"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                      hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                      flex items-center space-x-2"
//             onClick={handleNextStep}
//           >
//             <span>Next</span>
//             <span>→</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 7 Component (Thank You Page)
// const Step8 = ({
//   prevStep,
//   nextStep,
//   updatedStudentDatass,
// }: {
//   prevStep: (updatedStudentDatass: any) => void;
//   nextStep: (updatedStudentDatass: any) => void;
//   updatedStudentDatass: any;
// }) => {
//   console.log(updatedStudentDatass);
//   const handlenextstep = () => {
//     nextStep(updatedStudentDatass);
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Animated Background Circles */}
//       {/* <div className="absolute inset-0 overflow-hidden">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-float"
//             style={{
//               width: `${Math.random() * 200 + 50}px`,
//               height: `${Math.random() * 200 + 50}px`,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${Math.random() * 10 + 10}s`,
//             }}
//           ></div>
//         ))}
//       </div> */}

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//            src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-28 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {updatedStudentDatass.firstName} &nbsp;{" "}
//           {updatedStudentDatass.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="flex items-center text-right justify-between mb-8">
//           <button
//             onClick={() => prevStep(updatedStudentDatass)}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>
//           <button
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
//                         hover:from-blue-600 hover:to-purple-600 transition-all duration-200
//                         flex items-center space-x-2"
//             onClick={handlenextstep}
//           >
//             <span>→</span>
//           </button>
//         </div>
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center">
//           {/* Success Icon */}
//           <div className="mb-8 relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
//             <div className="relative bg-gradient-to-r from-green-400 to-blue-400 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
//               <span className="text-4xl">✓</span>
//             </div>
//           </div>

//           {/* Thank You Message */}
//           <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             Thank You!
//           </h1>

//           <p className="text-xl text-white/80 mb-8">
//             Your information has been successfully submitted.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 8 Component
// const Step9 = ({
//   prevStep,
//   nextStep,
//   updatedStudentDatass,
// }: {
//   prevStep: () => void;
//   nextStep: (data?: any) => void;
//   updatedStudentDatass: any;
// }) => {
//   const router = useRouter();
//   const [classStatus, setClassStatus] = useState("COMPLETED");
//   const [studentStatus, setStudentStatus] = useState("JOINED");
//   console.log(updatedStudentDatass);
//   // Function to handle form submission
//   const handleSubmit = async () => {
//     try {
//       const startDate = new Date(updatedStudentDatass.joiningDate);
//       const classEndDate = new Date(startDate);
//       classEndDate.setDate(classEndDate.getDate() + 28);
//       console.log(">>>", updatedStudentDatass.academicCoach.academicCoachId);
//       const submitData = {
//         academicCoachId: updatedStudentDatass.academicCoach.academicCoachId,
//         student: {
//           studentId: updatedStudentDatass.studentId,
//           studentRegisterId:updatedStudentDatass._id,
//           studentFirstName: updatedStudentDatass.firstName,
//           studentLastName: updatedStudentDatass.lastName,
//           studentEmail: updatedStudentDatass.email,
//           studentGender: updatedStudentDatass.gender,
//           studentPhone: updatedStudentDatass.phoneNumber,
//           studentCity: updatedStudentDatass.city ?? "N/A",
//           studentCountry: updatedStudentDatass.country,
//           studentCountryCode: updatedStudentDatass.countryCode,
//           learningInterest: updatedStudentDatass.learningInterest,
//           numberOfStudents: updatedStudentDatass.numberOfStudents,
//           preferredTeacher: updatedStudentDatass.preferredTeacher,
//           preferredFromTime: updatedStudentDatass.preferredFromTime,
//           preferredToTime: updatedStudentDatass.preferredToTime,
//           timeZone: updatedStudentDatass.timeZone,
//           referralSource: updatedStudentDatass.referralSource,
//           preferredDate: updatedStudentDatass.startDate,
//           evaluationStatus: classStatus,
//           status: updatedStudentDatass.status,
//           createdDate: updatedStudentDatass.createdDate,
//           createdBy: updatedStudentDatass.createdBy,
//         },
//         isLanguageLevel: updatedStudentDatass.isLanguageChecked,
//         languageLevel: updatedStudentDatass.languageLevel,
//         isReadingLevel: updatedStudentDatass.isReadingChecked,
//         readingLevel: updatedStudentDatass.readingLevel,
//         isGrammarLevel: updatedStudentDatass.isGrammarChecked,
//         grammarLevel: updatedStudentDatass.grammarLevel,
//         hours: updatedStudentDatass.selectedHours,
//         subscription: {
//           subscriptionName: updatedStudentDatass.subscriptionName,
//         },
//         teacher: {
//           teacherId: updatedStudentDatass.teacher.teacherId,
//           teacherName: updatedStudentDatass.teacher.teacherName,
//           teacherEmail: updatedStudentDatass.teacher.teacherEmail,
//         },
//         classDay: updatedStudentDatass.classDay,
//         startTime: updatedStudentDatass.startTime,
//         endTime: updatedStudentDatass.endTime,
//         joiningDate: updatedStudentDatass.joiningDate,
//         amount: "",
//         currency: "",
//         planTotalPrice: updatedStudentDatass.planTotalPrice,
//         classType: updatedStudentDatass.classType,
//         weeklySlots: updatedStudentDatass.weeklySlots,
//         classStartDate: startDate,
//         classEndDate: classEndDate,
//         classStartTime: updatedStudentDatass.preferredFromTime,
//         classEndTime: updatedStudentDatass.preferredToTime,
//         preferredTrialDate: updatedStudentDatass.preferredTrialDate,
//         preferredTrialFromTime: updatedStudentDatass.preferredTrialFromTime,
//         preferredTrialToTime: updatedStudentDatass.preferredTrialToTime,
//         accomplishmentTime: updatedStudentDatass.accomplishmentTime.toString(),
//         studentRate: updatedStudentDatass.studentRate,
//         expectedFinishingDate: updatedStudentDatass.expectedFinishingDate,
//         gardianName: updatedStudentDatass.guardianName,
//         gardianEmail: updatedStudentDatass.guardianEmail,
//         gardianPhone: updatedStudentDatass.guardianPhone.toString(),
//         gardianCity: updatedStudentDatass.guardianCity,
//         gardianCountry: updatedStudentDatass.guardianCountry,
//         gardianTimeZone: updatedStudentDatass.guardianTimeZone,
//         gardianLanguage: updatedStudentDatass.guardianLanguage,
//         assignedTeacher: updatedStudentDatass.assignedTeacher,
//         studentStatus: studentStatus,
//         classStatus: classStatus,
//         trialClassStatus: updatedStudentDatass.trialClassStatus,
//         status: updatedStudentDatass.status,
//         createdDate: updatedStudentDatass.createdDate,
//         createdBy: updatedStudentDatass.academicCoach.name,
//         updatedDate: new Date().toISOString(),
//         updatedBy: "system", // or replace with the current user's email/ID
//       };
//       console.log("Payload being sent:", JSON.stringify(submitData, null, 2));
//       // Make POST request to your API
//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("AcademicCoachAuthToken")
//           : null;

//       if (!token) {
//         console.error("❌ AdminAuthToken not found");
//         return;
//       }
//       const response = await fetch(`https://api.blackstoneinfomaticstech.com/evaluation`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(submitData),
//       });

//       if (!response.ok) {
//         const errorDetails = await response.json();
//         console.error("Server error details:", errorDetails);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("Status updated successfully:", result);
//       alert("Status updated successfully!");
//       router.push("/Academic-coach/ui/trailmanagement");
//     } catch (error) {
//       console.error("Error submitting status:", error);
//       alert("Error updating status. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

//       {/* Logo */}
//       <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
//         <Image
//           src="/assets/images/blackstone.png"
//           alt="Logo"
//           className="w-40 drop-shadow-2xl"
//           width={100}
//           height={100}
//         />
//       </div>

//       {/* User Info */}
//       <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
//         <div className="text-sm font-semibold text-white flex items-center gap-2">
//           {updatedStudentDatass.firstName} &nbsp;{updatedStudentDatass.lastName}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-4xl">
//         {/* Navigation */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={prevStep}
//             className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-white/10 hover:bg-white/20 rounded-lg group"
//           >
//             <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
//               ←
//             </span>
//             <span>Back</span>
//           </button>

//           <button
//             onClick={nextStep}
//             className="items-center gap-2 px-6 py-3 text-white transition-all duration-300 
//                      bg-gradient-to-r from-blue-500 to-purple-500 
//                      hover:from-blue-600 hover:to-purple-600 rounded-lg group hidden"
//           >
//             <span>Next</span>
//             <span className="transform group-hover:translate-x-1 transition-transform duration-300">
//               →
//             </span>
//           </button>
//         </div>
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
//           <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             Final Status Update
//           </h1>

//           {/* Status Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//             {/* Class Status Card */}
//             <div className="group">
//               <label
//                 htmlFor="classstatus"
//                 className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors"
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-2xl">👨‍🏫</span>
//                   <span>Class Status</span>
//                 </div>
//                 <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

//                 <div className="relative">
//                   <select
//                     value={classStatus}
//                     onChange={(e) => setClassStatus(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
//                             appearance-none cursor-pointer focus:outline-none focus:ring-2 
//                             focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
//                             hover:bg-white/10"
//                     aria-labelledby="classstatus"
//                   >
//                     <option value="COMPLETED" className="bg-gray-900">
//                       COMPLETED
//                     </option>
//                     <option value="NOT COMPLETED" className="bg-gray-900">
//                       NOT COMPLETED
//                     </option>
//                   </select>
//                 </div>
//               </label>
//             </div>

//             {/* Student Status Card */}
//             <div className="group">
//               <label
//                 htmlFor="studentstatus"
//                 className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors"
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-2xl">👥</span>
//                   <span>Student Status</span>
//                 </div>
//                 <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

//                 <div className="relative">
//                   <select
//                     value={studentStatus}
//                     onChange={(e) => setStudentStatus(e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
//                             appearance-none cursor-pointer focus:outline-none focus:ring-2 
//                             focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
//                             hover:bg-white/10"
//                     aria-labelledby="studentstatus"
//                   >
//                     <option value="JOINED" className="bg-gray-900">
//                       JOINED
//                     </option>
//                     <option value="NOT JOINED" className="bg-gray-900">
//                       NOT JOINED
//                     </option>
//                     <option value="WAITING" className="bg-gray-900">
//                       WAITING
//                     </option>
//                   </select>
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl
//                       hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]
//                       font-semibold text-lg shadow-lg"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main EvaluationSteps component - Update total number of steps
// const EvaluationSteps: React.FC<{ userId: string }> = ({ userId }) => {
//   const [step, setStep] = useState(1);
//   const [studentData, setStudentData] = useState<StudentData>();
//   const [updatedStudentData, setUpdatedStudentData] = useState<any>(null);
//   const [updatedStudentDatas, setUpdatedStudentDatas] = useState<any>(null);
//   const [updatedStudentDatass, setUpdatedStudentDatass] = useState<any>({});
//   const totalSteps = 9;

//   // Single draft that aggregates all step data
//   const [evaluationDraft, setEvaluationDraft] = useState<any>({});

//   const nextStep = (data: any) => {
//     console.log("Current step:", step);
//     // Merge into draft
//     setEvaluationDraft((prev: any) => ({ ...prev, ...data }));

//     if (step === 2 || step === 3 || step === 4) {
//       setStudentData({ ...(studentData as any), ...data });
//     }
//     if (step === 5) {
//       setUpdatedStudentData(data);
//     }
//     if (step === 6 || step === 7) {
//       setUpdatedStudentDatas(data);
//       setUpdatedStudentDatass(data);
//     }
//     if (step === 8 || step === 9) {
//       setUpdatedStudentDatass(data);
//     }
//     if (step < totalSteps) {
//       setStudentData({ ...(studentData as any), ...data });
//       setStep((prev) => prev + 1);
//     }
//   };

//   const prevStep = () => {
//     console.log("Current step:", step);
//     if (step > 1) {
//       setStep((prev) => prev - 1);
//     }
//   };

//   console.log("Rendering step:", step);

//   return (
//     <>
//       {step === 1 && <Step1 nextStep={nextStep} />}
//       {step === 2 && (
//         <Step2
//           prevStep={prevStep}
//           nextStep={(data: StudentData) => nextStep(data)}
//           studentDatas={studentData ?? ({} as StudentData)} // Handle undefined
//         />
//       )}
//       {step === 3 && (
//         <Step3
//           prevStep={prevStep}
//           nextStep={(data: StudentData) => nextStep(data)}
//           studentData={studentData ?? ({} as StudentData)}
//         />
//       )}
//       {step === 4 && (
//         <Step4
//           prevStep={prevStep}
//           nextStep={(data: StudentData) => nextStep(data)}
//           studentData={studentData ?? ({} as StudentData)}
//         />
//       )}
//       {step === 5 && (
//         <Step5
//           prevStep={prevStep}
//           nextStep={(data: StudentData) => nextStep(data)}
//           studentData={studentData ?? ({} as StudentData)}
//         />
//       )}
//       {step === 6 && (
//         <Step6
//           prevStep={prevStep}
//           nextStep={(data: any) => nextStep(data)}
//           updatedStudentData={updatedStudentData}
//         />
//       )}
//       {step === 7 && (
//         <Step7
//           prevStep={prevStep}
//           nextStep={(data: any) => nextStep(data)}
//           updatedStudentDatas={updatedStudentDatas}
//         />
//       )}
//       {step === 8 && (
//         <Step8
//           prevStep={prevStep}
//           nextStep={nextStep}
//           updatedStudentDatass={updatedStudentDatass}
//         />
//       )}
//       {step === 9 && (
//         <Step9
//           prevStep={prevStep}
//           nextStep={(data: any) => nextStep(data)}
//           updatedStudentDatass={{ ...evaluationDraft, ...updatedStudentDatass }}
//         />
//       )}
//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="dark"
//       />
//     </>
//   );
// };

// export default EvaluationSteps;




"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CountryDropdown } from "react-country-region-selector";
import ISO6391 from "iso-639-1";
import {
  CalendarDays,
  Clock3,
  Trash2,
  PlusCircle,
  CheckCircle,
  RotateCcw,
  ChevronDown,
  Clock,
  Check,
  Plus,
  BookOpen,
  Zap,
  Calendar,
} from "lucide-react";
import TimezoneSelect from "react-timezone-select";
import { getSocket } from "@/app/utils/socket";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AcademicCoach {
  academicCoachId: string;
  name: string;
  role: string;
  email: string;
}

interface StudentData {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  academicCoach: AcademicCoach;
  email: string;
  gender: string;
  phoneNumber: string;
  city: string;
  country: string;
  countryCode: string;
  learningInterest: string;
  numberOfStudents: number;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  timeZone: string;
  referralSource: string;
  startDate: string;
  evaluationStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
}

interface EvaluationData {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentGender: string;
  studentCity: string;
  studentPhone: number;
  studentCountry: string;
  studentCountryCode: string;
  learningInterest: string;
  numberOfStudents: number;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  timeZone: string;
  referralSource: string;
  preferredDate: Date;
  evaluationStatus: string;
  status: string;
  createdDate: Date;
  createdBy: string;
}

const Step1: React.FC<{ nextStep: (data: any) => void }> = ({ nextStep }) => {
  const steps = [
    {
      id: "step1",
      step: "1",
      title: "Clarify",
      description: "Clarify your interest from our experienced teacher",
      color: "from-indigo-500 to-purple-500",
      icon: "👋",
    },
    {
      id: "step2",
      step: "2",
      title: "Assess",
      description: "Assess your level with our best evaluation test exams",
      color: "from-blue-500 to-teal-400",
      icon: "🖊️",
    },
    {
      id: "step3",
      step: "3",
      title: "Schedule",
      description: "Schedule a time for your evaluation",
      color: "from-orange-400 to-pink-500",
      icon: "📅",
    },
    {
      id: "step4",
      step: "4",
      title: "Question",
      description: "Ask and clarify all your doubts",
      color: "from-red-500 to-indigo-500",
      icon: "❓",
    },
  ];

  const handleStartEvaluations = () => {
    nextStep({});
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-[0.03] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-6 tracking-tight leading-none mt-20">
          Purpose of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Evaluation
          </span>
        </h1>
        <p className="text-slate-500 text-center mb-16 max-w-2xl mx-auto font-medium text-sm md:text-sm">
          Begin your learning journey with a personalized evaluation process
          designed just for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 transition-all group-hover:bg-white/80"></div>

              <div className="relative p-8 h-full flex flex-col items-center text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-indigo-100 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {item.icon}
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{item.description}</p>

                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-xs mb-10 font-bold tracking-[0.2em]">
            Unlocking Knowledge Anywhere Anytime , Let's Start Process
          </p>
          <button
            className="group relative inline-block"
            onClick={handleStartEvaluations}
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative font-semibold flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-full text-sm shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95 leading-none">
              <span>Start Evaluations</span>
              <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
 

const Step2: React.FC<{
  prevStep: () => void;
  nextStep: (data: StudentData) => void;
  studentDatas?: StudentData;
}> = ({ prevStep, nextStep, studentDatas }) => {
  const [studentData, setStudentData] = useState<StudentData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editableStudentData, setEditableStudentData] = useState<StudentData | null>(null);

  const id = typeof window !== "undefined" ? window.location.href : "";
  const queryString = id.split("?")[1] || "";
  const params = new URLSearchParams(queryString);
  const studentId = params.get("studentId");

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("AcademicCoachAuthToken");
        if (!token) return;

        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/studentlist/${studentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setStudentData(data);
        setEditableStudentData(data);
        localStorage.setItem("studentData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [studentId]);

  const handleStudentDataChange = (field: keyof StudentData, value: any) => {
    setEditableStudentData((prev) => (prev ? { ...prev, [field]: value } as StudentData : prev));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-100"></div>
          <div className="text-indigo-600 font-black uppercase tracking-[0.2em] animate-pulse">Loading Profile...</div>
        </div>
      </div>
    );
  }

  if (error || !studentData || !editableStudentData) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
        <div className="relative z-10 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-12 shadow-2xl border border-white/80 text-center max-w-lg">
          <div className="text-5xl mb-6">⚠️</div>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Access Error</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            {error || "We couldn't retrieve the student profile. Please verify the session is active."}
          </p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shadow-inner">
            {studentData.firstName?.[0]}{studentData.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {studentData.firstName}&nbsp;{studentData.lastName}
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-0">

        <div className="flex flex-col md:flex-row md:items-center justify-center mb-6 gap-4">
          <h1 className="text-3xl text-center font-black p-2 text-slate-900 tracking-tight leading-none mb-2">
            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Profile</span>
          </h1>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Email", field: "email", type: "email", icon: "" },
              { label: "Phone", field: "phoneNumber", type: "tel", icon: "" },
              { label: "City", field: "city", type: "text", icon: "" },
              { label: "Country", field: "country", type: "text", icon: "" },
              { label: "Country Code", field: "countryCode", type: "text", icon: "" },
              { label: "Interest", field: "learningInterest", type: "text", icon: "" },
              { label: "No. of Students", field: "numberOfStudents", type: "number", icon: "" },
              { label: "Preferred Teacher", field: "preferredTeacher", type: "text", icon: "" },
              { label: "From Time", field: "preferredFromTime", type: "time", icon: "" },
              { label: "To Time", field: "preferredToTime", type: "time", icon: "" },
              { label: "Time Zone", field: "timeZone", type: "text", icon: "" },
              { label: "Referral", field: "referralSource", type: "text", icon: "" },
            ].map(({ label, field, type, icon }) => (
              <div key={label} className="group space-y-2">
                <label className="text-sm font-black text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                  <span className="text-indigo-500 text-sm">{icon}</span> {label}
                </label>
                <input
                  type={type}
                  value={(editableStudentData as any)[field] ?? ""}
                  onChange={(e) => handleStudentDataChange(field as keyof StudentData, type === "number" ? Number(e.target.value) : e.target.value)}
                  className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                             placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                             transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 w-full max-w-5xl mt-8">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-5 md:p-5 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">

            <button
              onClick={prevStep}
              className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                       bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
            >
              <span className="text-lg">←</span>
              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 0 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>

            <button
              onClick={() => nextStep(editableStudentData as StudentData)}
              className="group relative block"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
                <span className="text-xs uppercase tracking-widest">Next</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({
  prevStep,
  nextStep,
  studentData,
}: {
  prevStep: () => void;
  nextStep: (studentData: StudentData) => void;
  studentData: StudentData;
}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shadow-inner">
            {studentData.firstName?.[0]}{studentData.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {studentData.firstName}&nbsp;{studentData.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mt-12 md:mt-0">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Read the following word</h2>
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5 text-center transition-all hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)]">

          <div className="relative inline-block mt-8">
            <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-3xl opacity-10 animate-pulse"></div>
            <div className="relative bg-white/40 backdrop-blur-md border border-white rounded-[2.5rem] p-12 md:p-16 shadow-inner ring-1 ring-black/5">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm leading-normal">
                أهلاً وسهلاً
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mt-8">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-5 md:p-5 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">

            <button
              onClick={prevStep}
              className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                       bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
            >
              <span className="text-lg">←</span>
              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 1 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>

            <button
              onClick={() => nextStep(studentData)}
              className="group relative block"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
                <span className="text-xs uppercase tracking-widest">Next</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const Step4 = ({
  prevStep,
  nextStep,
  studentData,
}: {
  prevStep: () => void;
  nextStep: (studentData: StudentData) => void;
  studentData: StudentData;
}) => {
  const [time, setTime] = useState(120);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isActive && time > 0) {
      intervalId = setInterval(() => setTime((prev) => prev - 1), 1000);
    }
    if (time === 0) setIsActive(false);
    return () => clearInterval(intervalId);
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggle = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTime(120);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
            {studentData.firstName?.[0]}{studentData.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {studentData.firstName}&nbsp;{studentData.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mt-12 md:mt-12">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-12 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5 text-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-12"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Talk about yourself</span></h2>

          <div className="flex flex-col items-center gap-12">
            <div className="relative w-48 h-48 flex items-center justify-center">

              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 to-white shadow-[0_25px_45px_rgba(0,0,0,0.2)]" />

              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-indigo-50 to-purple-50 border border-white backdrop-blur-xl shadow-[inset_0_0_25px_rgba(255,255,255,0.9)]" />

              <div className="absolute top-6 left-10 w-24 h-20 bg-white blur-2xl opacity-80 rounded-full" />

              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-300/30 via-transparent to-purple-300/30 blur-xl" />

              <div className="relative px-5 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg">
                <div className="flex gap-1">
                  {formatTime(time).split("").map((char, i) => (
                    <span
                      key={i}
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

            </div>


            <div className="flex items-center gap-6 ml-20">
              <button
                onClick={handleToggle}
                className={`flex items-center gap-4 px-6 py-3 rounded-[2rem] font-black text-sm transition-all duration-300 shadow-xl
                  ${isActive
                    ? "bg-rose-50 text-rose-600 shadow-rose-100 border border-rose-200 hover:scale-105 active:scale-95"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-100 border border-indigo-500 hover:scale-105 active:scale-95"
                  }`}
              >
                <span>{isActive ? "🛑 Stop Recording" : "🎙️ Start Recording"}</span>
                {isActive && (
                  <div className="flex items-end gap-1 h-4">
                    {[1, 0.5, 0.8, 0.3, 1].map((p, i) => (
                      <div key={i} className="w-1 bg-rose-500 rounded-full animate-pulse" style={{ height: `${p * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-[1.5rem] bg-white/80 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all hover:shadow-lg active:scale-95 group"
              >
                <RotateCcw className="w-6 h-6 group-hover:rotate-[-180deg] transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="relative z-10 w-full max-w-5xl mt-8">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-5 md:p-5 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">

            <button
              onClick={prevStep}
              className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                       bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
            >
              <span className="text-lg">←</span>
              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 5 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>

            <button
              onClick={() => nextStep(studentData)}
              className="group relative block"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
                <span className="text-xs uppercase tracking-widest">Next</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step5 = ({
  prevStep,
  nextStep,
  studentData,
}: {
  prevStep: () => void;
  nextStep: (updatedStudentData: any) => void;
  studentData: StudentData;
}) => {
  const [isLanguageChecked, setIsLanguageChecked] = useState(false);
  const [isReadingChecked, setIsReadingChecked] = useState(false);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const [languageLevel, setLanguageLevel] = useState("");
  const [readingLevel, setReadingLevel] = useState("");
  const [grammarLevel, setGrammarLevel] = useState<string>("");
  const [accomplishmentTime, setAccomplishmentTime] = useState<number>(0);
  const [studentRate, setStudentRate] = useState(0);
  const [expectedFinishingDate] = useState(28);
  const [subscriptionName, setSubscriptionName] = useState<string>();
  const [planTotalPrice, setPlanTotalPrice] = useState<number>();
  const [selectedHours, setSelectedHours] = useState<number>(0);

  // First, add state to track which plan's total is being calculated
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [classType, setClassType] = useState<string | null>(null);

  const handleSelect = (type: string) => {
    setClassType(type.toUpperCase());
  };
  console.log(selectedPlan);
  // Modify the calculatePrice function to return null if plan isn't selected
  const calculatePrice = (rate: number, planLabel: string) => {
    if (selectedPlan !== planLabel) {
      return "";
    }
    return selectedHours * rate * 4;
  };
  useEffect(() => {
    // Only set planTotalPrice when a plan is selected
    if (selectedPlan) {
      const plan = pricingPlans.find((p) => p.label === selectedPlan);
      if (plan) {
        const price = calculatePrice(plan.rate, plan.label);
        setPlanTotalPrice(price || 0);
      }
    }
  }, [selectedPlan, selectedHours]);

  // Pricing plans data
  const pricingPlans = [
    { label: "Simple", rate: 8, basePrice: "$8/h" },
    { label: "Essential", rate: 9, basePrice: "$9/h" },
    { label: "Pro", rate: 11, basePrice: "$11/h" },
    { label: "Elite", rate: 16, basePrice: "$16/h" },
  ];
  const handleNextStep = () => {
    const updatedStudentData = {
      ...studentData,
      isLanguageChecked,
      isReadingChecked,
      isGrammarChecked,
      languageLevel,
      readingLevel,
      grammarLevel,
      accomplishmentTime,
      studentRate,
      expectedFinishingDate,
      subscriptionName,
      selectedHours,
      planTotalPrice,
      classType,
    };
    nextStep(updatedStudentData);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-6 md:p-9 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-[0.05] pointer-events-none"></div>



      {/* User Info - Neumorphic Glass */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-white/40 backdrop-blur-md shadow-[-6px_-6px_12px_rgba(255,255,255,0.8),6px_6px_12px_rgba(0,0,0,0.05)] rounded-3xl px-6 py-3 border border-white/40 flex items-center gap-4 transition-all hover:scale-105">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-200">
            {studentData.firstName?.[0]}{studentData.lastName?.[0]}
          </div>
          <div className="text-sm font-black text-slate-800 tracking-tight">
            {studentData.firstName}&nbsp;{studentData.lastName}
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-3xl">
        <div className="h-[550px] overflow-y-scroll scrollbar-hide bg-white/30 backdrop-blur-3xl rounded-[4rem] px-10 py-8 shadow-[-12px_-12px_24px_rgba(255,255,255,0.7),12px_12px_24px_rgba(0,0,0,0.04)] border border-white/60 relative overflow-hidden ring-1 ring-white/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px]"></div>

          <h1 className="text-3xl font-black text-center mb-6 text-slate-900 tracking-tighter leading-none">
            Your Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">Journey</span>
          </h1>

          <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 px-4">
            Curate Your Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { id: "language", label: "Language", checked: isLanguageChecked, setChecked: setIsLanguageChecked, level: languageLevel, setLevel: setLanguageLevel, options: ["A1", "A2", "A3", "A4"], delay: "0s" },
              { id: "reading", label: "Reading", checked: isReadingChecked, setChecked: setIsReadingChecked, level: readingLevel, setLevel: setReadingLevel, options: ["1", "2", "3", "4", "5"], delay: "0.1s" },
              { id: "grammar", label: "Grammar", checked: isGrammarChecked, setChecked: setIsGrammarChecked, level: grammarLevel, setLevel: setGrammarLevel, options: ["0", "1", "2", "3", "4", "5"], delay: "0.2s" },
            ].map((item, idx) => (
              <div
                key={item.id}
                className={`group p-4 rounded-[2rem] border transition-all duration-500 relative overflow-hidden
                           ${item.checked
                    ? 'bg-white/60 border-indigo-200 shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.05)] translate-y-1'
                    : 'bg-white/40 border-white/60 shadow-[-8px_-8px_16px_rgba(255,255,255,0.8),8px_8px_16px_rgba(0,0,0,0.05)] hover:-translate-y-1'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={item.checked}
                      onChange={(e) => item.setChecked(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-xl border-2 border-white/80 bg-white/20 backdrop-blur-sm transition-all checked:border-indigo-600 checked:bg-indigo-600 shadow-sm"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label htmlFor={item.id} className={`text-xs font-black tracking-widest cursor-pointer transition-colors ${item.checked ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'}`}>
                    {item.label}
                  </label>
                </div>
                {item.checked && (
                  <div className="relative group/select">
                    <select
                      className="w-full bg-white/50 backdrop-blur-md border border-indigo-100 rounded-2xl px-4 py-2.5 text-[10px] font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                      onChange={(e) => item.setLevel(e.target.value)}
                      value={item.level}
                    >
                      <option value="">Choose Level</option>
                      {item.options.map(opt => (
                        <option key={opt} value={`Level: ${opt}`}>level {opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none group-hover/select:scale-125 transition-transform" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Intensity Selection - Tactile Chips */}
          <div className="mb-6">
            <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 px-4">
              Commitment Tier
            </h2>
            <div className="flex flex-wrap gap-4 justify-center bg-white/20 backdrop-blur-md p-4 rounded-[3rem] border border-white/40 shadow-[inset_-8px_-8px_16px_rgba(255,255,255,0.7),inset_8px_8px_16px_rgba(0,0,0,0.03)]">
              {[1, 1.5, 2, 2.5, 3, 4, 5].map((hour) => (
                <button
                  key={hour}
                  onClick={() => {
                    setSelectedHours(hour);
                    setAccomplishmentTime(hour * 4);
                    setStudentRate(hour);
                  }}
                  className={`px-4 py-3 text-[10px] rounded-[1.5rem] font-black transition-all duration-500 transform
                             ${hour === selectedHours
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300 scale-110 -translate-y-1"
                      : "bg-white/60 text-slate-500 hover:bg-white hover:text-indigo-600 shadow-[-4px_-4px_8px_rgba(255,255,255,0.8),4px_4px_8px_rgba(0,0,0,0.05)] hover:-translate-y-0.5"
                    }`}
                >
                  {hour} hr/wk
                </button>
              ))}
            </div>
          </div>

          {/* Pricing - Neumorphic Glass Cards */}
          <div className="mb-6">
            <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 px-4">
              Select Your Monthly Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan) => (
                <button
                  key={plan.label}
                  className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 transform border-2
                             ${selectedPlan === plan.label
                      ? 'border-indigo-400/50 bg-white/80 shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.8),inset_4px_4px_12px_rgba(0,0,0,0.06)] scale-[0.98]'
                      : 'bg-white/40 border-white/80 shadow-[-8px_-8px_16px_rgba(255,255,255,0.8),8px_8px_16px_rgba(0,0,0,0.05)] hover:scale-[1.03] hover:-translate-y-1'}`}
                  onClick={() => {
                    if (selectedHours > 0) {
                      setSelectedPlan(plan.label);
                      setSubscriptionName(plan.label);
                    } else {
                      alert("Please select preferred hours first");
                    }
                  }}
                >
                  <div className="p-6 text-center">
                    <h3 className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 transition-colors ${selectedPlan === plan.label ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {plan.label}
                    </h3>

                    <div className={`text-xl font-black mb-4 tracking-tighter transition-colors ${selectedPlan === plan.label ? 'text-slate-900' : 'text-slate-700'}`}>
                      {plan.basePrice}
                    </div>

                    <div className={`p-4 rounded-[1.8rem] transition-all duration-500 ${selectedPlan === plan.label ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white/50 text-slate-500 shadow-inner'}`}>
                      <div className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Total</div>
                      <div className="text-xl font-black leading-none">
                        {(() => {
                          if (selectedPlan === plan.label && planTotalPrice !== undefined) {
                            return `$${planTotalPrice.toFixed(2)}`;
                          }
                          return "--";
                        })()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Hub - High Depth tactile bar */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-0 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40 overflow-hidden shadow-[inset_-8px_-8px_16px_rgba(255,255,255,0.7),inset_8px_8px_16px_rgba(0,0,0,0.03)] ring-1 ring-white/10">
            {[
              { label: "Total Time", value: `${accomplishmentTime} Hours`, icon: Clock },
              { label: "Weekly Rate", value: `${studentRate} hr/wk`, icon: Zap },
              { label: "Completion", value: "28 Days", icon: Calendar },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-row items-center justify-center gap-3 py-4 px-2 ${i !== 2 ? 'md:border-r border-white/20' : ''}`}>
                <div className="text-[8px] mt-2 font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">{stat.label}</div>
                <div className="text-[12px] font-black text-slate-900 tracking-tight leading-none">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Class Type and Footer Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
            <div className="flex items-center gap-6">
              <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] ml-2">
                Class Format
              </h2>
              <div className="flex gap-4 p-1.5 bg-white/20 rounded-[1.8rem] shadow-inner border border-white/30">
                {["REGULARCLASS", "GROUPCLASS"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSelect(type)}
                    className={`px-8 py-2.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 relative
                             ${classType === type.toUpperCase()
                        ? "bg-slate-900 text-white shadow-xl translate-z-0"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                      }`}
                  >
                    {type === "REGULARCLASS" ? "REGULAR CLASS" : "GROUP CLASS"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Navigation - Extreme Glassmorphism */}
      <div className="relative z-10 w-full max-w-5xl mt-4">
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-4 md:p-4 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">          <button
            onClick={prevStep}
            className="group flex items-center gap-4 px-6 py-2 text-slate-600 font-black transition-all duration-500
                     bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-[-8px_-8px_16px_rgba(255,255,255,0.7),8px_8px_16px_rgba(0,0,0,0.05)] hover:scale-105 hover:-translate-x-2"
          >
            <span className="text-lg group-hover:-translate-x-2 transition-transform duration-500">←</span>
            <span className="text-xs uppercase tracking-[0.2em]">Back</span>
          </button>

          <div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 3 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>

          <button
            className="group relative"
            onClick={handleNextStep}
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center gap-4 bg-indigo-700 text-white px-6 py-2 rounded-[2rem] font-black shadow-[-8px_-8px_16px_rgba(255,255,255,0.1),8px_8px_24px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:shadow-indigo-400/40 active:scale-95">
              <span className="text-xs uppercase tracking-[0.2em]">Next</span>
              <span className="text-lg group-hover:translate-x-2 transition-transform duration-500">→</span>
            </div>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
const Step6 = ({
  prevStep,
  nextStep,
  updatedStudentData,
}: {
  prevStep: (updatedStudentData: any) => void;
  nextStep: (updatedStudentDatas: any) => void;
  updatedStudentData: any;
}) => {
  console.log(updatedStudentData);
  interface TimeSlot {
    startTime: string;
    endTime: string;
  }

  interface ScheduleItem {
    day: string;
    times: TimeSlot[];
    isSelected: boolean;
  }
  const [teachers, setTeachers] = useState<TeacherList[]>([]);
  interface TeacherList {
    teacherId: string;
    teacherName: string;
  }
  interface Teacher {
    _id: string;
    userName: string;
    email: string;
    password: string;
    role: string[];
    profileImage: string | null;
    status: string;
    createdBy: string;
    lastUpdatedBy: string;
    userId: string;
    lastLoginDate: string;
    createdDate: string;
    lastUpdatedDate: string;
  }
  type WeeklySlotMap = {
    [day: string]: { from: string; to: string }[];
  };
  interface TimeSlot {
    startTime: string;
    endTime: string;
  }

  interface ScheduleItem {
    day: string;
    times: TimeSlot[];
    isSelected: boolean;
  }
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherList | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [trailStartDate, setTrailStartDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [fromMinute, setFromMinute] = useState("");
  const [suggestedSlots, setSuggestedSlots] = useState<WeeklySlotMap>({});
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day) => ({
      day,
      times: [],
      isSelected: false,
    }))
  );
  const weeklyHourLimit = updatedStudentData.selectedHours;
  const isGroupClass = updatedStudentData.classType === "GROUPCLASS";
  const buildWeeklySlots = () => {
    const map: WeeklySlotMap = {};
    schedule.forEach((item) => {
      if (item.isSelected && item.times.length > 0) {
        map[item.day] = item.times.map((t) => ({
          from: t.startTime,
          to: t.endTime,
        }));
      }
    });
    return map;
  };

  const calculateTotalHours = () => {
    let totalHours = 0;

    schedule.forEach((item) => {
      if (item.isSelected) {
        item.times.forEach((time) => {
          if (time.startTime && time.endTime) {
            const start = new Date(`2023-01-01T${time.startTime}`);
            const end = new Date(`2023-01-01T${time.endTime}`);
            const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
            totalHours += diff;
          }
        });
      }
    });

    return totalHours;
  };
  const showRemainingHoursPopup = () => {
    const totalHours = calculateTotalHours();
    const remainingHours = weeklyHourLimit - totalHours;

    if (remainingHours === 0) {
      toast.warning(" You've reached your weekly hour limit.", {
        className:
          "w-[340px] px-4 py-3 text-sm rounded-lg shadow bg-yellow-600 text-white",
      });
    } else {
      toast.info(
        `You have ${remainingHours.toFixed(2)} hours remaining this week.`,
        {
          className:
            "w-[340px] px-4 py-3 text-sm rounded-lg shadow bg-blue-600 text-white",
        }
      );
    }
  };

  const handleNextStep = () => {
    const updatedStudentDatas = {
      ...updatedStudentData,
      joiningDate: isGroupClass ? new Date() : startDate,
      preferredTrialDate: trailStartDate,
      preferredTrialFromTime: fromTime,
      preferredTrialToTime: toTime,
      weeklySlots: buildWeeklySlots(),
      teacher: {
        teacherId: selectedTeacher?.teacherId ?? "",
        teacherName: selectedTeacher?.teacherName ?? "",
        teacherEmail: "demoteacher@gmail.com",
      },
      classDay: isGroupClass
        ? []
        : schedule
          .filter((item) => item.isSelected)
          .map((item) => ({ label: item.day, value: item.day })),
      startTime: isGroupClass
        ? []
        : schedule
          .filter((item) => item.isSelected)
          .flatMap((item) =>
            item.times.map((time) => ({
              label: time.startTime,
              value: time.startTime,
            }))
          ),
      endTime: isGroupClass
        ? []
        : schedule
          .filter((item) => item.isSelected)
          .flatMap((item) =>
            item.times.map((time) => ({
              label: time.endTime,
              value: time.endTime,
            }))
          ),
    };

    nextStep(updatedStudentDatas);
  };

  useEffect(() => {
    if (!trailStartDate || !fromTime) return;
    const calculatedToTime = moment(fromTime, "HH:mm")
      .add(30, "minutes")
      .format("HH:mm");
    setToTime(calculatedToTime);
    const academicId =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
    if (!academicId || !trailStartDate) return;
    const socket = getSocket(academicId);
    const position =
      updatedStudentData.learningInterest === "Islamic Studies"
        ? "Islamic Teacher"
        : `${updatedStudentData.learningInterest} Teacher`;
    console.log("📤 Sending academicTrialClassTeacherListRequest");
    console.log("📤 Sending with payload:", {
      startDate: trailStartDate,
      from: fromTime,
      to: calculatedToTime,
      position: position,
    });
    socket.emit("academicTrailClassTeacherListRequest", {
      requestId: academicId,
      startDate: trailStartDate,
      from: fromTime,
      to: calculatedToTime,
      position: position,
    });

    const handleResponse = (data: Record<string, string>) => {
      const teacherArray = Object.entries(data).map(
        ([teacherId, teacherName]) => ({
          teacherId,
          teacherName,
        })
      );
      setTeachers(teacherArray);
    };

    socket.on("academicTrailClassTeacherListResponse", handleResponse);
    return () => {
      socket.off("academicTrailClassTeacherListResponse", handleResponse);
    };
  }, [trailStartDate, fromTime]);
  useEffect(() => {
    const academicId =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
    if (!academicId || !startDate) return;
    const socket = getSocket(academicId);
    console.log("📤 Sending academicTeacherWeeklySlotsListRequest");
    socket.emit("academicTeacherWeeklySlotsListRequest", {
      requestId: academicId,
      startDate: startDate,
      teacherId: selectedTeacher?.teacherId,
    });

    const handleResponse = (data: WeeklySlotMap) => {
      console.log("weekyl", data);
      setSuggestedSlots(data);
    };

    socket.on("academicTeacherWeeklySlotsListResponse", handleResponse);
    return () => {
      socket.off("academicTeacherWeeklySlotsListResponse", handleResponse);
    };
  }, [startDate, selectedTeacher]);

  const normalizeTime = (time: string) => time.slice(0, 5);

  const handleAddSuggestedSlot = (day: string, from: string, to: string) => {
    if (calculateTotalHours() >= weeklyHourLimit) {
      toast.warning(" You've reached your weekly hour limit.");
      return;
    }
    const index = schedule.findIndex((item) => item.day === day);
    if (index === -1) return;

    const updated = [...schedule];
    const times = updated[index].times;

    const isDuplicate = times.some(
      (t) =>
        normalizeTime(t.startTime) === normalizeTime(from) &&
        normalizeTime(t.endTime) === normalizeTime(to)
    );

    if (isDuplicate) {
      alert("⛔ Already added.");
      return;
    }

    updated[index].isSelected = true;
    updated[index].times.push({
      startTime: normalizeTime(from),
      endTime: normalizeTime(to),
    });

    updated[index].times.sort((a, b) => a.startTime.localeCompare(b.startTime));

    setSchedule(updated);
    showRemainingHoursPopup();
  };

  const handleRemoveSlot = (day: string, from: string, to: string) => {
    const index = schedule.findIndex((item) => item.day === day);
    if (index === -1) return;

    const updated = [...schedule];

    updated[index].times = updated[index].times.filter(
      (t) =>
        !(
          normalizeTime(t.startTime) === normalizeTime(from) &&
          normalizeTime(t.endTime) === normalizeTime(to)
        )
    );

    if (updated[index].times.length === 0) {
      updated[index].isSelected = false;
    }

    setSchedule(updated);
    showRemainingHoursPopup();
  };

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].times[timeIndex][field] = value;
    setSchedule(updatedSchedule);
  };
  const handleTimeChange1 = (hour: any, minute: any) => {
    setFromHour(hour);
    setFromMinute(minute);

    if (hour && minute) {
      setFromTime(`${hour}:${minute}`);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-4 md:p-6 relative overflow-hidden scrollbar-none">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-[0.03] pointer-events-none"></div>



      {/* User Info Badge */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs shadow-inner uppercase">
            {updatedStudentData.firstName?.[0]}{updatedStudentData.lastName?.[0]}
          </div>
          <div className="text-sm font-semibold text-slate-700">
            {updatedStudentData.firstName}&nbsp;{updatedStudentData.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-center mb-6 gap-4">
          <h1 className="text-3xl text-center font-black p-2 text-slate-900 tracking-tight leading-none mb-2">
            Trial <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Class</span>
          </h1>
        </div>
        <div className="h-[500px] overflow-y-scroll scrollbar-hide bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Date Input */}
            <div className="space-y-3 group">
              <label htmlFor="ugcuc" className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                Trial Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="ugcuc"
                  className="w-full text-xs bg-white/50 rounded-xl px-3 py-2 text-slate-900 font-semibold
                             focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow
                             hover:bg-white hover:border-slate-300 outline-none"
                  value={trailStartDate}
                  onChange={(e) => setTrailStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                Start Time
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    value={fromHour}
                    onChange={(e) => handleTimeChange1(e.target.value, fromMinute)}
                    className="w-full text-xs bg-white/50 rounded-xl px-3 py-2 text-slate-900 font-semibold
                               focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow
                               hover:bg-white hover:border-slate-300 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">HH</option>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="relative flex-1">
                  <select
                    value={fromMinute}
                    onChange={(e) => handleTimeChange1(fromHour, e.target.value)}
                    className="w-full text-xs bg-white/50 rounded-xl px-3 py-2 text-slate-900 font-semibold
                               focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow
                               hover:bg-white hover:border-slate-300 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">MM</option>
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Dropdown */}
            <div className="space-y-3">
              <label htmlFor="teacher" className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                Assigned Teacher
              </label>
              <div className="relative">
                <select
                  className="w-full text-xs bg-white/50 rounded-xl px-3 py-2 text-slate-900 font-semibold
                             focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow
                             hover:bg-white hover:border-slate-300 outline-none appearance-none cursor-pointer"
                  onChange={(e) => {
                    const selected = teachers.find(
                      (teacher) => teacher.teacherId === e.target.value
                    );
                    setSelectedTeacher(selected || null);
                  }}
                >
                  <option value="">Select a Teacher</option>
                  {teachers.length === 0 ? (
                    <option disabled>🔍 Searching...</option>
                  ) : (
                    teachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.teacherName}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 pb-2 border-b border-slate-100/50 gap-4 mt-2">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">
                <span className="text-indigo-600">Schedule</span> Classes
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-white/40 p-2 pr-4 rounded-[1.25rem] border border-white/60 shadow-sm">
              <label htmlFor="joinDate" className="text-[11px] font-black text-indigo-500 tracking-widest pl-2 border-r border-indigo-100 mr-2">
                Joining Date
              </label>
              <input
                type="date"
                id="joinDate"
                className="bg-transparent border-none p-0 text-slate-900 font-semibold focus:ring-0 outline-none text-xs cursor-pointer"
                value={startDate}
                disabled={isGroupClass}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div
            className={`grid border border-white h-[260px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-indigo-50/40 to-indigo-100/40 p-4 rounded-3xl overflow-y-scroll scrollbar-hide grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${updatedStudentData.classType === "GROUPCLASS"
              ? "pointer-events-none opacity-40 grayscale"
              : ""
              }`}
          >
            {schedule.map((item, index) => (
              <div
                key={item.day}
                className="flex flex-col bg-white/40 backdrop-blur-sm border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500 group/card"
              >
                {/* Day Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transform group-hover/card:rotate-6 transition-transform">
                      <CalendarDays size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-slate-800 font-black font-sans font-semibold text-md tracking-tight">{item.day}</span>
                  </div>
                  {item.isSelected && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  )}
                </div>

                {/* Added Slots Container */}
                <div className="flex-1 space-y-3 mb-6 min-h-[40px]">
                  {item.times.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {item.times.map((time, timeIndex) => (
                        <div
                          key={`${time.startTime}-${timeIndex}`}
                          className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-sm ring-1 ring-black/5 group/slot hover:ring-indigo-200 transition-all"
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between">
                              <input
                                type="time"
                                value={time.startTime}
                                onChange={(e) => handleTimeChange(index, timeIndex, "startTime", e.target.value)}
                                className="bg-transparent border-none p-0 text-slate-900 text-xs font-black focus:ring-0 outline-none w-16"
                              />
                              <span className="text-[10px] font-bold text-slate-300 uppercase">to</span>
                              <input
                                type="time"
                                value={time.endTime}
                                onChange={(e) => handleTimeChange(index, timeIndex, "endTime", e.target.value)}
                                className="bg-transparent border-none p-0 text-slate-900 text-xs font-black focus:ring-0 outline-none w-16 text-right"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveSlot(item.day, time.startTime, time.endTime)}
                            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover/slot:opacity-100 shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl py-6">
                      <Clock3 size={20} className="mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">No slots added</span>
                    </div>
                  )}
                </div>

                {/* Available Suggestions Section */}
                {suggestedSlots[item.day] && (
                  <div className="pt-5 border-t border-slate-100/80">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">Quick Add</span>
                      <span className="text-[9px] font-bold text-slate-300 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                        {suggestedSlots[item.day].length} Available
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {suggestedSlots[item.day].map((slot, i) => {
                        const isAlready = item.times.some(
                          (t) => normalizeTime(t.startTime) === normalizeTime(slot.from) &&
                            normalizeTime(t.endTime) === normalizeTime(slot.to)
                        );

                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300 ${isAlready
                              ? "bg-slate-50/50 border-slate-100 opacity-60"
                              : "bg-white border-white hover:border-indigo-100 hover:shadow-md cursor-pointer hover:bg-indigo-50/20"
                              }`}
                            onClick={() => !isAlready && handleAddSuggestedSlot(item.day, slot.from, slot.to)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                              <span className="text-slate-600 text-[11px] font-bold">
                                {slot.from} - {slot.to}
                              </span>
                            </div>
                            <div className={`p-1 rounded-lg ${isAlready ? "bg-slate-200/50 text-slate-400" : "bg-indigo-50 text-indigo-600"}`}>
                              {isAlready ? <Check size={12} /> : <Plus size={12} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons footer */}
      <div className="relative z-10 w-full max-w-5xl mt-4">
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-4 md:p-4 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">
          <button
            onClick={() => prevStep(updatedStudentData)}
            className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                       bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
          >
            <span className="text-lg">←</span>
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>

          <div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 4 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>

          <button
            className="group block relative"
            onClick={handleNextStep}
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
              <span className="text-xs uppercase tracking-widest">Next</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const Step7 = ({
  prevStep,
  nextStep,
  updatedStudentDatas,
}: {
  prevStep: () => void;
  nextStep: (updatedStudentDatass: any) => void;
  updatedStudentDatas: any;
}) => {
  const [guardianName, setGuardianName] = useState<string>("");
  const [guardianEmail, setGuardianEmail] = useState<string>("");
  const [guardianPhone, setGuardianPhone] = useState<string>("");
  const [guardianCountry, setGuardianCountry] = useState<string>("");
  const [guardianCity, setGuardianCity] = useState<string>("");
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [guardianTimeZone, setGuardianTimeZone] =
    useState<string>(defaultTimezone);
  const [cities, setCities] = useState([]);
  const countriesCities = require("countries-cities");
  const [guardianLanguage, setGuardianLanguage] = useState("");

  const languages = ISO6391.getAllNames();
  const languageCodes = ISO6391.getAllCodes();

  const handleNextStep = () => {
    const updatedStudentDatass = {
      ...updatedStudentDatas,
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianCountry,
      guardianCity,
      guardianLanguage,
      guardianTimeZone,
    };
    nextStep(updatedStudentDatass);
  };

  useEffect(() => {
    const fetchedCities = countriesCities.getCities(guardianCountry);
    setCities(fetchedCities);
    setGuardianCity("");
  }, [guardianCountry]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-6 md:p-10 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* User Info */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
            {updatedStudentDatas.firstName?.[0]}{updatedStudentDatas.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {updatedStudentDatas.firstName}&nbsp;{updatedStudentDatas.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Guardian <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Information</span>
          </h1>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Guardian Name */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Guardian Name
              </label>
              <input
                type="text"
                placeholder="Enter guardian's name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                           focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)]
                           hover:bg-white hover:border-slate-300 outline-none"
              />
            </div>

            {/* Guardian Email */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Guardian Email
              </label>
              <input
                type="email"
                placeholder="Enter guardian's email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                             placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                             transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none"
              />
            </div>

            {/* Guardian Phone */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                              placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                              transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none"
              />
            </div>

            {/* Country */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Country
              </label>
              <div className="relative">
                <CountryDropdown
                  value={guardianCountry}
                  onChange={(val) => setGuardianCountry(val)}
                  className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                             placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                             transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none appearance-none cursor-pointer"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* City */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                City
              </label>
              <div className="relative">
                <select
                  value={guardianCity}
                  onChange={(e) => setGuardianCity(e.target.value)}
                  className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                             placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                             transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select a city</option>
                  {cities?.map((cityName) => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-3 group">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Preferred Language
              </label>
              <div className="relative">
                <select
                  value={guardianLanguage}
                  onChange={(e) => setGuardianLanguage(e.target.value)}
                  className="w-full text-xs bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 font-semibold
                             placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 
                             transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)] outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select language</option>
                  {languages.map((lang, index) => (
                    <option key={languageCodes[index]} value={languageCodes[index]}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="space-y-3 group md:col-span-3">
              <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-2">
                Time Zone
              </label>
              <div className="glass-select-container text-xs">
                <TimezoneSelect
                  value={{ value: guardianTimeZone, label: guardianTimeZone.replace("_", " ") }}
                  onChange={(timezone) => setGuardianTimeZone(timezone.value)}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      padding: "0.35rem",
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.6)",
                      boxShadow: "2px 4px 16px rgba(0,0,0,0.02)",
                      "&:hover": { borderColor: "#cbd5e1" }
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)"
                    })
                  }}
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-4 p-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl mb-2 transition-all hover:bg-white">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded-lg border-slate-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            />
            <label htmlFor="terms" className="text-slate-600 font-semibold text-xs cursor-pointer select-none">
              I agree to the <span className="text-indigo-600 hover:decoration-2 hover:underline underline-offset-4 transition-all">Terms and Conditions</span>
            </label>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="relative z-10 w-full max-w-5xl mt-4">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl p-4 md:p-4 rounded-[2rem] border border-white shadow-xl shadow-indigo-500/5">            <button
            onClick={prevStep}
            className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                         bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
          >
            <span className="text-lg">←</span>
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
<div className="hidden md:flex items-center gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 5 ? "bg-indigo-600 w-12" : "bg-indigo-100 w-2"}`} />
              ))}
            </div>
            <button
              className="group relative block"
              onClick={handleNextStep}
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
                <span className="text-xs uppercase tracking-widest">Next</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step8 = ({
  prevStep,
  nextStep,
  updatedStudentDatass,
}: {
  prevStep: (updatedStudentDatass: any) => void;
  nextStep: (updatedStudentDatass: any) => void;
  updatedStudentDatass: any;
}) => {
  const handlenextstep = () => {
    nextStep(updatedStudentDatass);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* User Info */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
            {updatedStudentDatass.firstName?.[0]}{updatedStudentDatass.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {updatedStudentDatass.firstName}&nbsp;{updatedStudentDatass.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5 text-center relative">
          {/* Success Icon with Glow */}
          <div className="mb-12 relative inline-block">
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200/50 transform hover:scale-110 transition-transform duration-500 cursor-default ring-8 ring-white/50">
              <span className="text-5xl text-white drop-shadow-md">✓</span>
            </div>
          </div>

          <h1 className="text-3xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
            Assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Completed!</span>
          </h1>

          <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Your evaluation data has been successfully processed. We're getting everything ready for your first class!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => prevStep(updatedStudentDatass)}
              className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                         bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
            >
              <span className="text-lg">←</span>
              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>

            <button
              onClick={handlenextstep}
              className="group relative block w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300 active:scale-95">
                <span className="text-xs uppercase tracking-widest">Finish Process</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-6 py-2 bg-emerald-50/50 rounded-full border border-emerald-100/50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Submission Successful
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 8 Component
const Step9 = ({
  prevStep,
  nextStep,
  updatedStudentDatass,
}: {
  prevStep: () => void;
  nextStep: (data?: any) => void;
  updatedStudentDatass: any;
}) => {
  const router = useRouter();
  const [classStatus, setClassStatus] = useState("COMPLETED");
  const [studentStatus, setStudentStatus] = useState("JOINED");

  const handleSubmit = async () => {
    try {
      const startDate = new Date(updatedStudentDatass.joiningDate);
      const classEndDate = new Date(startDate);
      classEndDate.setDate(classEndDate.getDate() + 28);

      const submitData = {
        academicCoachId: updatedStudentDatass.academicCoach.academicCoachId,
        student: {
          studentId: updatedStudentDatass.studentId,
          studentRegisterId: updatedStudentDatass._id,
          studentFirstName: updatedStudentDatass.firstName,
          studentLastName: updatedStudentDatass.lastName,
          studentEmail: updatedStudentDatass.email,
          studentGender: updatedStudentDatass.gender,
          studentPhone: updatedStudentDatass.phoneNumber,
          studentCity: updatedStudentDatass.city ?? "N/A",
          studentCountry: updatedStudentDatass.country,
          studentCountryCode: updatedStudentDatass.countryCode,
          learningInterest: updatedStudentDatass.learningInterest,
          numberOfStudents: updatedStudentDatass.numberOfStudents,
          preferredTeacher: updatedStudentDatass.preferredTeacher,
          preferredFromTime: updatedStudentDatass.preferredFromTime,
          preferredToTime: updatedStudentDatass.preferredToTime,
          timeZone: updatedStudentDatass.timeZone,
          referralSource: updatedStudentDatass.referralSource,
          preferredDate: updatedStudentDatass.startDate,
          evaluationStatus: classStatus,
          status: updatedStudentDatass.status,
          createdDate: updatedStudentDatass.createdDate,
          createdBy: updatedStudentDatass.createdBy,
        },
        isLanguageLevel: updatedStudentDatass.isLanguageChecked,
        languageLevel: updatedStudentDatass.languageLevel,
        isReadingLevel: updatedStudentDatass.isReadingChecked,
        readingLevel: updatedStudentDatass.readingLevel,
        isGrammarLevel: updatedStudentDatass.isGrammarChecked,
        grammarLevel: updatedStudentDatass.grammarLevel,
        hours: updatedStudentDatass.selectedHours,
        subscription: {
          subscriptionName: updatedStudentDatass.subscriptionName,
        },
        teacher: {
          teacherId: updatedStudentDatass.teacher.teacherId,
          teacherName: updatedStudentDatass.teacher.teacherName,
          teacherEmail: updatedStudentDatass.teacher.teacherEmail,
        },
        classDay: updatedStudentDatass.classDay,
        startTime: updatedStudentDatass.startTime,
        endTime: updatedStudentDatass.endTime,
        joiningDate: updatedStudentDatass.joiningDate,
        amount: "",
        currency: "",
        planTotalPrice: updatedStudentDatass.planTotalPrice,
        classType: updatedStudentDatass.classType,
        weeklySlots: updatedStudentDatass.weeklySlots,
        classStartDate: startDate,
        classEndDate: classEndDate,
        classStartTime: updatedStudentDatass.preferredFromTime,
        classEndTime: updatedStudentDatass.preferredToTime,
        preferredTrialDate: updatedStudentDatass.preferredTrialDate,
        preferredTrialFromTime: updatedStudentDatass.preferredTrialFromTime,
        preferredTrialToTime: updatedStudentDatass.preferredTrialToTime,
        accomplishmentTime: updatedStudentDatass.accomplishmentTime.toString(),
        studentRate: updatedStudentDatass.studentRate,
        expectedFinishingDate: updatedStudentDatass.expectedFinishingDate,
        gardianName: updatedStudentDatass.guardianName,
        gardianEmail: updatedStudentDatass.guardianEmail,
        gardianPhone: updatedStudentDatass.guardianPhone.toString(),
        gardianCity: updatedStudentDatass.guardianCity,
        gardianCountry: updatedStudentDatass.guardianCountry,
        gardianTimeZone: updatedStudentDatass.guardianTimeZone,
        gardianLanguage: updatedStudentDatass.guardianLanguage,
        assignedTeacher: updatedStudentDatass.assignedTeacher,
        studentStatus: studentStatus,
        classStatus: classStatus,
        trialClassStatus: updatedStudentDatass.trialClassStatus,
        status: updatedStudentDatass.status,
        createdDate: updatedStudentDatass.createdDate,
        createdBy: updatedStudentDatass.academicCoach.name,
        updatedDate: new Date().toISOString(),
        updatedBy: "system",
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;
      if (!token) return;

      const response = await fetch(`https://api.blackstoneinfomaticstech.com/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      alert("Status updated successfully!");
      router.push("/Academic-coach/ui/trailmanagement");
    } catch (error) {
      alert("Error updating status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-indigo-100/40 flex flex-col items-center justify-start p-6 md:p-10 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* User Info */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-5 py-2.5 border border-white/40 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
            {updatedStudentDatass.firstName?.[0]}{updatedStudentDatass.lastName?.[0]}
          </div>
          <div className="text-sm font-bold text-slate-700">
            {updatedStudentDatass.firstName}&nbsp;{updatedStudentDatass.lastName}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl text-center font-black text-slate-900 tracking-tight leading-none mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Update</span> Status
            </h1>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/80 ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Class Status Card */}
            <div className="bg-white/40 border border-slate-200/60 backdrop-blur-md rounded-[2rem] p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
              <label className="text-md font-black text-slate-400 tracking-widest mb-6 block">Class Status</label>
              <div className="relative">
                <select
                  value={classStatus}
                  onChange={(e) => setClassStatus(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200/60 rounded-2xl px-6 py-4 text-slate-900 font-bold
                             focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)]
                             hover:bg-white hover:border-slate-300 outline-none appearance-none cursor-pointer"
                >
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="NOT COMPLETED">NOT COMPLETED</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Student Status Card */}
            <div className="bg-white/40 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
              <label className="text-md font-black text-slate-400 tracking-widest mb-6 block">Student Status</label>
              <div className="relative">
                <select
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200/60 rounded-2xl px-6 py-4 text-slate-900 font-bold
                             focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-100/50 transition-all duration-300 shadow-[2px_4px_16px_rgba(0,0,0,0.02)]
                             hover:bg-white hover:border-slate-300 outline-none appearance-none cursor-pointer"
                >
                  <option value="JOINED">JOINED</option>
                  <option value="NOT JOINED">NOT JOINED</option>
                  <option value="WAITING">WAITING</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <button
              onClick={handleSubmit}
              className="group relative block w-full"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-indigo-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-300 active:scale-[0.99]">
                <span>Submit Evaluation</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-3 px-6 py-2 text-slate-600 font-black transition-all duration-300 
                           bg-white/80 hover:bg-white border border-slate-200/50 rounded-2xl group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-x-1"
              >
                <span className="text-lg">←</span>
                <span className="text-xs uppercase tracking-widest">Back</span>
              </button>

              <div className="flex items-center gap-2 px-6 py-2 bg-indigo-50/50 rounded-full border border-indigo-100/50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                Final Record Syncing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main EvaluationSteps component - Update total number of steps
const EvaluationSteps: React.FC<{ userId: string }> = ({ userId }) => {
  const [step, setStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentData>();
  const [updatedStudentData, setUpdatedStudentData] = useState<any>(null);
  const [updatedStudentDatas, setUpdatedStudentDatas] = useState<any>(null);
  const [updatedStudentDatass, setUpdatedStudentDatass] = useState<any>({});
  const totalSteps = 9;

  // Single draft that aggregates all step data
  const [evaluationDraft, setEvaluationDraft] = useState<any>({});

  const nextStep = (data: any) => {
    console.log("Current step:", step);
    // Merge into draft
    setEvaluationDraft((prev: any) => ({ ...prev, ...data }));

    if (step === 2 || step === 3 || step === 4) {
      setStudentData({ ...(studentData as any), ...data });
    }
    if (step === 5) {
      setUpdatedStudentData(data);
    }
    if (step === 6 || step === 7) {
      setUpdatedStudentDatas(data);
      setUpdatedStudentDatass(data);
    }
    if (step === 8 || step === 9) {
      setUpdatedStudentDatass(data);
    }
    if (step < totalSteps) {
      setStudentData({ ...(studentData as any), ...data });
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    console.log("Current step:", step);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  console.log("Rendering step:", step);

  return (
    <div className="relative">
      {/* Common Logo */}
      <div className="absolute top-0 left-5 p-10 z-50 hover:scale-105 transition-transform">
        <Image
          src="/assets/images/blackstone.png"
          alt="Logo"
          className="w-40 drop-shadow-2xl"
          width={160}
          height={160}
        />
      </div>

      {step === 1 && <Step1 nextStep={nextStep} />}
      {step === 2 && (
        <Step2
          prevStep={prevStep}
          nextStep={(data: StudentData) => nextStep(data)}
          studentDatas={studentData ?? ({} as StudentData)} // Handle undefined
        />
      )}
      {step === 3 && (
        <Step3
          prevStep={prevStep}
          nextStep={(data: StudentData) => nextStep(data)}
          studentData={studentData ?? ({} as StudentData)}
        />
      )}
      {step === 4 && (
        <Step4
          prevStep={prevStep}
          nextStep={(data: StudentData) => nextStep(data)}
          studentData={studentData ?? ({} as StudentData)}
        />
      )}
      {step === 5 && (
        <Step5
          prevStep={prevStep}
          nextStep={(data: StudentData) => nextStep(data)}
          studentData={studentData ?? ({} as StudentData)}
        />
      )}
      {step === 6 && (
        <Step6
          prevStep={prevStep}
          nextStep={(data: any) => nextStep(data)}
          updatedStudentData={updatedStudentData}
        />
      )}
      {step === 7 && (
        <Step7
          prevStep={prevStep}
          nextStep={(data: any) => nextStep(data)}
          updatedStudentDatas={updatedStudentDatas}
        />
      )}
      {step === 8 && (
        <Step8
          prevStep={prevStep}
          nextStep={nextStep}
          updatedStudentDatass={updatedStudentDatass}
        />
      )}
      {step === 9 && (
        <Step9
          prevStep={prevStep}
          nextStep={(data: any) => nextStep(data)}
          updatedStudentDatass={{ ...evaluationDraft, ...updatedStudentDatass }}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default EvaluationSteps;