'use client';
import React, { useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";

const AssignmentList = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showWritingModal, setShowWritingModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [quizData, setQuizData] = useState({
    assignmentName: '',
    question: '',
    options: {
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: ''
    } as { [key: string]: string },
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
  const [showNoOptions, setShowNoOptions] = useState({
    writing: false,
    reading: false,
    image: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [readingFile, setReadingFile] = useState<File | null>(null);
  const [readingAudio, setReadingAudio] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAudio, setImageAudio] = useState<File | null>(null);
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const handleFinalAssign = () => {
    setTitle("");
    setShowTypeDropdown(false);
    setShowQuizModal(false);
    setShowWritingModal(false);
    setShowReadingModal(false);
    setShowImageModal(false);
    setQuizData({
      assignmentName: '',
      question: '',
      options: {
        optionOne: '',
        optionTwo: '',
        optionThree: '',
        optionFour: ''
      },
      answers: [
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false }
      ]
    });
    setQuestionType({
      choose: false,
      trueOrFalse: false
    });
    setShowSuccessModal(false);
    setCurrentPage(1);
    setShowNoOptions({
      writing: false,
      reading: false,
      image: false
    });
    setSelectedFile(null);
    setSelectedAudio(null);
    setReadingFile(null);
    setReadingAudio(null);
    setImageFile(null);
    setImageAudio(null);
    setAssignedDate("");
    setDueDate("");
    setComment("");
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
 
  const handleAssign = async () => {
    const studentId11=localStorage.getItem('studentviewcontrol');
    const studentId1=localStorage.getItem('TeacherPortalName');
    const formData = new FormData();
    formData.append("studentId",studentId11 ?? "");
formData.append("assignmentName", quizData.assignmentName);
formData.append("assignedTeacher",studentId1 ?? " " );
formData.append("assignmentType", title);
formData.append("chooseType", questionType.choose.toString());
formData.append("trueorfalseType", questionType.trueOrFalse.toString());
formData.append("question", quizData.question);
formData.append("hasOptions", (!showNoOptions.writing && !showNoOptions.reading && !showNoOptions.image).toString());
formData.append("options", JSON.stringify(quizData.options));
formData.append("status", "Assigned");
formData.append("createdDate", new Date().toISOString());
formData.append("createdBy", "System");
formData.append("updatedDate", new Date().toISOString());
formData.append("updatedBy", "System");
formData.append("level", "0");
formData.append("courses", "");
formData.append("assignedDate", assignedDate || new Date().toISOString());
formData.append("dueDate", dueDate || new Date().toISOString());
formData.append('answer', selectedAnswer ?? "");
formData.append("answerValidation", "");
if (selectedFile) {
  formData.append("uploadFile", selectedFile);
}

if (selectedAudio) {
  formData.append("audioFile",selectedAudio);
}

    try {
      const auth = localStorage.getItem('TeacherAuthToken');
      const response = await fetch("http://localhost:5001/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        body: formData, // Use FormData instead of JSON
      });
      console.log(formData);

      if (response.ok) {
        setIsFormOpen(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        console.error("Failed to assign assignment");
      }
    } catch (error) {
      console.error("Error assigning assignment:", error);
    }
  };

  // const toBuffer = async (file: File) => {
  //   return new Promise<ArrayBuffer>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as ArrayBuffer);
  //     reader.onerror = () => reject(new Error("Failed to read file"));
  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  const handleNoOptionsChange = (type: keyof typeof showNoOptions) => {
    setShowNoOptions(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAudio(file);
    }
  };

  const handleReadingFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReadingFile(file);
    }
  };

  const handleReadingAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReadingAudio(file);
    }
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageAudio(file);
    }
  };
  const handleOptionChange = (optionKey: string, value: string) => {
    setQuizData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: value,
      },
      answers: prev.answers.map(ans =>
        ans.id === optionKey.charAt(optionKey.length - 1) ? { ...ans, text: value } : ans
      ),
    }));
  };

  // Function to handle checkbox change and toggle isCorrect for each answer
  const handleAnswerChange = (optionKey: string) => {
    const optionValue = quizData.options[optionKey];  // Get the value of the selected option
    setSelectedAnswer(optionValue);  // Update the selected answer with the option's value

    console.log("Selected Answer:", optionValue);  // Debugging: log the selected answer value
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
            {currentItems.map((assignment,index) => (
              <tr
                key={assignment.assignmentId}
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
                            handleFinalAssign();
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
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
              />
              <input
                type="text"
                className="w-1/2 border-b-2 p-2 rounded text-[14px]"
                placeholder="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Comment"
              className="w-full border-b-2 p-2 rounded mb-4 text-[14px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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

{showQuizModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-[500px] h-[600px]">
            <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
            <div className="flex">
            <div className="mb-2 grid ml-4">
              <label htmlFor="scbaivbcia" className="text-[12px] text-[#012A4A]">Assignment Name</label>
              <input
                type="text"
                className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                placeholder="Name of Assignment"
                value={quizData.assignmentName}
                onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
              />
            </div>

            <div className="mb-2 ml-10">
              <label htmlFor="scbaivbciass"  className="text-[12px] text-[#012A4A]">Assignment Type</label>
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
                    className="mr-2"/>{/** */}
                  Choose
                </label>
                <label className="flex items-center text-[#012A4A] text-[13px]">
                  <input
                    type="checkbox"
                    checked={questionType.trueOrFalse}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, trueOrFalse: e.target.checked }))}
                    className="mr-2"
                  />{/** */}
                  True or False
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="scbaivbcia"  className="text-[12px] text-gray-600">Type the question</label>
              <div className="relative">
                <textarea
                  className="w-full border border-[#808FA4] text-[#223857] text-[12px] text-center rounded-lg p-2 mt-1"
                  rows={3}
                  value={quizData.question}
                  onChange={(e) => setQuizData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Which of the following letters is considered a Qalqalah letter?"
                />
                
              </div>
            </div>

            <div className="space-y-3">
            {['optionOne', 'optionTwo', 'optionThree', 'optionFour'].map((optionKey, index) => (
      <div key={optionKey} className="flex items-center space-x-2 text-[12px] w-1/2 justify-center ml-32">
        {/* Checkbox for answer */}
        <input
            type="checkbox"
            checked={selectedAnswer === quizData.options[optionKey]}  // Check if this option value is selected
            onChange={() => handleAnswerChange(optionKey)}
            className="w-5 h-3"
          />
        {/* Input for the option */}
        <input
          type="text"
          className="flex-1 rounded-lg p-1 w-1/2 text-[14px] border border-[#808FA4] text-center"
          placeholder={`Option ${index + 1}`}
          value={quizData.options[optionKey]}
          onChange={(e) => handleOptionChange(optionKey, e.target.value)}
        />
      </div>
    ))}


            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg text-[12px]"
                onClick={() => setShowQuizModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#223857] text-white rounded-lg text-[12px]"
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
          <div className="bg-white rounded-lg p-4 w-[500px] h-[600px]">
            <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
            <div className="flex">
            <div className="mb-2 grid ml-4">
              <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Name</label>
              <input
                type="text"
                className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                placeholder="Name of Assignment"
                value={quizData.assignmentName}
                onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
              />
            </div>

            <div className="mb-2 ml-10">
              <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Type</label>
              <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                <option value="Quiz">Writing</option>
              </select>
            </div>
            </div>
            
            

            <div className="mb-4">
              <p className="text-sm font-medium mb-2 ml-2 text-[#012A4A]">Writing Template</p>
              <div className="flex space-x-4 ml-4">
                
                <label className="flex items-center text-[#012A4A] text-[13px]">
                  <input
                    type="checkbox"
                    checked={questionType.choose}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, choose: e.target.checked }))}
                    className="mr-2"
                  />{/** */}
                  Choose
                </label>
                <label className="flex items-center text-[#012A4A] text-[13px]">
                  <input
                    type="checkbox"
                    checked={questionType.trueOrFalse}
                    onChange={(e) => setQuestionType(prev => ({ ...prev, trueOrFalse: e.target.checked }))}
                    className="mr-2"
                  />{/** */}
                  True or False
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="scbaivbcia"  className="text-[12px] text-gray-600">Type the question</label>
              <div className="relative">
                <textarea
                  className="w-full border border-[#808FA4] text-[#223857] text-[12px] text-center rounded-lg p-2 mt-1"
                  rows={3}
                  value={quizData.question}
                  onChange={(e) => setQuizData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Type your question here..."
                />
             <div className="absolute right-2 bottom-2 flex space-x-4">
  {/* Image Upload */}
  <label className="cursor-pointer">
    <input
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
      className="hidden" // Hide default input
    />
     <span className="sr-only">Upload file</span>
    <svg
      className="w-6 h-6 text-gray-500 hover:text-gray-700"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  </label>

  {/* Audio Upload */}
  <label className="cursor-pointer">
    <input
      type="file"
      accept="audio/*"
      onChange={handleAudioUpload}
      className="hidden" // Hide default input
    />
     <span className="sr-only">Upload Audio</span>
    <svg
      className="w-6 h-6 text-gray-500 hover:text-gray-700"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  </label>
</div>
              </div>
              
              {/* Preview section */}
              <div className="mt-2 flex space-x-2">
                {selectedFile && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Uploaded file" 
                      className="h-16 w-16 object-cover rounded"
                    />
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
               
              </div>
            </div>

            <label className="flex items-center text-[#012A4A] text-[13px]">
              <input
                type="checkbox"
                checked={showNoOptions.writing}
                onChange={() => handleNoOptionsChange('writing')}
                className="mr-2"
              />{/** */}
              No Options
            </label>

            {!showNoOptions.writing && (
              <div className="space-y-3">
                {quizData.answers.map((answer, index) => (
                  <div key={answer.id} className="flex items-center space-x-2 text-[12px] w-1/2 justify-center ml-32">
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={() => setQuizData(prev => ({
                        ...prev,
                        answers: prev.answers.map(ans => 
                          ans.id === answer.id ? { ...ans, isCorrect: !ans.isCorrect } : ans
                        )
                      }))}
                      className="w-5 h-3"
                    />
                    <input
                      type="text"
                      className="flex-1 rounded-lg p-1 w-1/2 text-[14px] border border-[#808FA4] text-center"
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
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg text-[12px]"
                onClick={() => setShowWritingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#223857] text-white rounded-lg text-[12px]"
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
                <div className="bg-white rounded-lg p-4 w-[500px] h-[600px]">
                  <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
                  <div className="flex">
                  <div className="mb-2 grid ml-4">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Name</label>
                    <input
                      type="text"
                      className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                      placeholder="Name of Assignment"
                      value={quizData.assignmentName}
                      onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
                    />
                  </div>

                  <div className="mb-2 ml-10">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Type</label>
                    <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                      <option value="Quiz">Reading</option>
                    </select>
                  </div>
                  </div>
                  
                  

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 ml-2 text-[#012A4A]">Reading Template</p>
                    <div className="flex space-x-4 ml-4">
                      
                      <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={questionType.choose}
                          onChange={(e) => setQuestionType(prev => ({ ...prev, choose: e.target.checked }))}
                          className="mr-2"
                        />{/** */}
                        Choose
                      </label>
                      <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={questionType.trueOrFalse}
                          onChange={(e) => setQuestionType(prev => ({ ...prev, trueOrFalse: e.target.checked }))}
                          className="mr-2"
                        />{/** */}
                        True or False
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-gray-600">Type the question</label>
                    <div className="relative">
                      <textarea
                        className="w-full border border-[#808FA4] text-[#223857] text-[12px] text-center rounded-lg p-2 mt-1"
                        rows={3}
                        value={quizData.question}
                        onChange={(e) => setQuizData(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="Type your question here..."
                      />
                      <div className="absolute right-2 bottom-2 flex space-x-2">
                        
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReadingFileUpload}
                            className="hidden"
                          />
                          <svg 
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                      
                        
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleReadingAudioUpload}
                            className="hidden"
                          />
                          <svg 
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                       
                      </div>
                    </div>
                    
                    {/* Preview section */}
                    <div className="mt-2 flex space-x-2">
                      {readingFile && (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(readingFile)} 
                            alt="Uploaded file" 
                            className="h-16 w-16 object-cover rounded"
                          />
                          <button
                            onClick={() => setReadingFile(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {readingAudio && (
                        <div className="relative">
                          <audio controls className="h-8">
                            <source src={URL.createObjectURL(readingAudio)} />
                            <track kind="captions" src="path_to_captions.vtt" default />
                          </audio>
                          <button
                            onClick={() => setReadingAudio(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                    <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={showNoOptions.reading}
                          onChange={() => handleNoOptionsChange('reading')}
                          className="mr-2"
                        />{/** */}
                        No Options
                      </label>

                  {!showNoOptions.reading && (
                    <div className="space-y-3">
                      {quizData.answers.map((answer, index) => (
                        <div key={answer.id} className="flex items-center space-x-2 text-[12px] w-1/2 justify-center ml-32">
                          <input
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={() => setQuizData(prev => ({
                              ...prev,
                              answers: prev.answers.map(ans => 
                                ans.id === answer.id ? { ...ans, isCorrect: !ans.isCorrect } : ans
                              )
                            }))}
                            className="w-5 h-3"
                          />
                          <input
                            type="text"
                            className="flex-1 rounded-lg p-1 w-1/2 text-[14px] border border-[#808FA4] text-center"
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
                  )}

                  <div className="flex justify-end space-x-3 mt-6 ">
                    <button
                      className="px-4 py-2 border rounded-lg text-[12px]"
                      onClick={() => setShowReadingModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#223857] text-white rounded-lg text-[12px]"
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
                <div className="bg-white rounded-lg p-4 w-[500px] h-[600px]">
                  <h2 className="text-lg font-semibold mb-2 text-[#012A4A]">Add Assignments</h2>
                  <div className="flex">
                  <div className="mb-2 grid ml-4">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Name</label>
                    <input
                      type="text"
                      className="w-[90%] border border-[#808FA4] rounded-lg p-2 mt-1 text-[12px]"
                      placeholder="Name of Assignment"
                      value={quizData.assignmentName}
                      onChange={(e) => setQuizData(prev => ({ ...prev, assignmentName: e.target.value }))}
                    />
                  </div>

                  <div className="mb-2 ml-10">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-[#012A4A]">Assignment Type</label>
                    <select name="" id="" className="w-[100%] border border-[#808FA4] text-[#223857] text-[12px] rounded-lg p-2 mt-1">
                      <option value="Quiz">Image</option>
                    </select>
                  </div>
                  </div>
                  
                  

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 ml-2 text-[#012A4A]">Image Identification Template</p>
                    <div className="flex space-x-4 ml-4">
                      
                      <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={questionType.choose}
                          onChange={(e) => setQuestionType(prev => ({ ...prev, choose: e.target.checked }))}
                          className="mr-2"
                        />{/** */}
                        Choose
                      </label>
                      <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={questionType.trueOrFalse}
                          onChange={(e) => setQuestionType(prev => ({ ...prev, trueOrFalse: e.target.checked }))}
                          className="mr-2"
                        />{/** */}
                        True or False
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="scbaivbcia"  className="text-[12px] text-gray-600">Type the question</label>
                    <div className="relative">
                      <textarea
                        className="w-full border border-[#808FA4] text-[#223857] text-[12px] text-center rounded-lg p-2 mt-1"
                        rows={3}
                        value={quizData.question}
                        onChange={(e) => setQuizData(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="Type your question here..."
                      />
                      <div className="absolute right-2 bottom-2 flex space-x-2">
                        
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                          <svg 
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                       
                        
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleImageAudioUpload}
                            className="hidden"
                          />
                          <svg 
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                      
                      </div>
                    </div>
                    
                    {/* Preview section */}
                    <div className="mt-2 flex space-x-2">
                      {imageFile && (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(imageFile)} 
                            alt="Uploaded file" 
                            className="h-16 w-16 object-cover rounded"
                          />
                          <button
                            onClick={() => setImageFile(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {imageAudio && (
                        <div className="relative">
                          <audio controls className="h-8">
                            <source src={URL.createObjectURL(imageAudio)} />
                            <track kind="captions" src="path_to_captions.vtt" default />
                          </audio>
                          <button
                            onClick={() => setImageAudio(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center text-[#012A4A] text-[13px]">
                        <input
                          type="checkbox"
                          checked={showNoOptions.image}
                          onChange={() => handleNoOptionsChange('image')}
                          className="mr-2"
                        />{/** */}
                        No Options
                      </label>

                  {!showNoOptions.image && (
                    <div className="space-y-3">
                      {quizData.answers.map((answer, index) => (
                        <div key={answer.id} className="flex items-center space-x-2 text-[12px] w-1/2 justify-center ml-32">
                          <input
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={() => setQuizData(prev => ({
                              ...prev,
                              answers: prev.answers.map(ans => 
                                ans.id === answer.id ? { ...ans, isCorrect: !ans.isCorrect } : ans
                              )
                            }))}
                            className="w-5 h-3"
                          />
                          <input
                            type="text"
                            className="flex-1 rounded-lg p-1 w-1/2 text-[14px] border border-[#808FA4] text-center"
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
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      className="px-4 py-2 border rounded-lg text-[12px]"
                      onClick={() => setShowImageModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#223857] text-white rounded-lg text-[12px]"
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