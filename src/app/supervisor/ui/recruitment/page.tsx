'use client';
import { useRef, useState } from "react"
import { Star, MoreHorizontal, FileText, X, Upload, Calendar } from "lucide-react"
import BaseLayout3 from "@/components/BaseLayout3"
import axios from "axios";

type Status = "Shortlisted" | "Rejected" | "Waiting"
type Position = "Arabic Teacher" | "Quran Teacher"

interface Applicant {
  id: number
  date: string
  name: string
  contact: string
  email: string
  position: Position
  status: Status
  level: number
  linkedin?: string
  experience?: {
    title: string
    company: string
    duration: string
    location: string
    description: string[]
  }
  skills?: string[]
  languageProficiency?: {
    quranReading: "Basic" | "Medium" | "Advanced"
    tajweed: "Basic" | "Medium" | "Advanced"
    arabicSpeaking: "Basic" | "Medium" | "Advanced"
    arabicWriting: "Basic" | "Medium" | "Advanced"
    englishSpeaking: "Basic" | "Medium" | "Advanced"
  }
  workingPreferences?: {
    days: string
    hours: string
    expectedSalary: string
  }
}

const generateApplicants = (): Applicant[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    date: "Sep, 12 2023",
    name: "Brendan Bradt",
    contact: "123456789",
    email: "b.bradtke@example.com",
    position: i % 2 === 0 ? "Arabic Teacher" : "Quran Teacher",
    status: i % 3 === 0 ? "Shortlisted" : i % 3 === 1 ? "Rejected" : "Waiting",
    level: Math.floor(Math.random() * 3) + 3,
    linkedin: "linkedin.com/in/b.bradtke",
    experience: {
      title: "Professor",
      company: "BS INSTITUTIONS",
      duration: "Jan, 2023 - Present",
      location: "United States",
      description: [
        "Developed React.js components for improved user engagement",
        "Collaborated on RESTful APIs for seamless data exchange",
        "Optimized performance through efficient algorithms"
      ]
    },
    skills: [
      "JavaScript", "Python", "HTML5", "CSS3", "React.js",
      "Node.js", "Express.js", "MongoDB", "Git", "MySQL",
      "Scrum", "VS Code, JIRA, Slack"
    ],
    languageProficiency: {
      quranReading: "Medium",
      tajweed: "Medium",
      arabicSpeaking: "Advanced",
      arabicWriting: "Advanced",
      englishSpeaking: "Advanced"
    },
    workingPreferences: {
      days: "Monday-Saturday",
      hours: "9AM - 3PM",
      expectedSalary: "$40"
    }
  }))
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
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [showAddApplicant, setShowAddApplicant] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  
  const tabs = ["All", "New Candidate", "Shortlisted", "Rejected", "Waiting"]
  const applicants = generateApplicants()
  const itemsPerPage = 10

  const filteredApplicants = activeTab === "All" 
    ? applicants 
    : applicants.filter(applicant => applicant.status === activeTab)
  
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex)

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Shortlisted": return "bg-green-500 text-white"
      case "Rejected": return "bg-red-500 text-white"
      case "Waiting": return "bg-yellow-500 text-white"
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i)
    } else {
      if (currentPage <= 3) {
        buttons.push(1, 2, 3, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        buttons.push(1, "...", currentPage, "...", totalPages)
      }
    }
    return buttons
  }

  const handleMenuClick = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setOpenMenuId(null)
  }
  
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
    formData.forEach((value, key) => {
      console.log(key + ": " + value);
    });
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
                      <tr key={applicant.id} className="border-b border-gray-200">
                        <td className="px-4 py-2 text-sm text-[#17243E]">{applicant.date}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-medium">
                                {applicant.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {applicant.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-[#17243E]">{applicant.contact}</td>
                        <td className="px-4 py-2 text-sm text-[#17243E]">{applicant.email}</td>
                        <td className="px-4 py-2">
                          <span className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-900">
                            {applicant.position}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button className="text-[#17243E] hover:text-blue-700 flex items-center text-sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Resume
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(applicant.status)}`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < applicant.level 
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
                              onClick={() => handleMenuClick(applicant.id)}
                              className="hover:bg-gray-100 p-2 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600" />
                            </button>
                            {openMenuId === applicant.id && (
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
                          placeholder="9:00 AM - 20:00 PM"
                        />
                        <span className="absolute right-3 top-2 text-sm text-blue-600">Select</span>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedApplicant(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              {/* Header Section */}
              <div className="flex items-start mb-8">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{selectedApplicant.name}</h2>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                      {selectedApplicant.position}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <FileText className="w-4 h-4 mr-1" />
                    CV.pdf
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="text-sm text-gray-600">STATUS</div>
                  <div className="text-sm font-medium">New Application</div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="adviayvuya" className="text-xs text-gray-500 block">FULL NAME</label>
                        <input
                          type="text"
                          value={selectedApplicant.name}
                          readOnly
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="adviayvuya" className="text-xs text-gray-500 block">E-MAIL</label>
                        <input
                          type="email"
                          value={selectedApplicant.email}
                          readOnly
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="adviayvuya" className="text-xs text-gray-500 block">PHONE</label>
                        <input
                          type="tel"
                          value={selectedApplicant.contact}
                          readOnly
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="adviayvuya" className="text-xs text-gray-500 block">LINKEDIN</label>
                        <input
                          type="text"
                          value={selectedApplicant.linkedin}
                          readOnly
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="adviayvuya" className="text-xs text-gray-500 block">APPLIED</label>
                        <input
                          type="text"
                          value={selectedApplicant.date}
                          readOnly
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Experience</h3>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{selectedApplicant.experience?.title}</h4>
                          <p className="text-sm text-gray-600">{selectedApplicant.experience?.duration}</p>
                        </div>
                        <div className="text-sm text-gray-600">{selectedApplicant.experience?.location}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-4">
                        <h5 className="font-medium mb-2">{selectedApplicant.experience?.company}</h5>
                        <ul className="list-disc pl-4 space-y-1">
                          {selectedApplicant.experience?.description.map((desc) => (
                            <li key={desc}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Language Proficiency</h3>
                    <div className="space-y-4">
                    
                    <p className="text-sm text-indigo-600 mb-2">Quran Reading</p>
                    <div className="flex">
                      <RadioOption label="Basic" checked={false} onChange={() => {}} />
                      <RadioOption label="Medium" checked={true} onChange={() => {}} />
                      <RadioOption label="Advanced" checked={false} onChange={() => {}} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 mb-2">Tajweed</p>
                    <div className="flex">
                      <RadioOption label="Basic" checked={false} onChange={() => {}} />
                      <RadioOption label="Medium" checked={true} onChange={() => {}} />
                      <RadioOption label="Advanced" checked={false} onChange={() => {}} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 mb-2">Arabic Speaking</p>
                    <div className="flex">
                      <RadioOption label="Basic" checked={false} onChange={() => {}} />
                      <RadioOption label="Medium" checked={false} onChange={() => {}} />
                      <RadioOption label="Advanced" checked={true} onChange={() => {}} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 mb-2">Arabic Writing</p>
                    <div className="flex">
                      <RadioOption label="Basic" checked={false} onChange={() => {}} />
                      <RadioOption label="Medium" checked={false} onChange={() => {}} />
                      <RadioOption label="Advanced" checked={true} onChange={() => {}} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 mb-2">English Speaking</p>
                    <div className="flex">
                      <RadioOption label="Basic" checked={false} onChange={() => {}} />
                      <RadioOption label="Medium" checked={false} onChange={() => {}} />
                      <RadioOption label="Advanced" checked={true} onChange={() => {}} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-indigo-600 mb-2">Preferred Working Days</h3>
                      <select className="block w-full p-2 border rounded" disabled>
                        <option>{selectedApplicant.workingPreferences?.days}</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-sm text-indigo-600 mb-2">Preferred Working Hours</h3>
                      <select className="block w-full p-2 border rounded" disabled>
                        <option>{selectedApplicant.workingPreferences?.hours}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-indigo-600 mb-2">Expected salary per Hour</h3>
                      <input
                        type="text"
                        value={selectedApplicant.workingPreferences?.expectedSalary}
                        readOnly
                        className="block w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm text-indigo-600 mb-2">Overall Rating</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= selectedApplicant.level 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-indigo-600 mb-2">Comments</h3>
                    <textarea
                      className="block w-full p-2 border rounded h-32 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            

            {/* Footer */}
            <div className="flex flex-col items-end gap-4 px-4 py-3 border-b ">
              {/* Skills Section */}
              <div className="w-full">
  <h3 className="text-lg font-semibold mb-2 ml-3">Skills</h3>
  <div className="bg-gray-100 p-4 rounded-md flex flex-wrap gap-2">
    {selectedApplicant.skills?.map((skill) => (
      <SkillBadge key={skill} name={skill} />
    ))}
  </div>
</div>

  {/* Buttons Section */}
  <div className="flex gap-3">
    <button className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded">
      Reject
    </button>
    <button className="px-6 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded">
      Waiting
    </button>
    <button className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded">
      Shortlist
    </button>
    <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">
      Send for Approval
    </button>
  </div>
</div>

          </div>
        </div>
      )}
    </BaseLayout3>
  )
}