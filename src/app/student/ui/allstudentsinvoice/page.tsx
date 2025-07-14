"use client";

import { useEffect, useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import BaseLayout2 from "@/components/BaseLayout2";
import axios from "axios";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import StudentHeader from "../../components/StudentHeader";
import React from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const stripePromise = loadStripe(
  "pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE"
);

type StripePaymentFormProps = {
  onPaymentSuccess: (token: any) => void;
};
interface Student {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string; // Changed to string because it's a phone number and might start with 0 or contain country codes
  country: string;
  state: string;
  city: string;
  pinCode: string;
}

interface Invoice {
  _id: string;
  courseName: string;
  amount: number;
  paymentDate: number;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  invoiceStatus: string;
  student: Student;
  description: string;
  dueDate: string;
  duration: string;
  itemDescription: string;
  packageType: string;
  rate: string;
  __v: number;
  payments?: { amount: number; date: string }[]; // Added payments array
}

interface InvoiceResponse {
  totalCount: number;
  invoice: Invoice[];
}

interface CheckoutFormProps {
  clientSecret: string;
  invoiceId: string;
  amount: number;
  currency: string;
}
const itemsPerPage = 10;

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  invoiceId,
  amount,
  currency,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setMessage("Card details are required.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardNumberElement },
      }
    );

    if (error) {
      setMessage(error.message ?? "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      // Now send this to your backend if needed
      await axios.post(
        "http://localhost:5001/student/create-payment-intent",
        {
          amount,
          currency,
          invoiceId,
          paymentIntentResponse: paymentIntent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-[#343434]"
    >
      <div className="">
        <div className="mb-4 ">
          <label className="block text-xs font-medium text-gray-800 mb-1 dark:text-[#ffffff]">
            Card Number
          </label>
          <div className="border rounded-md px-3 py-2 flex items-center bg-white dark:bg-[#3C3C3C]">
            <CardNumberElement className="w-full dark:text-[#ffffff]" />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-800 mb-1 dark:text-[#ffffff]">
              Expiry
            </label>
            <div className="border rounded-md px-3 py-2 bg-white dark:bg-[#3C3C3C] dark:text-[#ffffff]">
              <CardExpiryElement className="w-full dark:text-[#ffffff]" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-800 mb-1 dark:text-[#ffffff]">
              CVC
            </label>
            <div className="border rounded-md px-3 py-2 bg-white dark:bg-[#3C3C3C] dark:text-[#ffffff]">
              <CardCvcElement className="w-full dark:text-[#ffffff]" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-bold transition-colors text-[13px] ${
            !stripe || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "cursor-pointer bg-[#2D6AE0] hover:bg-[#1B4FA0]"
          }`}
        >
          {loading ? "Processing..." : "Pay"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </form>
  );
};

const Invoice = () => {
  const [showModal, setShowModal] = useState(false); // Payment modal
  const [showFilterModal, setShowFilterModal] = useState(false); // Filter modal
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  // Add missing filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [positionApplied, setPositionApplied] = useState("Pending");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState("");

  // Calculate total price based on selected invoice
  const calculateTotalPrice = () => {
    if (!selectedInvoice) return 0;
    const amount = Number(selectedInvoice.amount) || 0;
    const gst = 0; // Since GST is not in your API response
    const discount = 0; // Since discount is not in your API response
    return amount + gst - discount;
  };

  const totalPrice = calculateTotalPrice();
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const studentIdToFilter = localStorage.getItem("StudentPortalId");
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;

        if (!token) {
          console.error("❌ StudentAuthToken not found");
          return;
        }
        const response = await axios.get<InvoiceResponse>(
          "https://api.blackstoneinfomaticstech.com/studentinvoice",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("api response", response);
        const filteredInvoices = response.data.invoice.filter(
          (invoice) => invoice.student.studentId === studentIdToFilter
        );
        setInvoices(filteredInvoices);
        // Set the first invoice as selected by default if available
        if (filteredInvoices.length > 0) {
          setSelectedInvoice(filteredInvoices[0]);
        }
      } catch (error) {
        console.log("Failed to fetch invoices. Please try again.");
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  const handleClick = async () => {
    if (!selectedInvoice) {
      alert("Please select an invoice first.");
      return;
    }

    setShowModal(true);
    setShowFilterModal(false); // <-- Add this line
    const evaluationid = selectedInvoice._id;
    const totalprice = totalPrice;

    // Debug: Log values before making the request
    console.log("[DEBUG] totalprice:", totalprice);
    console.log("[DEBUG] evaluationid:", evaluationid);

    // Set paymentDate to current date/time in ISO format
    const paymentDate = new Date().toISOString();

    try {
      const response = await axios.post(
        "http://localhost:5001/student/create-payment-intent",
        {
          amount: totalprice * 100,
          currency: "usd",
          invoiceId: evaluationid,
          paymentIntentResponse: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[DEBUG] Stripe Response:", response.data); // Debugging
      const clientSecret = response?.data?.clientSecret;
      console.log("[DEBUG] Stripe clientSecret:", clientSecret);

      if (clientSecret?.includes("_secret_")) {
        setClientSecret(clientSecret);
      } else {
        console.error("Invalid clientSecret received:", response.data);
        alert("Error: Invalid payment session. Please try again.");
        setShowModal(false);
      }
    } catch (error: any) {
      if (error && error.response && error.response.data) {
        console.error("[DEBUG] Error response data:", error.response.data);
        alert("Backend error: " + JSON.stringify(error.response.data));
      } else {
        console.error("[DEBUG] Unknown error:", error);
        alert("Unknown error occurred. Check console for details.");
      }
      setShowModal(false);
    }
  };

  const downloadInvoice = () => {
    if (typeof window === "undefined") return;

    setIsGeneratingPDF(true);

    // Hide buttons during PDF generation
    const hideElements = [
      document.getElementById("hideDuringDownload"),
      document.getElementById("hideDuringDownloadFooter"),
    ];
    hideElements.forEach((el) => el?.classList.add("hidden"));

    const invoiceElement = document.getElementById("invoic");
    const options = {
      filename: "invoice.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    const html2pdf = require("html2pdf.js");
    html2pdf()
      .set(options)
      .from(invoiceElement)
      .save()
      .then(() => {
        // Show elements again after download
        hideElements.forEach((el) => el?.classList.remove("hidden"));
        setIsGeneratingPDF(false);
      });
  };

  function formatDateDMY(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatDateMMMDDYYYY(dateString?: string | number) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  function toDateString(date: string) {
    return new Date(date).toISOString().slice(0, 10);
  }

  const getInvoiceDue = (invoice: Invoice) => {
    const paid =
      invoice.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    return Number(invoice.amount) - paid;
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
    setShowModal(false);
  };

  // Get unique course names for dropdown
  const courseOptions = useMemo(() => {
    const set = new Set(invoices.map((inv) => inv.courseName));
    return Array.from(set);
  }, [invoices]);

  // Unified filtering logic for both search and filters
  const applyFilters = () => {
    let filtered = invoices;
    // Course filter
    if (course) {
      filtered = filtered.filter((inv) => inv.courseName === course);
    }
    // Date range filters
    if (fromDate) {
      filtered = filtered.filter(
        (inv) => toDateString(inv.createdDate) >= fromDate
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (inv) => toDateString(inv.createdDate) <= toDate
      );
    }
    // Status filter
    if (positionApplied && positionApplied !== "Pending") {
      filtered = filtered.filter(
        (inv) => inv.invoiceStatus === positionApplied
      );
    }
    // Search text filter
    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((inv) => {
        const invoiceDate = formatDateMMMDDYYYY(inv.createdDate).toLowerCase();
        const invoiceNumber = inv._id.toLowerCase();
        const courseName = inv.courseName.toLowerCase();
        const paymentDate = inv.paymentDate
          ? formatDateDMY(new Date(inv.paymentDate).toISOString()).toLowerCase()
          : "";
        const status = inv.invoiceStatus.toLowerCase();
        const amount = inv.amount.toString().toLowerCase();
        return (
          invoiceDate.includes(searchLower) ||
          invoiceNumber.includes(searchLower) ||
          courseName.includes(searchLower) ||
          paymentDate.includes(searchLower) ||
          status.includes(searchLower) ||
          amount.includes(searchLower)
        );
      });
    }
    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, fromDate, toDate, positionApplied, course, invoices]);

  // Filter modal submit handler
  const handleFilter = () => {
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPositionApplied("Pending");
    setSearchText("");
    setCourse("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredInvoices, searchText]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const isAnyFilterActive = (
    searchText.trim() !== "" ||
    fromDate ||
    toDate ||
    course ||
    positionApplied
  );

  const dataToPaginate = isAnyFilterActive ? filteredInvoices : invoices;
  const currentItems = dataToPaginate.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToPaginate.length / itemsPerPage);

  return (
    <BaseLayout2>
      <StudentHeader currentSection="Payment" />
      <div id="invoic" className="px-4 py-4 flex justify-center w-full ">
        <div className="w-full  ">
          {/* Header Section */}

          {!isGeneratingPDF && (
            <div>
              <div className="w-full h-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
                {/* <a href="/transactions" className="text-xs text-blue-500 hover:underline">View all</a> */}
                <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent outline-none text-[12px] w-52 py-3"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 text-sm py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer ${
                        (fromDate || toDate || positionApplied !== "Pending") 
                          ? "text-[#576CBC] dark:text-[#6087C0]" 
                          : "text-gray-400 dark:border-[#606060]"
                      }`}
                      onClick={() => setShowFilterModal(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                      {(fromDate || toDate || positionApplied !== "Pending") && (
                        <span className="w-2 h-2 bg-[#576CBC] dark:bg-[#6087C0] rounded-full"></span>
                      )}
                    </div>
                    {(fromDate || toDate || positionApplied !== "Pending") && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                  {/* Modal */}
                  {showFilterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                      <div className="bg-white p-6 rounded-lg w-[350px] relative dark:bg-[#252525]">
                        {/* Close Icon */}
                        <button
                          className="absolute top-2 right-3 text-gray-400 text-xl"
                          onClick={() => setShowFilterModal(false)}
                        >
                          &times;
                        </button>
                        <h2 className="text-md font-semibold mb-4">Filter by</h2>
                        {/* Course Dropdown */}
                        <div className="mb-4">
                          <label className="text-[13px] font-medium mb-1 dark:text-[#D6D6D6]">Course</label>
                          <select
                            className="w-full border rounded-md p-2 text-[10px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                          >
                            <option value="">All Courses</option>
                            {courseOptions.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        {/* Date Input */}
                        <div className="mb-4">
                          <label className="text-[13px] font-medium mb-1 dark:text-[#D6D6D6]">Payment Date</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="date"
                              className="w-1/2 px-3 py-2 border rounded text-[10px] text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                            <input
                              type="date"
                              className="w-1/2 px-3 py-2 border rounded text-[10px] text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Status Dropdown */}
                        <div className="mb-4">
                          <label htmlFor="position" className="block text-[13px] font-medium mb-1">Status</label>
                          <select
                            className="w-full border rounded-md p-2 text-[10px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                            value={positionApplied}
                            onChange={(e) => setPositionApplied(e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={clearFilters}
                            className="px-4 py-1 rounded-md border border-gray-400 text-gray-600 dark:text-[#fff] font-medium text-[10px]"
                          >
                            Reset
                          </button>
                          <button
                            className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium text-[10px]"
                            onClick={() => { handleFilter(); }}
                          >
                            Show {filteredInvoices.length} results
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60 ">
                      Showing{" "}
                      {filteredInvoices.length > 0
                        ? filteredInvoices.length
                        : invoices.length}{" "}
                      of {invoices.length}
                    </span>
                  </div>
                </div>
                <table
                  className="table-auto w-full"
                  style={{ width: "100%", tableLayout: "fixed" }}
                >
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                    <tr className="font-medium">
                      <th className="w-32 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Invoice Date
                      </th>
                      <th className="w-44 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Invoice Number
                      </th>
                      <th className="w-32 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Course Name
                      </th>

                      <th className="w-28 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Payment Amount
                      </th>
                      <th className="w-32 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Payment Date
                      </th>
                      <th className="w-24 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Status
                      </th>
                      <th className="w-20 text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((invoice, index) => (
                        <tr
                          key={invoice._id || index}
                          onClick={() => {
                            if (invoice.invoiceStatus === "Pending") {
                              handleInvoiceClick(invoice);
                            }
                          }}
                          className={`text-[12px] ${
                            index % 2 === 0
                              ? "bg-[#fff] dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          } cursor-pointer`}
                        >
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap rounded-l-lg dark:text-[#ffffff]">
                            {formatDateMMMDDYYYY(invoice.createdDate)}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap dark:text-[#ffffff]">
                            {invoice._id}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap dark:text-[#ffffff]">
                            {invoice.courseName}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap dark:text-[#ffffff]">
                            {invoice.amount}{" "}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap dark:text-[#ffffff]">
                            {invoice.paymentDate
                              ? formatDateDMY(
                                  new Date(invoice.paymentDate).toISOString()
                                )
                              : ""}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap dark:text-[#ffffff]">
                            <span
                              className={
                                (invoice.invoiceStatus === "Paid"
                                  ? "bg-[#ECFDF3] text-[#377E36] border border-green-600"
                                  : invoice.invoiceStatus === "Pending"
                                  ? "bg-[#FDF6EC] text-[#F0AD4E] border border-[#F0AD4E]"
                                  : "bg-gray-100 text-gray-600 border border-gray-400") +
                                " py-0.5 px-1  rounded-md text-[10px] min-w-[70px] inline-block text-center"
                              }
                            >
                              {invoice.invoiceStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap rounded-r-lg relative">
                            <button
                              className="focus:outline-none dark:text-[#ffffff]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuOpen(
                                  actionMenuOpen === invoice._id
                                    ? null
                                    : invoice._id
                                );
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 18,
                                  verticalAlign: "middle",
                                }}
                              >
                                ⋮
                              </span>
                            </button>
                            {actionMenuOpen === invoice._id && (
                              <div className="absolute right-0 mt-2 w-40 divide-y bg-white border rounded-lg shadow-lg z-10 dark:bg-[#343434]">
                                <button className="block w-full text-left px-4 py-2  text-xs dark:text-[#ffffff] text-[#000]">
                                  View Payment Receipt
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-xs dark:text-[#ffffff] text-[#000]"
                                  onClick={() => setActionMenuOpen(null)}
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
              <div className="mt-4 text-right">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Invoice;
