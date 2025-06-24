"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSyncAlt, FaPlus, FaEdit, FaEllipsisV } from "react-icons/fa";
import BaseLayout1 from "@/components/BaseLayout1";
import { useRouter } from "next/navigation";
import AddEvaluationModal from "@/components/Academic/AddEvaluationModel";
import { User } from "@/types";
import axios from "axios";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import { getSocket } from "@/app/utils/socket";

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
  studentStatus: string;
}
interface ClassPayload {
  academicCoachId: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentGender: string;
    studentPhone: number;
    studentCity: string;
    studentCountry: string;
    studentCountryCode: string;
    learningInterest?: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime?: string;
    preferredToTime?: string;
    timeZone: string;
    referralSource: string;
    preferredDate?: string;
    evaluationStatus: string;
    status: string;
    createdDate: Date;
    createdBy: string;
  };
  classType: string;
  teacher: {
    teacherName: string;
  };
  classDay?: string[]; // assuming it's an array of days like ['Monday', 'Wednesday']
  startTime?: string[];
  endTime?: string[];
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
  classStartDate: Date | string;
  classEndDate: Date | string;
  classStartTime: string;
  classEndTime: string;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  accomplishmentTime?: string;
  studentRate: number;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  teacherStatus: string;
  status: string;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}
interface EvaluationItem {
  paymentLink: string;
  _id: string;
  student: Student;
  trialClassStatus: string;
  assignedTeacher: string;
  paymentStatus: string;
}

interface ApiResponse {
  evaluation: EvaluationItem[];
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
  studentStatus: string; // Optional if not always present
}

