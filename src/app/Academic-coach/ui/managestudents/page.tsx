"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import BaseLayout1 from "@/components/BaseLayout1";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import AcademicHeader from "../../components/academicHeader";
import Modal from "react-modal";
import { getSocket } from "@/app/utils/socket";

export interface Student {
  _id: string;
  teacherName: string;
  sessionClassType: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string | number | Date;
  createdBy: string;
  updatedDate: string | number | Date;
  __v: number;
  classScheduleCount: number;
  student: {
    studentId: string;
    studentEmail: string;
    studentPhone: string | number;
    course: string;
    package: string;
    city: string;
    country: string;
    gender: string;
  };
  level: string;
}

interface Users {
  totalCount: number;
  students: Student[];
}
const ManageStudents = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [studentData, setStudentData] = useState<Users>({
    totalCount: 0,
    students: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<Student[] | null>(null);

  const router = useRouter();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(studentData.students.length / itemsPerPage);
  const studentsToRender = filteredUsers ? filteredUsers : studentData.students;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentsToRender.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const fetchData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/alstudents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setStudentData(data);
      setCurrentPage(1); // Calculate total pages
    };

    fetchData();
  }, []);
  useEffect(()=>{
     const academicId = typeof window !== "undefined"
               ? localStorage.getItem("AcademicCoachPortalId")
               : null;
               if(!academicId) return;
            const socket = getSocket(academicId);
            const handleList = ( data : { data : Student  , sender : string }) =>{
              console.log("web socket");
               setStudentData((prev) => ({
    totalCount: prev.totalCount + 1,
    students: [...prev.students, data.data],
  }));
            }
             
            socket.on('academicStudentProfile', handleList);
            return () =>{
              socket.off('academicStudentProfile', handleList);
            }

  },[]);

  const toggleSelect = (index: number) => {
    const student = studentsToRender[index];
    if (student.sessionClassType === "REGULAR") return; // Prevent selection for REGULAR class type
    setSelectedRows((prev) => {
      let newSelectedRows;
      if (prev.includes(index)) {
        newSelectedRows = prev.filter((i) => i !== index);
      } else {
        newSelectedRows = [...prev, index];
      }
      // Update selectedStudents array
      const newSelectedStudents = newSelectedRows.map((i) => studentsToRender[i]);
      setSelectedStudents(newSelectedStudents);
      return newSelectedRows;
    });
  };

  const toggleSelectAll = () => {
    // Only select students that are not REGULAR
    const selectableIndices = studentsToRender
      .map((student, idx) => (student.sessionClassType !== "REGULAR" ? idx : null))
      .filter((idx) => idx !== null) as number[];
    if (selectedRows.length === selectableIndices.length) {
      setSelectedRows([]);
      setSelectedStudents([]);
    } else {
      setSelectedRows(selectableIndices);
      setSelectedStudents(selectableIndices.map((i) => studentsToRender[i]));
    }
  };

  const handleSyncClick = (_id: string) => {
    setOpenMenuId((prev) => (prev === _id ? null : _id));
  };

  const handleViewDetails = (_id: string) => {
    localStorage.setItem("studentManageID", _id);
    router.push(`managestudentview?id=${_id}`);
  };

  //search

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const queryLower = query.toLowerCase();

    const filtered = studentData.students.filter((item) => {
      const studentId = item.student?.studentId?.toLowerCase() || "";
      const fullName = (item.username || "").toLowerCase();
      const teacher = (item.teacherName || "").toLowerCase();
      const contact = item.student?.studentPhone?.toString() || "";
      const classType = item.sessionClassType.toLowerCase() || "";
      const classCount = item.classScheduleCount?.toString() || "";
      const level = (item.level || "").toLowerCase();
      const joiningDate = new Date(item.createdDate)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toLowerCase(); // normalize date string too

      return (
        studentId.includes(queryLower) ||
        fullName.includes(queryLower) ||
        teacher.includes(queryLower) ||
        contact.includes(queryLower) ||
        classType.includes(queryLower) ||
        classCount.includes(queryLower) ||
        level.includes(queryLower) ||
        joiningDate.includes(queryLower)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

    const FilterModal = ({
      isOpen,
      onClose,
      onApplyFilters,
      users,
    }: {
      isOpen: boolean;
      onClose: () => void;
      onApplyFilters: (filters: {
        studentName: string;
        studentID: string;
        Date: string;
        TeacherName: string;
        contact: string;
        scheduledClasses: string;
        level: string;
        Time: string;
        classType: string;
        status: string;
      }) => void;
      users:Student[];
    }) => {
      const [filters, setFilters] = useState({
       studentName:"",
        studentID: "",
        Date: "",
        TeacherName: "",
        contact: "",
        scheduledClasses:"",
        level: "",
        Time: "",
        classType: "",
        status: "",
      });
  
      const handleApply = () => {
        onApplyFilters(filters);
        onClose();
      };
  
      const handleReset = () => {
        setFilters({
          studentName:"",
        studentID: "",
        Date: "",
        TeacherName: "",
        contact: "",
        scheduledClasses:"",
        level: "",
        Time: "",
        classType: "",
        status: "",
        });
      };
  
      return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-lg  w-[500px]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center">
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
                {/* Student Name */}
                <div>
                  <label htmlFor="studentname" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={filters.studentName}
                    onChange={(e) =>
                      setFilters({ ...filters, studentName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  />
                </div>
  
                {/* Course */}
                <div>
              <label htmlFor="studentId" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                Student ID
              </label>
              <input
                value={filters.studentID}
                onChange={(e) =>
                  setFilters({ ...filters, studentID: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
              />
               
            </div>
  
                {/* Date */}
                <div>
                  <label htmlFor="date" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filters.Date}
                    onChange={(e) =>
                      setFilters({ ...filters, Date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  />
                </div>
  
                {/* Time */}
                <div>
                  <label htmlFor="Time" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Time
                  </label>
                  <input
                    type="time"
                    value={filters.Time}
                    onChange={(e) =>
                      setFilters({ ...filters, Time: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  />
                </div>
  
                {/* Class Type */}
                <div>
                  <label htmlFor="classtype" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Class Type
                  </label>
                  <select
                    value={filters.classType}
                    onChange={(e) =>
                      setFilters({ ...filters, classType: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  >
                    <option value="">Select Class Type</option>
                    <option value="REGULAR">Regular Class</option>
                    <option value="GROUP">Group Class</option>
                    <option value="TRAIL">Trail Class</option>
                  </select>
                </div>
  
                {/* Status */}
                <div>
                  <label htmlFor="stauts" className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="RESCHEDULED">Rescheduled</option>
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
                    users
                      .filter((user) => {
                        return (
                          (!filters.studentName ||
                            `${user.username ?? ""}`
                              .toLowerCase()
                              .includes(filters.studentName.toLowerCase())) &&
                          (!filters.studentID ||
                            user.student?.studentId
                              ?.toLowerCase()
                              .includes(filters.studentID.toLowerCase())) &&
                          (!filters.Date ||
                            new Date(user.createdDate)
                              .toLocaleDateString() ===
                              new Date(filters.Date).toLocaleDateString()) 
                        
                          
                         
                        );
                      }
                    ).length
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
  
    // Add filter handling function
    const handleApplyFilters = (filters: {
      studentName: string;
      studentID: string;
      Date: string;
      TeacherName: string;
      contact: string;
      scheduledClasses: string;
      level: string;
      Time: string;
      classType: string;
      status: string;
    }) => {
      const formatDate = (date: Date | string) =>
        new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  
      let filtered = [...studentData.students];
  
      if (filters.studentName) {
        filtered = filtered.filter((user) =>
          `${user.username ?? ""}`.toLowerCase().includes(filters.studentName.toLowerCase())
        );
      }

      if (filters.studentID) {
        filtered = filtered.filter((user) =>
          (user.student?.studentId ?? "").toLowerCase().includes(filters.studentID.toLowerCase())
        );
      }

      if (filters.Date) {
        filtered = filtered.filter(
          (user) => formatDate(user.createdDate as string | Date) === filters.Date
        );
      }

      // Add more filter logic as needed for TeacherName, contact, scheduledClasses, level, Time, classType, status

      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page
    };
  return (
    <BaseLayout1>
      <div>
        <AcademicHeader currentSection="Student List" students={selectedStudents} />
        
        <div className=" mx-auto">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div className="w-full h-[610px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
                <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by keyword"
                      className="bg-transparent outline-none text-[15px] w-52 py-3 "
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
                   
                  >
                    {/* <BsFilterLeftFilter /> */}
                    <MdTune className="w-4 h-4" />
                    <span>Filter</span>
                  </div>

                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60 ">
                      Showing {currentItems.length} of {studentsToRender.length}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full">
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0] h-[46px]">
                    <tr className="font-medium ">
                      <th className="text-left h-[46px] px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[40px]">
                        <input
                          type="checkbox"
                          checked={
                            currentItems.length > 0 &&
                            currentItems.every((_, i) =>
                              selectedRows.includes(indexOfFirstItem + i)
                            )
                          }
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded-3xl"
                        />
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[130px]">
                        Student ID
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[140px]">
                        Date of Joining
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[180px]">
                        Student Name
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[180px]">
                        Teacher Name
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[140px]">
                        Class Type
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[140px]">
                        Contact
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] whitespace-nowrap w-[150px]">
                        Scheduled Classes
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[80px]">
                        Level
                      </th>
                      <th className="text-left px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[60px]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr
                        key={`${item._id}-${index}`}
                        className={`text-[12px] h-[50px]  ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="px-3 py-2 w-[40px]">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(
                              index + indexOfFirstItem
                            )}
                            onChange={() =>
                              toggleSelect(index + indexOfFirstItem)
                            }
                            disabled={item.sessionClassType === "REGULARCLASS"}
                            className={item.sessionClassType === "REGULARCLASS" ? "cursor-not-allowed" : ""}
                          />
                        </td>
                        <td className="px-3 py-2">{item.student.studentId}</td>
                        <td className="px-3 py-2">
                          {new Date(item.createdDate)
                            .toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                            .replace(",", ",")}
                        </td>
                        <td className="px-3 py-2 text-[#3D8FDE] font-medium">
                          {item.username}
                        </td>
                        <td className="px-3 py-2">{item.teacherName}</td>
                        <td className="px-3 py-2">{item.sessionClassType}</td>
                        <td className="px-3 py-2">
                          {item.student.studentPhone}
                        </td>
                        
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.classScheduleCount}
                        </td>
                        <td className="px-3 py-2">{item.level}</td>
                        <td className="relative px-3 py-2">
                          <button
                            className="p-1"
                            onClick={() => handleSyncClick(item._id)}
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                          </button>

                          {openMenuId === item._id && (
                            <div className="absolute right-0 mt-2 w-[120px] bg-white border rounded-lg shadow-md z-10 dark:bg-[#2d2d2d]">
                              <button
                                onClick={() => handleViewDetails(item._id)}
                                className="w-full text-left px-4 py-2 "
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="w-full text-left px-4 py-2 text-red-600"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
<FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          users={studentData.students}
        />
            {/*filterform  */}

            
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ManageStudents;
