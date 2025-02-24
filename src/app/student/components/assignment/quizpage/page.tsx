'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BaseLayout2 from '@/components/BaseLayout2';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircle, IoMicCircleSharp, IoStopCircleSharp } from "react-icons/io5";
import { FaStar, FaImages } from "react-icons/fa";
import axios from 'axios';


type QuizData = {
  question: string;
  options?: string[];
  answer?: string;
  placeholder?: string;
  passage?: string;
  imageUrl?: string;
  audioUrl?: string;
  correctAnswer?: string;
  words?: string[];
  matches?: string[];
};

interface Assignment {
  _id: string;
  assignmentName: string;
  assignmentType: string;
  assignedTeacher: string;
  assignedDate: string; // ISO date string
  dueDate: string; // ISO date string
  createdBy: string;
  createdDate: string; // ISO date string
  updatedBy?: string;
  updatedDate?: string; // ISO date string
  studentId: string;
  status: string; // e.g., "Assigned"
  level: string;
  question: string;
  hasOptions: boolean;
  chooseType: boolean;
  trueorfalseType: boolean;
  options?: string[]; // Only if `hasOptions: true`
  correctAnswer?: string; // Only if `hasOptions: true`
  answer?: string;
  answerValidation?: string;
  audioFile?: string; // Base64 or URL
  uploadFile?: string; // Base64 or URL (for images)
  passage?: string;
  words?: string[];
  matches?: string[];
  courses?: string;
}

const QuizPage = async () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const assignmentId = searchParams.get('id');
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const currentQuestion = quizData[currentQuestionIndex];
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`https://alfurqanacademy.tech/allAssignment`);
        // Use find() instead of filter() to get single assignment
        const assignmentData = response.data.assignments.find(
          (assignment: Assignment) => assignment._id === assignmentId
        );
        
        setAssignment(assignmentData || null); // Handle case when not found
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (assignmentId) fetchAssignment();
  }, [assignmentId]);
  useEffect(() => {
    if (!assignment) return;

    // Properly map all assignment fields to quizData
    const formattedQuizData: QuizData = {
      question: assignment.question || "No question available",
      options: assignment.options,
      correctAnswer: assignment.correctAnswer ?? assignment.answer,
      answer: assignment.answer,
      audioUrl: assignment.audioFile 
        ? `data:audio/mp3;base64,${assignment.audioFile}`
        : undefined,
      imageUrl: assignment.uploadFile
        ? `data:image/jpeg;base64,${assignment.uploadFile}`
        : undefined,
      passage: assignment.passage,
      words: assignment.words,
      matches: assignment.matches
    };

    setQuizData([formattedQuizData]);
  }, [assignment]);
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioUrl(audioURL);
        audioChunks.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleNextClick = async () => {
    // Check if the selected option matches the correct answer
    if (assignment?.assignmentType === 'Quiz' && selectedOption === assignment.answer) {
      setScore((prev) => prev + 1);
    }
  
    // Add this block for writing questions
    if (assignment?.assignmentType === 'Writing' && currentQuestion?.correctAnswer) {
      const writingScore = calculateWritingScore(writtenAnswer, currentQuestion.correctAnswer);
      setScore((prev) => prev + writingScore);
    }
  
    // Move to the next question or submit the quiz
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
    
    // Reset state after the user has selected an option
    
  };
 
  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setWrittenAnswer('');
    }
  };
