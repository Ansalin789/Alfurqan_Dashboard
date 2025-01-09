
"use client"

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import { useRouter } from 'next/navigation';
import AddEvaluationModal from '@/components/Academic/AddEvaluationModel';
import { User } from '@/types';




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
}

const getAllUsers = async (): Promise<{
  success: boolean;
  data: TransformedUser[];
  message: string;
}> => {
  try {
    const auth = localStorage.getItem('authToken');
    const response = await fetch('http://alfurqanacademy.tech:5001/evaluationlist', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      },
    });

    // Check for response.ok to handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData: ApiResponse = await response.json();

    // Ensure rawData has the expected structure
    if (!rawData.evaluation || !Array.isArray(rawData.evaluation)) {
      throw new Error('Invalid data structure received from API');
    }

    // Transform API data to match TransformedUser interface
    const transformedData: TransformedUser[] = rawData.evaluation.map((item) => ({
      _id: item._id,
      studentId: item.student.studentId,
      studentFirstName: item.student.studentFirstName,
      studentLastName: item.student.studentLastName,
      number: item.student.studentPhone ? item.student.studentPhone.toString() : '',
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

    console.log('>>>>transformedData', transformedData);

    return {
      success: true,
      data: transformedData,
      message: 'Users fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    };
  }
};


// Move FilterModal outside of the TrailManagement component
const FilterModal = ({ 
  isOpen, 
  onClose,
  onApplyFilters, 
  users 
}: { 
  isOpen: boolean;  
  onClose: () => void; 
  onApplyFilters: (filters: { country: string; course: string; teacher: string; status: string; }) => void;
  users: User[];
}) => {
  const [filters, setFilters] = useState({
    country: '',
    course: '',
    teacher: '',
    status: ''
  });

    // Get unique values for each filter
    const uniqueCountries = Array.from(new Set(users.map(user => user.country)));
    const uniqueCourses = Array.from(new Set(users.map(user => user.course)));
    const uniqueTeachers = Array.from(new Set(users.map(user => user.preferredTeacher)));
  
    const handleApply = () => {
      onApplyFilters(filters);
      onClose();
    };
  
    const handleReset = () => {
      setFilters({
        country: '',
        course: '',
        teacher: '',
        status: ''
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
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
  
        <div className="space-y-4">
          <div>
            <label htmlFor='ayvayv' className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
            >
              <option value="">All Countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label htmlFor='ciuviuva' className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.course}
              onChange={(e) => setFilters({...filters, course: e.target.value})}
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label htmlFor='ivbiucv' className="block text-sm font-medium text-gray-700 mb-1">
              Teacher
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.teacher}
              onChange={(e) => setFilters({...filters, teacher: e.target.value})}
            >
              <option value="">All Teachers</option>
              {uniqueTeachers.map((teacher) => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label htmlFor='daiuiauv' className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState<FormData>();
  const [trialClassStatus, setTrialClassStatus] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  

   
   useEffect(() => {
  const fetchData = async () => {
    try {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data); // Cast TransformedUser[] to User[]
        setFilteredUsers(allData.data); // Initialize filtered users
      } else {
        setErrorMessage(allData.message ?? 'Failed to fetch users');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('An unexpected error occurred', error);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  Modal.setAppElement('body');
}, []);

  
   const [options, setOptions] = useState({
    trialClassStatus: ["PENDING", "INPROGRESS", "COMPLETED"],
    studentStatus: ["JOINED","NOT JOINED","WAITING"],
    paymentStatus: [ "PAID", "FAILED","PENDING"],
  });

    
  const router = useRouter();
  const handleSyncClick = () => {
    if (router) {
    router.push('trailManagement');
    } else {
    console.error('Router is not available');
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
};

const closeModal = () => {
  setIsModalOpen(false);
  setModalIsOpen(false);
};
   
useEffect(() => {
  console.log('Current users data:', users);
}, [users]);

const fetchStudents = async () => {
  try {
    const allData = await getAllUsers();
    if (allData.success && allData.data) {
      setUsers(allData.data); // Cast to User[] to resolve type error
    } else {
      setErrorMessage(allData.message ?? 'Failed to fetch users');
    }
  } catch (error) {
    setErrorMessage('An unexpected error occurred');
    console.error('An unexpected error occurred', error);
  }
};


const handleClick = async (id:string) => {
  try {
    const auth=localStorage.getItem('authToken');
    const response = await fetch(`http://alfurqanacademy.tech:5001/evaluationlist/${id}`,{
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${auth}`,
      },
    });
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
      `http://alfurqanacademy.tech:3000/invoice?id=${encodeURIComponent(data.student.studentId)}`);
    setFormData(data);
    console.log(data);
   
    // Open the modal after setting the form data
    setShowModal(true);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
  };
     
  
   
  const updateClick = async (id: string | undefined) => {
    const formDataNames = {
      _id: formData?._id ?? "",
      student: {
        studentId:formData?._id,
        studentFirstName: formData?.student.studentFirstName,
        studentLastName: formData?.student.studentLastName,
        studentEmail: formData?.student.studentEmail,
        studentPhone: formData?.student.studentPhone,
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
      paymentLink:paymentLink,
      paymentStatus: paymentStatus ,
      status: formData?.status,
      createdDate: formData?.createdDate,
      createdBy: formData?.createdBy,
      updatedDate: formData?.updatedDate,
      updatedBy: formData?.updatedBy,
      planTotalPrice: formData?.planTotalPrice,
      accomplishmentTime: formData?.accomplishmentTime,
      studentRate: formData?.studentRate,
      expectedFinishingDate: formData?.expectedFinishingDate  
    };
    
  alert(JSON.stringify(formDataNames));
    try {
      const auth=localStorage.getItem('authToken');
      const response = await fetch(`http://alfurqanacademy.tech:5001/evaluation/${id}`,
        {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
          body: JSON.stringify(formDataNames),
        });
       
      console.log("response",response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
  
      // Open the modal after setting the form data
      // setShowModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
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


  const Pagination = () => {
    const renderPageNumbers = () => {
      const pageNumbers = [];
      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
      for (let i = 1; i <= totalPages; i++) {
        if (i <= 3 || i > totalPages - 3 || (currentPage >= 4 && currentPage <= totalPages - 3 && (i === currentPage - 1 || i === currentPage + 1))) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i
                  ? 'bg-gray-800 text-white text-[13px]'
                  : 'bg-white text-gray-800 text-[13px] hover:bg-gray-50'
              }`}
            >
              {i}
            </button>
          );
        } else if (i === 4 || i === totalPages - 1) {
          pageNumbers.push(<span key={i} className="px-3 py-1">...</span>);
        }
      }
  
      return pageNumbers;
    };
  
    return (
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-[12px] text-gray-700">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Last
          </button>
        </div>
      </div>
    );
  };

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout1>
    );
  }

  return (
    <BaseLayout1>
      <div className={`min-h-screen p-4 bg-[#EDEDED]`}>
        <div className="flex justify-between items-center">
            <div className='flex items-center space-x-2'>
              <h2 className="text-[20px] font-semibold">Scheduled Trail Session</h2>
              <button className="bg-gray-800 text-white p-[4px] rounded-full shadow-2xl" onClick={handleSyncClick}>
                <FaSyncAlt />
              </button>
            </div>
          </div>
        <div className={`p-6 rounded-lg bg-[#EDEDED]`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-1 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg px-2 text-[13px] mr-4 shadow`}
                />
                <button 
                  // onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg text-[12px] shadow"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
                <button 
                  onClick={() => openModal(null)}
                  className={`border text-[14px] p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4`}
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow text-[14px]`}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <table className={`min-w-full rounded-lg shadow bg-white`} style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th className="p-3 text-[12px] text-center"style={{ width: '26%' }}>Trail ID</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '22%' }}>Student Name</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '15%' }}>Mobile</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '12%' }}>Country</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '13%' }}>Course</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '10%' }}>Preferred Teacher</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '18%' }}>Assigned Teacher</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '14%' }}>Time</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '25%' }}>Class Status</th>
                <th className="p-3 text-[12px] text-center"style={{ width:'15%'}}>payment Status</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '13%' }}>Student Status</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '10%' }}>Action</th>
                {/* <th
                    className="shadow-md p-2 text-left font-medium text-gray-700"
                >
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id} className={`border-t`}>
                    <td className="p-2 px-6 text-[11px] text-center">{item._id}</td>
                    <td className="p-2 text-[11px] text-center">{item.studentFirstName} {item.studentLastName}</td>
                    <td className="p-2 text-[11px] text-center">{item.number}</td>
                    <td className="p-2 text-[11px] text-center">{item.country}</td>
                    <td className="p-2 text-[11px] text-center">{item.course}</td>
                    <td className="p-2 text-[11px] text-center">{item.preferredTeacher}</td>
                    <td className="p-2 text-[11px] text-center">{item.assignedTeacher}</td>
                    <td className="p-2 text-[11px] text-center">{item.time}</td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[9px] text-center py-1 rounded-full ${
                        item.classStatus === 'COMPLETED' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.classStatus ?? 'COMPLETED'}
                      </span>
                        
          <span>/</span>
                      <span className={`px-2 text-[9px] text-center py-1 rounded-full ${
                        item.trialClassStatus === 'COMPLETED' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.trialClassStatus ?? 'COMPLETED'}
                      </span>

                    </td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[11px] text-center py-1 rounded-full ${
                        item.paymentStatus === 'PAID' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.paymentStatus ?? 'PAID'}
                      </span>
                    </td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[13px] text-center py-1 rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status ?? 'Active'}
                      </span>
                    </td>
                    <td className="p-2 px-8">
                    <button
                        onClick={() => handleClick(item._id.toString())} // Convert number to string
                        className="bg-gray-800 hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-gray-900"
                      >
                        <FaEdit size={10} />
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
          <Pagination />
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
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      /> */}

