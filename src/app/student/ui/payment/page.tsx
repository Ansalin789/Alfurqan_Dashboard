'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BaseLayout2 from "@/components/BaseLayout2";
import StripePaymentForm from './StripePaymentForm';

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

const Invoice = () => {
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePaymentSuccess = async (token: any) => {
    console.log('Payment successful! Token:', token);
    alert('Payment was successful!');
    setShowModal(false);
  };

  const downloadInvoice = () => {
    if (typeof window === 'undefined') return;

    setIsGeneratingPDF(true);
    const invoiceElement = document.getElementById('invoic');
    const options = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    const html2pdf = require('html2pdf.js'); // Dynamically load html2pdf.js
    html2pdf()
      .set(options)
      .from(invoiceElement)
      .save()
      .then(() => {
        setIsGeneratingPDF(false);
      });
  };

  return (
    <BaseLayout2>
      <div id="invoic" className="px-8 py-8 flex justify-center w-full h-full">
        <div className="w-full bg-white py-4 px-4 rounded-lg shadow">
          {/* Header Section */}
          <div className="p-2">
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

            {!isGeneratingPDF && (
              <button
                onClick={downloadInvoice}
                className="bg-[#223857] text-white px-3 py-1 rounded-2xl mb-2 shadow text-xs hover:bg-blue-600"
              >
                Download Invoice
              </button>
            )}

            {/* Invoice Table */}
            <div className="overflow-x-auto mb-4 bg-[#efefef] rounded-lg border border-[#223857]">
              <table className="table-auto w-full h-full border-collapse border border-gray-200 text-xs">
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

            {/* Payment Summary */}
            <div className="w-[100%] p-2 text-right rounded-lg text-xs bg-[#efefef] border border-[#223857] justify-end">
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

            <div className='flex justify-between p-1'>
              <div className="mb-2">
                <h3 className="text-xs font-bold mb-1 text-[#223857]">Payment Instructions:</h3>
                <p className="text-[11px]"><strong>AL FURQAN ACADEMY</strong></p>
                <p className="text-[10px]">BANK NAME: ABC BANK LIMITED</p>
                <p className="text-[10px]">SWIFT/IBAN: GB0021030012</p>
                <p className="text-[10px]">ACCOUNT NUMBER: 12-1234-123456-12</p>
                <p className="text-[10px]"><strong>PLEASE USE INV-0205 AS A REFERENCE NUMBER</strong></p>
                <p className="text-[9px]">For any questions, please contact us at <span className="font-bold">contact@alfurqan.academy</span>.</p>
              </div>

              <div>
                {/* Stripe Payment Form */}
                <Elements stripe={stripePromise}>
                  <StripePaymentForm onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Invoice;
