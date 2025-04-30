// components/ApplicantsList.tsx
import React, { useEffect, useState } from "react";
import {  FileText, Star, Upload, X } from "lucide-react";
import axios from "axios";

interface Supervisor {
  supervisorId: string;
  supervisorName: string;
  supervisorEmail: string;
  supervisorRole: string;
}

interface Applicant {
  _id: string;
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
  candidatePhoneNumber: string | number;
  applicationStatus: string;
  positionApplied: string;
  applicationDate: string;
  level?: string;
  gender?: string;
  candidateCountry?: string;
  candidateCity?: string;
  currency?: string;
  expectedSalary?: number;
  preferedWorkingHours?: string;
  uploadResume?: {
    type: string;
    data: any[];
  };
  comments?: string;
  overallRating?: number;
  professionalExperience?: string;
  skills?: string;
  status?: string;
  createdDate?: string;
  createdBy?: string;
  __v?: number;
  supervisor?: Supervisor;
}


const  ApplicantsList: React.FC = () => {
  // Static data for demonstration
   const [applicants, setApplicants] = useState<Applicant[]>([]);

  const [activeTab, setActiveTab] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [showAddApplicant, setShowAddApplicant] = React.useState(false);
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);
  // Static form state
  const [addApplicantForm, setAddApplicantForm] = React.useState({
    applicationDate: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    position: "Arabic Teacher",
    expectedSalary: "",
    workingHours: "",
    resume: null as File | null,
    comment: ""
  });

  // Static view state
  const [quranReading, setQuranReading] = React.useState("Basic");
  const [tajweed, setTajweed] = React.useState("Medium");
  const [arabicSpeaking, setArabicSpeaking] = React.useState("Advanced");
  const [arabicWriting, setArabicWriting] = React.useState("Medium");
  const [englishSpeaking, setEnglishSpeaking] = React.useState("Advanced");
  const [workingDays, setWorkingDays] = React.useState("Monday-Friday");
  const [rating, setRating] = React.useState(4);
  const [comments, setComments] = React.useState("");
  const [applicationStatus, setApplicationStatus] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs = ["All", "NewApplication", "Shortlisted", "Rejected", "Waiting"];
   useEffect(() => {
    axios.get('http://localhost:5001/applicants')
      .then((res) => {
        setApplicants(res.data.applicants); 
      })
      .catch((err) => {
        console.error('Error fetching applicants:', err);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEWAPPLICATION":
        return "bg-blue-500 text-white px-2 text-[9px]";
      case "SHORTLISTED":
        return "bg-[#79D67B] text-white px-3 text-[9px]";
      case "REJECTED":
        return "bg-[#D12B36] text-white px-2 text-[9px]";
      case "WAITING":
        return "bg-yellow-500 text-white px-2 text-[9px]";
      case "APPROVED":
        return "bg-green-500 text-white px-7 text-[9px]";
      default:
        return "bg-gray-300 text-black px-2 text-[9px]";
    }
  };
  

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMenuClick = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpenMenuId(null);
  };

  const handleviewclose = () => {
    setSelectedApplicant(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddApplicantForm({
        ...addApplicantForm,
        resume: e.target.files[0]
      });
    }
  };

  const handleAddApplicantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the form data here
    console.log("Form submitted:", addApplicantForm);
    setShowAddApplicant(false);
    // Reset form
    setAddApplicantForm({
      applicationDate: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      position: "Arabic Teacher",
      expectedSalary: "",
      workingHours: "",
      resume: null,
      comment: ""
    });
  };

  const handlesendupdate = (id: string) => {
    console.log(`Status updated for applicant ${id} to ${applicationStatus}`);
    setSelectedApplicant(null);
  };

  const filteredApplicants = activeTab === "All" 
    ? applicants 
    : applicants.filter(applicant => applicant.applicationStatus === activeTab.toUpperCase());

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  return (
    <div className=" mx-auto">
      <div className="mx-auto">
  <div className="bg-white shadow-md border border-gray-900 rounded-lg  flex h-[430px] mb-4">
    <div className="w-full flex flex-col mt-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 space-y-3 md:space-y-0 px-4 mt-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 text-sm rounded-md font-semibold ${
                activeTab === tab
                  ? "text-white bg-[#012A4A]"
                  : "text-[#05445E] hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 whitespace-nowrap">
            Sort by:
          </span>
          <select className="px-2 py-1 border rounded-md text-slate-600 bg-white text-xs">
            <option>Designation</option>
            <option>Date</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto w-full h-[400px] ">
        <table className="w-full text-xs">
          <thead className="bg-[#F4F5F7] text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-3 whitespace-nowrap">Date</th>
              <th className="px-2 py-3 whitespace-nowrap">Name</th>
              <th className="px-2 py-3 whitespace-nowrap">Contact</th>
              <th className="px-2 py-3 whitespace-nowrap">E-Mail</th>
              <th className="px-2 py-3 whitespace-nowrap">Position</th>
              <th className="px-2 py-3 whitespace-nowrap">Resume</th>
              <th className="px-2 py-3 whitespace-nowrap">Status</th>
              <th className="px-2 py-3 whitespace-nowrap">Level</th>
              {/* <th className="px-2 py-3 whitespace-nowrap">Actions</th> */}
            </tr>
          </thead>
          <tbody>
  {currentApplicants.map((applicant, index) => (
    <tr 
      key={applicant._id} 
      className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
    >
      <td className="px-2 py-2 text-[#17243E] whitespace-nowrap text-center align-middle">
        {formatDate(applicant.applicationDate)}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-center align-middle">
          <span className="font-medium text-slate-800 truncate max-w-[100px]">
            {applicant.candidateFirstName} {applicant.candidateLastName}
          </span>
      </td>
      <td className="px-2 py-2 text-[#17243E] whitespace-nowrap text-center align-middle">
        {applicant.candidatePhoneNumber}
      </td>
      <td className="px-2 py-2 text-[#17243E] whitespace-nowrap truncate max-w-[120px] text-center align-middle">
        {applicant.candidateEmail}
      </td>
      <td className="px-2 py-2 whitespace-nowrap truncate max-w-[100px] text-center align-middle">
        {applicant.positionApplied}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-center align-middle">
        <button className="text-[#5482dd] hover:text-[#0b1421] flex items-center justify-center mx-auto">
          <FileText className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline ">Resume</span>
        </button>
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-center align-middle">
        <div className="flex justify-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-[9px] w-[100px] text-center ${getStatusColor(
              applicant.applicationStatus
            )}`}
          >
            {applicant.applicationStatus}
          </span>
        </div>
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-center align-middle">
        <div className="flex gap-0.5 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={`star-${star}`}
              className={`w-3 h-3 ${
                (Number(applicant.overallRating) || 0) >= star
                  ? "text-[#FAAB3C] fill-[#68b806]"
                  : "text-[#F8D8AB] fill-[#f7f6f5]"
              }`}
            />
          ))}
        </div>
      </td>
      {/* <td className="px-2 py-2 whitespace-nowrap text-center align-middle">
        <div className="relative flex justify-center">
          <button
         
            className="hover:bg-gray-100 p-1 rounded-md"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-600" />
          </button>
          {openMenuId === applicant._id && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
              <button className="block w-full px-3 py-1 text-left text-xs text-[#353232]">
                Edit
              </button>
              <button
                onClick={() => handleViewDetails(applicant)}
                className="block w-full px-3 py-1 text-left text-xs text-slate-600"
              >
                View Details
              </button>
              <button
                onClick={() => setOpenMenuId(null)}
                className="block w-full px-3 py-1 text-left text-xs text-red-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </td> */}
    </tr>
  ))}
</tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 space-y-2 md:space-y-0 border-t mt-auto">
        <div className="text-xs text-gray-600">
          Showing {startIndex + 1} -{" "}
          {Math.min(endIndex, filteredApplicants.length)} of{" "}
          {filteredApplicants.length} entries
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded text-xs ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            &lt;
          </button>

          {totalPages > 5 ? (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-2 py-1 rounded text-xs ${
                  currentPage === 1
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                1
              </button>

              {currentPage > 3 && <span className="px-1 py-1">...</span>}

              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter((page) => page > 1 && page < totalPages)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded text-xs ${
                      currentPage === page
                        ? "bg-[#1B2B65] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {currentPage < totalPages - 2 && <span className="px-1 py-1">...</span>}

              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-2 py-1 rounded text-xs ${
                  currentPage === totalPages
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {totalPages}
              </button>
            </>
          ) : (
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-2 py-1 rounded text-xs ${
                  currentPage === index + 1
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))
          )}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded text-xs ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Add Applicant Modal */}
      {showAddApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[500px]">
            <h2 className="text-[16px] font-semibold text-gray-800 mb-4 text-center">
              Add Applicant
            </h2>
            <form onSubmit={handleAddApplicantSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-[12px] font-medium mb-2">
                    Application Date
                  </label>
                  <input
                    type="date"
                    value={addApplicantForm.applicationDate}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        applicationDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 text-[11px] rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
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
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
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
                    className="w-full px-4 py-2 rounded-lg border text-[11px] border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
                    Gender
                  </label>
                  <select
                    value={addApplicantForm.gender}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border text-[11px] border-gray-300 bg-white"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
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
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
                    Country
                  </label>
                  <select
                    value={addApplicantForm.country}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="UAE">United Arab Emirates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
                    City
                  </label>
                  <select
                    value={addApplicantForm.city}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                  >
                    <option value="">Select a city</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Dubai">Dubai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
                    Position Applied
                  </label>
                  <select
                    value={addApplicantForm.position}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        position: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                  >
                    <option value="Arabic Teacher">Arabic Teacher</option>
                    <option value="Quran Teacher">Quran Teacher</option>
                    <option value="Islamic Studies Teacher">
                      Islamic Studies Teacher
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
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
                      className="w-full px-4 py-2 text-[11px] rounded-lg border border-gray-300"
                    />
                    <button className="absolute inset-y-0 right-0 px-3 text-[11px] text-[#1C3557] hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-[12px] font-medium mb-2">
                    Preferred Working Hours
                  </label>
                  <input
                    type="text"
                    value={addApplicantForm.workingHours}
                    onChange={(e) =>
                      setAddApplicantForm({
                        ...addApplicantForm,
                        workingHours: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-[12px] font-medium mb-2 flex items-center">
                    Upload Resume
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300 bg-white">
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
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-[12px] font-medium mb-2">
                  Comment
                </label>
                <textarea
                  value={addApplicantForm.comment}
                  onChange={(e) =>
                    setAddApplicantForm({
                      ...addApplicantForm,
                      comment: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Write your comment here..."
                  className="w-full px-4 py-2 rounded-lg text-[11px] border border-gray-300"
                ></textarea>
              </div>

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
                  className="px-4 py-2 bg-[#1C3557] text-white rounded-lg text-[12px] hover:bg-[#0e1a2c]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Details Popup */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex max-h-[90vh] items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl relative overflow-hidden">
            <button
              onClick={handleviewclose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex h-full">
              {/* Left Side - Resume */}
              <div className="w-1/2 border-r relative bg-gray-50">
                <div className="relative min-h-full">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Resume preview would appear here</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Questions and Details */}
              <div className="w-1/2 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start p-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xl font-medium">
                      {selectedApplicant.candidateFirstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedApplicant.candidateFirstName}{" "}
                      {selectedApplicant.candidateLastName}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                        {selectedApplicant.positionApplied}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FileText className="w-4 h-4 mr-1" /> CV.pdf
                    </div>
                  </div>
                  <div className="ml-auto mt-8">
                    <div className="text-sm font-medium">
                      {selectedApplicant.applicationStatus}
                    </div>
                  </div>
                </div>

                {/* Questions Section - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Language Proficiency
                  </h3>

                  {/* Language Proficiency Sections */}
                  {[
                    { field: "Quran Reading", state: quranReading, setState: setQuranReading },
                    { field: "Tajweed", state: tajweed, setState: setTajweed },
                    { field: "Arabic Speaking", state: arabicSpeaking, setState: setArabicSpeaking },
                    { field: "Arabic Writing", state: arabicWriting, setState: setArabicWriting },
                    { field: "English Speaking", state: englishSpeaking, setState: setEnglishSpeaking },
                  ].map(({ field, state, setState }) => (
                    <div key={field}>
                      <p className="text-sm text-indigo-600 mb-1">{field}</p>
                      <div className="flex gap-2">
                        {["Basic", "Medium", "Advanced"].map((level) => (
                          <label key={level} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={field}
                              value={level}
                              checked={state === level}
                              onChange={() => setState(level)}
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Preferred Working Days */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-indigo-600 mb-1">
                        Preferred Working Days
                      </h3>
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(e.target.value)}
                      >
                        <option value="Monday-Saturday">Monday-Saturday</option>
                        <option value="Monday-Friday">Monday-Friday</option>
                        <option value="Sunday-Thursday">Sunday-Thursday</option>
                        <option value="Sunday-Saturday">Sunday-Saturday</option>
                        <option value="Tuesday-Saturday">Tuesday-Saturday</option>
                        <option value="Wednesday-Saturday">Wednesday-Saturday</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-sm text-indigo-600 mb-1">
                        Preferred Working Hours
                      </h3>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value="9:00 AM - 5:00 PM"
                        disabled
                      />
                    </div>

                    <div>
                      <h3 className="text-sm text-indigo-600 mb-1">
                        Expected Salary per Hour
                      </h3>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value="$20"
                        disabled
                      />
                    </div>

                    <div>
                      <h3 className="text-sm text-indigo-600 mb-1">
                        Overall Rating
                      </h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`text-xl cursor-pointer ${
                              rating >= star
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <h3 className="text-sm text-indigo-600 mb-1">Comments</h3>
                    <textarea
                      className="w-full p-2 border rounded h-15 resize-none"
                      placeholder="Add your comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t bg-white flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setApplicationStatus("REJECTED");
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setApplicationStatus("WAITING");
                    }}
                    className="px-3 py-1.5 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded"
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() => {
                      setApplicationStatus("SHORTLISTED");
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => {
                      handlesendupdate(selectedApplicant._id);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;