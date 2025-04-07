"use client";

import React, { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { FaEdit } from "react-icons/fa";

const SalaryCard = () => {
  const [duration, setDuration] = useState("Last month");
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  const itemsPerPage = 7;

  const salaryData = [
    { employeeid: "3867", employeename: "Arabic", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1000", status: "Paid" },
    { employeeid: "3868", employeename: "Ayesha R.", paymentdate: "11/02/2024", designation: "Supervisor", salaryamount: "1200", status: "Pending" },
    { employeeid: "3869", employeename: "Wazed Ali", paymentdate: "11/02/2024", designation: "Supervisor", salaryamount: "2500", status: "Paid" },
    { employeeid: "3870", employeename: "Angela Moss", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1800", status: "Paid" },
    { employeeid: "3871", employeename: "Abdullah S.", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1500", status: "Pending" },
    { employeeid: "3872", employeename: "Hasan R.", paymentdate: "11/02/2024", designation: "Supervisor", salaryamount: "1900", status: "Paid" },
    { employeeid: "3873", employeename: "Sara A.", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1300", status: "Paid" },
    { employeeid: "3874", employeename: "Nashit K.", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1700", status: "Pending" },
    { employeeid: "3875", employeename: "Rayan S.", paymentdate: "11/02/2024", designation: "Supervisor", salaryamount: "2100", status: "Paid" },
    { employeeid: "3876", employeename: "Laila M.", paymentdate: "11/02/2024", designation: "Teacher", salaryamount: "1400", status: "Paid" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourseData = salaryData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <BaseLayout4>
      <div className="w-full h-screen bg-[#e9e9e9] px-4 py-6">
        <div className="flex justify-between items-start mb-1.5">
          <h2 className="text-2xl font-bold text-gray-800">Salary and Wages</h2>

          <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-[6px] shadow-sm">
            <label htmlFor="duration" className="text-sm font-medium text-gray-600">Duration :</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="text-sm bg-transparent focus:outline-none"
            >
              <option>Last week</option>
              <option>Last month</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="w-[240px] h-[120px] p-5 rounded-xl bg-[#304DAF] text-white shadow-md">
            <h4 className="text-sm mb-2 opacity-90">Total Salary Paid</h4>
            <h1 className="text-xl font-bold">$ 120,000</h1>
            <div className="flex justify-between items-center mt-2 text-sm opacity-90">
              <span><strong>12%</strong> Increase From Target</span>
              <span className="text-lg">↑</span>
            </div>
          </div>

          <div className="w-[240px] h-[120px] p-5 rounded-xl bg-white text-[#475569] shadow-md">
            <h4 className="text-sm mb-2 opacity-90">Pending Salary</h4>
            <h1 className="text-xl font-bold">$ 16,500</h1>
            <div className="flex justify-between items-center mt-2 text-sm opacity-90">
              <span><strong>2%</strong> Decrease From Target</span>
              <span className="text-lg">↓</span>
            </div>
          </div>

          <div className="w-[240px] h-[120px] p-5 rounded-xl bg-white text-[#475569] shadow-md">
            <h4 className="text-sm mb-2 opacity-90">Balance</h4>
            <h1 className="text-xl font-bold">$ 48,670</h1>
            <div className="flex justify-between items-center mt-2 text-sm opacity-90">
              <span><strong>6%</strong> Increase From Target</span>
              <span className="text-lg">↑</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <button className="bg-[#0F3659] hover:bg-[#0c2b46] text-white text-sm font-medium px-12 py-2 rounded-md shadow-sm transition">
            Pay Now
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
          <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-xs">
            <thead className="border-b border-[#1C3557] text-xs font-semibold">
              <tr className="bg-gray-100">
                <th className="p-3 text-center">Employee ID</th>
                <th className="p-3 text-center">Employee Name</th>
                <th className="p-3 text-center">Designation</th>
                <th className="p-3 text-center">Salary Amount</th>
                <th className="p-3 text-center">Payment Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourseData.map((row, index) => (
                <tr key={row.employeeid} className="border-b text-center text-xs">
                  <td className="p-2">{row.employeeid}</td>
                  <td className="p-2">{row.employeename}</td>
                  <td className="p-2">{row.designation}</td>
                  <td className="p-2">{row.salaryamount}</td>
                  <td className="p-2">{row.paymentdate}</td>
                  <td className="p-2">
                    <span className={`inline-flex items-center justify-center w-20 h-8 px-3 py-1 rounded-2xl ${row.status === "Paid" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{row.status}</span>
                  </td>
                  <td className="p-1 text-center align-middle relative">
                    <button
                      className="p-1 bg-[#1C3557] text-white rounded-full"
                      onClick={() => setOpenPopup(openPopup === index ? null : index)}
                    >
                      <FaEdit size={10} />
                    </button>

                    {openPopup === index && (
                      <div className="fixed inset-0 z-50 flex items-left justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-[55%] md:w-[90%] lg:w-[70%] max-h-[80vh] overflow-y-auto rounded-2xl p-6 relative shadow-lg">
                          <button
                            className="absolute top-4 right-4 text-black text-xl font-bold"
                            onClick={() => setOpenPopup(null)}
                          >
                            ×
                          </button>

                          <h2 className="text-xl font-semibold text-[#1C3557] mb-6 text-left">Edit Payment</h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="employee Id" className="block font-medium text-sm text-gray-800 mb-1 text-left">Employee ID</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value={row.employeeid}  />
                              </div>
                              <div>
                                <label  htmlFor="designation" className="block font-medium text-sm text-gray-800 mb-1 text-left">Designation</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value={row.designation}  />
                              </div>
                              <div>
                                <label htmlFor="payment date" className="block font-medium text-sm text-gray-800 mb-1 text-left">Payment Date</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm"  value={row.paymentdate}  />
                              </div>
                              <div>
                                <label htmlFor="payment status" className="block font-medium text-sm text-gray-800 mb-1 text-left">Payment Status</label>
                                <input type="text"className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value={row.status}  />
                              </div>
                              <div>
                                <label htmlFor="deductions" className="block font-medium text-sm text-gray-800 mb-1 text-left">Deductions</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value="$200"  />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="employeename" className="block font-medium text-sm text-gray-800 mb-1 text-left">Employee Name</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value={row.employeename}  />
                              </div>
                              <div>
                                <label htmlFor="salary" className="block font-medium text-sm text-gray-800 mb-1 text-left">Salary Amount</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value={row.salaryamount}  />
                              </div>
                              <div>
                                <label htmlFor="bonus" className="block font-medium text-sm text-gray-800 mb-1 text-left">Payment Received Date</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value="$100"  />
                              </div>
                              <div>
                                <label htmlFor="net payment" className="block font-medium text-sm text-gray-800 mb-1 text-left">Earnings</label>
                                <input type="text" className="w-full h-10 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm" value="$1100"  />
                              </div>
                              <div>
                                <label htmlFor="description"  className="block font-medium text-sm text-gray-800 mb-1 text-left">Description</label>
                                <textarea className="w-full h-15 p-4 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 text-sm"   />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 p-2 text-sm text-gray-600">
          <p>
            Showing {paginatedCourseData.length} of {salaryData.length} classes
          </p>
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(salaryData.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                className={`w-5 h-5 text-[13px] flex items-center justify-center rounded ${
                  currentPage === i + 1 ? "bg-[#1C3557] text-white" : "text-[#1C3557] border border-[#1C3557]"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default SalaryCard;