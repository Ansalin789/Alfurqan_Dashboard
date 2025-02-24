"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Invoice {
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: number;
  };
  _id: string;
  courseName: string;
  amount: number;
  status: string;
  createdDate: string;
  invoiceStatus: "Paid" | "Pending";
}

const Profile = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch("http://localhost:5001/studentinvoice");
        const result = await response.json();

        if (result?.invoice?.length > 0) {
          setInvoice(result.invoice[0]); // Get the latest invoice
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  return (
    <div className="bg-white rounded-tl-lg rounded-tr-lg h-auto sm:h-[350px] overflow-hidden mr-0 sm:mr-6 mx-auto">
      <div className="text-center p-0">
        <Image  
          src="/assets/images/proff.png" 
          alt={invoice?.student?.studentName || "Student"}
          width={80}
          height={80}
          className="rounded-full mx-auto sm:w-[100px] sm:h-[100px]"
        />
        <h2 className="text-[16px] sm:text-[14px] font-semibold mt-2">
          {invoice?.student?.studentName ?? "Student"}
        </h2>
        <p className="text-gray-500 text-[14px] sm:text-[12px]">Student</p>
        <div className="flex justify-center mt-2">
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-gray-300">⭐</span>
        </div>
      </div>

      {/* Sections */}
      <div className="p-2 space-y-2 justify-center ml-5 border-t-[1px] border-t-[#727272] border-b-[1px] border-b-[#727272]">
        {/* Recent Payments */}
        <div className="bg-[#E8EFF6] border-l-4 border-[#9882BB] p-3 h-[9vh] rounded-md text-center">
          <h3 className="text-[12px] font-semibold text-gray-700">
            Recent Payments
          </h3>
          {loading ? (
            <p className="text-[11px] text-gray-500 mt-1">Loading...</p>
          ) : invoice?.invoiceStatus === "Paid" ? (
            <p className="text-[11px] text-green-600 mt-1">
              Paid: ₹{invoice.amount}
            </p>
          ) : (
            <p className="text-[11px] text-gray-500 mt-1">No recent payments</p>
          )}
        </div>

        {/* Pending Fee Section */}
        <div className="bg-[#E8EFF6] p-3 h-16 rounded-md text-center border-l-4 border-[#9882BB]">
          {invoice?.invoiceStatus === "Pending" ? (
            <>
              <h3 className="text-[12px] font-semibold text-gray-700">
                Pending Fee!
              </h3>
              <div className="justify-start text-start">
                <p className="text-[11px] text-gray-600">
                  Amount Due: ₹{invoice?.amount}
                </p>
                <button className="bg-[#1C3557] text-white text-[8px] font-semibold px-3 py-1 -mt-8 rounded-md hover:bg-[#142844] transition">
                  <Link href="/student/ui/payment">Pay Now</Link>
                </button>
              </div>
            </>
          ) : (
            <h3 className="text-[12px] font-semibold text-green-600">
              No Pending Fees 🎉
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
