import React from "react";

const Invoice = () => {
  // Dynamic data (You can fetch this from an API or database in a real application)
  const studentName = "Joe Selvaraj";
  const contact = "1234567890";
  const email = "jothikaselvaraj8787@gmail.com";
  const invoicePlan = "Elite";
  const invoiceDate = "12/31/2024";
  const dueDate = "01/15/2025";
  const courseName = "Quran";
  const quantity = "1";
  const rate = "16";
  const amount = "16";
  const discount = "0";
  const adjust = "16";
  const totalDue = "16";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <h1>Invoice</h1>
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        <p>
          <strong>BILL TO:</strong>
        </p>
        <p>
          Student Name: {studentName}
          <br />
          Contact: {contact}
          <br />
          Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          Invoice Plan: {invoicePlan}
          <br />
          Invoice Date: {invoiceDate}
          <br />
          Invoice Due Date: {dueDate}
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Course Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Quantity
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Rate</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Amount
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Discount
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Adjust
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {courseName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {quantity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {rate}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {amount}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {discount}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {adjust}
              </td>
            </tr>
          </tbody>
        </table>

        <p
          style={{
            fontWeight: "bold",
            textAlign: "right",
            marginTop: "20px",
          }}
        >
          Total Due: {totalDue}
        </p>

        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#2c3e50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Pay Now
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
        <p>Powered by AL Furqan</p>
      </div>
    </div>
  );
};

export default Invoice;
