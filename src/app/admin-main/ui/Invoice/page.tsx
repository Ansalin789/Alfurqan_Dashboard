"use client";

import React, { useEffect, useRef, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { Sun, Bell, X, FileText, Search } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";
import ApplicationChart from "../../components/invoiceBar";

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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from "chart.js";
import { useRouter } from "next/navigation";
import InvoicesDueByDays from "../../components/invoicedue";
import { MdTune } from "react-icons/md";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Page() {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  

  type InvoiceType = "total" | "paid" | "pending" | "void";
  const [invoiceCounts, setInvoiceCounts] = useState<
    Record<InvoiceType, number>
  >({
    total: 0,
    paid: 0,
    pending: 0,
    void: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [filterOpen, setFilterOpen] = useState(false);
  const [dashboardRead,setdashboardRead]=useState(false);
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

const [searchText, setSearchText] = useState("");
const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
const [filterStatus, setFilterStatus] = useState("");
const [filterRange, setFilterRange] = useState("");


useEffect(() => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
  if (token) {
    fetchInvoice(token); // Or call the function that performs the GET request
  } else {
    console.log("No auth token found.");
  }
  if (typeof window !== "undefined") {
      const roleAccessRaw = localStorage.getItem("AdminRolePermission");

      if (roleAccessRaw) {
        try {
          const roleAccess = JSON.parse(roleAccessRaw);
          const hasRead = roleAccess?.invoice?.write ?? false;
          console.log(hasRead);
          setdashboardRead(hasRead);
        } catch (error) {
          console.error("Invalid JSON in AdminRolePermission:", error);
        }
      }
    }

}, []);

const fetchInvoice = (token: string) => {
  axios
    .get("https://api.blackstoneinfomaticstech.com/studentinvoice/list", {
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

 

  // Combine filter modal and search text logic
  const filterAndSearchInvoices = invoices.filter((invoice) => {
    // Modal filters
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
    // Modal filter modal (status/range)
    const matchesFilterStatus = filterStatus ? invoice.invoiceStatus === filterStatus : true;
    const matchesFilterRange = filterRange
      ? (invoice.dueDate ? (() => {
          const due = new Date(invoice.dueDate!);
          const today = new Date();
          const diffTime = due.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (filterRange === "0 to 10") return diffDays >= 0 && diffDays <= 10;
          if (filterRange === "10 to 20") return diffDays > 10 && diffDays <= 20;
          if (filterRange === "20 to 30") return diffDays > 20 && diffDays <= 30;
          if (filterRange === "More than 30 Days") return diffDays > 30;
          return true;
        })() : false)
      : true;
    // Search text
    const keyword = searchText.toLowerCase();
    const matchesSearch =
      invoice._id.toLowerCase().includes(keyword) ||
      invoice.student?.studentName?.toLowerCase().includes(keyword) ||
      invoice.student?.studentId?.toLowerCase().includes(keyword) ||
      invoice.courseName?.toLowerCase().includes(keyword);
    return (
      matchesInvoiceId &&
      matchesDate &&
      matchesStudentName &&
      matchesStudentId &&
      matchesCourse &&
      matchesDueByDays &&
      matchesPaidDate &&
      matchesStatus &&
      matchesFilterStatus &&
      matchesFilterRange &&
      matchesSearch
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterAndSearchInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterAndSearchInvoices.length / itemsPerPage);

  // Only one definition of calculateDueDays should exist, before its first use
 

  useEffect(() => {
     const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      fetchInvoiceCounts(token); // call your function with token
    } else {
    console.log("No auth token found.");
    }
  }, []);
    const fetchInvoiceCounts = async (token: string) => {
      try {
        const response = await fetch("https://api.blackstoneinfomaticstech.com/invoicecounts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        const result = await response.json();
        if (result.success) {
          setInvoiceCounts(result.data);
        }
      } catch (error) {
        console.error("Error fetching invoice counts:", error);
      }
    };

  const cards: {
    title: string;
    key: InvoiceType;
    iconBg: string;
    iconColor: string;
    chartColor: string;
  }[] = [
    {
      title: "Total Invoices",
      key: "total",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
      chartColor: "#64748b",
    },
    {
      title: "Paid Invoices",
      key: "paid",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
      chartColor: "#6366f1",
    },
    {
      title: "Unpaid Invoices",
      key: "pending",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-500",
      chartColor: "#06b6d4",
    },
    {
      title: "Void Invoices",
      key: "void",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      chartColor: "#3b82f6",
    },
  ];




 
 




  const handleviewlist = () => {
    router.push("/admin-main/ui/invoicelist");
  };





  const calculateDueDays = (dueDate?: string) => {
    if (!dueDate) return "-";
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div>
      <BaseLayout4>
        <div className="p-6 w-full mx-auto">
          {/* Header */}
          {/* Invoice Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-3">
  {cards.map((card, index) => (
    <div
      key={index}
      className="bg-[#7986CB] text-white rounded-md px-4 py-3 h-24 flex flex-col justify-between"
    >
      <p className="text-sm font-medium">{card.title}</p>
      <h3 className="text-2xl font-bold">{invoiceCounts[card.key]}</h3>
    </div>
  ))}
</div>



          {/* Middle Sections */}
          <div className="flex gap-6 mb-6 items-start">
  {/* Total Invoice Section (Bar Chart) */}
  <div className="bg-white rounded-xl shadow-sm p-4 h-[300px] flex-1">
    <ApplicationChart />
  </div>

  {/* Invoices Due by Days (Doughnut Chart) */}
  <div className="bg-white rounded-xl shadow-sm p-4 h-[300px] w-[300px] shrink-0">
   <InvoicesDueByDays />
  </div>
</div>


          {/* Invoice Table */}
          <div className="">
          <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg overflow-x-auto scrollbar-none">
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
          Showing {filterAndSearchInvoices.length} of {filterAndSearchInvoices.length}
        </span>
      </div>
    </div>
    {/* Table scrollable wrapper start */}
    <div className="h-96 overflow-y-auto w-full scrollbar-none">
      <table className="table-fixed w-full">
        <thead className="text-[13px] bg-[#4C6993] text-white sticky top-0 z-10">
          <tr>
            {[
              "Invoice ID",
              "Date",
              "Student Name",
              "Student ID",
              "Course",
              "Due By Days",
              "Paid Date",
              "Status",
            ].map((header, idx) => (
              <th
                key={idx}
                className="px-2 py-1 text-left text-wrap break-words"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...filterAndSearchInvoices]
            .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
            .map((row: Invoice, index: number) => (
            <tr
              key={row._id}
              className={`text-[9px] text-center  mt-0 ${
                index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
              }`}
            >
              <td className="px-3 py-3 break-words text-[12px] text-left">
                #{row._id.slice(-6)}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {new Date(row.createdDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {row.student?.studentName || "-"}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {row.student?.studentId || "-"}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {row.courseName}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {calculateDueDays(row.dueDate)}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                {row.invoiceStatus === "Paid"
                  ? new Date(row.lastUpdatedDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </td>
              <td className="px-3 py-3 break-words text-[12px] text-left">
                <span
                  className={`inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded-md
                    ${
                      row.invoiceStatus === "Paid"
                        ? "bg-[#ECFDF3] text-[#377E36]"
                        : row.invoiceStatus === "Pending"
                        ? "bg-[#F0AD4E33] text-[#F0AD4E]"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {row.invoiceStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Table scrollable wrapper end */}
    {/* Filter Modal */}
    {isFilterModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 dark:bg-opacity-70">
        <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl shadow-lg p-5 w-[400px]">
          <h2 className="text-base font-semibold mb-3">Filter by</h2>
          {/* Invoice ID */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Invoice ID</label>
            <input
              type="text"
              className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
              value={filters.invoiceId}
              onChange={e => setFilters(f => ({ ...f, invoiceId: e.target.value }))}
              placeholder="Enter Invoice ID"
            />
          </div>
          {/* Student ID */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input
              type="text"
              className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
              value={filters.studentId}
              onChange={e => setFilters(f => ({ ...f, studentId: e.target.value }))}
              placeholder="Enter Student ID"
            />
          </div>
          {/* Student Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Student Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
              value={filters.studentName}
              onChange={e => setFilters(f => ({ ...f, studentName: e.target.value }))}
              placeholder="Enter Student Name"
            />
          </div>
          {/* Course */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              type="text"
              className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
              value={filters.course}
              onChange={e => setFilters(f => ({ ...f, course: e.target.value }))}
              placeholder="Enter Course Name"
            />
          </div>
          {/* Due Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-2 py-1.5 bg-white dark:bg-zinc-800 dark:text-white border-gray-300 dark:border-zinc-700 text-sm"
              value={filters.date}
              onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
            />
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
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          {/* Buttons */}
          <div className="flex justify-between">
            <button
              className="px-4 py-1.5 text-sm rounded-md border bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
              onClick={() => {
                setFilterRange("");
                setFilterStatus("");
                setIsFilterModalOpen(false);
              }}
            >
              Reset
            </button>
            <button
              className="px-4 py-1.5 text-sm rounded-md bg-[#002244] text-white hover:bg-blue-700"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Show {invoices.filter((row: Invoice) =>
                row._id.toLowerCase().includes(searchText.toLowerCase()) &&
                (filterStatus ? row.invoiceStatus === filterStatus : true) &&
                (filterRange ? (row.dueDate ? (() => {
                  const due = new Date(row.dueDate!);
                  const today = new Date();
                  const diffTime = due.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (filterRange === "0 to 10") return diffDays >= 0 && diffDays <= 10;
                  if (filterRange === "10 to 20") return diffDays > 10 && diffDays <= 20;
                  if (filterRange === "20 to 30") return diffDays > 20 && diffDays <= 30;
                  if (filterRange === "More than 30 Days") return diffDays > 30;
                  return true;
                })() : false) : true)
              ).length} results
            </button>
          </div>
        </div>
      </div>
    )}
    {/* END Filter Modal */}
    {/* Pagination */}
  
  {/* Close the main content div for w-full bg-[#FAFAFB] ... */}
  </div>
          </div>
          <div className="flex justify-end">
            <button
                className=" mt-2 text-[#576CBC] border border-[#576CBC] bg-[#fff] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#dbe2f3] transition duration-200 dark:bg-[#2E3343]"
                onClick={handleviewlist}
            >
              View All
            </button>
          </div>
        </div>
      </BaseLayout4>
    </div>
  );
}
