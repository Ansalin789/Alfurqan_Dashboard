"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaFilter, FaPlus } from "react-icons/fa";
import BaseLayout1 from "@/components/BaseLayout1";
import { useRouter } from "next/navigation";
import AddTrailStudentModal from "@/components/Academic/AddTrailStudentModel";

const TrailManagement = () => {
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for filter moda
  const [users, setUsers] = useState<Users>({ totalCount: 0, students: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0); // Add state for total pages
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query

  const handleSyncClick = (studentId: string) => {
    if (router) {
      router.push("managestudentview");
      localStorage.setItem("studentManageID", studentId);
    } else {
      console.error("Router is not available");
    }
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true); // Open filter modal
    setIsModalOpen(false); // Ensure add student modal is closed
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const openModal = () => {
    setIsEditMode(!!users);
    setIsModalOpen(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  useEffect(() => {
    const fetchData = async () => {
      const auth = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5001/alstudents`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      const data = await response.json();
      console.log(auth);
      setUsers(data);
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage)); // Calculate total pages
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredStudents = users.students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on search query
  );
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
    let filtered = [...users.students];

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

    setUsers({ ...users, students: filtered });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const Pagination = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
      <div>
        <div className="flex justify-between items-center p-3">
          <p className="text-[9px] text-gray-600">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, users.totalCount)} from{" "}
            {users.totalCount} data
          </p>
          <div className="flex space-x-2 text-[8px]">
            {/* Previous Button */}
            <button
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {/* Pagination Numbers */}
            {totalPages > 5 ? (
              <>
                <button
                  className={`px-2 py-1 rounded ${
                    currentPage === 1
                      ? "bg-[#1B2B65] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2 py-1">...</span>}
                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter((page) => page > 1 && page < totalPages)
                  .map((page) => (
                    <button
                      key={page}
                      className={`px-2 py-1 rounded ${
                        currentPage === page
                          ? "bg-[#1B2B65] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                {currentPage < totalPages - 2 && (
                  <span className="px-2 py-1">...</span>
                )}
                <button
                  className={`px-2 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-[#1B2B65] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            ) : (
              [...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-2 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-[#1B2B65] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))
            )}

            {/* Next Button */}
            <button
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseLayout1>
      <div className="p-3 pr-9 mx-auto h-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-[18px] p-2 font-semibold">Students List</h2>
          </div>
        </div>
        <div className="">
          <div className="flex justify-between items-center p-2">
            <div className="flex flex-1 mb-4 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border rounded-lg px-2 text-[12px] mr-4 shadow"
                  value={searchQuery} // Bind input value to search query state
                  onChange={handleSearchChange} // Update search query on change
                />
                <button
                  onClick={openFilterModal}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className="flex">
                <button
                  onClick={() => openModal()}
                  className="text-[12px] p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4"
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className="border rounded-lg p-2 shadow text-[12px]">
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
            <table
              className="min-w-full rounded-lg shadow bg-[#fff]"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "24%" }}
                  >
                    Student ID
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "15%" }}
                  >
                    Date of Joining
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "18%" }}
                  >
                    Student Name
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "15%" }}
                  >
                    Contact
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "20%" }}
                  >
                    Scheduled Classes
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "12%" }}
                  >
                    Level
                  </th>
                  <th
                    className="p-3 py-5  font-semibold text-center"
                    style={{ wordWrap: "break-word", width: "10%" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <tr
                      key={student.studentId || index}
                      className={`text-[9px] font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td
                        className="p-2 py-4 text-center"
                        style={{ wordWrap: "break-word" }}
                      >
                        {student.student?.studentId}
                      </td>
                      <td
                        className="p-2 text-center"
                        style={{ wordWrap: "break-word" }}
                      >
                        {new Date(student.createdDate).toLocaleDateString()}
                      </td>
                      <td
                        className="p-2 text-center"
                        style={{ wordWrap: "break-word" }}
                      >
                        {student.username}
                      </td>
                      <td
                        className="p-2 text-center"
                        style={{ wordWrap: "break-word" }}
                      >
                        {student.student?.studentPhone}
                      </td>
                      <td
                        className="p-2 text-center"
                        style={{ wordWrap: "break-word" }}
                      >
                        {student.classScheduleCount}
                      </td>
                      <td className="p-2 text-center">1</td>
                      <td className="p-1 text-center">
                        <button
                          className="bg-gray-800 text-[9px] hover:cursor-pointer text-center text-white px-3 py-1 rounded-lg shadow hover:bg-gray-900"
                          onClick={() => handleSyncClick(student._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-2 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2>Edit User</h2>
      </Modal>
      <AddTrailStudentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        isEditMode={isEditMode}
        onSave={closeModal}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onApplyFilters={handleApplyFilters}
        users={users.students}
      />
    </BaseLayout1>
  );
};

export default TrailManagement;
