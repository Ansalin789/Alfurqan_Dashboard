// components/ApplicantsList.tsx
import React from "react";
import { MoreHorizontal, FileText, Star, Upload, X } from "lucide-react";

interface Applicant {
  _id: string;
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
  candidatePhoneNumber: string;
  applicationStatus: string;
  positionApplied: string;
  applicationDate: string;
  level: string;
}

const  ApplicantsList: React.FC = () => {
  // Static data for demonstration
  const applicants: Applicant[] = [
    {
      _id: "1",
      candidateFirstName: "John",
      candidateLastName: "Doe",
      candidateEmail: "john.doe@example.com",
      candidatePhoneNumber: "+1234567890",
      applicationStatus: "NEWAPPLICATION",
      positionApplied: "Arabic Teacher",
      applicationDate: "2023-05-15",
      level: "3"
    },
    {
      _id: "2",
      candidateFirstName: "Jane",
      candidateLastName: "Smith",
      candidateEmail: "jane.smith@example.com",
      candidatePhoneNumber: "+1987654321",
      applicationStatus: "SHORTLISTED",
      positionApplied: "Quran Teacher",
      applicationDate: "2023-05-10",
      level: "4"
    },
    {
      _id: "3",
      candidateFirstName: "Michael",
      candidateLastName: "Johnson",
      candidateEmail: "michael.j@example.com",
      candidatePhoneNumber: "+1122334455",
      applicationStatus: "REJECTED",
      positionApplied: "Islamic Studies Teacher",
      applicationDate: "2023-05-05",
      level: "2"
    },
    {
        _id: "4",
        candidateFirstName: "Michael",
        candidateLastName: "Johnson",
        candidateEmail: "michael.j@example.com",
        candidatePhoneNumber: "+1122334455",
        applicationStatus: "WAITING",
        positionApplied: "Islamic Studies Teacher",
        applicationDate: "2023-05-05",
        level: "2"
      },
      {
        _id: "5",
        candidateFirstName: "Michael",
        candidateLastName: "Johnson",
        candidateEmail: "michael.j@example.com",
        candidatePhoneNumber: "+1122334455",
        applicationStatus: "WAITING",
        positionApplied: "Islamic Studies Teacher",
        applicationDate: "2023-05-05",
        level: "2"
      },
      {
        _id: "6",
        candidateFirstName: "Michael",
        candidateLastName: "Johnson",
        candidateEmail: "michael.j@example.com",
        candidatePhoneNumber: "+1122334455",
        applicationStatus: "WAITING",
        positionApplied: "Islamic Studies Teacher",
        applicationDate: "2023-05-05",
        level: "2"
      }
  ];

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

  const tabs = ["All", "NEWAPPLICATION", "SHORTLISTED", "REJECTED", "WAITING"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEWAPPLICATION":
        return "bg-blue-500 text-white px-2 text-[10px]";
      case "SHORTLISTED":
        return "bg-[#1E8A26] text-white px-3 text-[10px]";
      case "REJECTED":
        return "bg-[#D12B36] text-white px-2 text-[10px]";
      case "WAITING":
        return "bg-yellow-500 text-white px-2 text-[10px]";
      case "APPROVED":
        return "bg-green-500 text-white px-7 text-[10px]";
      default:
        return "bg-gray-300 text-black px-2 text-[10px]";
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
    : applicants.filter(applicant => applicant.applicationStatus === activeTab);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  return (
    <div className=" mx-auto">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mt-5">
            Applicants
          </h1>
        </div>

      <div  className="bg-white shadow-md rounded-lg  flex border border-gray-300  h-[360px] mb-4">
        <div className="p-4 justify-between flex flex-col">
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-2 mb-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 md:px-3 md:py-1 rounded-md text-[13px] font-semibold ${
                        activeTab === tab
                          ? "text-[#fff] bg-[#012A4A] mt-2"
                          : "text-[#05445E] py-4 hover:bg-slate-100 mt-4"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mr-20">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-600 whitespace-nowrap">
                      Sort by:
                    </span>
                    <select className="px-2 py-1 border rounded-md text-slate-600 bg-white text-[11px]">
                      <option>Designation</option>
                      <option>Date</option>
                      <option>Status</option>
                    </select>
                  </div>
                 
                </div>
              </div>

              <div className="overflow-x-auto w-[1150px]">
                <table className="table-auto w-[200px]">
                  <thead className="text-[12px] font-bold">
                    <tr className="bg-[#F4F5F7] py-6 rounded-lg mb-4">
                      <th className="text-center px-2 py-2 font-semibold text-[#343942] whitespace-nowrap">
                        Application Date
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942] whitespace-nowrap">
                        Applicant Name
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]">
                        Contact
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]">
                        E-Mail
                      </th>
                      <th className="text-center px-4 py-2 font-semibold text-[#343942] whitespace-nowrap">
                       Position Applied
                    </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]">
                        Resume
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]">
                        Status
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]">
                        Level
                      </th>
                      <th className="text-center px-2 py-2 font-semibold text-[#343942]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplicants.map((applicant, index) => (
                      <tr
                        key={applicant._id}
                        className={`text-[11px] font-medium mt-2 ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="px-4 py-1 text-center text-[#17243E]">
                          {formatDate(applicant.applicationDate)}
                        </td>
                        <td className="px-4 py-1 text-center">
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-medium whitespace-nowrap">
                                {applicant.candidateFirstName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-slate-800">
                              {applicant.candidateFirstName} {applicant.candidateLastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-1 text-center text-[#17243E]">
                          {applicant.candidatePhoneNumber}
                        </td>
                        <td className="px-4 py-1 text-center text-[#17243E]">
                          {applicant.candidateEmail}
                        </td>
                        <td className="px-4 py-1 text-center text-[9px]">
                          {applicant.positionApplied}
                        </td>
                        <td className="px-4 py-1 text-center">
                          <button className="text-[#17243E] hover:text-[#38619A] flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Resume
                          </button>
                        </td>
                        <td className="px-4 py-1 text-center text-[12px]">
  <span
    className={`inline-block w-[90px] text-center px-3 py-1 rounded-full truncate ${getStatusColor(
      applicant.applicationStatus
    )}`}
  >
    {applicant.applicationStatus}
  </span>
</td>

                        <td className="px-4 py-1 text-center">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={`star-${star}`}
                                className={`w-4 h-4 ${
                                  (Number(applicant?.level) || 0) >= star
                                    ? "text-[#FAAB3C] fill-[#68b806]"
                                    : "text-[#F8D8AB] fill-[#f7f6f5]"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-1 text-center">
                          <div className="relative">
                            <button
                              onClick={() => handleMenuClick(applicant._id)}
                              className="hover:bg-gray-100 p-2 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600" />
                            </button>
                            {openMenuId === applicant._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                <button
                                  className="block w-full px-4 py-2 text-left text-[12px] text-[#353232]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleViewDetails(applicant)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row items-center justify-between px-24 py-2  space-y-4 md:space-y-0">
                <div className="text-[10px] text-gray-600">
                  Showing {startIndex + 1} -{" "}
                  {Math.min(endIndex, filteredApplicants.length)} of{" "}
                  {filteredApplicants.length} entries
                </div>
                <div className="flex space-x-2 text-[10px]">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded ${
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
                        className={`px-2 py-1 rounded ${
                          currentPage === 1
                            ? "bg-[#1B2B65] text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        1
                      </button>

                      {currentPage > 3 && (
                        <span className="px-2 py-1">...</span>
                      )}

                      {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                        .filter((page) => page > 1 && page < totalPages)
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 py-1 rounded ${
                              currentPage === page
                                ? "bg-[#1B2B65] text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      {currentPage < totalPages - 2 && (
                        <span className="px-2 py-1">...</span>
                      )}

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-2 py-1 rounded ${
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
                        className={`px-2 py-1 rounded ${
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
                    className={`px-2 py-1 rounded ${
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