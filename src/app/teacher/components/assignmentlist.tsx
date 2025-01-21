'use client';
import React, { useState } from "react";

const AssignmentList = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track open dropdown by index
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Add this state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState({
    assignmentName: '',
    question: '',
    answers: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false }
    ]
  });
  const [questionType, setQuestionType] = useState({
    choose: false,
    trueOrFalse: false
  });

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
                <td className="px-3 py-2 text-xs relative">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() =>
                      setOpenDropdownIndex(
                        openDropdownIndex === index ? null : index
                      )
                    }
                  >
                    ...
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownIndex === index && (
                    <div className="absolute right-10 -mt-[30px] bg-white border rounded-md shadow-lg z-10 w-40">
                      <button
                        className="block w-full text-left px-4 py-2 text-[12px] hover:bg-gray-100"
                        onClick={() => {
                          setOpenDropdownIndex(null);
                          setIsFormOpen(true);
                        }}
                      >
                        Assign
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-[12px] hover:bg-gray-100"
                        onClick={() => setOpenDropdownIndex(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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

      {/* Assign Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[400px]">
            <h2 className="text-sm font-bold mb-4">Assign</h2>
            <div className="relative w-full mb-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border-b-2 p-2 rounded pr-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                className="absolute top-1/2 right-2 border border-black transform -translate-y-1/2 text-black rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                +
              </button>
              
              {/* Assignment Type Dropdown */}
              {showTypeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Quiz");
                        setShowTypeDropdown(false);
                        setShowQuizModal(true);
                      }}
                    >
                      Quiz
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Writing");
                        setShowTypeDropdown(false);
                      }}
                    >
                      Writing
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Reading");
                        setShowTypeDropdown(false);
                      }}
                    >
                      Reading
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Image Identification");
                        setShowTypeDropdown(false);
                      }}
                    >
                      Image Identification
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                className="w-1/2 border-b-2 p-2 rounded text-[14px]"
                placeholder="Assigned Date"
              />
              <input
                type="text"
                className="w-1/2 border-b-2 p-2 rounded text-[14px]"
                placeholder="Due Date"
              />
            </div>
            <textarea
              placeholder="Comment"
              className="w-full border-b-2 p-2 rounded mb-4 text-[14px]"
            ></textarea>
            <button
              className="text-white flex items-center text-[13px] justify-center text-center py-2 rounded-lg ml-32 p-4 border border-grey bg-[#223857]"
              onClick={() => setIsFormOpen(false)}
            >
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h2 className="text-lg font-semibold mb-4">Add Assignments</h2>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600">Assignment Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Name of sess"
                value={quizData.assignmentName}
                onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Assignment Type</label>
              <div className="w-full border rounded-lg p-2 mt-1 bg-gray-50">
                Quiz
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Quiz Template</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={questionType.choose}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, choose: e.target.checked }))}
                    className="mr-2"
                  />
                  Choose
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={questionType.trueOrFalse}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, trueOrFalse: e.target.checked }))}
                    className="mr-2"
                  />
                  True or False
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Type the question</label>
              <textarea
                className="w-full border rounded-lg p-2 mt-1"
                rows={3}
                value={quizData.question}
                onChange={(e) => setQuizData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Which of the following letters is considered a Qalqalah letter?"
              />
            </div>

            <div className="space-y-3">
              {quizData.answers.map((answer, index) => (
                <div key={answer.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={() => handleAnswerSelect(answer.id)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded-lg p-2"
                    placeholder={`${answer.id}) Answer ${index + 1}`}
                    value={answer.text}
                    onChange={(e) => setQuizData(prev => ({
                      ...prev,
                      answers: prev.answers.map(ans => 
                        ans.id === answer.id ? { ...ans, text: e.target.value } : ans
                      )
                    }))}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowQuizModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#223857] text-white rounded-lg"
                onClick={() => {
                  // Handle save logic here
                  setShowQuizModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
