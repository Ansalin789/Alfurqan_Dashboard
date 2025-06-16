"use client";

import { useEffect, useState } from "react";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import { MoreVertical, Search } from "lucide-react";
import BaseLayout1 from "@/components/BaseLayout1";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Modal from "react-modal";

interface Student {
  username: string;
  createdDate: string | number | Date;
  studentId: string;
  student: {
    studentPhone: number;
    studentId: string;
    username: string;
    createdDate: string;
  };
  classScheduleCount: number;
  _id: string;
  teacherName: string;
  level: string;
}

interface Users {
  totalCount: number;
  students: Student[];
}
const ManageStudents = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [studentData, setStudentData] = useState<Users>({
    totalCount: 0,
    students: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for filter moda
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentData.students.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(studentData.students.length / itemsPerPage);

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

  const toggleSelect = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === studentData.students.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(studentData.students.map((_, idx) => idx));
    }
  };

  const handleSyncClick = (_id: string) => {
    setOpenMenuId((prev) => (prev === _id ? null : _id));
  };

  const handleViewDetails = (_id: string) => {
    localStorage.setItem("studentManageID", _id);
    router.push(`managestudentview?id=${_id}`);
  };

  //Filter

  const openFilterModal = () => {
    setIsFilterModalOpen(true); // Open filter modal
    setIsModalOpen(false); // Ensure add student modal is closed
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
      studentId: string;
      dateOfJoining: string;
      studentName: string;
      teacherName: string;
      contact: string;
      scheduledClasses: string;
      level: string;
    }) => void;
    users: Student[];
  }) => {
    const [filters, setFilters] = useState({
      studentId: "",
      dateOfJoining: "",
      studentName: "",
      teacherName: "",
      contact: "",
      scheduledClasses: "",
      level: "",
    });

    const handleApply = () => {
      onApplyFilters(filters);
      onClose();
    };

    const handleReset = () => {
      setFilters({
        studentId: "",
        dateOfJoining: "",
        studentName: "",
        teacherName: "",
        contact: "",
        scheduledClasses: "",
        level: "",
      });
    };



    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 border border-gray-300 p-8 rounded-lg shadow-lg w-[500px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold bg-gradient-to-r from-[#415075] via-[#1e273c] to-[#1e273c] text-transparent bg-clip-text">
            Filter Options
          </h2>
          <button
            onClick={onClose}
            className="text-[#223857] hover:text-gray-700 font-semibold text-[20px]"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="studentId"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Student ID
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.studentId}
              onChange={(e) =>
                setFilters({ ...filters, studentId: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="dateOfJoining"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Date of Joining
            </label>
            <input
              type="date"
              className="w-full p-2 rounded-lg text-[10px] font-medium bg-gray-200 border border-gray-300"
              value={filters.dateOfJoining}
              onChange={(e) =>
                setFilters({ ...filters, dateOfJoining: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="teacherName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Teacher Name
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.teacherName}
              onChange={(e) =>
                setFilters({ ...filters, teacherName: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="studentName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Student Name
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.studentName}
              onChange={(e) =>
                setFilters({ ...filters, studentName: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Contact
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.contact}
              onChange={(e) =>
                setFilters({ ...filters, contact: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="scheduledClasses"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Scheduled Classes
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.scheduledClasses}
              onChange={(e) =>
                setFilters({ ...filters, scheduledClasses: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="level"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Level
            </label>
            <input
              type="text"
              className="w-full p-2  rounded-lg text-[12px] font-medium bg-gray-200 border border-gray-300"
              value={filters.level}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value })
              }
            />
          </div>

          <div className="flex space-x-4 mt-4 ml-12">
            <button
              onClick={handleReset}
              className="px-4 py-[2px] rounded-lg hover:bg-gray-50 text-[13px] font-medium shadow bg-gray-200 border border-gray-300"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-[2px] bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 text-[13px] font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const handleApplyFilters = (filters: {
    studentId: string;
    dateOfJoining: string;
    studentName: string;
    teacherName: string;
    contact: string;
    scheduledClasses: string;
    level: string;
  }) => {
    let filtered = [...studentData.students];
    if (filters.studentId) {
      filtered = filtered.filter((user) =>
        user.studentId?.includes(filters.studentId)
      );
    }
    if (filters.dateOfJoining) {
      filtered = filtered.filter(
        (user) =>
          new Date(user.createdDate).toLocaleDateString() ===
          new Date(filters.dateOfJoining).toLocaleDateString()
      );
    }
    if (filters.studentName) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }
    if (filters.teacherName) {
      filtered = filtered.filter((user) =>
        user.teacherName
          ?.toLowerCase()
          .includes(filters.teacherName.toLowerCase())
      );
    }
    if (filters.contact) {
      filtered = filtered.filter((user) =>
        user.student?.studentPhone.toString().includes(filters.contact)
      );
    }
    if (filters.scheduledClasses) {
      filtered = filtered.filter((user) =>
        user.classScheduleCount.toString().includes(filters.scheduledClasses)
      );
    }
    if (filters.level) {
      filtered = filtered.filter((user) =>
        user.level?.toString().includes(filters.level)
      ); // Adjust as necessary
    }

    setStudentData({ ...studentData, students: filtered });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const closeFilterModal = () => {
  setIsFilterModalOpen(false);
};

  return (
    <BaseLayout1>
      <div>
        <SupervisorHeader currentSection="Scheduled Meetings" />
        <div className="md:p-0 mx-auto">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div className="w-full h-[610px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
                <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434] h-[42px]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by keyword"
                      className="bg-transparent outline-none text-[15px] w-52 py-3 "
                      // value={searchText}
                      // onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                    onClick={openFilterModal}
                  >
                    {/* <BsFilterLeftFilter /> */}
                    <MdTune className="w-4 h-4" />
                    <span>Filter</span>
                  </div>

                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60 ">
                      {/* Showing {currentApplicants.length} Of{" "}
                                        {dataToShow.length} */}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <table className="table-auto xw-full">
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0] h-[46px]">
                    <tr className="font-medium ">
                      <th className="text-left h-[46px] px-3 py-2 text-[12px] font-medium border border-[#4C6993] dark:border-[#6087C0] w-[40px]">
                        <input
                          type="checkbox"
                          checked={
                            selectedRows.length === studentData.students.length
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
                        <td className="px-3 py-2">David</td>
                        <td className="px-3 py-2">Group Class</td>
                        <td className="px-3 py-2">
                          {item.student.studentPhone}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.classScheduleCount}
                        </td>
                        <td className="px-3 py-2">1</td>
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

              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={closeFilterModal}
                onApplyFilters={handleApplyFilters}
                users={studentData.students}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ManageStudents;
