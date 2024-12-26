"use client"; // Mark this as a Client Component

import Invoice from "@/components/Invoice";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
const linkdata = '/invoice?name=Joe+Selvaraj&plan=Elite&due=16"'
const Form = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
       
        {/* Routes */}
        <Routes>
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Form;
