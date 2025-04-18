"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { User } from "@/types";

import Dashboard from "../../components/dashhh";
import BaseLayout4 from "@/components/BaseLayout4";

const evaluation: EvaluationItem[] = [
  {
    paymentLink: "https://payment.example.com/link1",
    _id: "eval001",
    student: {
      learningInterest: "Mathematics",
      studentId: "stu001",
      studentFirstName: "Alice",
      studentLastName: "Smith",
      studentPhone: 1234567890,
      studentCountry: "USA",
      preferredTeacher: "Teacher A",
      preferredFromTime: "10:00 AM",
      preferredToTime: "11:00 AM",
      classStatus: "Pending",
      status: "Active",
      trialClassStatus: "Scheduled",
    },
    trialClassStatus: "Scheduled",
    assignedTeacher: "Teacher A",
    paymentStatus: "Pending",
  },
  {
    paymentLink: "https://payment.example.com/link2",
    _id: "eval002",
    student: {
      learningInterest: "Science",
      studentId: "stu002",
      studentFirstName: "Bob",
      studentLastName: "Johnson",
      studentPhone: 9876543210,
      studentCountry: "UK",
      preferredTeacher: "Teacher B",
      preferredFromTime: "2:00 PM",
      preferredToTime: "3:00 PM",
      classStatus: "Confirmed",
      status: "Active",
      trialClassStatus: "Completed",
    },
    trialClassStatus: "Completed",
    assignedTeacher: "Teacher B",
    paymentStatus: "Paid",
  },
  {
    paymentLink: "https://payment.example.com/link3",
    _id: "eval003",
    student: {
      learningInterest: "English",
      studentId: "stu003",
      studentFirstName: "Charlie",
      studentLastName: "Brown",
      studentPhone: 1122334455,
      studentCountry: "Canada",
      preferredTeacher: "Teacher C",
      preferredFromTime: "9:00 AM",
      preferredToTime: "10:00 AM",
      classStatus: "Rescheduled",
      status: "Inactive",
      trialClassStatus: "Pending",
    },
    trialClassStatus: "Pending",
    assignedTeacher: "Teacher C",
    paymentStatus: "Unpaid",
  },
];


// Define interfaces for the API response structure
interface Student {
  learningInterest: string; // Replace with the exact type if known
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
}

interface EvaluationItem {
  paymentLink: string;
  _id: string;
  student: Student;
  trialClassStatus: string;
  assignedTeacher: string;
  paymentStatus: string;
}

// Define the transformed user structure
interface TransformedUser {
  _id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  number: string;
  country: string;
  course: string; // Assuming this corresponds to `learningInterest`
  preferredTeacher: string;
  time: string;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
  paymentStatus: string;
  assignedTeacher: string;
  paymentLink: string;
}

