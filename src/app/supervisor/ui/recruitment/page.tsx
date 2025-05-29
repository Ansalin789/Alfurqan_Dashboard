"use client";

import React, { useState, useEffect, useRef } from "react";
import { CountryDropdown } from "react-country-region-selector";
import {
  Star,
  MoreVertical,
  FileText,
  Upload,
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
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [Applicantbyid, setApplicantbyid] = useState<ApiResponse | null>(null);
  const [resumeImages, setResumeImages] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const [addApplicantForm, setAddApplicantForm] =
    useState<AddApplicantFormData>({
      applicationDate: new Date().toISOString().split("T")[0],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      country: "USA",
      city: "",
      position: "Arabic Teacher",
      expectedSalary: "",
      workingHours: "",
      resume: null,
      comment: "",
    });
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

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorAuthToken")
        : null;

    if (!token) {
      console.error("❌ SupervisorAuthToken not found");
      return;
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
          `https://api.blackstoneinfomaticstech.com/applicants/${_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Applicant data received:", response.data);
        setApplicantbyid(response.data);
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

  const handleAddApplicantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("applicationDate", addApplicantForm.applicationDate);
    formData.append("candidateFirstName", addApplicantForm.firstName); // Changed
    formData.append("candidateLastName", addApplicantForm.lastName); // Changed
    formData.append("candidateEmail", addApplicantForm.email); // Changed
    formData.append("candidatePhoneNumber", addApplicantForm.phone); // Changed
    formData.append("candidateCountry", addApplicantForm.country); // Changed
    formData.append("candidateCity", addApplicantForm.city); // Changed
    formData.append("positionApplied", addApplicantForm.position);
    formData.append("gender", addApplicantForm.gender);
    formData.append("currency", "$"); // Changed
    formData.append("expectedSalary", addApplicantForm.expectedSalary); // Changed
    formData.append("preferedWorkingHours", addApplicantForm.workingHours); // Changed
    formData.append("comments", addApplicantForm.comment); // Changed
    formData.append("applicationStatus", "NEWAPPLICATION");
    formData.append("overallRating", "1");
    formData.append("status", "Active");

    if (addApplicantForm.resume) {
      formData.append("uploadResume", addApplicantForm.resume);
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }
      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/recruit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Applicant added successfully!");
        setShowAddApplicant(false);
        setAddApplicantForm({
          applicationDate: new Date().toISOString().split("T")[0],
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "USA",
          city: "",
          gender: "",
          position: "Arabic Teacher",
          expectedSalary: "",
          workingHours: "",
          resume: null,
          comment: "",
        });
      }
    } catch (error) {
      console.error("Error adding applicant:", error);
      alert("Failed to add applicant");
    }
    setShowAddApplicant(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAddApplicantForm({ ...addApplicantForm, resume: e.target.files[0] });
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handlesendupdate = async (id: string) => {
    // Map the state to the data you want to send
    const updateData = {
      applicationStatus: applicationStatus, // static value, you can update based on logic
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
    console.log(updateData);
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
        `https://api.blackstoneinfomaticstech.com/applicants/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update successful:", response.data);
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
    handleviewclose();
  };

  const [country, setCountry] = useState("USA");
  const [cities, setCities] = useState([]);
  const countriesCities = require("countries-cities");

  useEffect(() => {
    const fetchedCities = countriesCities.getCities(country);
    setCities(fetchedCities);
  }, [country]);

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
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    {/* <button
                      onClick={() => setShowAddApplicant(true)}
                      className="bg-[#012A4A] font-medium text-[12px] hover:bg-[#0d202f] text-white px-2 py-0 rounded-md transition-colors"
                    >
                      + Add Applicant
                    </button> */}
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
                    <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 dark:text-gray-400">
                      {/* <BsFilterLeft /> */}
                      <svg
                        className="text-gray-400 dark:text-gray-400"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_3603_6313"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="25"
                          height="24"
                        >
                          <rect
                            x="0.335938"
                            width="24"
                            height="24"
                            fill="#D9D9D9"
                          />
                        </mask>
                        <g mask="url(#mask0_3603_6313)">
                          <path
                            d="M4.33594 19C4.0526 19 3.81527 18.904 3.62394 18.712C3.43194 18.5207 3.33594 18.2833 3.33594 18C3.33594 17.7167 3.43194 17.4793 3.62394 17.288C3.81527 17.096 4.0526 17 4.33594 17H8.33594C8.61927 17 8.85694 17.096 9.04894 17.288C9.24027 17.4793 9.33594 17.7167 9.33594 18C9.33594 18.2833 9.24027 18.5207 9.04894 18.712C8.85694 18.904 8.61927 19 8.33594 19H4.33594ZM4.33594 7C4.0526 7 3.81527 6.90433 3.62394 6.713C3.43194 6.521 3.33594 6.28333 3.33594 6C3.33594 5.71667 3.43194 5.479 3.62394 5.287C3.81527 5.09567 4.0526 5 4.33594 5H12.3359C12.6193 5 12.8569 5.09567 13.0489 5.287C13.2403 5.479 13.3359 5.71667 13.3359 6C13.3359 6.28333 13.2403 6.521 13.0489 6.713C12.8569 6.90433 12.6193 7 12.3359 7H4.33594ZM12.3359 21C12.0526 21 11.8153 20.904 11.6239 20.712C11.4319 20.5207 11.3359 20.2833 11.3359 20V16C11.3359 15.7167 11.4319 15.479 11.6239 15.287C11.8153 15.0957 12.0526 15 12.3359 15C12.6193 15 12.8569 15.0957 13.0489 15.287C13.2403 15.479 13.3359 15.7167 13.3359 16V17H20.3359C20.6193 17 20.8566 17.096 21.0479 17.288C21.2399 17.4793 21.3359 17.7167 21.3359 18C21.3359 18.2833 21.2399 18.5207 21.0479 18.712C20.8566 18.904 20.6193 19 20.3359 19H13.3359V20C13.3359 20.2833 13.2403 20.5207 13.0489 20.712C12.8569 20.904 12.6193 21 12.3359 21ZM8.33594 15C8.0526 15 7.81494 14.904 7.62294 14.712C7.4316 14.5207 7.33594 14.2833 7.33594 14V13H4.33594C4.0526 13 3.81527 12.904 3.62394 12.712C3.43194 12.5207 3.33594 12.2833 3.33594 12C3.33594 11.7167 3.43194 11.479 3.62394 11.287C3.81527 11.0957 4.0526 11 4.33594 11H7.33594V10C7.33594 9.71667 7.4316 9.479 7.62294 9.287C7.81494 9.09567 8.0526 9 8.33594 9C8.61927 9 8.85694 9.09567 9.04894 9.287C9.24027 9.479 9.33594 9.71667 9.33594 10V14C9.33594 14.2833 9.24027 14.5207 9.04894 14.712C8.85694 14.904 8.61927 15 8.33594 15ZM12.3359 13C12.0526 13 11.8153 12.904 11.6239 12.712C11.4319 12.5207 11.3359 12.2833 11.3359 12C11.3359 11.7167 11.4319 11.479 11.6239 11.287C11.8153 11.0957 12.0526 11 12.3359 11H20.3359C20.6193 11 20.8566 11.0957 21.0479 11.287C21.2399 11.479 21.3359 11.7167 21.3359 12C21.3359 12.2833 21.2399 12.5207 21.0479 12.712C20.8566 12.904 20.6193 13 20.3359 13H12.3359ZM16.3359 9C16.0526 9 15.8153 8.904 15.6239 8.712C15.4319 8.52067 15.3359 8.28333 15.3359 8V4C15.3359 3.71667 15.4319 3.479 15.6239 3.287C15.8153 3.09567 16.0526 3 16.3359 3C16.6193 3 16.8566 3.09567 17.0479 3.287C17.2399 3.479 17.3359 3.71667 17.3359 4V5H20.3359C20.6193 5 20.8566 5.09567 21.0479 5.287C21.2399 5.479 21.3359 5.71667 21.3359 6C21.3359 6.28333 21.2399 6.521 21.0479 6.713C20.8566 6.90433 20.6193 7 20.3359 7H17.3359V8C17.3359 8.28333 17.2399 8.52067 17.0479 8.712C16.8566 8.904 16.6193 9 16.3359 9Z"
                            fill="#252525"
                            fill-opacity="0.3"
                          />
                        </g>
                      </svg>
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                      <span className="text-left -ml-60 ">
                        Showing {currentApplicants.length} Of 50
                      </span>
                    </div>
                  </div>

                  {/* Table */}
                  <table className="table-auto w-full">
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
                        <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
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
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                              {applicant.candidateEmail}
                            </td>
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                              {applicant.positionApplied}
                            </td>
                            <td className="px-3 py-2">
                              <button className="text-[#38619A] hover:underline flex items-center gap-1">
                                <ImAttachment className="w-4 h-4" />
                                Resume
                              </button>
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
                                    <button className="block w-full px-4 py-2 text-left text-[12px] text-[#353232]">
                                      Edit
                                    </button>
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
                                      className="block w-full px-4 py-2 text-left text-[12px] text-red-600 hover:bg-gray-50"
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

      {showAddApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[500px]">
            <h2 className="text-[16px] font-semibold text-gray-800 mb-4 text-center">
              Add Applicant
            </h2>
            <form onSubmit={handleAddApplicantSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Date */}
                <div>
                  <label
                    htmlFor="applicationDate"
                    className="block text-gray-700 text-[12px] font-medium mb-2"
                  >
                    Application Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={addApplicantForm.applicationDate}
                      onChange={(e) =>
                        setAddApplicantForm({
                          ...addApplicantForm,
                          applicationDate: e.target.value,
                        })
                      }
                      id="applicationDate"
                      className="w-full px-4 py-2 text-[11px] rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={addApplicantForm.firstName}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        firstName: e.target.value,
                      })
                    }
                    id="firstName"
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={addApplicantForm.lastName}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        lastName: e.target.value,
                      })
                    }
                    id="lastName"
                    className="w-full px-4 py-2 rounded-lg border text-[11px] border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={addApplicantForm.gender}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border text-[11px] border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={addApplicantForm.email}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        email: e.target.value,
                      })
                    }
                    id="email"
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    value={addApplicantForm.phone}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        phone: e.target.value,
                      })
                    }
                    id="phoneNumber"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Country
                  </label>
                  <CountryDropdown
                    value={addApplicantForm.country}
                    onChange={(val) => {
                      setCountry(val);
                      setAddApplicantForm({
                        ...addApplicantForm,
                        country: val,
                      });
                    }}
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    City
                  </label>
                  <select
                    id="city"
                    value={addApplicantForm.city}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select a city</option>
                    {cities?.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Position Applied & Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="position"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Position Applied
                  </label>
                  <select
                    id="position"
                    value={addApplicantForm.position}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        position: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Arabic Teacher">Arabic Teacher</option>
                    <option value="English Teacher">Quran Teacher</option>
                    <option value="Math Teacher">
                      Islamic Studies Teacher
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="salary"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Expected Salary per Hour
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={addApplicantForm.expectedSalary}
                      onChange={(e) =>
                        setAddApplicantForm({
                          ...addApplicantForm,
                          expectedSalary: e.target.value,
                        })
                      }
                      id="salary"
                      className="w-full px-4 py-2 text-[11px] rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button className="absolute inset-y-0 right-0 px-3 text-[11px] text-[#1C3557] hover:underline focus:outline-none">
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferred Working Hours & Resume */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="workingHours"
                    className="block text-gray-600 text-[12px] font-medium mb-2"
                  >
                    Preferred Working Hours
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={addApplicantForm.workingHours}
                      onChange={(e) =>
                        setAddApplicantForm({
                          ...addApplicantForm,
                          workingHours: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="resume"
                    className="text-gray-600 text-[12px] font-medium mb-2 flex items-center"
                  >
                    Upload Resume
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                      {addApplicantForm.resume
                        ? addApplicantForm.resume.name
                        : "No file selected"}
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-[11px] bg-[#1C3557] text-white rounded-lg hover:bg-[#0e1a2c] flex items-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </button>
                  </div>
                  {addApplicantForm.resume && (
                    <p className="mt-2 text-[11px] text-gray-500">
                      Selected file: {addApplicantForm.resume.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-gray-600 text-[12px] font-medium mb-2"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={addApplicantForm.comment}
                  onChange={(e) =>
                    setAddApplicantForm({
                      ...addApplicantForm,
                      comment: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Write your comment here..."
                  className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddApplicant(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-[12px] hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddApplicantSubmit}
                  className="px-4 py-2 bg-[#1C3557] text-white rounded-lg text-[12px] hover:bg-[#0e1a2c]"
                >
                  Save
                </button>
              </div>
            </form>
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
                    <div className="flex items-center gap-1 text-sm text-[#6B7280] dark:text-[#D6D6D6]">
                      <FileText className="w-3 h-3" />
                      <span className="text-[10px] font-medium">CV.pdf</span>
                    </div>
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
                  <div className="border border-[#E0E4E9]  rounded-2xl p-4 text-sm text-gray-800 shadow-sm dark:border-[#5F5959]">
                    <h3 className="text-[12px] font-semibold text-[#010E30] mb-3 dark:text-[#fff]">
                      Professional Experience
                    </h3>
                    <div className="mb-4">
                      <h4 className="text-[12px] text-[#010E30] font-semibold dark:text-[#fff]">
                        Professor
                      </h4>
                      <div className="flex flex-wrap justify-between text-[10px] text-[#8A8383] mt-1 dark:text-[#D6D6D6]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Jan, 2023 - Present</span>
                        </div>
                        <span>United States</span>
                      </div>
                      <h5 className="text-[12px] text-[#010E30] mt-2 font-semibold uppercase dark:text-[#fff]">
                        BS Institutions
                      </h5>
                      <ul className="list-disc pl-5 mt-1 text-[10px] text-[#525252] dark:text-[#D6D6D6]">
                        <li>
                          Developed React.js components for improved user
                          engagement,
                        </li>
                        <li>
                          Collaborated on RESTful APIs for seamless data
                          exchange,
                        </li>
                        <li>
                          Optimized performance through efficient algorithms.
                        </li>
                      </ul>
                    </div>
                  </div>
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
                      {" "}
                      {/* added mt-3 */}
                      <div className="text-[12px] font-Medium text-[#1E2A41] dark:text-[#fff]">
                        {label}
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px] font-medium text-[#989292]">
                        {["Basic", "Medium", "Advanced"].map((level) => (
                          <label
                            key={level}
                            className={`flex items-center gap-2 rounded px-3 py-1 transition-all  dark:border border-[#E0E4EA] ${
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
                              className="appearance-none w-[10px] h-[10px] rounded-full border border-[#333D58] checked:bg-[#1E2A41] checked:ring-1 checked:ring-offset-1 transition-all 
                                       dark:border-[#A9A9A9] dark:checked:bg-[#E5E5E5] dark:checked:ring-[#E5E5E5] dark:ring-offset-[#333D58]"
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
                        className="block text-[11px] font-medium  text-[#1E2A41] mb-1 dark:text-[#fff]"
                      >
                        Preferred Working Days
                      </label>
                      <select
                        className="border rounded px-2 py-1 w-full text-[10px] font-medium text-[#1E2A41] dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292]"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(e.target.value)}
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
                        className="block text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff] "
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
                        className="block text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff] "
                      >
                        Overall Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`text-xl cursor-pointer ${
                              rating >= star
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                            type="button"
                            aria-label={`Rate ${star} star${
                              star > 1 ? "s" : ""
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="mt-3">
                    {" "}
                    {/* added mt-3 */}
                    <div className="text-[11px] font-medium text-[#1E2A41] mb-1 dark:text-[#fff] ">
                      Comments
                    </div>
                    <textarea
                      className="w-full p-2 border rounded h-24 resize-none text-[10px] font-medium text-[#1E2A41]  dark:bg-[#343434] dark:border-[#5f5959] dark:text-[#989292]"
                      placeholder="Add your comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-medium  text-[12px] border-b border-[#E0E4E9] dark:border-[#5F5959] pb-1 mb-3 text-[#1E2A41]  dark:text-[#fff] ">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {[
                    "JavaScript",
                    "Python",
                    "HTML5",
                    "CSS3",
                    "React.js",
                    "Node.js",
                    "MongoDB",
                    "Git",
                    "JIRA",
                    "Slack",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 border rounded-full text-[#010E30E5] bg-gray-50 dark:bg-[#343434] dark:text-[#d5d5d5] border-[#E0E4E9] dark:border-[#5F5959] "
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
              <button
                onClick={() => setApplicationStatus("REJECTED")}
                className="px-4 py-2 text-[12px] text-[#D34645] bg-[#FDECEC] rounded-lg dark:bg-[#543838]"
              >
                Rejected
              </button>
              <button
                onClick={() => setApplicationStatus("WAITING")}
                className="px-4 py-2 text-[12px] text-[#F0AD4E] bg-[#FDF6EC] rounded-lg dark:bg-[#5A4D3B]"
              >
                Waiting
              </button>
              <button
                onClick={() => setApplicationStatus("SHORTLISTED")}
                className="px-4 py-2 text-[12px] text-[#377E36] bg-[#ECFDF3] rounded-lg  dark:bg-[#377E3633]"
              >
                Shortlisted
              </button>
              <button
                onClick={() => handlesendupdate(Applicantbyid?._id ?? "")}
                className="px-4 py-2 text-[12px] text-[#4E91F0] bg-[#ECF3FD] rounded-lg dark:bg-[#39475A]"
              >
                Send for Approval
              </button>
            </div>
          </div>
        </>
      )}
    </BaseLayout3>
  );
}
