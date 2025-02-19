'use client';
import { useEffect, useRef, useState } from "react"
import { Star, MoreHorizontal, FileText, X, Upload, Calendar } from "lucide-react"
import BaseLayout3 from "@/components/BaseLayout3"
import axios from "axios";
import { pdfjs } from "react-pdf";
type Status = "Shortlisted" | "Rejected" | "Waiting"
type Position = "Arabic Teacher" | "Quran Teacher"
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
  level:string;
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
  applicationDate: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  position: string
  expectedSalary: string
  workingHours: string
  resume:File | null | undefined; 
  comment: string
}

interface RadioOptionProps {
  label: string
  checked: boolean
  onChange: () => void
}

const RadioOption: React.FC<RadioOptionProps> = ({ label, checked, onChange }) => (
  <label className="inline-flex items-center mr-4">
    <input
      type="radio"
      className="form-radio h-4 w-4 text-blue-600"
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2 text-sm text-gray-700">{label}</span>
  </label>
)

interface SkillBadgeProps {
  name: string
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name }) => (
  <span className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 mr-2 mb-2">
    {name}
  </span>
)

export default function ApplicantsPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showAddApplicant, setShowAddApplicant] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const[Applicantbyid,setApplicantbyid]=useState<ApiResponse | null>(null);
  const [resumeImages, setResumeImages] = useState<string | null>(null);
  const [addApplicantForm, setAddApplicantForm] = useState<AddApplicantFormData>({
    applicationDate: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'USA',
    city: '',
    position: 'Arabic Teacher',
    expectedSalary: '',
    workingHours: '',
    resume: null,
    comment: ''
  })
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [quranReading, setQuranReading] = useState("Medium");
  const [tajweed, setTajweed] = useState("Medium");
  const [arabicSpeaking, setArabicSpeaking] = useState("Advanced");
  const [arabicWriting, setArabicWriting] = useState("Advanced");
  const [englishSpeaking, setEnglishSpeaking] = useState("Advanced");
  const [workingDays, setWorkingDays] = useState("Monday-Saturday");
  const [rating, setRating] = useState(4);
  const [comments, setComments] = useState("");
  const[applicationStatus,setApplicationStatus]=useState("");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  
  useEffect(() => {
    const auth = localStorage.getItem('SupervisorAuthToken');
    axios
    .get("http://localhost:5001/applicants", {
      headers: {
        Authorization: `Bearer ${auth}`, // Add Authorization header with the Bearer token
      }
    })
      .then((response) => setApplicants(response.data.applicants))
      .catch((error) => console.error("Error fetching applicants:", error));
  }, []);

  
  const tabs = ["All", "NEWAPPLICATION", "SHORTLISTED", "REJECTED", "WAITING"]
  const itemsPerPage = 10

  const filteredApplicants = activeTab === "All" 
    ? applicants 
    : applicants.filter(applicant => applicant.applicationStatus === activeTab)
  
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEWAPPLICATION": return "bg-blue-500 text-white"
      case "SHORTLISTED": return "bg-green-500 text-white"
      case "REJECTED": return "bg-red-500 text-white"
      case "WAITING": return "bg-yellow-500 text-white"
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i)
      }
      return buttons
    }
  
    if (currentPage <= 3) {
      buttons.push(1, 2, 3, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      buttons.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else {
      buttons.push(1, "...", currentPage, "...", totalPages)
    }
  
    return buttons
  }

  const handleMenuClick = async (_id: string) => {
    setOpenMenuId(openMenuId === _id ? null : _id);

    if (openMenuId !== _id) {
      const auth = localStorage.getItem('SupervisorAuthToken');
      try {
        const response = await axios.get<ApiResponse>(
          `http://localhost:5001/applicants/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${auth}`, // Replace with actual token
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Applicant data received:", response.data);
        setApplicantbyid(response.data);
        if (response.data.uploadResume) {
          const base64String = response.data.uploadResume;
        
          // Check if base64String is an object
          if (typeof base64String === 'string') {
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
    setSelectedApplicant(applicant)
    setOpenMenuId(null)
  }
  const handleviewclose=()=>{
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
    formData.append("candidateFirstName", addApplicantForm.firstName);  // Changed
    formData.append("candidateLastName", addApplicantForm.lastName);    // Changed
    formData.append("candidateEmail", addApplicantForm.email);          // Changed
    formData.append("candidatePhoneNumber", addApplicantForm.phone);    // Changed
    formData.append("candidateCountry", addApplicantForm.country);      // Changed
    formData.append("candidateCity", addApplicantForm.city);            // Changed
    formData.append("positionApplied", addApplicantForm.position); 
    formData.append("currency", "$");                          // Changed
    formData.append("expectedSalary", addApplicantForm.expectedSalary);       // Changed
    formData.append("preferedWorkingHours", addApplicantForm.workingHours);  // Changed
    formData.append("comments", addApplicantForm.comment);              // Changed
    formData.append("applicationStatus", "NEWAPPLICATION");
    formData.append("status", "Active");
    
    if (addApplicantForm.resume) {
      formData.append("uploadResume", addApplicantForm.resume);
    }
    
    try {
      const response = await axios.post("http://localhost:5001/recruit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
     
      if (response.status === 201) {
        alert("Applicant added successfully!");
        setShowAddApplicant(false);
        setAddApplicantForm({
          applicationDate: new Date().toISOString().split('T')[0],
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: 'USA',
          city: '',
          position: 'Arabic Teacher',
          expectedSalary: '',
          workingHours: '',
          resume: null,
          comment: '',
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
 
    const handlesendupdate = async (id:string) => {
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
        level:"1",
      };
      console.log(updateData);
      try {
        const response = await axios.put(
          `http://localhost:5001/applicants/${id}`, 
          updateData
        );
        console.log("Update successful:", response.data);
      } catch (error) {
        console.error("Error updating applicant:", error);
      }
      handleviewclose();
    };  


  return (
    <BaseLayout3>
      <div className="min-h-screen">
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Applicants</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-sm ${
                  activeTab === tab ? "text-[#05445E] bg-blue-50" : "text-slate-500 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-48">
                <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                <select className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                  <option>Designation</option>
                  <option>Date</option>
                  <option>Status</option>
                </select>
              </div>
              <button
              onClick={() => setShowAddApplicant(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto">
                + Add Applicant
              </button>
            </div>
          </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 mb-5">
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Application Date</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Applicant Name</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Contact</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">E-Mail</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Position Applied</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Resume</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Status</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]">Level</th>
                      <th className="text-center px-2  text-sm font-medium text-[#343942]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplicants.map((applicant) => (
                      <tr key={applicant._id} className="border-b border-gray-200">
                        <td className="px-4 py-2 text-sm text-[#17243E]">{formatDate(applicant.applicationDate)}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-medium">
                                {applicant.candidateFirstName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {applicant.candidateFirstName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-[#17243E]">{applicant.candidatePhoneNumber}</td>
                        <td className="px-4 py-2 text-sm text-[#17243E]">{applicant.candidateEmail}</td>
                        <td className="px-4 py-2">
                          <span className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-900">
                            {applicant.positionApplied}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button className="text-[#17243E] hover:text-blue-700 flex items-center text-sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Resume
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(applicant.applicationStatus)}`}>
                            {applicant.applicationStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                          key={`star-${star}`} // Using a stable key instead of index
                                         className={`w-4 h-4 ${
                                        (Number(applicant?.level) || 0) >= star
                                          ? "text-amber-400 fill-amber-400"
                                            : "text-gray-200 fill-gray-200"
                                                     }`}
                                                />
                                ))}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <button 
                              onClick={() => handleMenuClick(applicant._id)}
                              className="hover:bg-gray-100 p-2 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600" />
                            </button>
                            {openMenuId === applicant._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                                <button 
                                  onClick={() => handleViewDetails(applicant)}
                                  className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-gray-50"
                                >
                                  View Details
                                </button>
                                <button 
                                onClick={() => setOpenMenuId(null)}
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
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

              <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 border-t space-y-4 md:space-y-0">
                <div className="text-sm text-slate-500">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredApplicants.length)} of {filteredApplicants.length} entries
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {renderPaginationButtons().map((button) => (
                    <button
                      key={button}
                      onClick={() => typeof button === "number" && setCurrentPage(button)}
                      disabled={typeof button !== "number"}
                      className={`px-3 py-1 border rounded-md ${
                        button === currentPage
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "text-slate-600 hover:bg-gray-50"
                      }`}
                    >
                      {button}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Add Applicant</h2>
              
              <form onSubmit={handleAddApplicantSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="addappname"  className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={addApplicantForm.applicationDate}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, applicationDate: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                      <input
                        type="text"
                        value={addApplicantForm.firstName}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, firstName: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Robert"
                      />
                    </div>
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                      <input
                        type="text"
                        value={addApplicantForm.lastName}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, lastName: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="James"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={addApplicantForm.email}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, email: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="robert@gmail.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                      <input
                        type="tel"
                        value={addApplicantForm.phone}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, phone: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="8784673891"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        value={addApplicantForm.country}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, country: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={addApplicantForm.city}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, city: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Texas"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label  htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Position Applied</label>
                      <select
                        value={addApplicantForm.position}
                        onChange={(e) => setAddApplicantForm({...addApplicantForm, position: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Arabic Teacher">Arabic Teacher</option>
                        <option value="Quran Teacher">Quran Teacher</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Expected Salary per Hour</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={addApplicantForm.expectedSalary}
                          onChange={(e) => setAddApplicantForm({...addApplicantForm, expectedSalary: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="$40"
                        />
                        <span className="absolute right-3 top-2 text-sm text-red-500">Est</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Preferred Working Hours</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={addApplicantForm.workingHours}
                          onChange={(e) => setAddApplicantForm({...addApplicantForm, workingHours: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div>
      <label
        htmlFor="resume"
        className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
      >
        <Upload className="h-5 w-5 mr-2" /> {/* Upload icon */}
        Upload Resume
      </label>
      <div className="relative">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="absolute opacity-0 w-full h-full cursor-pointer" // Hidden but clickable
          onChange={handleFileChange}
        />

        {/* Custom Upload Button */}
        <button
          type="button"
          className="absolute right-3 top-2 text-blue-600 flex items-center"
          onClick={() => fileInputRef.current?.click()} // Trigger file input
        >
          <Upload className="h-5 w-5" />
          <span className="ml-1">Upload</span>
        </button>
      </div>

      {/* Display selected file name (optional) */}
      {addApplicantForm.resume && (
        <p className="mt-2 text-sm text-gray-500">{addApplicantForm.resume.name}</p>
      )}
    </div>
                  </div>

                  <div>
                    <label htmlFor="addappname" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      value={addApplicantForm.comment}
                      onChange={(e) => setAddApplicantForm({...addApplicantForm, comment: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Write your comment here..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddApplicant(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddApplicantSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Popup */}
      {selectedApplicant && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl relative max-h-[90vh] overflow-hidden">
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
                 <iframe
          src={resumeImages ?? ''}
          title="Resume PDF"
          width="100%"
          height="800px"
        />
          
           
                   
                   {/* Page Navigation Overlay */}
                   <div className="none" />
                 </div>
              
             </div>
   
             {/* Right Side - Questions and Details */}
             <div className="w-1/2 flex flex-col h-full ">
  {/* Header Section */}
  <div className="flex items-start p-4 border-b">
    <img
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      alt="Profile"
      className="w-16 h-16 rounded-full mr-3"
    />
    <div>
      <h2 className="text-xl font-semibold">
        {Applicantbyid?.candidateFirstName} {Applicantbyid?.candidateLastName}
      </h2>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
          {Applicantbyid?.positionApplied}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <FileText className="w-4 h-4 mr-1" /> CV.pdf
      </div>
    </div>
    <div className="ml-auto mt-8">
      <div className="text-sm font-medium">{Applicantbyid?.applicationStatus}</div>
    </div>
  </div>

  {/* Questions Section - Scrollable */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
    <h3 className="text-lg font-semibold mb-2">Language Proficiency</h3>

    {/* Reusable Language Proficiency Section */}
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
      {/* Preferred Working Days */}
      <div>
        <h3 className="text-sm text-indigo-600 mb-1">Preferred Working Days</h3>
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

      {/* Preferred Working Hours */}
      <div>
        <h3 className="text-sm text-indigo-600 mb-1">Preferred Working Hours</h3>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={Applicantbyid?.preferedWorkingHours}
          
          disabled
        />
      </div>

      {/* Expected Salary */}
      <div>
        <h3 className="text-sm text-indigo-600 mb-1">Expected Salary per Hour</h3>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={Applicantbyid?.expectedSalary}
          
          disabled
        />
      </div>

      {/* Overall Rating */}
      <div>
        <h3 className="text-sm text-indigo-600 mb-1">Overall Rating</h3>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`text-xl cursor-pointer ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
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
    onClick={()=>{setApplicationStatus("REJECTED")}}
     className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors">
      Reject
    </button>
    <button 
    onClick={()=>{setApplicationStatus("WAITING")}}
    className="px-3 py-1.5 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded transition-colors">
      Waiting
    </button>
    <button
    onClick={()=>{setApplicationStatus("SHORTLISTED")}}
    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors">
      Shortlist
    </button>
    <button
    onClick={()=>{handlesendupdate(Applicantbyid?._id ??"" )}}
    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors">
      Send
    </button>
  </div>
</div>

           </div>
         </div>
       </div>
      )}
    </BaseLayout3>
  )
}