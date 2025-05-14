"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaEdit, FaFilter } from "react-icons/fa";
import axios from "axios";

interface Student {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  country?: string;
  city?: string;
}

interface Invoice {
  _id: string;
  courseName: string;
  amount: number;
  invoiceStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  dueDate?: string;
  student: Student;
}

const Trailclasslist = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
const [filters, setFilters] = useState({
  invoiceId: "",
  date: "",
  studentName: "",
  studentId: "",
  course: "",
  dueByDays: "",
  paidDate: "",
  status: "",
});


useEffect(() => {
  const token = localStorage.getItem('AdminAuthToken');
  if (token) {
    fetchInvoice(token); // Or call the function that performs the GET request
  } else {
    alert("No auth token found.");
  }
}, []);

const fetchInvoice = (token: string) => {
  axios
    .get("http://localhost:5001/studentinvoice/list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      setInvoices(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching invoices:", error);
    });
};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const calculateDueDays = (dueDate?: string) => {
    if (!dueDate) return "-";
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const handleclicksend = () => {
    router.push("/admin-main/ui/send-invoice");
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesInvoiceId = filters.invoiceId
      ? invoice._id.toLowerCase().includes(filters.invoiceId.toLowerCase())
      : true;
    const matchesDate = filters.date
      ? invoice.createdDate.slice(0, 10) === filters.date
      : true;
    const matchesStudentName = filters.studentName
      ? invoice.student?.studentName?.toLowerCase().includes(filters.studentName.toLowerCase())
      : true;
    const matchesStudentId = filters.studentId
      ? invoice.student?.studentId?.toLowerCase().includes(filters.studentId.toLowerCase())
      : true;
    const matchesCourse = filters.course
      ? invoice.courseName?.toLowerCase().includes(filters.course.toLowerCase())
      : true;
    const matchesDueByDays = filters.dueByDays
      ? calculateDueDays(invoice.dueDate).includes(filters.dueByDays)
      : true;
    const matchesPaidDate = filters.paidDate
      ? invoice.lastUpdatedDate?.slice(0, 10) === filters.paidDate
      : true;
    const matchesStatus = filters.status
      ? invoice.invoiceStatus === filters.status
      : true;
  
    return (
      matchesInvoiceId &&
      matchesDate &&
      matchesStudentName &&
      matchesStudentId &&
      matchesCourse &&
      matchesDueByDays &&
      matchesPaidDate &&
      matchesStatus
    );
  });
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 1);
      const rightBound = Math.min(totalPages, currentPage + 1);

      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) pageNumbers.push(-1);
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <BaseLayout4>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <div className="flex items-center space-x-2">
          <h2 className="text-[20px] font-semibold">Invoice</h2>
        </div>

        <div className="flex justify-between items-center py-4">
          {/* Left Section: Search + Filter */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-sm px-4 py-2 text-[12px] shadow outline-none"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
  className="flex items-center bg-white border p-2 px-4 rounded-sm shadow text-[12px]"
  onClick={() => setFilterOpen((prev) => !prev)}
>
  <FaFilter className="mr-2 text-gray-600" />
  Filter
</button>


          </div>

          {/* Right Section: Add Invoice + Duration */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleclicksend}
              className="flex items-center bg-[#002244] text-white px-4 py-2 rounded-sm text-[12px] font-medium shadow"
            >
              + New Invoice
            </button>
            <select className="border rounded-sm px-4 py-2 shadow text-[12px] outline-none">
              <option>Duration: Last month</option>
              <option>Duration: Last week</option>
              <option>Duration: Last year</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[500px] overflow-y-scroll scrollbar-none flex flex-col justify-between mt-4">
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg shadow bg-[#fff]">
                <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                  <tr>
                    <th className="p-3 py-5 text-center">Invoice ID</th>
                    <th className="p-3 py-5 text-center">Date</th>
                    <th className="p-3 py-5 text-center">Student Name</th>
                    <th className="p-3 py-5 text-center">Student ID</th>
                    <th className="p-3 py-5 text-center">Course</th>
                    <th className="p-3 py-5 text-center">Due By Days</th>
                    <th className="p-3 py-5 text-center">Paid Date</th>
                    <th className="p-3 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((invoice, index) => (
                      <tr
                        key={invoice._id}
                        className={`text-[9px] font-medium ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="p-2 text-center">#{invoice._id.slice(-6)}</td>
                        <td className="p-2 text-center">
                          {new Date(invoice.createdDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-2 text-center">{invoice.student?.studentName || "-"}</td>
                        <td className="p-2 text-center">{invoice.student?.studentId || "-"}</td>
                        <td className="p-2 text-center">{invoice.courseName}</td>
                        <td className="p-2 text-center">{calculateDueDays(invoice.dueDate)}</td>
                        <td className="p-2 text-center">
                          {invoice.invoiceStatus === "Paid"
                            ? new Date(invoice.lastUpdatedDate).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-12 h-4.5 px-3 py-1 rounded-md ${
                              invoice.invoiceStatus === "Paid"
                                ? "bg-green-100 text-green-800 border border-green-900"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-900"
                            } text-[7px]`}
                          >
                            {invoice.invoiceStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <p className="text-[11px] text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} entries
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronLeft size={8} />
              </button>

              {getPageNumbers().map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <span key={index} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-5 h-5 rounded-lg shadow text-[11px] ${
                      currentPage === pageNumber
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronRight size={8} />
              </button>
            </div>
          </div>
          
        </div>
        {filterOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        onClick={() => setFilterOpen(false)}
        aria-label="Close"
      >
        &times;
      </button>
      <h3 className="text-lg font-semibold mb-4 text-center">Filter Invoice</h3>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={e => { e.preventDefault(); setCurrentPage(1); setFilterOpen(false); }}
      >
        <input
          className="border p-2 rounded text-xs"
          placeholder="Invoice ID"
          value={filters.invoiceId}
          onChange={e => setFilters(f => ({ ...f, invoiceId: e.target.value }))}
        />
        <input
          type="date"
          className="border p-2 rounded text-xs"
          placeholder="Date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
        />
        <input
          className="border p-2 rounded text-xs"
          placeholder="Student Name"
          value={filters.studentName}
          onChange={e => setFilters(f => ({ ...f, studentName: e.target.value }))}
        />
        <input
          className="border p-2 rounded text-xs"
          placeholder="Student ID"
          value={filters.studentId}
          onChange={e => setFilters(f => ({ ...f, studentId: e.target.value }))}
        />
        <input
          className="border p-2 rounded text-xs"
          placeholder="Course"
          value={filters.course}
          onChange={e => setFilters(f => ({ ...f, course: e.target.value }))}
        />
        <input
          className="border p-2 rounded text-xs"
          placeholder="Due By Days"
          value={filters.dueByDays}
          onChange={e => setFilters(f => ({ ...f, dueByDays: e.target.value }))}
        />
        <input
          type="date"
          className="border p-2 rounded text-xs"
          placeholder="Paid Date"
          value={filters.paidDate}
          onChange={e => setFilters(f => ({ ...f, paidDate: e.target.value }))}
        />
        <select
          className="border p-2 rounded text-xs"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <button
          type="submit"
          className="col-span-2 bg-[#002244] text-white rounded p-2 text-xs mt-2 w-44 ml-56 text-center justify-end"
        >
          Apply Filters
        </button>
      </form>
    </div>
  </div>
)}

      </div>
    </BaseLayout4>
  );
};

export default Trailclasslist;
