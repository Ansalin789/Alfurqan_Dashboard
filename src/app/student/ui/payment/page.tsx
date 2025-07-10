"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import BaseLayout2 from "@/components/BaseLayout2";
import axios from "axios";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import StudentHeader from "../../components/StudentHeader";
import React from "react";

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

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("Card details are required.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement },
      }
    );

    if (error) {
      setMessage(error.message ?? "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      await axios.post(
        "https://api.blackstoneinfomaticstech.com/student/create-payment-intent",
        {
          amount,
          currency,
          invoiceId,
          paymentIntentResponse: paymentIntent,
        }
      );

      setMessage("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col gap-4"
    >
      <div className="p-3 border border-gray-300 rounded focus-within:border-blue-500 bg-gray-50 transition-colors">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
          !stripe || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {loading ? "Processing..." : "Pay"}
      </button>

      {message && (
        <p className="text-center text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
};

const Invoice = () => {
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

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
    const evaluationid = selectedInvoice._id;
    const totalprice = totalPrice;

    try {
      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/student/create-payment-intent",
        {
          amount: totalprice * 100,
          currency: "usd",
          invoiceId: evaluationid,
          paymentIntentResponse: "",
        }
      );

      console.log("Stripe Response:", response.data); // Debugging
      const clientSecret = response?.data?.clientSecret;
      console.log("Stripe Response:", response?.data);

      if (clientSecret?.includes("_secret_")) {
        setClientSecret(clientSecret);
      } else {
        console.error("Invalid clientSecret received:", response.data);
        alert("Error: Invalid payment session. Please try again.");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      alert("Payment initialization failed. Please try again later.");
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

  const getInvoiceDue = (invoice: Invoice) => {
    const paid =
      invoice.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    return Number(invoice.amount) - paid;
  };

  return (
    <BaseLayout2>
      <StudentHeader currentSection="Payment" />
      <div id="invoic" className="px-4 py-4 flex justify-center w-full ">
        <div className="w-full h-[480px] bg-white py-4 px-0 rounded-lg shadow dark:bg-[#343434]">
          {/* Header Section */}
          <div className="p-2">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-md font-semibold dark:text-[#ffffff]">
                Invoice
              </h1>
              <img
                src="/assets/images/alf.png"
                alt="Al Furqan Academy"
                className="w-40 dark:text-[#ffffff]"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              {/* <div className="flex items-center mb-2 md:mb-0">
                
              </div> */}
              <div className="justify-between flex text-xs w-full">
                <div>
                  <p>
                    <span className="font-semibold text dark:text-[#ffffff]">
                      Reg&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                    </span>{" "}
                    <span> {selectedInvoice?._id || ""}</span>
                  </p>
                  <p>
                    <span className="font-semibold text dark:text-[#ffffff]">
                      Email Id
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                    </span>{" "}
                    <span>{selectedInvoice?.student.studentEmail || ""}</span>
                  </p>
                  <p>
                    <span className="font-semibold text dark:text-[#ffffff]">
                      Phone number &nbsp;&nbsp;:{" "}
                    </span>{" "}
                    <span>{selectedInvoice?.student.studentPhone || ""}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold dark:text-[#ffffff]">
                      Invoice Number &nbsp; :
                    </span>{" "}
                    <span>{selectedInvoice?._id || ""}</span>
                  </p>
                  <p>
                    <span className="font-semibold dark:text-[#ffffff]">
                      Invoice Date
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                    </span>{" "}
                    <span>{formatDateDMY(selectedInvoice?.createdDate)}</span>
                  </p>
                  <p>
                    <span className="font-semibold dark:text-[#ffffff]">
                      Due
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                    </span>{" "}
                    <span>{formatDateDMY(selectedInvoice?.dueDate)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice + Payment Summary */}
            {/* Invoice + Payment Summary */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              {/* Left Table */}
              <div className="w-full md:w-3/4 bg-gray-100 text-xs rounded-lg overflow-hidden dark:bg-[#343434]">
                <table className="w-full text-xs border">
                  <thead className="bg-[#505050] text-white">
                    <tr>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Discount</th>
                      <th className="p-2 border">GST</th>
                      <th className="p-2 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="p-2 border font-semibold text-left">
                        {selectedInvoice?.courseName}
                      </td>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border">
                        ${selectedInvoice?.amount ?? 0}
                      </td>
                      <td className="p-2 border">0.00</td>
                      <td className="p-2 border">0.00</td>
                      <td className="p-2 border text-right">
                        ${selectedInvoice?.amount ?? 0}
                      </td>
                    </tr>
                    {/* Show payments if any */}
                    {selectedInvoice?.payments &&
                      selectedInvoice.payments.length > 0 &&
                      selectedInvoice.payments.map((payment, pidx) => (
                        <tr key={pidx} className="text-center bg-gray-50">
                          <td className="p-2 border text-left pl-8">
                            Payment on {formatDateDMY(payment.date)}
                          </td>
                          <td className="p-2 border"></td>
                          <td className="p-2 border">-${payment.amount}</td>
                          <td className="p-2 border"></td>
                          <td className="p-2 border"></td>
                          <td className="p-2 border text-right">
                            -${payment.amount}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td className="p-2 border font-semibold">
                        Sub total (Excl. GST):
                      </td>
                      <td colSpan={4} className="p-2 border"></td>
                      <td className="p-2 border text-right">
                        ${selectedInvoice?.amount ?? 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Total GST:</td>
                      <td colSpan={4} className="p-2 border"></td>
                      <td className="p-2 border text-right">$0.00</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">
                        Amount due on :{" "}
                        {formatDateDMY(selectedInvoice?.dueDate)}
                      </td>
                      <td colSpan={4} className="p-2 border"></td>
                      <td className="p-2 border text-right">
                        ${selectedInvoice ? getInvoiceDue(selectedInvoice) : 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Payment Summary */}
              <div className="w-full md:w-1/4 bg-gray-100 rounded-lg  text-xs dark:bg-[#343434]">
                <div className="bg-[#505050] text-white px-3 py-2 rounded-t">
                  Payment Details
                </div>
                <div className="divide-y text-sm">
                  <div className="flex justify-between px-2 py-2">
                    <span className="text-xs">Payment Type</span>
                    <span className="text-blue-900 font-semibold text-xs">
                      Stripe
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-2">
                    <span className="text-xs">Total Amount</span>
                    <span className="text-blue-900 font-semibold text-xs">
                      ${selectedInvoice ? getInvoiceDue(selectedInvoice) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions + Actions */}
            <div className="relative   p-1 rounded text-xs mb-8 -mt-5">
              <div
                id="hideDuringDownload"
                className="absolute top-1 right-0 flex items-center gap-2"
              >
                <button
                  onClick={handleClick}
                  className="bg-[#576CBC] text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                >
                  Pay Online
                </button>
                <span className="text-[10px]">with</span>
                <img
                  src="/assets/images/stripe.png"
                  alt="Stripe"
                  className="h-7 ml-[61px]"
                />
              </div>
              <div className="text-[11px] leading-relaxed pr-40">
                <h3 className="font-bold text-[#223857] mb-1 dark:text-[#ffffff]">
                  Payment Instructions
                </h3>
                <div className="space-y-[2px]">
                  <p>
                    <strong>Name</strong> &nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    : 1234567890
                  </p>
                  <p>
                    <strong>Bank Name</strong>&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                    contact@alfurqan.academy
                  </p>
                  <p>
                    <strong>Swift / Iban</strong>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    : GB0021030012
                  </p>
                  <p>
                    <strong>Account Number</strong>&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 12-1234-123456-12
                  </p>
                </div>
                <p className="mt-2 text-[10px] font-semibold uppercase">
                  Please use INV-0205 as a reference number
                </p>
                <p className="text-[10px]">
                  For any questions please contact us at{" "}
                  <span className="font-bold">contact@alfurqan.academy</span>
                </p>
              </div>
              <div className="absolute bottom-2 right-0">
                <button
                  id="hideDuringDownloadFooter"
                  onClick={downloadInvoice}
                  className="bg-[#576CBC] text-white text-xs px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>

          {!isGeneratingPDF && (
            <div>
              <h3 className="text-[17px] font-semibold text-gray-800 dark:text-[#ffffff]">
                Latest Transactions
              </h3>
              <br />
              <div className="w-full h-[300px]  bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
                {/* <a href="/transactions" className="text-xs text-blue-500 hover:underline">View all</a> */}
                <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent outline-none text-[15px] w-52 py-3"
                      // value={searchText}
                      // onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                    onClick={() => setShowModal(true)}
                  >
                    {/* <BsFilterLeft /> */}
                    <MdTune className="w-4 h-4" />
                    <span>Filter</span>
                  </div>
                  {/* Modal */}
                  {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                      <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
                        {/* Close Icon */}
                        <button
                          className="absolute top-2 right-3 text-gray-400 text-xl"
                          onClick={() => setShowModal(false)}
                        >
                          &times;
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                          Filter by
                        </h2>

                        {/* Date Input */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                            Date Range
                          </label>

                          <div className="flex gap-2 mb-2">
                            <input
                              type="date"
                              className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                              // value={exp.fromDate}
                              // value={fromDate}
                              // onChange={(e) => setFromDate(e.target.value)}
                            />
                            <input
                              type="date"
                              className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                              // value={exp.toDate}
                              // value={toDate}
                              // onChange={(e) => setToDate(e.target.value)}
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
                            // value={positionApplied}
                            // onChange={(e) =>
                            //   setPositionApplied(e.target.value)
                            // }
                          >
                            <option>Islamic Teacher</option>
                            <option>Quran Teacher</option>
                            <option>Arabic Teacher</option>
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
                            // value={applicationStatus}
                            // onChange={(e) =>
                            //   setApplicationStatus(e.target.value)
                            // }
                          >
                            <option>Shortlisted</option>
                            <option>Rejected</option>
                            <option>Waiting</option>
                            <option>Approved</option>
                            <option>NewApplication</option>
                          </select>
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
                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60 ">
                      {/* Showing {currentApplicants.length} of{" "}
                    {applicants.length} */}
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
                    {invoices.map((invoice, index) => (
                      <React.Fragment key={invoice._id || index}>
                        <tr
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
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 rounded-l-lg dark:text-[#ffffff]">
                            {formatDateDMY(invoice.createdDate)}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 dark:text-[#ffffff]">
                            {invoice._id}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 dark:text-[#ffffff]">
                            {invoice.courseName}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 dark:text-[#ffffff]">
                            {invoice.amount}{" "}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 dark:text-[#ffffff]">
                            24.7.2025
                          </td>
                          <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap border-b border-gray-200 dark:text-[#ffffff]">
                            <span
                              className={
                                (invoice.invoiceStatus === "Paid"
                                  ? "bg-[#ECFDF3] text-[#377E36] border border-green-600"
                                  : invoice.invoiceStatus === "Pending"
                                  ? "bg-[#FDF6EC] text-[#F0AD4E] border border-orange-600"
                                  : "bg-gray-100 text-gray-600 border border-gray-400") +
                                " py-0.5 px-1  rounded-md text-[10px] min-w-[70px] inline-block text-center"
                              }
                            >
                              {invoice.invoiceStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border-b border-gray-200 rounded-r-lg relative">
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
                                  fontSize: 20,
                                  verticalAlign: "middle",
                                }}
                              >
                                ⋮
                              </span>
                            </button>
                            {actionMenuOpen === invoice._id && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10 dark:bg-[#343434]">
                                <button className="block w-full text-left px-4 py-2  text-xs dark:text-[#ffffff]">
                                  View Receipt
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-xs dark:text-[#ffffff]"
                                  onClick={() => setActionMenuOpen(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Show payments if any */}
                        {invoice.payments &&
                          invoice.payments.length > 0 &&
                          invoice.payments.map((payment, pidx) => (
                            <tr key={pidx} className="text-center bg-gray-50">
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#ffffff]">
                                Payment on {formatDateDMY(payment.date)}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#ffffff]">
                                {payment.amount}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#ffffff]">
                                {payment.amount}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#ffffff]">
                                {payment.amount}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#ffffff]">
                                {payment.amount}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#fff]">
                                -${payment.amount}
                              </td>
                              <td></td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Modal for Payment Form */}
          {showModal && clientSecret && clientSecret.includes("_secret_") && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">
                  Complete Your Payment
                </h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    invoiceId={selectedInvoice?._id ?? ""}
                    amount={
                      selectedInvoice?.amount ? selectedInvoice.amount * 100 : 0
                    }
                    currency="usd"
                  />
                </Elements>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Invoice;
