"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useRef, useState } from "react";
import { PiBookOpenTextFill } from "react-icons/pi";
import { BiSolidTime } from "react-icons/bi";
import { BsCalendar2Check } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
interface Assignment {
    assignedTeacherId:string;
      _id: string;
      studentId:string;
      assignmentName: string;
      assignedTeacher: string;
      assignmentType: string;
      chooseType: boolean;
      trueorfalseType: boolean;
      question: string;
      hasOptions: boolean;
      audioFile: string;
      uploadFile: string;
      status: string;
      createdDate: string;
      createdBy: string;
      updatedDate: string;
      updatedBy: string;
      level: string;
      courses: string;
      assignedDate: string;
      dueDate: string;
      __v: number;
    }

const AssignmentsPage = () => {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7; // Number of items per page
    const totalItems = 20; // Total number of items (replace with actual data length)
   



    
      const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [isFormOpen1, setIsFormOpen1] = useState(false);
      const [title, setTitle] = useState("");
      const [showTypeDropdown, setShowTypeDropdown] = useState(false);
      const [showQuizModal, setShowQuizModal] = useState(false);
      const [showWritingModal, setShowWritingModal] = useState(false);
      const [showReadingModal, setShowReadingModal] = useState(false);
      const [showImageModal, setShowImageModal] = useState(false);
      const [assignments, setAssignments] = useState<Assignment[]>([]);
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
      const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const handleAssign = async () => {
        const formData = new FormData();
        formData.append("assignedTeacherId", '');
     formData.append("studentId","");
    formData.append("assignmentName", quizData.assignmentName);
    formData.append("assignedTeacher"," " );
    formData.append("assignmentType", title);
    formData.append("chooseType", questionType.choose.toString());
    formData.append("trueorfalseType", questionType.trueOrFalse.toString());
    formData.append("question", quizData.question);
    formData.append("hasOptions", (!showNoOptions.writing && !showNoOptions.reading && !showNoOptions.image).toString());
    formData.append("options", JSON.stringify(quizData.options));
    formData.append("status", "Not assigned");
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
    console.log(">>>>>>>>>>>>.",JSON.stringify(quizData.options));
    
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    
    
        try {
          
          const response = await fetch("https://api.blackstoneinfomaticstech.com/assignments", {
            method: "POST",
            body: formData, // Use FormData instead of JSON
          });
          console.log(formData);
    
          if (response.ok) {
            setIsFormOpen(false);
            handleFinalAssign(); 
            setShowQuizModal(false);
            setShowWritingModal(false);
            setShowImageModal(false);
            setShowReadingModal(false);
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
      };const handleNoOptionsChange = (type: keyof typeof showNoOptions) => {
          setShowNoOptions(prev => ({ ...prev, [type]: !prev[type] }));
        };
      
        const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            setSelectedFile(file);
          }
        };
        const handleSvgClick = () => {
            if (fileInputRef.current) {
              fileInputRef.current.click(); // Simulate the file input click
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

    const handleAddNewClick = () => {
        setShowModal(true); // Open the modal
    };

     // Close the dropdown when mouse leaves
  const handleMouseLeave = () => {
    setShowModal(false);
  };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = [
        {
            id: 789,
            name: "Samantha William",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
        {
            id: 789,
            name: "Jordan Nico",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
        {
            id: 451,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Group Class",
            date: "January 3, 2020",
        },
        {
            id: 621,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Group Class",
            date: "January 3, 2020",
        },
        {
            id: 542,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Regular Class",
            date: "January 3, 2020",
        },
        {
            id: 431,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
    ].slice(indexOfFirstItem, indexOfLastItem); // Get current items for the page

    return (
        <BaseLayout4>
            <div className="p-8 min-h-screen mx-auto">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Assignments</h2>

                <div className="flex flex-col gap-6 w-full  mx-auto">
  {/* Top Section with Cards */}
  <div className="flex flex-col lg:flex-row flex-wrap gap-6 justify-center lg:justify-between">
    {/* Profile Card */}
    <div className="relative bg-[#002D62] text-white rounded-xl w-full sm:w-64 px-4 py-4 shadow-md text-center">
      {/* Ribbon badge */}
      <div className="absolute top-2 right-2 w-[50px] h-[50px] rounded-full bg-red-700 flex items-center justify-center z-10">
        <div className="absolute w-10 h-10 rounded-full bg-[#012A4A] flex items-center justify-center z-10">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-[#813300] font-bold text-lg">1</span>
          </div>
          <div className="absolute bottom-[-24px] w-7 h-6 bg-red-700 rounded-b-[2px] [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_80%,0%_100%)]"></div>
        </div>
      </div>

      <img
        src="/assets/images/avatar.png"
        alt="Profile"
        className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="font-semibold text-[14px] mb-1">Angela Moss</h3>
      <p className="text-[10px] font-semibold text-cyan-500">Student ID : KOL231231293201</p>
      <p className="text-[10px] font-semibold text-cyan-500 mb-3">Arabic Language</p>

      <div className="flex justify-center mb-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
      </div>
      <button className="bg-[#88BADF] text-black font-semibold px-6 py-1 rounded-md text-[12px]">
        View Report
      </button>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
      <div className="bg-[#2D49AD] text-white rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total Assignments</p>
          <h2 className="text-lg font-bold mt-1">100</h2>
        </div>
        <div className="bg-[#8280ff77] p-4 rounded-3xl">
          <PiBookOpenTextFill className="text-[#2742A6]" size={25} />
        </div>
      </div>

      <div className="bg-[#667085] text-white rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total pending</p>
          <h2 className="text-lg font-bold mt-1">90</h2>
        </div>
        <div className="bg-[#778197] p-4 rounded-3xl">
          <BiSolidTime className="text-[#5D6472]" size={25} />
        </div>
      </div>

      <div className="bg-[#FFFFFF] text-[#6D7D93] rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total Completed</p>
          <h2 className="text-lg font-bold mt-1">20</h2>
        </div>
        <div className="bg-[#f8f6f6] border border-[#979797] p-4 rounded-3xl">
          <BsCalendar2Check className="text-[#717C92]" size={25} />
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Filter/Action Row */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
    <h3 className="font-semibold text-md text-[#012A4A]">Total Assignments</h3>
    <div className="flex flex-wrap gap-3 items-start relative">
  {/* Custom Dropdown Button */}
  <div className="relative">
  <button
    onClick={handleAddNewClick}
    className="bg-[#012A4A] text-white text-[12px] px-4 py-2 rounded-lg flex items-center gap-1 w-full"
  >
    + Add New
    <svg
      className="w-3 h-3 ml-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown Options */}
  {showModal && (
    <ul onMouseLeave={handleMouseLeave} className="absolute left-0 mt-1 w-full bg-white border border-gray-700 rounded-lg shadow-lg z-50 text-[10px] divide-y divide-gray-700">
      <button
        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
        onClick={() => {
          setTitle("Quiz");
          setShowTypeDropdown(false);
          setShowQuizModal(true);
          setShowModal(false);
        }}
      >
        Quiz
      </button>
      <button
        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
        onClick={() => {
          setTitle("Writing");
          setShowTypeDropdown(false);
          setShowWritingModal(true);
          setShowModal(false);
        }}
      >
        Writing
      </button>
      <button
        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
        onClick={() => {
          setTitle("Reading");
          setShowTypeDropdown(false);
          setShowReadingModal(true);
          setShowModal(false);
        }}
      >
        Reading
      </button>
      <button
        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
        onClick={() => {
          setTitle("Image Identification");
          setShowTypeDropdown(false);
          setShowImageModal(true);
          setShowModal(false);
        }}
      >
        Image Identification
      </button>
    </ul>
  )}
</div>


  {/* Time Filter Select */}
  <select className="border px-4 py-2.5 rounded-lg text-[12px] text-gray-800">
    <option>Last month</option>
    <option>This month</option>
  </select>
</div>


  </div>
</div>


                {/* Total Assignments Table */}
                <div className="">
                    <div className="overflow-x-auto scrollbar-none mt-4 bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4"></div>
                        <table className="table-auto w-full">
                            <thead className="border-b-[1px] border-[#1C3557] text-[13px] font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-center">
                                        ID <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Name{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Courses{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Class{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Date{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`text-[9px] text-center font-medium mt-0 ${index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                                            }`}
                                    >
                                        <td className="px-4 py-2">{row.id}</td>
                                        <td className="px-4 py-2">{row.name}</td>
                                        <td className="px-4 py-2">{row.course}</td>
                                        <td className="px-4 py-2">{row.classType}</td>
                                        <td className="px-4 py-2">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>

               
            </div>
            {/* <div className="flex space-x-2 mb-4">
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
            </div> */}
            {/* <textarea
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
            </div> */}
     

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
                onClick={() =>handleAssign()}
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
                onClick={() =>handleAssign()}
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
                      onClick={() =>handleAssign()}
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
                            onChange={handleFileUpload}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <svg 
                            className="w-5 h-5 text-gray-500 hover:text-gray-700"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={handleSvgClick} 
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
                      onClick={() =>handleAssign()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
        </BaseLayout4>
    );
};
// Pagination Component
const Pagination = ({
    currentPage,
    setCurrentPage,
    totalPages,
}: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}) => {
    return (
        <div className="flex justify-between items-center p-3">
            <p className="text-[9px] text-gray-600">
                Showing {currentPage * 6 - 5}-
                {Math.min(currentPage * 6, totalPages * 6)} from {totalPages * 6} data
            </p>
            <div className="flex space-x-2 text-[8px]">
                {/* Previous Button */}
                <button
                    className={`px-2 py-1 rounded ${currentPage === 1
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {/* Pagination Numbers */}
                {totalPages > 5 ? (
                    <>
                        <button
                            className={`px-2 py-1 rounded ${currentPage === 1
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(1)}
                        >
                            1
                        </button>
                        {currentPage > 3 && <span className="px-2 py-1">...</span>}
                        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                            .filter((page) => page > 1 && page < totalPages)
                            .map((page) => (
                                <button
                                    key={page}
                                    className={`px-2 py-1 rounded ${currentPage === page
                                            ? "bg-[#1B2B65] text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        {currentPage < totalPages - 2 && (
                            <span className="px-2 py-1">...</span>
                        )}
                        <button
                            className={`px-2 py-1 rounded ${currentPage === totalPages
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                ) : (
                    [...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={`px-2 py-1 rounded ${currentPage === index + 1
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                {/* Next Button */}
                <button
                    className={`px-2 py-1 rounded ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default AssignmentsPage;
