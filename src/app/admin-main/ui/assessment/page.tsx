"use client";

import { useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { IoCloseOutline } from "react-icons/io5";
import AdminHeader from "../../components/AdminHeader";
import BaseLayout4 from "@/components/BaseLayout4";

const ASSESSMENTS = [
  {
    _id: "a1",
    assessmentId: "#0938867",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Robert James",
    course: "Arabic",
    level: 1,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
  {
    _id: "a2",
    assessmentId: "#0938868",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Stefan Salvatore",
    course: "Quran",
    level: 4,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
  {
    _id: "a3",
    assessmentId: "#0938869",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Gia Rose",
    course: "Arabic",
    level: 3,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Completed",
  },
  {
    _id: "a4",
    assessmentId: "#0938870",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Aisha Khan",
    course: "Arabic",
    level: 2,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Completed",
  },
  {
    _id: "a5",
    assessmentId: "#0938871",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "John Doe",
    course: "Quran",
    level: 5,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
  {
    _id: "a6",
    assessmentId: "#0938872",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Mary Jane",
    course: "Arabic",
    level: 5,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Completed",
  },
  {
    _id: "a7",
    assessmentId: "#0938873",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Ali Ahmed",
    course: "Quran",
    level: 4,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Completed",
  },
  {
    _id: "a8",
    assessmentId: "#0938874",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Sara Lee",
    course: "Arabic",
    level: 5,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
  {
    _id: "a9",
    assessmentId: "#0938875",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Omar Faruk",
    course: "Quran",
    level: 2,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Completed",
  },
  {
    _id: "a10",
    assessmentId: "#0938876",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Lina Gomez",
    course: "Arabic",
    level: 1,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
  {
    _id: "a11",
    assessmentId: "#0938876",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Lina Gomez",
    course: "Arabic",
    level: 1,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<any[]>(ASSESSMENTS);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [cancelItem, setCancelItem] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 10;
  const [positionApplied, setPositionApplied] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const positionOptions = ["Student", "Teacher"];
  const statusOptions = ["Pending", "Completed"];
  const handlePositionChange = (e: any) => setPositionApplied(e.target.value);
  const handleStatusChange = (e: any) => setApplicationStatus(e.target.value);

  const filteredAssessments = assessments.filter((a) => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      String(a.assessmentId).toLowerCase().includes(q) ||
      String(a.studentName).toLowerCase().includes(q) ||
      String(a.course).toLowerCase().includes(q) ||
      String(a.lesson).toLowerCase().includes(q) ||
      String(a.status).toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssessments.length / itemsPerPage)
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAssessments = filteredAssessments.slice(
    indexOfFirst,
    indexOfLast
  );

  const statusClass = (status: string) =>
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";
  const getStatusClass = statusClass;

  return (
    <BaseLayout4>
      <>
        <div className="mx-auto max-w-screen-2xl px-2 sm:px-4 lg:px-6">
          <AdminHeader currentSection="Assessment" showBackButton showBackPath="/admin-main/ui/assessments"/>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 py-4">
            {/* Table */}
            <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
              {/* Header Search & Filter */}
              <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by keywords"
                    className="bg-transparent outline-none text-[15px] w-52 py-3"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div
                  className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                  // onClick={() => setShowModal(true)}
                >
                  {/* <BsFilterLeft /> */}
                  <MdTune className="w-4 h-4" />
                  <span>Filter</span>
                </div>
                {/* Modal */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
                      {/* X Icon for close */}
                      <button
                        className="absolute top-2 right-3 text-gray-400 text-2xl font-bold hover:text-gray-600"
                        onClick={() => setShowModal(false)}
                        aria-label="Close filter modal"
                      >
                        <IoCloseOutline />
                      </button>
                      <h2 className="text-lg font-semibold mb-4">Filter by</h2>
                      {/* Date Input */}
                      <div className="mb-4">
                        <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                          Date Range
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="date"
                            className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                          <input
                            type="date"
                            className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* Position Applied */}
                      <div className="mb-4">
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium mb-1"
                        >
                          Position Applied
                        </label>
                        <select
                          className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                          value={positionApplied}
                          onChange={handlePositionChange}
                        >
                          <option value="">All</option>
                          {positionOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Status */}
                      <div className="mb-6">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium mb-1"
                        >
                          Application Status
                        </label>
                        <select
                          className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                          value={applicationStatus}
                          onChange={handleStatusChange}
                        >
                          <option value="">All</option>
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Buttons */}
                      <div className="flex justify-end gap-3">
                        <button
                          // onClick={handleResetFilter}
                          className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
                        >
                          Reset
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
                <div className="flex  gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                  <span className="text-center">
                    {filteredAssessments.length === 0
                      ? "Showing 0 of 0"
                      : `Showing ${indexOfFirst + 1} - ${Math.min(
                          indexOfLast,
                          filteredAssessments.length
                        )} of ${filteredAssessments.length}`}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[650px] overflow-y-auto overflow-x-auto ">
                <table className="w-full table-auto border-collapse text-[13px] sm:text-sm">
                  <thead>
                    <tr>
                      {[
                        "Assessment ID",
                        "Assessment Date",
                        "Student Name",
                        "Course",
                        "Level",
                        "Lesson",
                        "Next Review Date",
                        "Status",
                        "Action",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-2 py-3 text-left font-medium border border-[#4C6993] bg-[#4C6993] text-white dark:bg-[#6087C0]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentAssessments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-6 text-sm">
                          No assessments found.
                        </td>
                      </tr>
                    ) : (
                      currentAssessments.map((a, index) => (
                        <tr
                          key={`${a._id}-${index}`}
                          className={`${
                            index % 2 === 0
                              ? "bg-white dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="px-4 py-3 text-left break-words">
                            <span className="text-[12px]">
                              {a.assessmentId}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            {new Date(a.assessmentDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-3 text-left text-[#576CBC] text-[12px]">
                            {a.studentName}
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            {a.course}
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            {a.level}
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            {a.lesson}
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            {new Date(a.reviewDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-3 text-left text-[12px]">
                            <span
                              className={`w-24 px-3 py-1 rounded-sm inline-flex justify-center text-[12px] text-center ${getStatusClass(
                                a.status
                              )}`}
                            >
                              {a.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-left relative">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMenu(openMenu === index ? null : index)
                                }
                                className="inline-flex justify-center p-1"
                              >
                                <MoreVertical className="w-4 h-4 text-slate-900 dark:text-white" />
                              </button>

                              {openMenu === index && (
                                <div className="absolute right-0 mt-2 w-36 bg-white  rounded-lg shadow-lg z-10 dark:bg-[#252525] dark:text-[#fff]">
                                  <button
                                    onClick={() => {
                                      router.push(
                                        `/admin-main/ui/assessment/${a._id}`
                                      );
                                      setOpenMenu(null);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-[#ECFDF3] hover:bg-gray-100 dark:hover:bg-gray-600"
                                  >
                                    View
                                  </button>
                                  <div className="w-full h-px bg-[#D4D4D4] mx-auto" />
                                  <button
                                    onClick={() => {
                                      router.push(
                                        `/admin-main/ui/assessment/${a._id}?mode=edit`
                                      );
                                      setOpenMenu(null);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-[#ECFDF3] hover:bg-gray-100 dark:hover:bg-gray-600"
                                  >
                                    Edit
                                  </button>
                                  <div className="w-full h-px bg-[#D4D4D4] mx-auto" />
                                  <button
                                    onClick={() => {
                                      setCancelItem(a);
                                      setOpenMenu(null);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-[#ECFDF3] hover:bg-gray-100 dark:hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) =>
              setCurrentPage(Math.max(1, Math.min(totalPages, p)))
            }
          />
        </div>
      </>
    </BaseLayout4>
  );
}