const getAllUsers = async (): Promise<{
  success: boolean;
  data: TransformedUser[];
  message: string;
}> => {
  try {
    const academicId = localStorage.getItem("AcademicCoachPortalId");
    console.log("academicId>>", academicId);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
    }
    const response = await axios.get(
      `https://api.blackstoneinfomaticstech.com/evaluationlist`,
      {
        params: { academicCoachId: academicId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Add debug log for raw API response
    console.log("Raw API Response:", response.data.evaluation);

    // Transform API data to match TransformedUser interface
    const transformedData: TransformedUser[] = response.data.evaluation.map(
      (item: any) => {
        // Debug log for each item's studentStatus
        console.log("Item studentStatus before transform:", item.studentStatus);
        return {
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
          studentStatus: item.studentStatus,
        };
      }
    );

    // Debug log for transformed data
    console.log("Transformed Data:", transformedData);

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

const TrailSection = () => {
  const [users, setUsers] = useState<TransformedUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>();
  const [trialClassStatus, setTrialClassStatus] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log(setItemsPerPage);

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

   useEffect(()=>{
   const academicId = typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachPortalId")
          : null;
          if(!academicId) return;
       const socket = getSocket(academicId);
       const handleList = ( data :{event : string , data : ClassPayload , sender : string })=>{
           console.log("📩 Received WebSocket Data:", data);
   if(data.event === "update"){
      const classPayload = data.data as ClassPayload;
      const student = classPayload.student;
  
      console.log("➡️ Action: update", student.studentId);
  
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.studentId === student.studentId
            ? {
                ...user,
                paymentStatus: classPayload.paymentStatus ?? "NOT JOINED",
                trialClassStatus: classPayload.trialClassStatus ?? "NOT COMPLETED",
                studentStatus: classPayload.studentStatus ?? "NOT JOINED",
              }
            : user
        )
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.studentId === student.studentId
            ? {
               ...user,
                paymentStatus: classPayload.paymentStatus ?? "NOT JOINED",
                trialClassStatus: classPayload.trialClassStatus ?? "NOT COMPLETED",
                studentStatus: classPayload.studentStatus ?? "NOT JOINED",
              }
            : user
        )
      );
    }
          }
  
      socket.on("academicStudentList",handleList);
      return () =>{
        socket.off("academicStudentList",handleList);
      }
  },[]);

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
      router.push("trailManagement");
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
      studentGender: string;
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
  const openModal = (user: User | null = null) => {
    setIsEditMode(!!user);
    setIsModalOpen(true);
    setModalIsOpen(true);

    if (!user) {
      setTrialClassStatus("PENDING");
      setStudentStatus("NOT JOINED");
      setPaymentStatus("PENDING");
      setPaymentLink("");
    } else {
      handleClick(user._id.toString());
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIsOpen(false);
  };

  useEffect(() => {
    console.log("Current users data:", users);
  }, [users]);

  const fetchStudents = async () => {
    try {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data); // Cast to User[] to resolve type error
      } else {
        setErrorMessage(allData.message ?? "Failed to fetch users");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error("An unexpected error occurred", error);
    }
  };

  const handleClick = async (id: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/evaluationlist/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOptions((prev) => ({
        trialClassStatus: prev.trialClassStatus.includes(data.trialClassStatus)
          ? prev.trialClassStatus
          : [...prev.trialClassStatus, data.trialClassStatus],
        studentStatus: prev.studentStatus.includes(data.studentStatus)
          ? prev.studentStatus
          : [...prev.studentStatus, data.studentStatus],
        paymentStatus: prev.paymentStatus.includes(data.paymentStatus)
          ? prev.paymentStatus
          : [...prev.paymentStatus, data.paymentStatus],
      }));
      setTrialClassStatus(data.trialClassStatus);
      setStudentStatus(data.studentStatus);
      setPaymentStatus(data.paymentStatus);
      setPaymentLink(
        `https://blackstoneinfomaticstech.com/invoice?id=${encodeURIComponent(
          data._id
        )}`
      );
      setFormData(data);
      console.log(data);

      // Open the modal after setting the form data
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      trailId: string;
      studentName: string;
      email: string;
      mobile: string;
      time: string;
      trialClassStatus: string;
    }) => void;
    users: TransformedUser[];
  }) => {
    const [filters, setFilters] = useState({
      country: "",
      course: "",
      teacher: "",
      status: "",
      trailId: "",
      studentName: "",
      email: "",
      mobile: "",
      time: "",
      trialClassStatus: "",
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
        trailId: "",
        studentName: "",
        email: "",
        mobile: "",
        time: "",
        trialClassStatus: "",
      });
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-lg  w-[500px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[320px] relative dark:bg-[#252525]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                Filter by
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 text-xl absolute top-4 right-4"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]"
                >
                  Country
                </label>
                <select
                  className="w-full px-3 py-2 border rounded text-sm text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                >
                  <option value="">Select Country</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div>
                <label
                  htmlFor="course"
                  className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]"
                >
                  Course
                </label>
                <select
                  className="w-full px-3 py-2 border rounded text-sm text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                >
                  <option value="">Select Courses</option>
                  {uniqueCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label
                  htmlFor="teachers"
                  className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]"
                >
                  Teachers
                </label>
                <select
                  className="w-full px-3 py-2 border rounded text-sm text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={filters.teacher}
                  onChange={(e) =>
                    setFilters({ ...filters, teacher: e.target.value })
                  }
                >
                  <option value="">Select Teachers</option>
                  {uniqueTeachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]"
                >
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border rounded text-sm text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={filters.trialClassStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, trialClassStatus: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 ">
                <button
                  onClick={handleReset}
                  className="w-[45%] py-2 border border-[#576CBC] text-[#576CBC] rounded-md text-sm font-medium hover:bg-blue-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="w-[50%] py-2 bg-[#576CBC] text-white rounded-md text-sm font-medium"
                >
                  Show{" "}
                  {
                    users.filter((user) => {
                      return (
                        (!filters.country ||
                          user.country === filters.country) &&
                        (!filters.course || user.course === filters.course) &&
                        (!filters.teacher ||
                          user.preferredTeacher === filters.teacher) &&
                        (!filters.status ||
                          user.trialClassStatus === filters.status) &&
                        (!filters.trailId ||
                          user.studentId.includes(filters.trailId)) &&
                        (!filters.studentName ||
                          `${user.studentFirstName} ${user.studentLastName}`
                            .toLowerCase()
                            .includes(filters.studentName.toLowerCase())) &&
                        (!filters.mobile ||
                          user.number.includes(filters.mobile)) &&
                        (!filters.time || user.time.includes(filters.time)) &&
                        (!filters.trialClassStatus ||
                          user.trialClassStatus === filters.trialClassStatus)
                      );
                    }).length
                  }{" "}
                  results
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // Add filter handling function
  const handleApplyFilters = (filters: {
    country: string;
    course: string;
    teacher: string;
    status: string;
    trailId: string;
    studentName: string;
    email: string;
    mobile: string;
    time: string;
    trialClassStatus: string;
  }) => {
    let filtered = [...users];

    if (filters.country) {
      filtered = filtered.filter((user) => user.country === filters.country);
    }
    if (filters.course) {
      filtered = filtered.filter((user) => user.course === filters.course);
    }
    if (filters.teacher) {
      filtered = filtered.filter(
        (user) => user.preferredTeacher === filters.teacher
      );
    }
    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }
    if (filters.trailId) {
      filtered = filtered.filter((user) =>
        user.studentId.includes(filters.trailId)
      );
    }
    if (filters.studentName) {
      filtered = filtered.filter((user) =>
        `${user.studentFirstName} ${user.studentLastName}`
          .toLowerCase()
          .includes(filters.studentName.toLowerCase())
      );
    }
    if (filters.email) {
      // No email property in TransformedUser, so skip or use a relevant property if available
      // Example: filter by studentId as a placeholder
      filtered = filtered.filter((user) =>
        user.studentId.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.mobile) {
      filtered = filtered.filter((user) =>
        user.number.includes(filters.mobile)
      );
    }
    if (filters.time) {
      filtered = filtered.filter((user) => user.time.includes(filters.time));
    }
    if (filters.trialClassStatus) {
      filtered = filtered.filter(
        (user) => user.trialClassStatus === filters.trialClassStatus
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users); // Show all if search is empty
      setCurrentPage(1);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = users.filter((user) => {
      const fullName =
        `${user.studentFirstName} ${user.studentLastName}`.toLowerCase();

      return (
        (user._id?.toLowerCase() || "").includes(lowerQuery) ||
        (user.studentId?.toLowerCase() || "").includes(lowerQuery) ||
        fullName.includes(lowerQuery) ||
        (user.number || "").includes(query) ||
        (user.country?.toLowerCase() || "").includes(lowerQuery) ||
        (user.course?.toLowerCase() || "").includes(lowerQuery) ||
        (user.preferredTeacher?.toLowerCase() || "").includes(lowerQuery) ||
        (user.time?.toLowerCase() || "").includes(lowerQuery) ||
        (user.classStatus?.toLowerCase() || "").includes(lowerQuery) ||
        (user.status?.toLowerCase() || "").includes(lowerQuery) ||
        (user.trialClassStatus?.toLowerCase() || "").includes(lowerQuery) ||
        (user.paymentStatus?.toLowerCase() || "").includes(lowerQuery) ||
        (user.assignedTeacher?.toLowerCase() || "").includes(lowerQuery) ||
        (user.paymentLink?.toLowerCase() || "").includes(lowerQuery) ||
        (user.studentStatus?.toLowerCase() || "").includes(lowerQuery)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page
  };

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-2">{errorMessage}</div>
      </BaseLayout1>
    );
  }
  const updateClick = async (id: string | undefined) => {
    const formDataNames = {
      _id: formData?._id ?? "",
      student: {
        studentId: formData?.student.studentId,
        studentFirstName: formData?.student.studentFirstName,
        studentLastName: formData?.student.studentLastName,
        studentEmail: formData?.student.studentEmail,
        studentGender: formData?.student.studentGender,
        studentPhone: formData?.student.studentPhone,
        studentCity: formData?.student.studentCity,
        studentCountry: formData?.student.studentCountry,
        studentCountryCode: formData?.student.studentCountryCode,
        learningInterest: formData?.student.learningInterest,
        numberOfStudents: formData?.student.numberOfStudents,
        preferredTeacher: formData?.student.preferredTeacher,
        preferredFromTime: formData?.student.preferredFromTime,
        preferredToTime: formData?.student.preferredToTime,
        timeZone: formData?.student.timeZone,
        referralSource: formData?.student.referralSource,
        preferredDate: formData?.student.preferredDate,
        evaluationStatus: formData?.student.evaluationStatus,
        status: formData?.student.status,
        createdDate: formData?.student.createdDate,
        createdBy: formData?.student.createdBy,
      },
      isLanguageLevel: formData?.isLanguageLevel,
      languageLevel: formData?.languageLevel,
      isReadingLevel: formData?.isReadingLevel,
      readingLevel: formData?.readingLevel,
      isGrammarLevel: formData?.isGrammarLevel,
      grammarLevel: formData?.grammarLevel,
      hours: formData?.hours,
      subscription: {
        subscriptionName: formData?.subscription.subscriptionName,
      },
      classStartDate: formData?.classStartDate,
      classEndDate: formData?.classEndDate,
      classStartTime: formData?.classStartTime,
      classEndTime: formData?.classEndTime,
      gardianName: formData?.gardianName,
      gardianEmail: formData?.gardianEmail,
      gardianPhone: formData?.gardianPhone,
      gardianCity: formData?.gardianCity,
      gardianCountry: formData?.gardianCountry,
      gardianTimeZone: formData?.gardianTimeZone,
      gardianLanguage: formData?.gardianLanguage,
      assignedTeacher: formData?.assignedTeacher,
      studentStatus: studentStatus,
      classStatus: formData?.classStatus,
      comments: formData?.comments,
      trialClassStatus: trialClassStatus,
      invoiceStatus: formData?.invoiceStatus,
      paymentLink: paymentLink,
      paymentStatus: paymentStatus,
      status: formData?.status,
      createdDate: formData?.createdDate,
      createdBy: formData?.createdBy,
      updatedDate: formData?.updatedDate,
      updatedBy: formData?.updatedBy,
      planTotalPrice: formData?.planTotalPrice,
      accomplishmentTime: formData?.accomplishmentTime,
      studentRate: formData?.studentRate,
      expectedFinishingDate: formData?.expectedFinishingDate,
    };

    alert(JSON.stringify(formDataNames));
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/evaluation/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDataNames),
        }
      );

      console.log("response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Open the modal after setting the form data
      // setShowModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      console.log(`Field: ${field}, Value: ${event.target.value}`);
      switch (field) {
        case "TrialClassStatus":
          setTrialClassStatus(event.target.value);
          // If trial status is PENDING, set student status to PENDING
          if (event.target.value === "PENDING") {
            setStudentStatus("PENDING");
          }
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

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout1>
    );
  }

  return (
    <div>
      <div className="">
        <div className="md:p-0 mx-auto mb-10">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] min-h-[calc(100vh-200px)]">
                <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent outline-none text-[15px] w-52 py-3"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <MdTune className="w-4 h-4" />
                    <span>Filter</span>
                  </div>
                  {/* Modal */}
                  {/* FilterModal is rendered below, so no need for inline modal JSX here */}
                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60 ">
                      Showing {currentItems.length} of {users.length}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full table-fixed">
                    <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                      <tr>
                        {[
                          { label: "Trail ID", width: "w-[10%]" },
                          { label: "Student Name", width: "w-[12%]" },
                          { label: "Mobile", width: "w-[10%]" },
                          { label: "Country", width: "w-[8%]" },
                          { label: "Course", width: "w-[10%]" },
                          { label: "Preferred Teacher", width: "w-[10%]" },
                          { label: "Assigned Teacher", width: "w-[10%]" },
                          { label: "Time", width: "w-[8%]" },
                          { label: "Trail Status", width: "w-[10%]" },
                          { label: "Student Status", width: "w-[10%]" },
                          { label: "Payment Status", width: "w-[10%]" },
                          { label: "Action", width: "w-[7%]" },
                        ].map((header, index) => (
                          <th
                            key={header.label}
                            className={`px-3 py-2 text-left font-medium border border-[#4C6993] dark:border-[#6087C0] break-words ${header.width}`}
                          >
                            {header.label}
                        </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <tr
                            key={item._id}
                            className={`text-[12px] ${
                              index % 2 === 0
                                ? "bg-[#fff] dark:bg-[#2C2C2C] "
                                : "bg-[#F8F8F8] dark:bg-[#303030]"
                            }`}
                          >
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[10%]">
                              {item._id}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[15%]">
                              {item.studentFirstName} {item.studentLastName}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[10%]">
                              {item.number}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[8%]">
                              {item.country}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[10%]">
                              {item.course}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[10%]">
                              {item.preferredTeacher}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[10%]">
                              {item.assignedTeacher}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[8%]">
                              {item.time}
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] break-words w-[8%]">
                              <span
                                className={`px-1 text-[8px] text-center py-[3px] rounded-md ${
                                  item.trialClassStatus === "COMPLETED"
                                    ? "bg-[#ECFDF3] text-[#377E36] px-2 dark:bg-[#377E3633]"
                                    : item.trialClassStatus === "INPROGRESS"
                                    ? " bg-[#FDECEC] text-[#D34645]  px-3 dark:bg-[#D3464533]"
                                    : "bg-[#FDF6EC] text-[#F0AD4E] px-3 dark:bg-[#F0AD4E33]"
                                }`}
                              >
                                {item.trialClassStatus === "COMPLETED"
                                  ? "COMPLETED"
                                  : item.trialClassStatus === "INPROGRESS"
                                  ? "IN PROGRESS"
                                  : "PENDING"}
                              </span>
                            </td>

                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] w-[8%]">
                              {(() => {
                                // Debug log for table display
                                console.log("Table display studentStatus:", {
                                  original: item.studentStatus,
                                  upperCase: item.studentStatus?.toUpperCase(),
                                  isJoined: item.studentStatus?.toUpperCase() === "JOINED",
                                  isWaiting: item.studentStatus?.toUpperCase() === "WAITING",
                                  isPending: item.studentStatus?.toUpperCase() === "PENDING"
                                });
                                return (
                                  <span
                                    className={`px-1 text-[8px] text-center py-[3px] rounded-md ${
                                      item.studentStatus?.toUpperCase() === "JOINED"
                                        ? "bg-[#ECFDF3] text-[#377E36] px-6 dark:bg-[#377E3633]"
                                        : item.studentStatus?.toUpperCase() === "WAITING"
                                        ? "bg-[#FDF6EC] text-[#F0AD4E] px-3 dark:bg-[#F0AD4E33]"
                                        : item.studentStatus?.toUpperCase() === "PENDING"
                                        ? "bg-[#FDF6EC] text-[#F0AD4E] px-3 dark:bg-[#F0AD4E33]"
                                        : "bg-[#FDECEC] text-[#D34645] px-3 dark:bg-[#D3464533]"
                                    }`}
                                  >
                                    {item.studentStatus?.toUpperCase() || "PENDING"}
                                  </span>
                                );
                              })()}
                            </td>

                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD]  w-[8%] break-words">
                              <span
                                className={`px-1 text-[8px] text-center py-[3px] rounded-md ${
                                  item.paymentStatus === "PAID"
                                    ? "bg-[#ECFDF3] text-[#377E36] px-5 dark:bg-[#377E3633]"
                                    : item.paymentStatus === "FAILED"
                                    ? "bg-[#FDECEC] text-[#D34645] px-3 dark:bg-[#D3464533]"
                                    : "bg-[#FDF6EC] text-[#F0AD4E] px-3 dark:bg-[#F0AD4E33]" // for Pending or other statuses
                                }`}
                              >
                                {item.paymentStatus ?? "PAID"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] w-[5%]">
                              <button
                                onClick={() => handleClick(item._id.toString())}
                                className="hover:cursor-pointer text-center p-2"
                              >
                                <FaEllipsisV
                                  size={14}
                                  className="text-[#5F6368] dark:text-white"
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="p-4 text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2>Edit User</h2>
      </Modal>
      <AddEvaluationModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        isEditMode={isEditMode}
        onSave={() => {
          fetchStudents();
          closeModal();
        }}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 scrollbar-none">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-4xl h-auto overflow-y-auto max-h-[90vh] scrollbar-none dark:bg-[#252525]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold bg-gradient-to-r from-[#415075] via-[#1e273c] to-[#1e273c] text-transparent bg-clip-text text-[#010E30] dark:text-[#FFFFFF]">
                Student Details
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800  dark:text-white"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>

            <form className="grid grid-cols-2  gap-5">
              {/** First Name */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  First name
                </label>
                <input
                  value={formData?.student.studentFirstName || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] "
                />
              </div>
              {/** Last Name */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Last name
                </label>
                <input
                  value={formData?.student.studentLastName || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Email */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Email
                </label>
                <input
                  value={formData?.student.studentEmail || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] "
                />
              </div>
              {/** Phone Number */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Phone number
                </label>
                <input
                  value={formData?.student.studentPhone || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Country */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Country
                </label>
                <input
                  value={formData?.student.studentCountry || ""}
                  disabled
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** City */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  City
                </label>
                <input
                  value={formData?.student.studentCity || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>

              {/** time zone */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Time Zone
                </label>
                <input
                  value={formData?.student.studentCity || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Trail ID */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Trial ID
                </label>
                <input
                  value={formData?._id || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] "
                />
              </div>
              {/** Course */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Course
                </label>
                <input
                  value={formData?.student.learningInterest || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Preferred Teacher */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Preferred Teacher
                </label>
                <input
                  value={formData?.student.preferredTeacher || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Level */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Level
                </label>
                <input
                  value={formData?.languageLevel || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Preferred Date */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Preferred Date
                </label>
                <input
                  value={formData?.student.preferredDate || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Preferred Time */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Preferred Time
                </label>
                <input
                  value={`${formData?.student.preferredFromTime || ""} TO ${
                    formData?.student.preferredToTime || ""
                  }`}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Preferred Hours */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Preferred Hours
                </label>
                <input
                  value={formData?.hours || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>

              {/** Select Teacher */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Select Teacher
                </label>
                <input
                  value={formData?.assignedTeacher || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Preferred Package */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Preferred Package
                </label>
                <input
                  value={formData?.subscription?.subscriptionName || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Guardian Name */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Guardian Name
                </label>
                <input
                  value={formData?.gardianName || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Guardian Email */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Guardian Email
                </label>
                <input
                  value={formData?.gardianEmail || ""}
                  disabled
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Guardian Phone */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Guardian Phone Number
                </label>
                <input
                  value={formData?.gardianPhone || ""}
                  disabled
                  readOnly
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
              {/** Student Status */}
              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Student Status
                </label>
                <div className="w-full p-2 border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]">
                  {studentStatus?.toUpperCase() || "NOT JOINED"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Trial Class Status
                </label>
                <div className="w-full p-2 border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]">
                  {trialClassStatus || "PENDING"}
                </div>
              </div>

              {/** Evaluation Status */}

              {/** Comment (full width) */}
              {/* <div className="col-span-2">
                <label className="block text-xs font-medium text-black text-[12px] dark:text-[#D6D6D6]">
                  Comment
                </label>
                <textarea
                  value={formData?.comments || ""}
                  className="w-full p-2  border border-gray-300 rounded text-[10px] mt-2 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  placeholder="Write your comment here..."
                  rows={5}
                />
              </div> */}
              {/** Buttons (full width) */}
              <div className="col-span-2 flex justify-end gap-2 ">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className=" bg-[#576CBC1A] text-[#576CBC] px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium border border-[#576CBC1A] hover:bg-[#576CBC33] hover:text-[#576CBC] dark:hover:bg-[#576CBC33] dark:hover:text-[#576CBC]"
                >
                  Cancel
                </button>
                {/* <button
                  type="submit"
                  onClick={() => updateClick(formData?._id)}
                  className="bg-[#576CBC] text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                >
                  Save
                </button> */}
              </div>
            </form>
          </div>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        users={users}
      />
    </div>
  );
};
export default TrailSection;