const getAllUsers = async (): Promise<{
  success: boolean;
  data: TransformedUser[];
  message: string;
}> => {
  try {
    // Transform API data to match TransformedUser interface
    const transformedData: TransformedUser[] = evaluation.map((item: any) => ({
      _id: item._id,
      studentId: item.student.studentId,
      studentFirstName: item.student.studentFirstName,
      studentLastName: item.student.studentLastName,
      number: item.student.studentPhone
        ? item.student.studentPhone.toString()
        : "",
      country: item.student.studentCountry,
      course: item.student.learningInterest,
      preferredTeacher: item.student.preferredTeacher,
      time: item.student.preferredFromTime,
      classStatus: item.student.classStatus,
      status: item.student.status,
      trialClassStatus: item.trialClassStatus,
      paymentStatus: item.paymentStatus,
      assignedTeacher: item.assignedTeacher,
      paymentLink: item.paymentLink,
    }));

    console.log(">>>>transformedData", transformedData);

    return {
      success: true,
      data: transformedData,
      message: "Users fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
};

// Move FilterModal outside of the TrailManagement component
const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    country: string;
    course: string;
    teacher: string;
    status: string;
  }) => void;
  users: User[];
}) => {
  const [filters, setFilters] = useState({
    country: "",
    course: "",
    teacher: "",
    status: "",
  });

  // Get unique values for each filter
  const uniqueCountries = Array.from(
    new Set(users.map((user) => user.country))
  );
  const uniqueCourses = Array.from(new Set(users.map((user) => user.course)));
  const uniqueTeachers = Array.from(
    new Set(users.map((user) => user.preferredTeacher))
  );

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      country: "",
      course: "",
      teacher: "",
      status: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[500px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filter Options</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="ayvayv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ciuviuva"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ivbiucv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teacher
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.teacher}
            onChange={(e) =>
              setFilters({ ...filters, teacher: e.target.value })
            }
          >
            <option value="">All Teachers</option>
            {uniqueTeachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="daiuiauv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

type ViewType = "students";

const TrailSection = () => {
  const [users, setUsers] = useState<TransformedUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>();
  const [trialClassStatus, setTrialClassStatus] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<ViewType>("students");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllUsers();
        if (allData.success && allData.data) {
          setUsers(allData.data); // Cast TransformedUser[] to User[]
          setFilteredUsers(allData.data); // Initialize filtered users
        } else {
          setErrorMessage(allData.message ?? "Failed to fetch users");
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred");
        console.error("An unexpected error occurred", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const [options, setOptions] = useState({
    trialClassStatus: ["PENDING", "INPROGRESS", "COMPLETED"],
    studentStatus: ["JOINED", "NOT JOINED", "WAITING"],
    paymentStatus: ["PAID", "FAILED", "PENDING"],
  });

  const router = useRouter();
  const handleSyncClick = () => {
    if (router) {
      router.push("/admin-main/ui/trailmanagement");
    } else {
      console.error("Router is not available");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  interface FormData {
    _id: string;
    student: {
      city: string;
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
      studentPhone: number;
      studentCity: string;
      studentCountry: string;
      studentCountryCode: string;
      learningInterest: string;
      numberOfStudents: number;
      preferredTeacher: string;
      preferredFromTime: string;
      preferredToTime: string;
      timeZone: string;
      referralSource: string;
      preferredDate: string; // ISO date string
      evaluationStatus: string;
      status: string;
      createdDate: string; // ISO date string
      createdBy: string;
    };
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    subscription: {
      subscriptionName: string;
    };
    planTotalPrice: number;
    classStartDate: string; // ISO date string
    classEndDate: string; // ISO date string
    classStartTime: string;
    classEndTime: string;
    accomplishmentTime: string;
    studentRate: number;
    gardianName: string;
    gardianEmail: string;
    gardianPhone: string;
    gardianCity: string;
    gardianCountry: string;
    gardianTimeZone: string;
    gardianLanguage: string;
    assignedTeacher: string;
    assignedTeacherId: string;
    assignedTeacherEmail: string;
    studentStatus: string;
    classStatus: string;
    comments: string;
    trialClassStatus: string;
    invoiceStatus: string;
    paymentLink: string;
    paymentStatus: string;
    status: string;
    createdDate: string; // ISO date string
    createdBy: string;
    updatedDate: string; // ISO date string
    updatedBy: string;
    expectedFinishingDate: number;
    __v: number;
  }

  useEffect(() => {
    console.log("Current users data:", users);
  }, [users]);

  const handleClick = (id: string) => {
    const selectedItem = evaluation.find((item) => item._id === id);
    if (selectedItem) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      console.log(`Field: ${field}, Value: ${event.target.value}`);
      switch (field) {
        case "TrialClassStatus":
          setTrialClassStatus(event.target.value);
          break;
        case "studentStatus":
          setStudentStatus(event.target.value);
          break;
        case "paymentStatus":
          setPaymentStatus(event.target.value);
          break;
        default:
          break;
      }
    };
  useEffect(() => {
    console.log(`Updated TrialClassStatus: ${trialClassStatus}`);
  }, [trialClassStatus]);

  const filteredItems = currentItems.filter((item) => {
    const searchFields = [
      item._id,
      `${item.studentFirstName} ${item.studentLastName}`,
      item.number,
      item.country,
      item.course,
      item.preferredTeacher,
      item.assignedTeacher,
      item.time,
      item.classStatus,
      item.paymentStatus,
      item.status,
    ];
    return searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) => {
      const fullName =
        `${user.studentFirstName} ${user.studentLastName}`.toLowerCase();
      return (
        user.studentId.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        user.paymentStatus.toLowerCase().includes(query.toLowerCase()) ||
        user.number.includes(query) ||
        user.country.toLowerCase().includes(query.toLowerCase()) ||
        user.course.toLowerCase().includes(query.toLowerCase()) ||
        user.preferredTeacher.toLowerCase().includes(query.toLowerCase()) ||
        user.time.toLowerCase().includes(query.toLowerCase()) ||
        user.trialClassStatus.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };

  if (errorMessage) {
    return (
      <BaseLayout4>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout4>
    );
  }

  return (
    <BaseLayout4>
      <div className="p-4 w-full pr-9 mx-auto h-full">
        <div className="flex justify-between ml-7">
         
            <h2 className="text-[20px] font-semibold">Trail class Request</h2>
        
        </div>
        <div className="p-2">
          <Dashboard />
        </div>
        <div className="w-full max-w-[1300px] mx-auto px-4">
          <div className="flex justify-between items-center p-2 -ml-2">
            <div className="flex flex-1 mb-4 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none">
              <div className="flex ">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border rounded-lg px-2 text-[12px] mr-4 shadow"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className="flex">
                <select className="border rounded-lg p-2 shadow text-[12px] appearance-none  bg-white">
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
            <table className="min-w-full table-fixed bg-white shadow rounded-lg">
              <thead className="border-b-[1px] border-[#1C3557] text-[10px] font-semibold">
                <tr>
                  <th className="p-3 text-center w-[15%] break-words">
                    Trial ID
                  </th>
                  <th className="p-3 text-center w-[15%] break-words">
                    Student Name
                  </th>
                  <th className="p-3 text-center w-[15%] break-words">
                    Mobile
                  </th>
                  <th className="p-3 text-center w-[15%]">Country</th>
                  <th className="p-3 text-center w-[13%] break-words">
                    Course
                  </th>
                  <th className="p-3 text-center w-[18%] break-words">
                    Preferred Teacher
                  </th>
                  <th className="p-3 text-center w-[18%] break-words">
                    Assigned Teacher
                  </th>
                  <th className="p-3 text-center w-[10%]">Time</th>
                  <th className="p-3 text-center w-[25%] break-words">
                    Class Status
                  </th>
                  <th className="p-3 text-center w-[15%] break-words">
                    Payment Status
                  </th>
                  <th className="p-3 text-center w-[13%] break-words">
                    Student Status
                  </th>
                  <th className="p-3 text-center w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="text-[9px] font-medium">
                {filteredItems.length > 0 ? (
                  filteredItems.slice(0, 5).map((item, index) => (
                    <tr
                      key={item._id}
                      className={`${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-3 text-center break-words">
                        {item._id}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.studentFirstName} {item.studentLastName}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.number}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.country}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.course}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.preferredTeacher}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.assignedTeacher}
                      </td>
                      <td className="p-3 text-center break-words">
                        {item.time}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                            item.classStatus === "COMPLETED"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                              : "bg-green-100 text-green-800 border border-green-900 px-2"
                          }`}
                        >
                          {item.classStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                            item.paymentStatus === "PAID"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                              : "bg-green-100 text-green-800 border border-green-900 px-2"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                            item.status === "Active"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                              : "bg-green-100 text-green-800 border border-green-900 px-2"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleClick(item._id.toString())}
                          className="bg-gray-800 hover:cursor-pointer text-white p-2 rounded-lg shadow hover:bg-gray-900"
                        >
                          <FaEdit size={10} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="p-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              className="text-[#fff] mt-4 text-[11px] bg-[#223857] cursor-pointer rounded-md border-none px-2 py-1"
              onClick={() => router.push("/admin-main/ui/trailclasslist")}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[720px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold bg-gradient-to-r from-[#415075] via-[#1e273c] to-[#1e273c] text-transparent bg-clip-text">
                Student Details
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <form className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-black text-xs font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentFirstName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentLastName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData?.student.studentEmail}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentPhone}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-black text-xs font-medium">
                  City
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentCity ?? ""}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.studentCountry}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Trial ID */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Trial ID
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?._id}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Course
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.learningInterest}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Teacher */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Teacher
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.student.preferredTeacher}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Time
                </label>
                <input
                  type="text"
                  disabled
                  value={`${formData?.student.preferredFromTime} - ${formData?.student.preferredToTime}`}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Preferred Package */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Preferred Package
                </label>
                <input
                  type="text"
                  disabled
                  value={formData?.subscription?.subscriptionName}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                />
              </div>

              {/* Student Status */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Student Status
                </label>
                <select
                  value={studentStatus}
                  onChange={handleChange("studentStatus")}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                >
                  {options.studentStatus.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trial Class Status */}
              <div>
                <label className="block text-black text-xs font-medium">
                  Trial Class Status
                </label>
                <select
                  value={trialClassStatus}
                  onChange={handleChange("TrialClassStatus")}
                  className="w-full mt-2 p-1 bg-gray-200 border border-gray-300 rounded-md text-[12px] text-gray-800"
                >
                  {options.trialClassStatus.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div className="col-span-2">
                <label className="block text-black text-xs font-medium">
                  Comment
                </label>
                <textarea
                  placeholder="Write your comment here..."
                  value={formData?.comments}
                  className="w-full mt-2 bg-gray-200 border border-gray-300 p-2 rounded-md text-[12px] text-gray-800"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#223857] text-white rounded-md hover:bg-[#1c2f49] text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout4>
  );
};
export default TrailSection;
