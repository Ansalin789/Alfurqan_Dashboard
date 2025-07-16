"use client";

import React, { useEffect, useRef, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { FaEdit } from "react-icons/fa";
import { Sun } from "lucide-react";
import Pagination from "@/components/Pagination";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";

// Define a type for salary row
interface SalaryRow {
  employeeid: string;
  employeename: string;
  paymentdate: string;
  designation: string;
  salaryamount: string;
  status: string;
}

const SalaryCard = () => {
  const [duration, setDuration] = useState("Last month");
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  const itemsPerPage = 10;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRow | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [actionOpenId, setActionOpenId] = useState<string | null>(null);
  
  const handleActionClick = (id: string) => {
    setActionOpenId(prev => (prev === id ? null : id));
  };
  
  const handleViewDetails = (row: SalaryRow) => {
    setSelectedSalary(row);
    setShowPopup(true);
  };
  
  const handleCancel = (id: string) => {
    setActionOpenId(null);
  };
  
  const handlePayNow = (id: string) => {
    setActionOpenId(null);
  };
  
  const salaryData = [
    {
      employeeid: "3867",
      employeename: "Arabic",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1000",
      status: "Paid",
    },
    {
      employeeid: "3868",
      employeename: "Ayesha R.",
      paymentdate: "11/02/2024",
      designation: "Supervisor",
      salaryamount: "1200",
      status: "Pending",
    },
    {
      employeeid: "3869",
      employeename: "Wazed Ali",
      paymentdate: "11/02/2024",
      designation: "Supervisor",
      salaryamount: "2500",
      status: "Paid",
    },
    {
      employeeid: "3870",
      employeename: "Angela Moss",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1800",
      status: "Paid",
    },
    {
      employeeid: "3871",
      employeename: "Abdullah S.",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1500",
      status: "Pending",
    },
    {
      employeeid: "3872",
      employeename: "Hasan R.",
      paymentdate: "11/02/2024",
      designation: "Supervisor",
      salaryamount: "1900",
      status: "Paid",
    },
    {
      employeeid: "3873",
      employeename: "Sara A.",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1300",
      status: "Paid",
    },
    {
      employeeid: "3874",
      employeename: "Nashit K.",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1700",
      status: "Pending",
    },
    {
      employeeid: "3875",
      employeename: "Rayan S.",
      paymentdate: "11/02/2024",
      designation: "Supervisor",
      salaryamount: "2100",
      status: "Paid",
    },
    {
      employeeid: "3876",
      employeename: "Laila M.",
      paymentdate: "11/02/2024",
      designation: "Teacher",
      salaryamount: "1400",
      status: "Paid",
    },
  ];

  // Filter logic: filter salaryData before pagination
  const filteredData = salaryData.filter(row => {
    const statusMatch = filterStatus ? row.status === filterStatus : true;
    const categoryMatch = filterCategory ? row.designation === filterCategory : true;
    const searchMatch = searchText
      ? row.employeeid.toLowerCase().includes(searchText.toLowerCase()) ||
        row.employeename.toLowerCase().includes(searchText.toLowerCase()) ||
        row.designation.toLowerCase().includes(searchText.toLowerCase()) ||
        row.salaryamount.toLowerCase().includes(searchText.toLowerCase()) ||
        row.paymentdate.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return statusMatch && categoryMatch && searchMatch;
  });

  // Pagination logic: paginate filteredData
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredPaginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

 

 

  return (
    <BaseLayout4>
      <div className="w-full min-h-screen bg-[#e9e9e9] px-4 py-6 md:mr-6 overflow-y-auto">       
    
        <br />
        <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
  <div className="w-full max-w-[1255px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
    {/* Card 1 */}
    <div className="w-full h-[125px] flex flex-col p-4 rounded-xl bg-[#7689BD] text-white shadow-md">
      <h4 className="text-base font-bold">Total Salary Paid</h4>
      <div className="mt-8">
        <h1 className="text-lg font-bold ">$12,000</h1>
        <p className="text-[12px] opacity-90">60% increase than Last Month</p>
      </div>
    </div>
    {/* Card 2 */}
    <div className="w-full h-[125px] flex flex-col p-4 rounded-xl bg-[#7689BD] text-white shadow-md">
      <h4 className="text-base font-bold">Pending Salary</h4>
      <div className="mt-8">
        <h1 className="text-lg font-bold ">$2,000</h1>
        <p className="text-[12px] opacity-90">10% increase than Last Month</p>
      </div>
    </div>
    {/* Card 3 */}
    <div className="w-full h-[125px] flex flex-col p-4 rounded-xl bg-[#7689BD] text-white shadow-md">
      <h4 className="text-base font-bold">Balance</h4>
      <div className="mt-8">
        <h1 className="text-lg font-bold ">$10,000</h1>
        <p className="text-[12px] opacity-90">50% increase than Last Month</p>
      </div>
    </div>
  </div>
</div>


  <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg">
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            {/* Left: Search */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-[15px] w-52 py-3"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Center: Filter */}
            <div
              className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>

            {/* Right: Showing X of Y */}
            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60">
                Showing {filteredPaginatedData.length} of {filteredData.length}
              </span>
            </div>
          </div>
          <table className="table-fixed w-full border-separate border-spacing-y-2">
            <thead className="text-[13px] bg-[#4C6993] text-white">
              <tr>
                {[
                  "Employee ID",
                  "Employee Name",
                  "Designation",
                  "Salary Amount",
                  "Payment Method",
                  "Payment Type",
                  "Payment Date",
                  "Status",
                  "Action"
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-1 border border-[#4C6993] text-left text-wrap break-words"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
<tbody>
  {filteredPaginatedData.map((row, index) => (
    <tr
      key={row.employeeid}
      className={`text-[9px] text-center mt-0 ${
        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
      }`}
    >
      <td className="px-3 py-3 text-[12px] text-left">{row.employeeid}</td>
      <td className="px-3 py-3 text-[12px] text-left">{row.employeename}</td>
      <td className="px-3 py-3 text-[12px] text-left">{row.designation}</td>
      <td className="px-3 py-3 text-[12px] text-left">${row.salaryamount}</td>
      <td className="px-3 py-3 text-[12px] text-left">Bank Transfer</td>
      <td className="px-3 py-3 text-[12px] text-left">Monthly</td>
      <td className="px-3 py-3 text-[12px] text-left">{row.paymentdate}</td>
      <td className="px-3 py-3 text-[12px] text-left">
        <span
          className={`inline-flex items-center justify-center w-20 h-5 px-3 py-1 rounded-md
            ${
              row.status === "Paid"
                ? "bg-[#ECFDF3] text-[#377E36]"
                : row.status === "Pending"
                ? "bg-[#F0AD4E33] text-[#F0AD4E]"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {row.status}
        </span>
      </td>
      <td className="relative px-3 py-3 break-words text-[12px] text-left">
  <div className="relative inline-block text-left">
    <button
      onClick={() => handleActionClick(row.employeeid)}
      className="px-2 text-gray-600 hover:text-gray-800"
    >
      ⋮
    </button>

    {actionOpenId === row.employeeid && (
      <div className="absolute left-0 translate-x-[-10px] w-28 bg-white border rounded-md shadow-md z-50">
      {row.status === "Paid" ? (
          <>
            <button
              onClick={() => handleViewDetails(row)}
              className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={() => handleCancel(row.employeeid)}
              className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handlePayNow(row.employeeid)}
              className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100"
            >
              Pay Now
            </button>
            <button
              onClick={() => handleCancel(row.employeeid)}
              className="block w-full text-left px-4 py-2 text-xs  hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    )}
  </div>
</td>

    </tr>
  ))}
</tbody>

          </table>
        </div>
   {showPopup && selectedSalary && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={() => setShowPopup(false)}
        >
          &times;
        </button>
  
        <h2 className="text-lg font-semibold mb-6">Payment Details</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <label className="font-medium mb-1 block">Employee ID</label>
            <input
              value={selectedSalary.employeeid}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Employee Name</label>
            <input
              value={selectedSalary.employeename}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Designation</label>
            <input
              value={selectedSalary.designation}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Salary Amount</label>
            <input
              value={`$${selectedSalary.salaryamount}`}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Payment Date</label>
            <input
              value={"March 10, 2024"} // Replace with dynamic if available
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Payment Received Date</label>
            <input
              value={"March 15, 2024"} // Replace with dynamic if available
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Payment Status</label>
            <input
              value={selectedSalary.status}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Earnings</label>
            <input
              value={`$${selectedSalary.salaryamount}`}
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Deductions</label>
            <input
              value={"$200"} // Replace with dynamic if needed
              readOnly
              className="w-full p-2 border rounded text-[13px]"
            />
          </div>
  
          <div>
            <label className="font-medium mb-1 block">Description</label>
            <textarea
              placeholder="Write your comment here..."
              className="w-full p-2 border rounded text-[13px] h-[80px] resize-none"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  )}
  

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 dark:bg-opacity-70">
          <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl shadow-lg p-5 w-[400px]">
            <h2 className="text-base font-semibold mb-3">Filter by</h2>

            {/* Expense Type */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Expense Type
              </label>
              <select
                className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Supplies">Supplies</option>
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <input
                type="text"
                placeholder="e.g., Bank Transfer"
                className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-400"
              />
            </div>

            {/* Payment Date */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Payment Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
                />
                <input
                  type="date"
                  className="flex-1 border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                className="px-4 py-1.5 text-sm rounded-md border bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                onClick={() => {
                  setFilterCategory("");
                  setFilterStatus("");
                  setIsFilterModalOpen(false);
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-1.5 text-sm rounded-md bg-[#576CBC] text-white hover:bg-blue-700"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Show {filteredData.length} results
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
    </BaseLayout4>
  );
};

export default SalaryCard;
