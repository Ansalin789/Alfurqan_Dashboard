"use client";

import { useEffect, useState } from "react";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import { MoreVertical, Search } from "lucide-react";
import BaseLayout1 from "@/components/BaseLayout1";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

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
  const [studentData, setStudentData] = useState<Users>({  totalCount: 0, students: [], });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentData.students.slice(   indexOfFirstItem,   indexOfLastItem );
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
                    //   onClick={() => setShowModal(true)}
                  >
                    {/* <BsFilterLeft /> */}
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
                        <td className="px-3 py-2">
                          <button className="p-1">
                            <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                          </button>
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
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ManageStudents;
