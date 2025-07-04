"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import {
  IoPlaySkipBackCircle
} from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";

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

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams ? searchParams.get("type") : null;
  const assignmentId = searchParams ? searchParams.get("id") : null;
  // Mock assignment and quiz data for UI only
  const mockAssignment: Assignment = {
    _id: assignmentId || "1",
    assignmentName: "Sample Assignment",
    assignmentType: type || "Quiz",
    assignedTeacher: "Teacher Name",
    assignedDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    createdBy: "System",
    createdDate: new Date().toISOString(),
    studentId: "S001",
    status: "Assigned",
    level: "Beginner",
    question: "What is 2 + 2?",
    hasOptions: true,
    chooseType: true,
    trueorfalseType: false,
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    answer: "4",
    answerValidation: "",
    audioFile: "",
    uploadFile: "",
    passage: "This is a sample passage for reading.",
    words: ["sample", "passage"],
    matches: [],
    courses: "Math",
  };
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const currentQuestion = quizData[currentQuestionIndex];

  // Set mock data on mount
  useEffect(() => {
    setAssignment(mockAssignment);
    setQuizData([
      {
        question: "What is 2 + 2?", // Choose the answer
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        answer: "4",
      },
      {
        question: "The sky is blue.", 
        options: ["True", "False"],
        correctAnswer: "True",
        answer: "True",
      },
      {
        question: "Listen to the audio and type what you hear.", 
        audioUrl: "/assets/audio/sample.mp3", 
        correctAnswer: "hello world",
        answer: "hello world",
        placeholder: "Type what you hear...",
      },
    ]);
  }, [assignmentId, type]);
  
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
    if (
      assignment?.assignmentType === "Quiz" &&
      selectedOption === assignment.answer
    ) {
      setScore((prev) => prev + 1);
    }

    // Add this block for writing questions
    if (
      assignment?.assignmentType === "Writing" &&
      currentQuestion?.correctAnswer
    ) {
      const writingScore = calculateWritingScore(
        writtenAnswer,
        currentQuestion.correctAnswer
      );
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
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setWrittenAnswer("");
    }
  };
  const handleSubmitClick = () => {
    setIsQuizCompleted(false);
    resetState();
  };

  const resetState = () => {
    setSelectedOption(null);
    setWrittenAnswer("");
    setSelectedFile(null);
    setAudioUrl(null);
  };

  const calculateStarRating = (score: number) => {
    if (score === 1)
      return [
        <FaStar key="full-1" />,
        <FaStar key="full-2" />,
        <FaStar key="full-3" />,
      ];
    return [
      <FaStar key="empty-1" className="text-gray-200" />,
      <FaStar key="empty-2" className="text-gray-200" />,
      <FaStar key="empty-3" className="text-gray-200" />,
      <FaStar key="empty-4" className="text-gray-200" />,
      <FaStar key="empty-5" className="text-gray-200" />,
    ];
  };

  const calculateWritingScore = (
    writtenAnswer: string,
    correctAnswer: string
  ) => {
    const sanitizedWrittenAnswer = writtenAnswer.trim().toLowerCase();
    const sanitizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    if (sanitizedWrittenAnswer === sanitizedCorrectAnswer) {
      return 3;
    }

    const writtenWords = sanitizedWrittenAnswer.split(/\s+/);
    const correctWords = sanitizedCorrectAnswer.split(/\s+/);

    const matchedWords = writtenWords.filter((word) =>
      correctWords.includes(word)
    ).length;
    const accuracy = matchedWords / correctWords.length;

    if (accuracy >= 0.5) {
      return 1.5;
    }

    return 0;
  };

  const stars = calculateStarRating(score);

  const renderQuizContent = () => {
    const q = currentQuestion;
    // Listen & write
    if (q?.audioUrl) {
      return (
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {q.question}
          </h2>
          <audio controls className="w-full max-w-sm mx-auto mb-4">
            <source src={q.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <input
            type="text"
            className="border rounded px-4 py-2 w-1/2 mx-auto"
            placeholder={q.placeholder || "Type your answer..."}
            value={writtenAnswer}
            onChange={(e) => setWrittenAnswer(e.target.value)}
          />
        </div>
      );
    }
    // True or False
    if (
      q?.options &&
      q.options.length === 2 &&
      q.options.includes("True") &&
      q.options.includes("False")
    ) {
      return (
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {q.question}
          </h2>
          <div className="flex justify-center gap-4">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`px-6 py-2 rounded-lg text-center text-gray-800 shadow-lg transition-all mx-2 mb-3 ${
                  selectedOption === option
                    ? "bg-[#223857] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
    // Choose the answer (multiple choice)
    if (q?.options && q.options.length > 2) {
      return (
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {q.question}
          </h2>
          <div className="space-y-4 grid">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-1/2 px-4 py-2 rounded-lg text-center text-gray-800 shadow-lg transition-all mx-auto mb-3 ${
                  selectedOption === option
                    ? "bg-[#223857] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
    // Default fallback
    return <div className="text-center">No question available</div>;
  };

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Assignments" />

      <div className="md:p-0 mx-auto w-full">
        <div className="flex flex-col h-full w-full justify-between">
          <div className="flex flex-col">
            {isQuizCompleted ? (
              <div className="items-center justify-center align-middle mt-40 -ml-8 w-[600px]">
                <div className="bg-white w-full rounded-xl shadow-xl p-10 text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Nice Work
                  </h2>
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-red-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl font-bold">✓</span>
                    </div>
                  </div>
                  {type === "Quiz" && (
                    <p className="text-gray-600 mb-4">
                      You scored {score}/{quizData.length}
                    </p>
                  )}

                  <div className="flex gap-1 mb-6 justify-center">
                    {stars.map((star) => (
                      <span
                        key={
                          typeof star === "string"
                            ? star
                            : Math.random().toString(36).slice(2, 11) // Use slice instead of substr
                        }
                        className={
                          star
                            ? "text-[#223857] text-xl"
                            : "text-gray-200 text-xl"
                        }
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

                    <div className="items-center justify-between align-middle">
                      <div className="bg-white w-full rounded-xl shadow-xl p-10">
                        {renderQuizContent()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default QuizPage;
