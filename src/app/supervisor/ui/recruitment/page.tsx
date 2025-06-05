"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  MoreVertical,
  FileText,
  Search,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { ImAttachment } from "react-icons/im";
import BaseLayout3 from "@/components/BaseLayout3";
import axios from "axios";
import { pdfjs } from "react-pdf";
import Pagination from "@/components/Pagination";

import SupervisorHeader from "../../components/supervisorHeader";
import { IoCloseOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { MdTune } from "react-icons/md";
import SuccessPopup from "../../components/successPopup";
import FailedPopup from "../../components/failedPopup";

type Status = "Shortlisted" | "Rejected" | "Waiting";
type Position = "Arabic Teacher" | "Quran Teacher";
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
  level: string;
}
interface UploadResume {
  type: string;
  data: number[]; // Byte array
}

interface ApiResponse {
  candidateFirstName: string;
  candidateLastName: string;
  applicationDate: string; // ISO date string
  candidateEmail: string;
  candidatePhoneNumber: number;
  candidateCountry: string;
  candidateCity: string;
  positionApplied: string;
  currency: string;
  gender: string;
  expectedSalary: number;
  preferedWorkingHours: string;
  uploadResume: UploadResume;
  comments: string;
  applicationStatus: string;
  professionalExperience: string;
  skills: string;
  status: string;
  createdDate: string; // ISO date string
  createdBy: string;
  _id: string;
  __v: number;
}

interface AddApplicantFormData {
  applicationDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
  city: string;
  position: string;
  expectedSalary: string;
  workingHours: string;
  resume: File | null | undefined;
  comment: string;
}

interface RadioOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

const RadioOption: React.FC<RadioOptionProps> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="inline-flex items-center mr-4">
    <input
      type="radio"
      className="form-radio h-4 w-4 text-blue-600"
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2 text-sm text-gray-700">{label}</span>
  </label>
);

interface SkillBadgeProps {
  name: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name }) => (
  <span className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 mr-2 mb-2">
    {name}
  </span>
);

