"use client";

import { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { BsCalendar4Event, BsClockHistory } from "react-icons/bs";
import { RiMenu2Fill } from "react-icons/ri";
import { GrCurrency } from "react-icons/gr";
import { MdOutlineCurrencyExchange, MdOutlineTimer, MdOutlineCancel } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";



const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Wages");
  const tabs = ["Wages", "Earnings", "Leave Records", "Working Hours"];

  return (
    <BaseLayout4>
      <div className="p-4 min-h-screen w-full">
        <h2 className="font-semibold pb-2">Other Employees</h2>

        <div className="grid grid-cols-5 gap-4">
          {/* Profile Card (60%) with Contact Details */}
          <div className="col-span-3 bg-white p-4 rounded-xl shadow flex justify-between flex-row">
            <div className="flex flex-col items-center md:w-1/3 text-center">
              <div className="border-r-2 p-6 -ml-8">
                <div className="w-10 h-10 rounded-full overflow-hidden ml-2">
                  <img
                    src="/assets/images/Avatar.png"
                    alt="Avatar"
                    width={96} height={96}
                  />
                </div>
                <h2 className="text-xs font-medium mt-4"> Alen Smith</h2>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <div className="flex justify-between gap-20">
              <div>
                <div className="mt-4 text-xs w-full">
                  <h4 className="text-xs py-4 font-medium -mt-10">
                    Contact & Details
                  </h4>
                  <p className="text-[12px] text-gray-500">Email:</p>
                  <span className="text-[10px] text-gray-400">asulaiman403@gmail.com</span>
                  <p className="text-[12px] text-gray-500">Phone: </p>
                  <span className="text-[10px] text-gray-400">+880 1234 567891</span>
                  <p className="text-[12px] text-gray-500">
                    Date of Birth:
                  </p>
                  <span className="text-[10px] text-gray-400"> 28, July 2000</span>
                  <p className="text-[12px] text-gray-500">Country:</p>
                  <span className="text-[10px] text-gray-400"> Canada</span>
                  <p className="text-[12px] text-gray-500">
                    Gender:
                  </p>{" "}
                  <span className="text-[10px] text-gray-400">Male</span>
                </div>
              </div>
              <div>
                <div className="mt-4 text-gray-600 text-xs w-full">
                  <p className="text-[12px] text-gray-500">Languages Known:</p>{" "}
                  <span className="text-[10px] text-gray-400"> English, Hindi, Arabic</span>
                  <p className="text-[12px] text-gray-500"> City:</p>{" "}
                  <span className="text-[10px] text-gray-400"> Toronto</span>
                  <p className="text-[12px] text-gray-500">Residential Address:</p>
                  <span className="text-[10px] text-gray-400">
                    {" "}
                    325, Residences on Bloor, Bloor St E, Toronto, Ontario.
                  </span>
                  <p className="text-[12px] text-gray-500">Nationality:</p>{" "}
                  <span className="text-[10px] text-gray-400"> Canadian</span>
                </div>
              </div>
            </div>
          </div>
          {/* Educational Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="mt-2 text-xs w-full">
              <h4 className="text-xs py-4 font-medium -mt-10">
                Educational Information
              </h4>
              <p className="text-[12px] text-gray-500">
                Highest Qualification:{" "}
              </p>{" "}
              <span className="text-[10px] text-gray-400">MBA</span>
              <p className="text-[12px] text-gray-500">
                University/Institute:
              </p>{" "}
              <span className="text-[10px] text-gray-400"> ABC School of Education</span>
              <p className="text-[12px] text-gray-500">
                Previous Job Title:{" "}
              </p>{" "}
              <span className="text-[10px] text-gray-400">Junior Developer</span>
              <p className="text-[12px] text-gray-500">Experience: </p>
              <span className="text-[10px] text-gray-400">2 years</span>
            </div>
          </div>
          {/* Bank Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="mt-2 text-xs w-full">
              <h4 className="text-xs py-4 font-medium -mt-10">Bank Details</h4>
              <p className="text-[12px] text-gray-500">Bank Name:</p>
              <span className="text-[10px] text-gray-400">Lorem Ipsum</span> <br />
              <p className="text-[12px] text-gray-500">
                Account Number:
              </p>{" "}
              <span className="text-[10px] text-gray-400"> 1234567890</span>
              <p className="text-[12px] text-gray-500">
                Bank Code:
              </p>{" "}
              <span className="text-[10px] text-gray-400">000-00000</span>
              <p className="text-[12px] text-gray-500">
                Passport Number:
              </p>
              <span className="text-[10px] text-gray-400"> ABCD00000</span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow h-min">
          {/* Tabs */}
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-[7px] text-xs font-medium rounded-lg focus:outline-none transition-all duration-200 ${activeTab === tab
                  ? "bg-[#102645] text-white shadow"
                  : "text-black"
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
              <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] h-[270px] mx-auto">
                <table className="w-full border-gray-200 rounded-md">
                  <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                    <tr className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold text-center justify-center">
                      <th className="p-4 font-semibold text-[12px] text-center">
                        <div className="flex items-center text-center space-x-2">
                          <BsCalendar4Event className="text-base" />
                          <span>Class Type</span>
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-[12px] text-center">
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-base">
                            <RiMenu2Fill className="text-base" />
                          </span>
                          <span>Rate</span>
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-[12px] text-center">
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-base">
                            <GrCurrency />
                          </span>
                          <span>Currency</span>
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-[12px] text-center">
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-base">
                            <MdOutlineTimer />
                          </span>
                          <span>Duration</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-gray-900">
                    {[
                      ["Trial Class", "-", "-", "-"],
                      ["Regular Class", "-", "-", "-"],
                      ["Group Class", "-", "-", "-"],
                      ["Team Class", "-", "-", "-"],
                      ["Group Class", "-", "-", "-"],
                      ["Fixed Salary", "$2000", "Dirhams", "Monthly"],
                      ["Special Class", "-", "-", "-"],
                      ["Group Class", "-", "-", "-"],
                      ["Group Class", "-", "-", "-"],
                    ].map(([type, rate, currency, duration], index) => (
                      <tr key={index} className={` text-[12px] overflow-y-scroll scrollbar-none ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}>
                        <td className="p-2">{type}</td>
                        <td className="p-2">{rate}</td>
                        <td className="p-2">
                          {type === "Fixed Salary" ? (
                            <select className="p-1 focus:outline-none text-[12px] bg-transparent">
                              <option>Dirhams</option>
                              <option>USD</option>
                              <option>INR</option>
                            </select>
                          ) : (
                            currency
                          )}
                        </td>
                        <td className="p-2">
                          {type === "Fixed Salary" ? (
                            <select className="p-1 focus:outline-none bg-transparent">
                              <option>Monthly</option>
                              <option>Weekly</option>
                              <option>Daily</option>
                            </select>
                          ) : (
                            duration
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "Earnings" && (
              <div className="space-y-2">
                {/* Top Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#11244D] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Earnings</p>
                      <h2 className="text-lg font-bold mt-1">$2800</h2>
                    </div>
                    <div className="bg-[#1D3D70] p-2 rounded-lg text-sm">
                      <MdOutlineCurrencyExchange />
                    </div>
                  </div>
                  <div className="bg-[#4F4CD1] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Deductions</p>
                      <h2 className="text-lg font-bold mt-1">$400</h2>
                    </div>
                    <div className="bg-[#6D6BF1] p-2 rounded-lg text-sm">
                      <BsClockHistory />
                    </div>
                  </div>
                </div>

                {/* Scrollable Table */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                    <div className="overflow-x-auto max-h-[181px] overflow-y-auto custom-scrollbar scrollbar-none">
                      <table className="w-full min-w-[900px] text-sm text-left">
                        <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                          <tr className='border-b-[1px] border-[#1C3557]'>
                            <th className="p-4 font-semibold text-[12px] text-center">Month</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Working Hours</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Earnings</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Deductions</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-[#1D2939]">
                          {[
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                            {
                              month: "11/11/2022",
                              hours: "$500",
                              earnings: "Monthly Salary",
                              deductions: "Monthly Salary",
                            },
                          ].map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                            >
                              <td className="p-2">{item.month}</td>
                              <td className="p-2">{item.hours}</td>
                              <td className="p-2">{item.earnings}</td>
                              <td className="p-2">{item.deductions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Leave Record Tab */}

            {activeTab === "Leave Records" && (
              <div className="space-y-2 ">
                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#11244D] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Applied Leave(Days)</p>
                      <h2 className="text-lg font-bold mt-1">03</h2>
                    </div>
                  </div>
                  <div className="bg-[#4F4CD1] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Approved</p>
                      <h2 className="text-lg font-bold mt-1">02</h2>
                    </div>
                  </div>
                  <div className="bg-[#707791] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Declined</p>
                      <h2 className="text-lg font-bold mt-1">01</h2>
                    </div>
                  </div>
                </div>

                {/* Leave Table */}
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[600px] text-sm text-left">
                      <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr className="text-black border-b border-gray-900">
                          <th className="p-4 font-semibold text-[12px] text-center">Employee Name</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Employee ID</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Designation</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Leave Type</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Date Range</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Reason For Leave</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800 text-xs">
                        {[
                          {
                            id: "#0983867",
                            name: "Robert james",
                            designation: "Supervisor",
                            type: "Sick Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Sickness",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Stefan Salvatore",
                            designation: "Human Resource",
                            type: "Casual Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Family Function",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-1 text-center">
                              {item.id}
                            </td>
                            <td className="p-2 text-center">
                              {item.name}
                            </td>
                            <td className="p-2 text-center">
                              {item.designation}
                            </td>
                            <td className="p-2 text-center">
                              {item.type}
                            </td>
                            <td className="p-2 text-center">
                              {item.range}
                            </td>
                            <td className="p-2 text-center">
                              {item.reason}
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex items-center gap-2">
                                {item.status === "Approved" ? (
                                  <div>
                                    <span className="inline-flex items-center justify-center  gap-1">
                                      <span className="text-lg"><IoIosCheckmarkCircleOutline className="text-green-600 text-xs" />
                                      </span> Approved
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="inline-flex items-center justify-center  gap-1">
                                      <span className="text-lg"><MdOutlineCancel className="text-red-600 text-xs" />
                                      </span> Declined
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Tab */}

            {activeTab === "Working Hours" && (
              <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                <div className="overflow-x-auto max-h-[270px] overflow-y-auto custom-scrollbar scrollbar-none">
                  <table className="w-full min-w-[600px] text-sm text-left">
                    <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                      <tr className="text-black border-b border-gray-900">
                        <th className="p-4 font-semibold text-[12px] text-center">
                          <div className="flex items-center justify-center gap-2">
                            <BsCalendar4Event className="text-xl" />
                            <span>Day</span>
                          </div>
                        </th>
                        <th className="p-4 font-semibold text-[12px] text-center">
                          <div className="flex items-center justify-center gap-2">
                            <BsClockHistory className="text-xl" />
                            <span>Working Hours</span>
                          </div>
                        </th>
                        <th className="p-4 font-semibold text-[12px] text-center">
                          <div className="flex items-center justify-center gap-2">
                            <IoSunnyOutline className="text-xl" />
                            <span>GMT</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Friday", // duplicate as per image
                        "Sunday",
                      ].map((day, index) => (
                        <tr
                          key={index}
                          className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                        >
                          <td className="p-2 text-[12px] border-r border-gray-200">
                            {day}
                          </td>
                          <td className="p-2 text-[12px] border-r border-gray-200">
                            9 AM - 2 PM / 4 PM - 7 PM
                          </td>
                          <td className="p-2 text-[12px]">GMT +4</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default EmployeePage;
