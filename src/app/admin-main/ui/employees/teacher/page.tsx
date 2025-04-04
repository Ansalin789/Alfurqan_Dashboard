"use client";

import { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Wages");
  const tabs = ["Wages", "Earnings", "Leave Records", "Working Hours"];

  return (
    <BaseLayout4>
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <div className="grid grid-cols-5 gap-4">
          {/* Profile Card (60%) with Contact Details */}
          <div className="col-span-3 bg-white p-6 rounded-lg shadow flex justify-between flex-row">
            <div className="border-r-2 p-2">
              <img
                src="/avatar.png"
                alt="Avatar"
                className="w-20 h-20 rounded-full border"
              />
              <h2 className="font-semibold mt-2">Abdullah Sulaiman</h2>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
            <div className="flex justify-between p-2 gap-6">
              <div>
                <div className="mt-4 text-gray-600 text-sm w-full">
                  <p>Email: asulaiman403@gmail.com</p>
                  <p>Phone: +880 1234 567891</p>
                  <p>Date of Birth: 28, July 2000</p>
                  <p>Country: Canada</p>
                  <p>Gender: Male</p>
                  
                </div>
              </div>
              <div>
                <div className="mt-4 text-gray-600 text-sm w-full">
                <p>Languages Known: English, Hindi, Arabic</p>
                  <p>City: Toronto</p>
                  <p>
                    Residential Address: 325, Residences on Bloor, Bloor St E,
                    Toronto, Ontario.
                  </p>
                  <p>Nationality: Canadian</p>
                </div>
              </div>
            </div>
          </div>
          {/* Educational Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold">Educational Information</h3>
            <p>Highest Qualification: MBA</p>
            <p>University/Institute: ABC School of Education</p>
            <p>Previous Job Title: -</p>
            <p>Experience: -</p>
          </div>
          {/* Bank Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold">Bank Details</h3>
            <p>Bank Name: Lorem Ipsum</p>
            <p>Account Number: 1234567890</p>
            <p>Bank Code: 000-00000</p>
            <p>Passport Number: ABCD00000</p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "Wages" && (
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Class Type</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Currency</th>
                    <th className="border p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Trial Class</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Regular Class</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Group Class</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Fixed Salary</td>
                    <td className="border p-2">$2000</td>
                    <td className="border p-2">Dirhams</td>
                    <td className="border p-2">Monthly</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default EmployeePage;
