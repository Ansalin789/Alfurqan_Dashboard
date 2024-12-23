"use client"; // Mark this as a Client Component

import Invoice from "@/components/Invoice";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
const linkdata = '/invoice?name=Joe+Selvaraj&plan=Elite&due=16"'
const Form = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Invoice Generator</h1>
        <p>Click a link below to generate the invoice:</p>

        {/* Dynamic Links */}
        <ul>
          <li>
          <Link to="/invoice?id=67629e347a3e2e252d90d753">
              /invoice?id=67629e347a3e2e252d90d753
            </Link>
          </li>

          {/* <li>
            <Link to="/invoice?name=Alice+Smith&plan=Standard&due=50">
            /invoice?name=Alice+Smith&plan=Standard&due=50
            </Link>
          </li> */}
        </ul>

        {/* Routes */}
        <Routes>
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Form;
