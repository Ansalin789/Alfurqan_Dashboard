'use client';
import React, { useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";

const AssignmentList = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null); // Track open dropdown by index
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Add this state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showWritingModal, setShowWritingModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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
    {
      topic: "Reading",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
    },
    {
      topic: "Reading",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
    },
    {
      topic: "Reading",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
    },
    {
      topic: "Reading",
      assignmentId: "1234567890",
      course: "Tajweed Masterclass",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
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

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  // Add pagination handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAssign = () => {
    setIsFormOpen(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-[900px] ml-56 mt-48">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Assignment List</h1>
        <div className="relative w-40">
                <span className="absolute inset-y-0 left-4 text-[12px] flex items-center text-gray-400">
                <BsSearch />
                </span>
                <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-2 py-1 rounded-xl shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-[12px] text-gray-600 placeholder-gray-400"
                />
            </div>
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
            {currentItems.map((assignment, index) => (
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
                      setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                    }
                  >
                    <BsThreeDots />

                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownIndex === index && (
                    <div className="absolute right-10 -mt-[30px] bg-white border rounded-md shadow-lg z-10 w-40">
                      <button
                        className={`block w-full text-left px-4 py-2 text-[12px] ${
                          assignment.status === "Assigned"
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (assignment.status !== "Assigned") {
                            setOpenDropdownIndex(null);
                            setIsFormOpen(true);
                          }
                        }}
                        disabled={assignment.status === "Assigned"}
                      >
                        Assign
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-[12px] ${
                          assignment.status === "Assigned"
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (assignment.status !== "Assigned") {
                            setOpenDropdownIndex(null);
                          }
                        }}
                        disabled={assignment.status === "Assigned"}
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
        <span className="text-xs text-gray-600">
          Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredAssignments.length)} of {filteredAssignments.length} items
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-xs rounded ${
              currentPage === 1 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 text-xs rounded ${
                currentPage === index + 1
                  ? 'text-white bg-[#223857]'
                  : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-xs rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Next
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
                <div className="absolute right-0 -mt-2 text-center justify-center w-[350px] bg-white border rounded-lg shadow-lg z-20">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-center text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Quiz");
                        setShowTypeDropdown(false);
                        setShowQuizModal(true);
                      }}
                    >
                      Quiz
                    </button>
                    <button
                      className="w-full px-4 py-2 text-center text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Writing");
                        setShowTypeDropdown(false);
                        setShowWritingModal(true);
                      }}
                    >
                      Writing
                    </button>
                    <button
                      className="w-full px-4 py-2 text-center text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Reading");
                        setShowTypeDropdown(false);
                        setShowReadingModal(true);
                      }}
                    >
                      Reading
                    </button>
                    <button
                      className="w-full px-4 py-2 text-center text-sm hover:bg-gray-100"
                      onClick={() => {
                        setTitle("Image Identification");
                        setShowTypeDropdown(false);
                        setShowImageModal(true);
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
            <div className="flex ml-40">
            <button
              className="text-[#223857] flex items-center text-[13px] justify-center text-center py-2 rounded-lg p-4 border border-grey bg-[#fff] shadow-lg"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
            <button
              className="text-white font-semibold flex items-center text-[13px] justify-center text-center py-2 rounded-lg ml-2 p-4 border border-grey bg-[#223857]"
              onClick={handleAssign}
            >
              Assign
            </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-[500px]">
            <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
            <div className="flex">
            <div className="mb-2 grid ml-4">
              <label className="text-[12px] text-[#012A4A]">Assignment Name</label>
              <input
                type="text"
                className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                placeholder="Name of Assignment"
                value={quizData.assignmentName}
                onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
              />
            </div>

            <div className="mb-2 ml-10">
              <label className="text-[12px] text-[#012A4A]">Assignment Type</label>
              <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                <option value="Quiz">Quiz</option>
              </select>
            </div>
            </div>
            
            

            <div className="mb-4">
              <p className="text-sm font-medium mb-2 ml-2 text-[#012A4A]">Quiz Template</p>
              <div className="flex space-x-4 ml-4">
                <label className="flex items-center text-[#012A4A] text-[13px]">
                  <input
                    type="checkbox"
                    checked={questionType.choose}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, choose: e.target.checked }))}
                    className="mr-2"
                  />
                  Choose
                </label>
                <label className="flex items-center text-[#012A4A] text-[13px]">
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
              <label className="text-[12px] text-gray-600">Type the question</label>
              <textarea
                className="w-full border border-[#808FA4] text-[#223857] text-[12px] text-center rounded-lg p-2 mt-1"
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
                    onChange={() => (answer.id)}
                    className="w-6 h-4"
                  />
                  <input
                    type="text"
                    className="flex-1 rounded-lg p-2 border border-[#808FA4] text-center"
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
      {showWritingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-[500px]">
            <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
            <div className="flex">
            <div className="mb-2 grid ml-4">
              <label className="text-[12px] text-[#012A4A]">Assignment Name</label>
              <input
                type="text"
                className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                placeholder="Name of Assignment"
                value={quizData.assignmentName}
                onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
              />
            </div>

            <div className="mb-2 ml-10">
              <label className="text-[12px] text-[#012A4A]">Assignment Type</label>
              <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                <option value="Quiz">Quiz</option>
              </select>
            </div>
            </div>
            
            

            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-[#012A4A]">Quiz Template</p>
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
                    onChange={() => (answer.id)}
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
                onClick={() => setShowWritingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#223857] text-white rounded-lg"
                onClick={() => {
                  // Handle save logic here
                  setShowWritingModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showReadingModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-4 w-[500px]">
                  <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
                  <div className="flex">
                  <div className="mb-2 grid ml-4">
                    <label className="text-[12px] text-[#012A4A]">Assignment Name</label>
                    <input
                      type="text"
                      className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                      placeholder="Name of Assignment"
                      value={quizData.assignmentName}
                      onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
                    />
                  </div>

                  <div className="mb-2 ml-10">
                    <label className="text-[12px] text-[#012A4A]">Assignment Type</label>
                    <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                      <option value="Quiz">Quiz</option>
                    </select>
                  </div>
                  </div>
                  
                  

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-[#012A4A]">Quiz Template</p>
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
                          onChange={() => (answer.id)}
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
                      onClick={() => setShowReadingModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#223857] text-white rounded-lg"
                      onClick={() => {
                        // Handle save logic here
                        setShowReadingModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

      {showImageModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-4 w-[500px]">
                  <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
                  <div className="flex">
                  <div className="mb-2 grid ml-4">
                    <label className="text-[12px] text-[#012A4A]">Assignment Name</label>
                    <input
                      type="text"
                      className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                      placeholder="Name of Assignment"
                      value={quizData.assignmentName}
                      onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
                    />
                  </div>

                  <div className="mb-2 ml-10">
                    <label className="text-[12px] text-[#012A4A]">Assignment Type</label>
                    <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                      <option value="Quiz">Quiz</option>
                    </select>
                  </div>
                  </div>
                  
                  

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-[#012A4A]">Quiz Template</p>
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
                          onChange={() => (answer.id)}
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
                      onClick={() => setShowImageModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#223857] text-white rounded-lg"
                      onClick={() => {
                        // Handle save logic here
                        setShowImageModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

      {/* Add Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="bg-green-100 rounded-full p-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assigned Successfully</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
