"use client";

import React, { useEffect, useRef, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { Sun, Bell, X, FileText } from "lucide-react";
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


  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  const COLORS = ["#0f172a", "#8b5cf6", "#0ea5e9", "#3b82f6"];
  const [dueData, setDueData] = useState({
    range_0_10: 0,
    range_11_20: 0,
    range_21_30: 0,
    range_30_plus: 0,
  });

  useEffect(() => {
    const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      fetchData(token); // call your function with token
    } else {
      console.log("No auth token found.");
    }
  }, []);    
  const fetchData = async (token: string) => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/invoiceduebydates",
           {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        const json = await res.json();
        if (json.success) {
          setDueData(json.data);
        }
      } catch (err) {
        console.error("Error fetching invoiceduebydates", err);
      }
    };

 
 

 

  const legendLabels = [
    { label: "0-10 days", value: dueData.range_0_10, color: COLORS[0] },
    { label: "11-20 days", value: dueData.range_11_20, color: COLORS[1] },
    { label: "21-30 days", value: dueData.range_21_30, color: COLORS[2] },
    {
      label: "More than 30 days",
      value: dueData.range_30_plus,
      color: COLORS[3],
    },
  ];

  const InvoiceLegend = () => (
    <div className="space-y-3">
      {legendLabels.map(({ label, value, color }, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const handleviewlist = () => {
    router.push("/admin-main/ui/invoicelist");
  };


useEffect(() => {
    const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      fetchStudentInvoices(token);
    } else {
      console.log("No auth token found.");
    }
  }, []);

   const fetchStudentInvoices  = (token:string) => {
    axios
      .get("https://api.blackstoneinfomaticstech.com/studentinvoice/list", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInvoices(response.data.data); // adapt to your API shape
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
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
          <div className="overflow-x-auto scrollbar-none h-[170px] bg-white rounded-lg border-2 border-[#1C3557] flex flex-col justify-between">
            <table
              className="min-w-full rounded-lg shadow bg-white"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                <tr>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "15%" }}
                  >
                    Invoice ID
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "15%" }}
                  >
                    Date
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "15%" }}
                  >
                    Student Name
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "12%" }}
                  >
                    Student ID
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "12%" }}
                  >
                    Course
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "10%" }}
                  >
                    Due By Days
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "15%" }}
                  >
                    Paid Date
                  </th>
                  <th
                    className="p-3 py-5 font-semibold text-center"
                    style={{ width: "10%" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-[10px] font-medium">
                {invoices.length > 0 ? (
                  invoices.map((invoice, index) => (
                    <tr
                      key={invoice._id}
                      className={
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }
                    >
                      <td className="p-2 text-center">
                        #{invoice._id.slice(-6)}
                      </td>
                      <td className="p-2 text-center">
                        {new Date(invoice.createdDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {invoice.student?.studentName || "-"}
                      </td>
                      <td className="p-2 text-center">
                        {invoice.student?.studentId || "-"}
                      </td>
                      <td className="p-2 text-center">{invoice.courseName}</td>
                      <td className="p-2 text-center">
                        {calculateDueDays(invoice.dueDate)}
                      </td>
                      <td className="p-2 text-center">
                        {invoice.invoiceStatus === "Paid"
                          ? new Date(
                              invoice.lastUpdatedDate
                            ).toLocaleDateString(undefined, {
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
                    <td colSpan={8} className="text-center py-4 text-sm">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              className="text-[#fff] mt-3 text-[11px] bg-[#223857] cursor-pointer rounded-md border-none px-2 py-1"
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
