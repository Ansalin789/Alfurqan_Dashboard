'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const InvoiceDetails = () => {
  const searchParams = useSearchParams();

  // Extract data from query params
  const invoiceData = {
    studentId: searchParams.get('studentId'),
    studentName: searchParams.get('studentName'),
    address: searchParams.get('address'),
    contact: searchParams.get('contact'),
    email: searchParams.get('email'),
    invoiceNumber: searchParams.get('invoiceNumber'),
    invoiceDate: searchParams.get('invoiceDate'),
    dueDate: searchParams.get('dueDate'),
    totalDue: searchParams.get('totalDue'),
  };

  return (
    <div className="min-h-svg max-w-4xl bg-gradient-to-br from-[#32517E] via-[#4572B1] to-[#5691E0] p-12 mx-auto flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg p-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-center text-orange-600">INVOICE DETAILS</h1>
        </div>

        {/* Client and Invoice Info */}
        <div className="flex justify-between mb-12">
          {/* Client Info */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Student Name:</span> {invoiceData.studentName}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {invoiceData.address}
            </p>
            <p>
              <span className="font-semibold">Contact:</span> {invoiceData.contact}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {invoiceData.email}
            </p>
          </div>

          {/* Invoice Info */}
          <div className="text-right space-y-2">
            <p>
              <span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Invoice Date:</span> {invoiceData.invoiceDate}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span> {invoiceData.dueDate}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex justify-end gap-8">
          <div className="w-80">
            <div className="bg-gray-50 text-black rounded-md p-6 shadow-md">
              <div className="flex justify-between font-bold pb-4">
                <span>Total Due:</span>
                <span>${parseFloat(invoiceData.totalDue || 0).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-gradient-to-r from-[#32517E] to-[#5691E0] text-white py-3 px-6 rounded-md hover:from-blue-600 hover:to-blue-400 transition-all duration-300 font-semibold shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