export default function ApplicantsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [Applicantbyid, setApplicantbyid] = useState<ApiResponse | null>(null);
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [resumeImages, setResumeImages] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [quranReading, setQuranReading] = useState("Medium");
  const [tajweed, setTajweed] = useState("Medium");
  const [arabicSpeaking, setArabicSpeaking] = useState("Advanced");
  const [arabicWriting, setArabicWriting] = useState("Advanced");
  const [englishSpeaking, setEnglishSpeaking] = useState("Advanced");
  const [workingDays, setWorkingDays] = useState("Monday-Saturday");
  const [rating, setRating] = useState(4);
  const [comments, setComments] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const fromWrapperRef = useRef<HTMLDivElement>(null);
  const toWrapperRef = useRef<HTMLDivElement>(null);
  const [supervisorId, setSupervisorId] = React.useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [successMessage,setSuccessMessage] = useState("");


  const extractSkills = (rawText: string): string[] => {
    // Only keep content before "Accomplishments" or "Certifications"
    const relevantSection = rawText.split(/Accomplishments|Certifications/i)[0];

    // Match all bullet point items (• React, etc.)
    const matches = relevantSection.match(/•\s*[^•\n]+/g);

    const skills = matches
      ? matches
          .map((skill) => skill.replace(/•\s*/, "").trim()) // remove bullet and whitespace
          .flatMap((s) => s.split(",").map((sub) => sub.trim())) // split comma-separated items
          .filter(Boolean) // remove empty strings
      : [];

    return skills;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("SupervisorPortalId")?.trim() ?? null;
      setSupervisorId(id);
    }
  }, []);

  function focusFromInput() {
    const input = fromWrapperRef.current?.querySelector("input");
    input?.focus();
  }

  function focusToInput() {
    const input = toWrapperRef.current?.querySelector("input");
    input?.focus();
  }

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorAuthToken")
        : null;

    const supervisorId =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorPortalId")
        : null;

    if (!token) {
      console.error("❌ SupervisorAuthToken not found");
      return;
    }

    if (!supervisorId) {
      console.warn("⚠️ SupervisorId not found in localStorage");
    } else {
      console.log("✅ Supervisor ID from localStorage:", supervisorId);
    }

    axios
      .get("https://api.blackstoneinfomaticstech.com/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setApplicants(response.data.applicants))
      .catch((error) => console.error("Error fetching applicants:", error));
  }, []);

  const tabs = ["All", "New Application", "Shortlisted", "Rejected", "Waiting"];

  const filteredApplicants =
    activeTab === "All"
      ? applicants
      : applicants.filter(
          (applicant) =>
            applicant.applicationStatus.replace(/\s+/g, "").toUpperCase() ===
            activeTab.replace(/\s+/g, "").toUpperCase()
        );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEWAPPLICATION":
        return "bg-[#F9E7FF] text-[#BE36D5] dark:bg-[#4C3151] dark:text-[#BE36D5] rounded-md px-2 text-[10px]";
      case "SHORTLISTED":
        return "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36] rounded-md px-6 text-[10px]";
      case "REJECTED":
        return "bg-[#FDECEC] dark:bg-[#503434] dark:text-[#D34645] text-[#D34645] rounded-md px-8 text-[10px]";
      case "WAITING":
        return "bg-[#FDF6EC] dark:bg-[#534634] dark:text-[#F0AD4E] text-[#F0AD4E] rounded-md px-8 text-[10px]";
      case "APPROVED":
        return "bg-[#EEEEFF] text-[#38619A] dark:bg-[#2F3642] dark:text-[#225BAA] rounded-md px-8 text-[10px]";
    }
  };

  const handleMenuClick = async (_id: string) => {
    setOpenMenuId(openMenuId === _id ? null : _id);

    if (openMenuId !== _id) {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get<ApiResponse>(
          `https://api.blackstoneinfomatics.tech/applicants/${_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Applicant data received:", response.data);
        setApplicantbyid(response.data);

        // Parse and set skills
        const skillsFromApi = response.data.skills || "";
        const skillsArray = extractSkills(skillsFromApi);
        setParsedSkills(skillsArray);
        if (response.data.uploadResume) {
          const base64String = response.data.uploadResume;

          // Check if base64String is an object
          if (typeof base64String === "string") {
            // If it's a string, construct the PDF URL
            const pdfUrl = `data:application/pdf;base64,${base64String}`;
            setResumeImages(pdfUrl);
          } else if (base64String?.data) {
            // If base64String is an object, access its 'data' property
            const pdfUrl = `data:application/pdf;base64,${base64String.data}`;
            setResumeImages(pdfUrl);
          } else {
            console.error("Base64 string is empty or invalid.");
          }
        } else {
          console.error("uploadResume is not available.");
        }
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    }
  };

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpenMenuId(null);
    setMode("view"); // Always set to view mode
  };

  const handleEdit = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpenMenuId(null);
    setMode("edit");
  };

  const handleviewclose = () => {
    setSelectedApplicant(null);
    setResumeImages(null);
    setOpenMenuId(null);
    setQuranReading("Medium");
    setTajweed("Medium");
    setArabicSpeaking("Advanced");
    setArabicWriting("Advanced");
    setEnglishSpeaking("Advanced");
    setWorkingDays("Monday-Saturday");
    setRating(1);
    setComments("");
    setApplicationStatus("");
  };

  const handlesendupdate = async (id: string, status: string) => {
    const updateData = {
      applicationStatus: status,
      quranReading,
      tajweed,
      arabicSpeaking,
      arabicWriting,
      englishSpeaking,
      preferedWorkingDays: workingDays,
      overallRating: rating,
      comments,
      level: "1",
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      const response = await axios.put(
        `https://api.blackstoneinfomatics.tech/applicants/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ Explicitly set the content type
          },
        }
      );
       setSuccess(true);
       setSuccessMessage(status);
      console.log("✅ Update successful:", response.data);
      handleviewclose();
    } catch (error: any) {
      console.error("❌ Update error:", error.response?.data || error.message);
    }
  };

  const [country, setCountry] = useState("USA");
  const [cities, setCities] = useState([]);
  const countriesCities = require("countries-cities");

  useEffect(() => {
    const fetchedCities = countriesCities.getCities(country);
    setCities(fetchedCities);
  }, [country]);

  function createBlobUrlFromData(uploadResume: {
    type: string;
    data: number[];
  }): string | undefined {
    if (!uploadResume?.data?.length) return undefined;

    try {
      const byteArray = new Uint8Array(uploadResume.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to create Blob URL:", error);
      return undefined;
    }
  }

  return (
    <BaseLayout3>
      <div className="">
        <SupervisorHeader currentSection="Applicants" />
        <div className="md:p-0 mx-auto">
          <div className="h-full w-full  flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                  <div className="flex flex-wrap gap-2 mb-0">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 md:px-3 md:py-1 text-[16px] font-medium
                           ${
                             activeTab === tab
                               ? "text-[#576CBC] border-b-2 border-b-[#576CBC] mt-[2px] dark:text-[#576CBC]"
                               : "text-[#010E30] mt-0 dark:text-[white]"
                           }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[588px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
                  {/* Header Search & Filter */}
                  <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by keyword"
                        className="bg-transparent outline-none text-[15px] w-52 py-3 "
                      />
                    </div>

                    <div
                      className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      {/* <BsFilterLeft /> */}
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>

                    <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                      <span className="text-left -ml-60 ">
                        Showing {currentApplicants.length} Of 50
                      </span>
                    </div>
                  </div>

                  {/* Table */}
                  <table
                    className="table-auto w-full"
                    style={{ width: "100%", tableLayout: "fixed" }}
                  >
                    <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                      <tr className="font-medium">
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Applicant Name
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Application Date
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Contact
                        </th>
                        <th
                          className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]"
                          style={{ wordWrap: "break-word", width: "15%" }}
                        >
                          Email id
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Position Applied
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Resume
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Status
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Level
                        </th>
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentApplicants.map(
                        (applicant: any, index: number) => (
                          <tr
                            key={applicant._id}
                            className={`text-[12px] ${
                              index % 2 === 0
                                ? "bg-[#fff] dark:bg-[#2C2C2C] "
                                : "bg-[#F8F8F8] dark:bg-[#303030]"
                            }`}
                          >
                            <td className="px-3 py-2 text-[#3D8FDE] font-medium">
                              {applicant.candidateFirstName}
                            </td>
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                              {new Date(applicant.applicationDate)
                                .toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                                .replace(",", ",")}
                            </td>
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                              {applicant.candidatePhoneNumber}
                            </td>
                            <td
                              className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]"
                              style={{ wordWrap: "break-word" }}
                            >
                              {applicant.candidateEmail}
                            </td>
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                              {applicant.positionApplied}
                            </td>
                            <td className="px-3 py-2">
                              {applicant.uploadResume?.data?.length ? (
                                <a
                                  href={
                                    createBlobUrlFromData(
                                      applicant.uploadResume
                                    ) || undefined
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#38619A] hover:underline flex items-center gap-1"
                                >
                                  <ImAttachment className="w-4 h-4" />
                                  Resume
                                </a>
                              ) : (
                                <span className="text-gray-400 italic">
                                  No Resume
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-2">
                              <span
                                className={`text-[10px] font-semibold px-3 py-1 rounded-full ${getStatusColor(
                                  applicant.applicationStatus
                                )}`}
                              >
                                {applicant.applicationStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={`star-${star}`}
                                    className={`w-4 h-4 ${
                                      (Number(applicant?.level) || 0) >= star
                                        ? "text-[#FAAB3C]"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="relative">
                                <button
                                  onClick={() => handleMenuClick(applicant._id)}
                                  className="p-2 rounded-md"
                                >
                                  <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                                </button>
                                {openMenuId === applicant._id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    {/* Show Edit only if supervisorId matches */}
                                    {supervisorId &&
                                      supervisorId ===
                                        String(
                                          applicant.supervisor?.supervisorId
                                        ) && (
                                        <button
                                          onClick={() => handleEdit(applicant)}
                                          className="block w-full px-4 py-2 text-left text-[12px] text-slate-600"
                                        >
                                          Edit
                                        </button>
                                      )}

                                    <button
                                      onClick={() =>
                                        handleViewDetails(applicant)
                                      }
                                      className="block w-full px-4 py-2 text-left text-[12px] text-slate-600"
                                    >
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => setOpenMenuId(null)}
                                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <SuccessPopup onClose={() => setSuccess(false)} title={successMessage} />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
            {/* Close Icon */}
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Filter by</h2>

            {/* Date Input */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                Date Range
              </label>

              <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                    // value={exp.fromDate}
                  />
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                    // value={exp.toDate}
                  />
                </div>
            </div>

            {/* Position Applied */}
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium mb-1"
              >
                Position Applied
              </label>
              <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                <option>Islamic</option>
                <option>Quran</option>
                <option>Tajweed</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Application Status
              </label>
              <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Waiting</option>
                <option>Approved</option>
                <option>New Application</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <>
          {/* Dimmed background that closes the panel on click */}
          <button
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={handleviewclose}
            aria-label="Close panel"
          />

          {/* Slide-over panel */}
          <div className="fixed top-0 h-full w-[666px] right-0 z-50 bg-white  shadow-xl flex flex-col  dark:bg-[#343434]">
            {/* Header (Fixed) */}
            <div
              className="flex justify-between items-center p-6 border-b dark: border-none bg-[#FCFCFD] dark:bg-[#343434] z-10"
              style={{
                width: "666px",
                height: "114px",
                position: "sticky",
                top: 0,
              }}
            >
              {/* Left: Profile Info */}
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-[#0A0A14] leading-tight dark:text-[#fff]">
                      {Applicantbyid?.candidateFirstName}{" "}
                      {Applicantbyid?.candidateLastName}
                    </h2>
                  </div>
                  <div className="mt-1 text-[10px] text-[#0A0A14] font-medium flex items-center gap-2 dark:text-[#D6D6D6]">
                    <span>Applied for</span>
                    <span className="text-[#D28F35] px-3 py-1 text-sm rounded-md font-medium text-[10px]">
                      {Applicantbyid?.positionApplied}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Status + Close */}
              <div className="flex flex-col items-end gap-3">
                {/* Close Button */}
                <button
                  onClick={handleviewclose}
                  className="text-[#0A0A14] text-[18px] font-bold hover:text-black dark:text-[#fff]"
                >
                  <IoCloseOutline />
                </button>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {/* STATUS label */}
                  <span className="text-[12px] text-[#0A0A14] font-medium tracking-wide uppercase dark:text-[#fff]">
                    STATUS
                  </span>

                  {/* STATUS value */}
                  <span className="text-[12px] font-medium text-[#0A0A14] border border-[#E5E7EB] px-4 py-1.5 rounded-xl dark:border-[#5f5959] dark:text-[#B8B8B8]">
                    {Applicantbyid?.applicationStatus ?? "New Application"}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto scrollbar-none flex-grow px-8 py-4 space-y-6">
              <div className="flex items-stretch gap-4 w-full">
                {/* Left Column */}
                <div className="flex flex-col w-[262px] gap-4 flex-shrink-0">
                  {/* Personal Details */}
                  <div className=" border border-[#E0E4E9] rounded-2xl p-4 text-sm text-gray-800 shadow-sm dark:border-[#5F5959]">
                    <h3 className="text-[12px] font-semibold mb-6 text-[#010E30] dark:text-[#fff]">
                      Personal details
                    </h3>
                    {[
                      {
                        label: "FULL NAME",
                        value: `${Applicantbyid?.candidateFirstName} ${Applicantbyid?.candidateLastName}`,
                      },
                      {
                        label: "E-MAIL",
                        icon: <Mail className="w-4 h-4" />,
                        value: Applicantbyid?.candidateEmail,
                      },
                      {
                        label: "PHONE",
                        icon: <Phone className="w-4 h-4" />,
                        value: Applicantbyid?.candidatePhoneNumber,
                      },
                      { label: "LINKEDIN", value: "linkedInjd/in/j.str" },
                      { label: "APPLIED", value: Applicantbyid?.createdDate },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-2 border-t border-[#E0E4E9] dark:border-[#5F5959]"
                      >
                        <div className="uppercase text-[10px] text-gray-500 font-medium dark:text-[#D6D6D6]">
                          {label}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-[#010E30] dark:text-[#D6D6D6]">
                          {icon}
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Experience */}
                  {Applicantbyid?.professionalExperience && (
                    <div className="h-[300px] overflow-y-auto overflow-x-hidden scrollbar-hide border border-[#E0E4E9] rounded-2xl p-4 text-sm text-gray-800 shadow-sm dark:border-[#5F5959]">
                      <h3 className="text-[12px] font-semibold text-[#010E30] mb-3 dark:text-[#fff]">
                        Professional Experience
                      </h3>

                      {(() => {
                        const lines: string[] = String(
                          Applicantbyid.professionalExperience
                        ).split("\n");
                        const experiences: {
                          role: string;
                          location: string;
                          date: string;
                          details: string[];
                        }[] = [];

                        let current: {
                          role: string;
                          location: string;
                          date: string;
                          details: string[];
                        } | null = null;

                        const headerRegex =
                          /(.*?),\s*(.*?)(?:\s+([A-Za-z]{3}\s*[-–]?\s*\d{4})(?:\s*(?:to|-|–)\s*(Present|\d{4}))?)/i;

                        for (const line of lines) {
                          const trimmed: string = line.trim();
                          if (!trimmed) continue;

                          const match = trimmed.match(headerRegex);
                          if (match) {
                            if (current) experiences.push(current);

                            const [, role, location, start, end] = match;
                            current = {
                              role: role.trim(),
                              location: location.trim(),
                              date: `${start}${end ? " - " + end : ""}`,
                              details: [],
                            };
                          } else if (current) {
                            current.details.push(trimmed.replace(/^•\s*/, ""));
                          }
                        }
                        if (current) experiences.push(current);

                        return experiences.map((exp, idx) => (
                          <div key={idx} className="mb-4">
                            <h4 className="text-[12px] text-[#010E30] font-semibold dark:text-[#fff]">
                              {exp.role}
                            </h4>
                            <div className="flex flex-wrap justify-between text-[10px] text-[#8A8383] mt-1 dark:text-[#D6D6D6]">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{exp.date}</span>
                              </div>
                              <span>{exp.location}</span>
                            </div>
                            {exp.details.length > 0 && (
                              <ul className="list-disc list-inside mt-2 text-[11px] text-[#4B5563] dark:text-[#E0E0E0]">
                                {exp.details.map((detail, i) => (
                                  <li key={i}>{detail}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col w-[300px] gap-1 flex-shrink-0">
                  {[
                    {
                      label: "Quran Reading",
                      state: quranReading,
                      setState: setQuranReading,
                    },
                    { label: "Tajweed", state: tajweed, setState: setTajweed },
                    {
                      label: "Arabic Speaking",
                      state: arabicSpeaking,
                      setState: setArabicSpeaking,
                    },
                    {
                      label: "Arabic Writing",
                      state: arabicWriting,
                      setState: setArabicWriting,
                    },
                    {
                      label: "English Speaking",
                      state: englishSpeaking,
                      setState: setEnglishSpeaking,
                    },
                  ].map(({ label, state, setState }) => (
                    <div key={label} className="mt-3">
                      <div className="text-[12px] font-Medium text-[#1E2A41] dark:text-[#fff]">
                        {label}
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px] font-medium text-[#989292]">
                        {["Basic", "Medium", "Advanced"].map((level) => (
                          <label
                            key={level}
                            className={`flex items-center gap-2 rounded px-3 py-1 transition-all dark:border border-[#E0E4EA] ${
                              state === level
                                ? "border border-[#D9DEE8]"
                                : "border border-[#D9DEE8]"
                            }`}
                          >
                            <input
                              type="radio"
                              name={label}
                              value={level}
                              checked={state === level}
                              onChange={() => setState(level)}
                              disabled={mode === "view"}
                              className="appearance-none w-[10px] h-[10px] rounded-full border border-[#333D58] checked:bg-[#1E2A41] checked:ring-1 checked:ring-offset-1 transition-all 
                                       dark:border-[#A9A9A9] dark:checked:bg-[#E5E5E5] dark:checked:ring-[#E5E5E5] dark:ring-offset-[#333D58] disabled:opacity-50"
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Preferences */}
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {/* Preferred Working Days */}
                    <div>
                      <label
                        htmlFor="prferworking days"
                        className="block text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff]"
                      >
                        Preferred Working Days
                      </label>
                      <select
                        className="border rounded px-2 py-1 w-full text-[10px] font-medium text-[#1E2A41] dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292] disabled:opacity-50"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(e.target.value)}
                        disabled={mode === "view"}
                      >
                        {[
                          "Monday-Saturday",
                          "Monday-Friday",
                          "Sunday-Thursday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Working Hours */}
                    <div>
                      <label
                        htmlFor="prferworking Hours"
                        className="block text-[11px] font-semibold text-[#1E2A41] mb-1 dark:text-[#fff]"
                      >
                        Preferred Working Hours
                      </label>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full text-[10px] font-medium text-[#1E2A41] dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292]"
                        value={Applicantbyid?.preferedWorkingHours}
                        disabled
                      />
                    </div>

                    {/* Expected Salary per Hour */}
                    <div>
                      <label
                        htmlFor="Expected Salary per Hour"
                        className="block text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff]"
                      >
                        Expected Salary per Hour
                      </label>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full text-[10px] font-medium text-[#1E2A41] dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292]"
                        value={Applicantbyid?.expectedSalary}
                        disabled
                      />
                    </div>

                    {/* Overall Rating */}
                    <div>
                      <label
                        htmlFor="Overall Rating"
                        className="block text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff]"
                      >
                        Overall Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`text-xl cursor-pointer ${
                              rating >= star ? "text-yellow-500" : "text-gray-300"
                            } ${mode === "view" ? "cursor-default" : ""}`}
                            onClick={() => mode !== "view" && setRating(star)}
                            type="button"
                            disabled={mode === "view"}
                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="mt-3">
                    <div className="text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff]">
                      Comments
                    </div>
                    <textarea
                      className="w-full p-2 border rounded h-24 resize-none text-[10px] font-medium text-[#1E2A41] dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292] disabled:opacity-50"
                      placeholder="Add your comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}

              <div>
                <h3 className="font-medium text-[12px] border-b border-[#E0E4E9] dark:border-[#5F5959] pb-1 mb-3 text-[#1E2A41] dark:text-[#fff]">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  {parsedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 border rounded-full text-[#010E30E5] bg-gray-50 dark:bg-[#343434] dark:text-[#d5d5d5] border-[#E0E4E9] dark:border-[#5F5959]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-medium text-[#010E30] text-[12px] border-b dark:border-b-[#5F5959] pb-1 mb-3 dark:text-[#fff]">
                  Documents
                </h3>
                <a
                  href={resumeImages ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#5183CA] hover:underline text-[13px]"
                >
                  <ImAttachment /> Resume
                </a>
              </div>
            </div>

            {/* Footer (Fixed) */}
            <div className="w-full border-t p-3 flex justify-end gap-3 bg-white z-10 dark:bg-[#343434] dark:border-t-[#5F5959]">
              {mode === "edit" && (
                <>
                  <button
                    onClick={() =>
                      handlesendupdate(Applicantbyid?._id ?? "", "REJECTED")
                    }
                    className="px-4 py-2 text-[12px] text-[#D34645] bg-[#FDECEC] rounded-lg dark:bg-[#543838]"
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() =>
                      handlesendupdate(Applicantbyid?._id ?? "", "WAITING")
                    }
                    className="px-4 py-2 text-[12px] text-[#F0AD4E] bg-[#FDF6EC] rounded-lg dark:bg-[#5A4D3B]"
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() =>
                      handlesendupdate(Applicantbyid?._id ?? "", "SHORTLISTED")
                    }
                    className="px-4 py-2 text-[12px] text-[#377E36] bg-[#ECFDF3] rounded-lg dark:bg-[#377E3633]"
                  >
                    Shortlisted
                  </button>
                  <button
                    onClick={() =>
                      handlesendupdate(Applicantbyid?._id ?? "", applicationStatus)
                    }
                    className="px-4 py-2 text-[12px] text-[#4E91F0] bg-[#ECF3FD] rounded-lg dark:bg-[#39475A]"
                  >
                    Send for Approval
                  </button>
                </>
              )}
              {mode === "view" && (
                <button
                  onClick={handleviewclose}
                  className="px-4 py-2 text-[12px] text-[#4E91F0] bg-[#ECF3FD] rounded-lg dark:bg-[#39475A]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </BaseLayout3>
  );
}
