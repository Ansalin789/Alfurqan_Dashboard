import React from 'react';
import html2pdf from 'html2pdf.js';

export default function Invoic() {
  // Function to download the invoice as a PDF
  const downloadInvoice = () => {
    const invoiceElement = document.getElementById('invoic'); // The div containing the invoice
    const options = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 2 }, // Optional: higher scale for better quality
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // PDF format and orientation
    };
    html2pdf().set(options).from(invoiceElement).save(); // Generate and download the PDF
  };

  return (
    <div>
      <div
        id="invoic"
        style={{
          width: '800px',
          margin: '0 auto',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          border: '1px solid #ccc',
        }}
      >
        <h2 style={{ textAlign: 'right' }}>Invoice</h2>
        <p>REG: 1234567890</p>
        <p>contact@alfurqan.academy</p>
        <p>+44 20 4577 1227</p>
        <p>
          <strong>Invoice Number:</strong> INV-0205<br />
          <strong>Invoice Date:</strong> 02 Nov 2024<br />
          <strong>Due Date:</strong> 20 Nov 2024
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Description</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>QTY</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>GST</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Arabic Course (Standard)</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$50</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>0.00</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$50</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Tajweed Course (Basic)</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$30</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>0.00</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$30</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Quran Course (Standard)</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$45</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>0.00</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>$45</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Total (Excl. GST):</strong> $125<br />
          <strong>Total GST:</strong> $0.00<br />
          <strong>Amount Due:</strong> $125
        </p>
        <p>
          <strong>Payment Instructions:</strong><br />
          BANK NAME: ABC BANK LIMITED<br />
          SWIFT/IBAN: GB202103012<br />
          ACCOUNT NUMBER: 12-1234-123456-12<br />
          Use INV-0205 as a reference number
        </p>
      </div>

      <button
        className="bg-[#223857] text-white px-3 py-1 rounded-2xl mb-2 shadow text-xs hover:bg-blue-600"
        onClick={downloadInvoice}
      >
        Download Invoice
      </button>
    </div>
  );
}
