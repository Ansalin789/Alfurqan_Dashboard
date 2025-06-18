"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import BaseLayout1 from "@/components/BaseLayout1";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import AcademicHeader from "../../components/academicHeader";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<Student[] | null>(null);

  const router = useRouter();

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

  //search

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const queryLower = query.toLowerCase();

    const filtered = studentData.students.filter((item) => {
      const studentId = item.student?.studentId?.toLowerCase() || "";
      const fullName = (item.username || "").toLowerCase();
      const teacher = (item.teacherName || "").toLowerCase();
      const contact = item.student?.studentPhone?.toString() || "";
      const classType = "group class"; // hardcoded in your UI
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

  return (
    <BaseLayout1>
      <div>
        <AcademicHeader currentSection="Student List" />
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
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
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
                <table className="table-auto xw-full">
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
            </div>

            {/*filterform  */}

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
                <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
                  {/* Close Icon */}
                  <button
                    className="absolute top-2 right-3 text-gray-400 text-xl"
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </button>

                  <h2 className="text-lg font-semibold mb-4">Filter by</h2>

                  {/* Date Input */}
                  <div className="mb-4">
                    <label
                    htmlFor="date"
                    className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                      Date Of Joining Range
                    </label>

                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                        // value={fromDate}
                        // onChange={(e) => setFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                        // value={toDate}
                        // onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Position Applied */}
                  <div className="mb-4">
                    {/* Timing */}
                    <label
                      htmlFor="input"
                      className="block text-sm text-gray-700 mb-1 dark:text-white"
                    >
                      Class Type
                    </label>
                    <input
                      // value={timing}
                      // onChange={(e) => setTiming(e.target.value)}
                      type="input"
                      className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                    {/* Course */}
                  <div className="mb-4">
                    <label
                      htmlFor="level"
                      className="block text-sm text-gray-700 mb-1 dark:text-white"
                    >
                      Course
                    </label>
                    <input
                      // value={timing}
                      // onChange={(e) => setTiming(e.target.value)}
                      type="input"
                      className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Level */}
                  <div className="mb-4">
                    <label
                      htmlFor="level"
                      className="block text-sm text-gray-700 mb-1 dark:text-white"
                    >
                      Level
                    </label>
                    <input
                      // value={timing}
                      // onChange={(e) => setTiming(e.target.value)}
                      type="input"
                      className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>



                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium"
                      // onClick={handleFilter}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ManageStudents;
