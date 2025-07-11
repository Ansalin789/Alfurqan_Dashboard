"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonPlus } from "react-icons/bs";
import { IoDiamondSharp } from "react-icons/io5";

export interface IStudentInvoice {
  _id: string;
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    country: string;
    city: string;
  };
  courseName: string;
  amount: number;
  invoiceStatus: string;
  packageType: string;
  itemDescription: string;
  duration: string;
  rate: string;
  description: string;
  status: string;
  dueDate: string; // ISO date string
  createdDate: string; // ISO date string
  paymentDate: string; // ISO date string
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  __v: number;
}

const StudentProfile = () => {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [studentImage, setStudentImage] = useState<string | null>(null);

  // ✅ Move this line INSIDE the component
  const [invoices, setInvoices] = useState<IStudentInvoice[]>([]);

  useEffect(() => {
    const studentId = localStorage.getItem("StudentPortalId");
    const token = localStorage.getItem("StudentAuthToken");

    setStudentName(localStorage.getItem("StudentPortalName"));
    setStudentEmail(localStorage.getItem("StudentPortalEmail"));

    console.log("Student ID:", studentId);
    console.log("Token:", token);

    const fetchStudentInvoices = async () => {
      try {
        if (!studentId || !token) {
          console.warn("Missing studentId or token in localStorage");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/studentinvoiceById",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API response:", response.data);

        if (Array.isArray(response.data?.data)) {
          setInvoices(response.data.data);
          
          // Extract student info from the first invoice if available
          if (response.data.data.length > 0) {
            const firstInvoice = response.data.data[0];
            if (firstInvoice.student) {
              setStudentName(firstInvoice.student.studentName);
              setStudentEmail(firstInvoice.student.studentEmail);
            }
          }
        } else {
          console.warn("Invalid data format from API:", response.data);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchStudentInvoices();
  }, []);
  const [dashboardCounts, setDashboardCounts] = useState({
    totalLevel: 0,
    // totalAttendance: 0,
    // totalClasses: 0,
    // presentCount: 0,
    // totalDuration: "0 Hr",
  });

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;

        if (!token) {
          console.error("❌ StudentAuthToken not found");
          return;
        }

        const studentId = localStorage.getItem("StudentPortalId");
        const courseName = localStorage.getItem("StudentCourseName");

        const response = await axios.get(
          "http://localhost:5001/dashboard/student/counts",
          {
            params: { studentId, courseName },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        setDashboardCounts({
          totalLevel: Number(response.data.totalLevel) || 0,
          // totalAttendance: Number(response.data.totalAttendance) || 0,
          // totalClasses: Number(response.data.totalClasses) || 0,
          // presentCount: 0,
          // totalDuration: String(response.data.totalDuration) || "0",
        });
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[310px] flex flex-col gap-4">
      <div className="rounded-xl shadow-lg bg-white h-[280px] dark:bg-[#343434] p-4 relative">
        <h3 className="text-[#010E30] font-semibold text-[16px] mb-2 dark:text-white">
          Student Profile
        </h3>

        <img
          src={studentImage || "https://randomuser.me/api/portraits/men/32.jpg"}
          alt="profile"
          className="w-20 h-20 rounded-full mx-auto mb-2"
        />

        <h3 className="text-[#010E30] font-bold text-[16px] dark:text-white text-center">
          {studentName ?? "Loading..."}
        </h3>
        <p className="text-gray-500 text-[12px] text-center">
          {studentEmail ?? "Loading..."}
        </p>
        <p className="text-gray-500 text-[12px] mb-2 text-center">Level {dashboardCounts.totalLevel}</p>

        <div className="flex justify-center space-x-1 mb-2">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">
              ★
            </span>
          ))}
          <span className="text-gray-300 text-lg">★</span>
        </div>
      </div>

      {/* Payment Item */}
      <div className="rounded-xl shadow-lg bg-white dark:bg-[#343434] p-4 h-[180px] mt-1 w-full">
        <h3 className="text-[#010E30] font-semibold text-[16px] mb-3 dark:text-white">
          Upcoming Payments
        </h3>

        {invoices.filter((i) => i.invoiceStatus === "Pending").length === 0 ? (
          <p className="text-gray-500 text-sm">No pending payments found</p>
        ) : (
          invoices
            .filter((i) => i.invoiceStatus === "Pending")
            .slice(0, 2)
            .map((invoice) => (
              <div
                key={invoice._id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[#010E30] text-[13px] dark:text-white">
                      {invoice.itemDescription || "Class Invoice"}
                    </p>
                    <p className="text-[#010E30] text-[13px] font-semibold dark:text-white">
                      ${invoice.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-400 text-[11px]">Due date</p>
                  <p className="text-gray-400 text-[12px]">
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Payment Item */}
      <div className="rounded-xl shadow-lg bg-white dark:bg-[#343434] mt-2 h-[180px] p-4 w-full">
        <h3 className="text-[#010E30] font-semibold text-[16px] mb-3 dark:text-white">
          Recent Payments
        </h3>

        {invoices.filter((i) => i.invoiceStatus === "Paid").length === 0 ? (
          <p className="text-gray-500 text-sm">No paid payments found</p>
        ) : (
          invoices
            .filter((i) => i.invoiceStatus === "Paid")
            .slice(0, 2)
            .map((invoice) => (
              <div
                key={invoice._id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[#010E30] text-[13px] dark:text-white">
                      {invoice.itemDescription || "Class Invoice"}
                    </p>
                    <p className="text-[#010E30] text-[13px] font-semibold dark:text-white">
                      ${invoice.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[#377E36] text-[11px]">Paid</p>
                  <p className="text-gray-400 text-[12px]">
                    {new Date(invoice.paymentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Gradient Action Cards - Example 1 */}
      <div className="flex items-center justify-between p-4 mt-2 rounded-xl mb-0 bg-gradient-to-r from-[#7e57c2] to-[#5c6bc0] text-white">
        <div className="flex items-center gap-4">
          {/* ICON CIRCLE with image */}
          <div className="bg-white bg-opacity-20 p-3 rounded-full w-10 h-10 flex items-center justify-center">
          <BsPersonPlus />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold">Refer a Friend</p>
            <p className="text-[10px] opacity-80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
            </p>
          </div>
        </div>

        {/* Arrow Icon */}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Gradient Action Cards - Example 2 */}
      <div className="flex items-center justify-between p-4 mt-2 rounded-xl bg-gradient-to-r from-[#ef5350] via-[#ec407a] to-[#ab47bc] text-white mb-3">
        <div className="flex items-center gap-4">
          {/* Image icon in circle */}
          <div className="bg-white bg-opacity-20 p-3 rounded-full w-10 h-10 flex items-center justify-center">
          <IoDiamondSharp  />
          </div>

          {/* Text content */}
          <div>
            <p className="text-sm font-semibold">Upgrade Packages</p>
            <p className="text-[11px] opacity-80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
            </p>
          </div>
        </div>

        {/* Right arrow */}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