const handleSubmitClick=async()=>{
  let audioFileBuffer: ArrayBuffer | undefined; // Define these variables if they are missing
let uploadFileBuffer: ArrayBuffer | undefined;

if (assignment) {
  const formData = new FormData();
  
  const assignmentData = {
    studentId: assignment.studentId ?? "",  // Using nullish coalescing for safer fallback
    assignmentName: assignment.assignmentName ?? "",
    assignedTeacher: assignment.assignedTeacher ?? "",
    assignmentType: assignment.assignmentType ?? "",
    chooseType: assignment.chooseType ?? false,
    trueorfalseType: assignment.trueorfalseType ?? false,
    question: assignment.question ?? "",
    hasOptions: assignment.hasOptions ?? false,
    options: JSON.stringify(assignment.options ?? []),
    audioFile: audioFileBuffer ? Buffer.from(audioFileBuffer) : undefined,
    uploadFile: uploadFileBuffer ? Buffer.from(uploadFileBuffer) : undefined,
    status: "completed",
    createdDate: assignment.createdDate ?? new Date(),
    createdBy: assignment.createdBy ?? "",
    updatedDate: assignment.updatedDate ?? new Date(),
    updatedBy: "Student",
    level: score,
    courses: assignment.courses ?? "",
    assignedDate: assignment.assignedDate ?? new Date(),
    dueDate: assignment.dueDate ?? new Date(),
    answer: assignment.answer ??  "",
    answerValidation: selectedOption ?? "",
  };

  // Make sure all the values are correct types before appending to FormData
  Object.entries(assignmentData).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());  // Convert Date to ISO string
    } else if (typeof value === "boolean") {
      formData.append(key, value.toString());  // Convert boolean to string
    } else if (value !== undefined) {
      formData.append(key, value as string);  // Ensure value is string
    }
  });

  // Handle file uploads if they exist
  if (audioFileBuffer) {
    formData.append('audioFile', new Blob([audioFileBuffer]), 'audio.wav');
  }

  if (uploadFileBuffer) {
    formData.append('uploadFile', new Blob([uploadFileBuffer]), 'file.png');
  }

  try {
   const response= await axios.put(`https://alfurqanacademy.tech/assignments/${assignmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
   
    // Redirect after successful submission
    router.push('/student/ui/assignment');
    console.log(response);
    resetState();
  } catch (error) {
    console.error('Submission failed:', error);
  }
}
};

  const resetState = () => {
    setSelectedOption(null);
    setWrittenAnswer('');
    setSelectedFile(null);
    setAudioUrl(null);
  };

  const calculateStarRating = (score: number) => {
    if (score === 1)
      return [<FaStar key="full-1" />, <FaStar key="full-2" />, <FaStar key="full-3"/>];
    return [
      <FaStar key="empty-1" className="text-gray-200" />,
      <FaStar key="empty-2" className="text-gray-200" />,
      <FaStar key="empty-3" className="text-gray-200" />,
      <FaStar key="empty-4" className="text-gray-200" />,
      <FaStar key="empty-5" className="text-gray-200" />,
    ];
  };

  const calculateWritingScore = (writtenAnswer: string, correctAnswer: string) => {
    const sanitizedWrittenAnswer = writtenAnswer.trim().toLowerCase();
    const sanitizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    if (sanitizedWrittenAnswer === sanitizedCorrectAnswer) {
      return 3;
    }

    const writtenWords = sanitizedWrittenAnswer.split(/\s+/);
    const correctWords = sanitizedCorrectAnswer.split(/\s+/);

    const matchedWords = writtenWords.filter(word => correctWords.includes(word)).length;
    const accuracy = matchedWords / correctWords.length;

    if (accuracy >= 0.5) {
      return 1.5;
    }

    return 0;
  };

  const stars = calculateStarRating(score);


  const renderQuizContent = () => {
    if (type === 'Writing') {
      return (
        <div className="text-center">
          {/* Display the current question */}
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>
  
          {/* Check if the question has an audio URL */}
          {currentQuestion.audioUrl && (
           <div className="flex justify-center items-center mb-6">
           {/* Audio playback element */}
           <audio controls className="w-full max-w-sm">
             <source src={currentQuestion.audioUrl} type="audio/mpeg" />
             <track 
               default 
               kind="captions" 
               src="" // Leave blank or provide a valid .vtt file URL if captions are available
               srcLang="en" 
               label="No captions available" 
             />
             Your browser does not support the audio element.
           </audio>
         </div>
         
          )}
  
  
  <div className="bg-gray-100 border border-dashed border-gray-400 rounded-lg p-6 mt-6">
      <div className="flex flex-col items-center">
        {/* Icon */}
        <div className="mb-4">
          <FaImages className="text-gray-500 w-16 h-16" />
        </div>
        {/* File Upload Instructions */}
        <p className="text-gray-600 mb-4">
          Drag your image here, or{' '}
          <label htmlFor="file-upload" className="text-blue-500 cursor-pointer">
            browse
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileSelection}
          />
        </p>
        <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG, WEBP</p>

        {/* Display Selected File */}
        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-800">
              Selected File:
            </p>
          </div>
        )}
      </div>
    </div>


       </div>
      );
    }
    
  
    if (type === 'Reading') {
      return (
      <div className="flex items-center justify-center mt-10">
      
        {/* Image Section */}
        <div className="flex justify-center w-full md:w-1/3">
          <img
            src="/assets/images/Mask group.png"
            alt="Reading Character"
            className="rounded-lg w-48 h-48 object-cover"
          />
        </div>

        {/* Text and Controls Section */}
        <div className="flex flex-col w-full md:w-2/3 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Reading Passage
          </h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {currentQuestion?.passage ?? "No passage available."}
          </p>

          {/* Recorder Section */}
            <div className="flex flex-col items-center mt-6">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-md transition-transform ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {isRecording ? (
                  <IoStopCircleSharp className="text-white text-3xl" /> // Stop icon when recording
                ) : (
                  <IoMicCircleSharp className="text-white text-3xl" /> // Mic icon when not recording
                )}
              </button>
              {isRecording && (
                <p className="text-gray-500 text-sm mt-2">Recording...</p>
              )}
              {audioUrl && (
                <audio controls src={audioUrl} className="w-full mt-4">
                  <track
                    default
                    kind="captions"
                    src="" // Leave blank if no captions are available
                    srcLang="en"
                    label="No captions available"
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>


          {/* Next Button */}
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={handleNextClick}
              className="flex items-center justify-center px-6 py-3 rounded-full bg-[#223857] text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <span className="mr-2">Next</span>
              <BiSolidSkipNextCircle className="text-xl" />
            </button>
          </div>
        </div>
      
    </div>
      );
    }
  
    // Default content for other question types
    return (
      <div className="text-center">
        {currentQuestion?.imageUrl && (
      <img
        src={currentQuestion.imageUrl}
        alt={currentQuestion?.question || 'Quiz question'}
        className="rounded-lg w-44 max-w-xs mx-auto mb-4 h-32"
      />
    )}
       <p className="text-lg font-semibold text-gray-800 mb-4">
      {currentQuestion?.question || "No question available"}
    </p>

        {currentQuestion?.options && (
          <div className="space-y-4 grid"> {/* Reduced spacing between buttons */}
           {Object.values(currentQuestion.options).map((option: string, index: number) => (
              <button
                key={option} // Use the option value as the key
                onClick={() => handleOptionClick(option)}
                className={`w-1/2 px-4 py-2 rounded-lg text-center text-gray-800 shadow-lg transition-all mx-auto mb-3 ${ // Adjusted width, padding, and margin
                  selectedOption === option
                    ? 'bg-[#223857] text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

   </div>

    );
  };
  
 
  
  return (
 <BaseLayout2>
  <h1 className="font-semibold p-7 text-[35px]">Assignments</h1>
  {isQuizCompleted ? (
    <div className="items-center justify-center align-middle mt-40 -ml-8 w-[600px]">
      <div className="bg-white w-full rounded-xl shadow-xl p-10 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Nice Work</h2>
        <div className="flex justify-center items-center mb-4">
          <div className="bg-red-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">✓</span>
          </div>
        </div>
        {type === 'Quiz' && (
          <p className="text-gray-600 mb-4">You scored {score}/{quizData.length}</p>
        )}

        <div className="flex gap-1 mb-6 justify-center">
          {stars.map((star) => (
            <span
              key={
                typeof star === 'string'
                  ? star
                  : Math.random().toString(36).slice(2, 11) // Use slice instead of substr
              }
              className={star ? 'text-[#223857] text-xl' : 'text-gray-200 text-xl'}
            >
              {star || <FaStar />}
            </span>
          ))}
        </div>





        <div className="space-y-3">
          <button
            className="w-1/2 px-4 py-3 border rounded-lg text-center justify-center bg-[#223857] text-white shadow-2xl shadow-[#b5a9dc] border-white"
            onClick={handleSubmitClick}
          >
            Submit
          </button>
          <br />
          <button
            className="w-1/2 px-4 py-3 border rounded-lg text-center justify-center"
            onClick={() => setIsQuizCompleted(false)}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="items-center justify-center align-middle -ml-72 p-10">
      {isLoading ? (
        <p>Loading quiz data...</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-10 mt-20 w-[600px] ml-60">
            {currentQuestionIndex > 0 && (
              <button onClick={handleBackClick}>
                <IoPlaySkipBackCircle className="text-2xl" />
              </button>
            )}
            <h2 className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1}
            </h2>
            <button onClick={handleNextClick}>
              <BiSolidSkipNextCircle className="text-2xl" />
            </button>
          </div>

          <div className="items-center justify-between align-middle mt-6 ml-60 w-[600px]">
            <div className="bg-white w-full rounded-xl shadow-xl p-10">
              {renderQuizContent()}
            </div>
          </div>
        </>
      )}
    </div>
  )}
</BaseLayout2>

  );
};

export default QuizPage;