{showModal && (
  
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[720px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Student Details</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <form className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-black text-xs font-medium">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  disabled
                  value={formData?.student.studentFirstName} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-black text-xs font-medium">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  disabled
                  value={formData?.student.studentLastName} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-black text-xs font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={formData?.student.studentEmail} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-black text-xs font-medium">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="number"
                  disabled
                  value={formData?.student.studentPhone} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-black text-xs font-medium">City</label>
                <input
                  id="city"
                  type="text"
                  disabled
                  value={formData?.student.city ?? ""} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-black text-xs font-medium">Country</label>
                <input
                  id="country"
                  type="text"
                  disabled
                  value={formData?.student.studentCountry} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="preferredTime" className="block text-black text-xs font-medium">Preferred Time</label>
                <input
                  id="preferredTime"
                  type="text"
                  disabled
                  value={formData?.student.preferredFromTime +" TO "+  formData?.student.preferredToTime} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="trailId" className="block text-black text-xs font-medium">Trail ID</label>
                <input
                  id="trailId"
                  type="text"
                  disabled
                  value={formData?._id} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="course" className="block text-black text-xs font-medium">Course</label>
                <input
                  id="course"
                  type="text"
                  disabled
                  value={formData?.student.learningInterest} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredTeacher" className="block text-black text-xs font-medium">Preferred Teacher</label>
                <input
                  id="preferredTeacher"
                  type="text"
                  disabled
                  value={formData?.student.preferredTeacher} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-black text-xs font-medium">Level</label>
                <input
                  id="level"
                  type="text"
                  disabled
                  value={formData?.languageLevel} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredDate" className="block text-black text-xs font-medium">Preferred Date</label>
                <input
                  id="preferredDate"
                  type="text"
                  disabled
                  value={formData?.student.preferredDate} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredHours" className="block text-black text-xs font-medium">Preferred Hours</label>
                <input
                  id="preferredHours"
                  type="text"
                  disabled
                  value={formData?.hours} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredPackage" className="block text-black text-xs font-medium">Preferred package</label>
                <input
                  id="preferredPackage"
                  type="text"
                  disabled
                  value={formData?.subscription.subscriptionName} // Check if subscription exists
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianName" className="block text-black text-xs font-medium">Guardian&apos;s name</label>
                <input
                  id="guardianName"
                  type="text"
                  disabled
                  value={formData?.gardianName} // Bind to formDat
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianEmail" className="block text-black text-xs font-medium">Guardian&apos;s email</label>
                <input
                  id="guardianEmail"
                  type="email"
                  disabled
                  value={formData?.gardianEmail} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianPhone" className="block text-black text-xs font-medium">Guardian&apos;s phone Number</label>
                <input
                  id="guardianPhone"
                  type="text"
                  disabled
                  value={formData?.gardianPhone} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="evaluationStatus" className="block text-black text-xs font-medium">Evaluation status</label>
                <input
                  id="evaluationStatus"
                  type="text"
                  disabled
                  value={formData?.student.evaluationStatus } // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
               <label htmlFor="trialClassStatus" className="block text-black text-xs font-medium">Trial Class Status</label>
        <select
          id="trialClassStatus"
          value={trialClassStatus}
          onChange={handleChange("TrialClassStatus")}
          className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
        >
          {options.trialClassStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
              
              <div>
        <label htmlFor="studentStatus" className="block text-black text-xs font-medium">Student Status</label>
        <select
          id="studentStatus"
          value={studentStatus}
          onChange={handleChange("studentStatus")}
          className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
        >
          {options.studentStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="paymentStatus" className="block text-black text-xs font-medium">Payment Status</label>
        <select
          id="paymentStatus"
          value={paymentStatus}
          onChange={handleChange("paymentStatus")}
          className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
        >
          {options.paymentStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
              <div className="col-span-2">
                <label htmlFor="comment" className="block text-black text-xs font-medium">Comment</label>
                <textarea
                  id="comment"
                  placeholder="Write your comment here..."
                  value={formData?.comments} // Bind to formData
                  className="w-full mt-2 border rounded-md text-xs text-gray-800"
                ></textarea>
              </div>
              {/* Save and Cancel Buttons */}
              <div className="col-span-2 flex justify-end space-x-4 mt-0">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-800"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                 onClick={() => updateClick(formData?._id)}
                  type="submit"
                  className="px-4 py-1 bg-[#223857] text-white rounded-md hover:bg-[#1c2f49]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
       
      )}
    </BaseLayout1>
  );
};
export default TrailSection
