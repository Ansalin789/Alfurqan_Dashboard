'use client';
import React, { useState } from "react";

const AssignmentList = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [title, setTitle] = useState("");  
  const [assignmentType, setAssignmentType] = useState("");

  const handleAssignmentTypeChange = (event) => {
    setAssignmentType(event.target.value);
  };
  const handleCancel = () => {
    setAssignmentType(""); // Reset the assignment type
  };
  const assignments = [
    {
      topic: "Quiz",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Assigned",
    },
    {
      topic: "Reading",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
    },
  ];

  const filteredAssignments = assignments.filter((assignment) =>
    activeTab === "Pending"
      ? assignment.status !== "Completed"
      : assignment.status === "Completed"
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md w-[900px] ml-56 mt-96">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Assignment List</h1>
        <input
          type="text"
          placeholder="Search"
          className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 text-sm">
        <button
          className={`px-3 py-2 ${
            activeTab === "Pending"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending (05)
        </button>
        <button
          className={`px-3 py-2 ${
            activeTab === "Completed"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed (12)
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Topic
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Assignment ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Course
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Assigned Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Due Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                Status
              </th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-2 text-xs">{assignment.topic}</td>
                <td className="px-3 py-2 text-xs">{assignment.assignmentId}</td>
                <td className="px-3 py-2 text-xs">{assignment.course}</td>
                <td className="px-3 py-2 text-xs">{assignment.assignedDate}</td>
                <td className="px-3 py-2 text-xs">{assignment.dueDate}</td>
                <td className="px-3 py-2 text-xs">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === "Assigned"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-600">Showing 1–5 of 100 data</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded">
            1
          </button>
          <button className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded">
            2
          </button>
          <button className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded">
            3
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-64">
            <h2 className="text-sm font-bold mb-4">Assignment Pop-Up</h2>
            <div className="flex flex-col space-y-2">
              <button
                className="px-4 py-2 text-sm text-black bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsFormOpen(true);
                }}
              >
                Assign
              </button>
              <button
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Form Modal */}
      {isFormOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-md w-[400px]">
      <h2 className="text-sm font-bold mb-4">Assign</h2>
      <div className="relative w-full mb-4">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded pr-10" /* Added padding-right to prevent text overlapping the button */
          value={title}  // Set the input value to the selected title
          onChange={(e) => setTitle(e.target.value)}  // Update the input value
        />

        {/* Plus Button */}
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-slate-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          +
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 bg-white border shadow-md mt-2 rounded w-48 z-10">
            <select
              className="w-full p-2 bg-white border rounded shadow-md cursor-pointer"
              onChange={(e) => {
                setTitle(e.target.value); 
                setDropdownOpen(false);    
              }} >
              <option className="hover:bg-gray-100">Select</option>
              <option
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => setQuizOpen(!isQuizOpen)}
              >
                Quiz
              </option>
              {isQuizOpen && (
                <div className="assignment-modal">
                  <h2>Add Assignments</h2>
                </div>
              )}

              <option className="hover:bg-gray-100">Writing</option>
              <option className="hover:bg-gray-100">Reading</option>
              <option className="hover:bg-gray-100">Image Identification</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          className="w-1/2 border p-2 rounded"
          placeholder="Assigned Date"
        />
        <input
          type="text"
          className="w-1/2 border p-2 rounded"
          placeholder="Due Date"
        />
      </div>
      <textarea
        placeholder="Comment"
        className="w-full border p-2 rounded mb-4"
      ></textarea>
      <button
        className="text-white flex items-center justify-center py-2 rounded-2xl p-4 border border-grey bg-[#223857]"
        onClick={() => setIsFormOpen(false)}
      >
        Assign
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default AssignmentList;
