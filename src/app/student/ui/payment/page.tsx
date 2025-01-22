'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BaseLayout2 from "@/components/BaseLayout2";
import {StripePaymentForm} from "@/app/student/components/StripePaymentForm/page";
import html2pdf from 'html2pdf.js'; // Import html2pdf.js
const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

const Invoice = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // New state for PDF generation

  const handlePaymentSuccess = async (token: any) => {
    // Handle the token (e.g., send it to your server to create the charge)
    console.log('Payment successful! Token:', token);
    // You can make an API call here to process the payment on your server
  };

  // Function to download the invoice as a PDF
  const downloadInvoice = () => {
    setIsGeneratingPDF(true); // Set to true while generating PDF
    const invoiceElement = document.getElementById('invoic');
    const options = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 2 }, // Optional: higher scale for better quality
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // PDF format and orientation
    };
    html2pdf().set(options).from(invoiceElement).save().then(() => {
      setIsGeneratingPDF(false); // Reset after PDF is generated
    }); // Generate and download the PDF
  };

  return (
    <BaseLayout2>
      <div id="invoic" className="p-3 flex justify-center ml-10 h-[570px]">
        <div className="w-[1900px] max-w-5xl bg-white p-4 rounded-lg shadow ml-5">
          {/* Header Section */}
          <div className="p-3 ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-center mb-2 md:mb-0">
                <img
                  src="/assets/images/alf.png"
                  alt="Al Furqan Academy"
                  className="w-36 md:w-20 h-10"
                />
              </div>
              <div className="text-left md:text-right text-xs -mb-2">
                <h1 className="text-sm font-bold">Invoice</h1>
                <p>REG: 1234567890</p>
                <p>contact@alfurqan.academy</p>
                <p>+44 20 4577 1227</p>
                <br />
                <p>
                  Invoice Number: <span className="">INV-0205</span>
                </p>
                <p>
                  Invoice Date: <span className="">02 Nov 2024</span>
                </p>
                <p>
                  Due: <span className="">20 Nov 2024</span>
                </p>
              </div>
            </div>

            {/* Download Button (Hidden during PDF generation) */}
            {!isGeneratingPDF && (
              <button
                onClick={downloadInvoice} // Call the downloadInvoice function
                className="bg-[#223857] text-white px-3 py-1 rounded-2xl mb-2 shadow text-xs hover:bg-blue-600"
              >
                Download Invoice
              </button>
            )}

            {/* Invoice Table */}
            <div className="overflow-x-auto mb-4 bg-[#e6e6e6]">
              <table className="table-auto w-full border-collapse border border-gray-200 rounded-sm text-xs">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">QTY</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">GST</th>
                    <th className="border border-gray-300 p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 text-center">Arabic Course (Standard)</td>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-1 text-center">$50</td>
                    <td className="border border-gray-300 p-1 text-center">$0.00</td>
                    <td className="border border-gray-300 p-1 text-center">$50</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center">Tajweed Course (Basic)</td>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-1 text-center">$30</td>
                    <td className="border border-gray-300 p-1 text-center">$0.00</td>
                    <td className="border border-gray-300 p-1 text-center">$30</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center">Quran Course (Standard)</td>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-1 text-center">$45</td>
                    <td className="border border-gray-300 p-1 text-center">$0.00</td>
                    <td className="border border-gray-300 p-1 text-center">$45</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Summary Section */}
            <div className="w-[23%] p-2 text-right ml-[730px] rounded-lg text-xs bg-[#efefef] border border-[#223857] justify-end">
              <p>
                Sub total (Excl. GST): <span className="font-bold">$125</span>
              </p>
              <p>
                Total GST: <span className="font-bold">$0.00</span>
              </p>
              <p className="whitespace-nowrap">
                Amount due on 20 Nov 2024: <span className="font-bold">$125</span>
              </p>
            </div>

            {/* Payment Instructions Section */}
            <div className="mb-4">
              <h3 className="text-xs font-bold mb-1">Payment Instructions:</h3>
              <p className="text-[11px]"><strong>AL FURQAN ACADEMY</strong></p>
              <p className="text-[10px]">BANK NAME: ABC BANK LIMITED</p>
              <p className="text-[10px]">SWIFT/IBAN: GB0021030012</p>
              <p className="text-[10px]">ACCOUNT NUMBER: 12-1234-123456-12</p>
              <p className="text-[10px]"><strong>PLEASE USE INV-0205 AS A REFERENCE NUMBER</strong></p>
              <p className="text-[9px]">For any questions, please contact us at <span className="font-bold">contact@alfurqan.academy</span>.</p>
            </div>
            
            {/* Toggle Payment Form and Latest Transactions */}
            <div className="flex justify-between mt-5">
              {/* Pay Online Button (Hidden during PDF generation) */}
              {!isGeneratingPDF && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#223857] text-white py-1 rounded-2xl px-3 text-xs ml-[850px] hover:bg-blue-600 transform hover:-translate-y-1 transition duration-300"
                >
                  Pay Online
                </button>
              )}
            </div>
          </div>

          {/* Latest Transactions Section */}
          {!isGeneratingPDF && (

          <div className="w-[1030px] bg-white p-1 rounded-lg shadow mr-20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-800">Latest Transactions</h3>
              <a href="/transactions" className="text-xs text-blue-500 hover:underline">View all</a>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="text-left px-3 py-1">Invoice Date</th>
                    <th className="text-left px-3 py-1">Invoice Number</th>
                    <th className="text-left px-3 py-1">Course Name</th>
                    <th className="text-left px-3 py-1">Payment Date</th>
                    <th className="text-left px-3 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1 text-gray-700">October 15, 2024</td>
                    <td className="px-3 py-1 text-gray-700">INV-0204</td>
                    <td className="px-3 py-1 text-gray-700">Arabic - Basic</td>
                    <td className="px-3 py-1 text-gray-700">October 25, 2024</td>
                    <td className="px-3 py-1">
                      <span className="bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-[10px]">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1 text-gray-700">October 14, 2024</td>
                    <td className="px-3 py-1 text-gray-700">INV-0203</td>
                    <td className="px-3 py-1 text-gray-700">Tajweed - Standard</td>
                    <td className="px-3 py-1 text-gray-700">October 24, 2024</td>
                    <td className="px-3 py-1">
                      <span className="bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-[10px]">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
              )}

          {/* Payment Modal */}
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-5 rounded-lg w-[400px]">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-xl font-bold text-gray-500"
                  >
                    &times;
                  </button>
                </div>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Invoice;
