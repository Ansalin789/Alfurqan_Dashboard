"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircle } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout1 from "@/components/BaseLayout1";

type QuizData = {
  question: string;
  options?: string[];
  answer?: string;
  placeholder?: string;
  passage?: string;
  imageUrl?: string;
  uploadFile?: string;
  audioUrl?: string;
  audioFile?: string;
  correctAnswer?: string;
  words?: string[];
  matches?: string[];
  type?: string;
  description?: string;
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
  type?: string;
}

// Add API response interfaces
interface AssignmentApiResponse {
  status: string;
  count: number;
  data: AssignmentApiItem[];
}

interface AssignmentApiItem {
  _id: string;
  studentId: string;
  studentName: string;
  sessionClassType: string;
  assignmentName: string;
  questionName: string;
  questionType: string;
  typeofQuestion: string;
  title: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignmentId: string;
  assignmentType: {
    type: string;
    name: string;
  };
  chooseType: boolean;
  trueorfalseType: boolean;
  question: string;
  hasOptions: boolean;
  options: {
    optionOne: string;
    optionTwo: string;
    optionThree: string;
    optionFour: string;
  };
  audioFile?: string;
  uploadFile?: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  level: string;
  courses: string;
  assignedDate: string;
  dueDate: string;
  answer: string;
  answerValidation: string;
  assignmentStatus: string;
  score: number;
  rating: string;
  __v: number;
}

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams ? searchParams.get("type") : null;
  const assignmentId = searchParams ? searchParams.get("assignmentId") : null;
  // Mock assignment and quiz data for UI only
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
  // State for sentence builder question
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // For check/feedback state
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  // Reset selectedWords and check state when question changes
  useEffect(() => {
    setSelectedWords([]);
    setIsChecked(false);
    setIsCorrect(null);
  }, [currentQuestionIndex]);

  // Add a ref for the sentence builder audio
  const sentenceBuilderAudioRef = useRef<HTMLAudioElement | null>(null);
  const handlePlaySentenceAudio = () => {
    if (sentenceBuilderAudioRef.current) {
      // Debug log for audio URL
      if (currentQuestion && currentQuestion.audioUrl) {
        console.log('Playing audio URL:', currentQuestion.audioUrl);
      }
      sentenceBuilderAudioRef.current.currentTime = 0;
      sentenceBuilderAudioRef.current.play();
    }
  };

  // Set quiz data from API on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5001/assignments?assignmentId=${assignmentId}`
        );
        const data: AssignmentApiResponse = await res.json();

        // Transform API data to QuizData[]
        const quizItems: QuizData[] = data.data.map((item) => {
          // Convert options object to array if present
          let options: string[] | undefined = undefined;
          if (item.hasOptions && item.options) {
            options = [
              item.options.optionOne,
              item.options.optionTwo,
              item.options.optionThree,
              item.options.optionFour,
            ].filter(Boolean); // Remove empty strings
          }

          // Determine type for rendering
          let type = item.assignmentType?.type?.toLowerCase();
          // Always normalize to 'word-match' for any variant containing "word match"
          if (type && type.replace(/[-_]/g, "").includes("word match")) type = "word-match";
          else if (type && type.replace(/[-_\s]/g, "").includes("wordmatch")) type = "word-match";
          else if (type === "image identification" || type === "image-identification") type = "image-identification";
          else if (type === "writing") type = "writing";
          else if (type === "reading") type = "speaking";
          else if (type === "quiz") type = item.chooseType ? "quiz" : (item.trueorfalseType ? "quiz" : "quiz");
          else if (!type) type = "unknown";

          // Audio as base64 data URL
          let audioUrl: string | undefined = undefined;
          // Only set audioUrl for non-word-match types
          if (type !== "word-match" && item.audioFile && item.audioFile.length > 10 && item.audioFile !== "null") {
            audioUrl = `data:audio/wav;base64,${item.audioFile}`;
          }

          // Image as uploadFile (if present)
          let uploadFile: string | undefined = undefined;
          if (item.uploadFile && item.uploadFile.length > 5 && item.uploadFile !== "null") {
            uploadFile = item.uploadFile.startsWith('http')
              ? item.uploadFile
              : `http://localhost:5001${item.uploadFile}`;
          }

          // Ensure words array for word-match type
          let words: string[] | undefined = undefined;
          if (type === "word-match") {
            if (
              item.options &&
              (
                item.options.optionOne ||
                item.options.optionTwo ||
                item.options.optionThree ||
                item.options.optionFour
              )
            ) {
              words = [
                item.options.optionOne,
                item.options.optionTwo,
                item.options.optionThree,
                item.options.optionFour,
              ].filter(Boolean);
            } else if (item.answerValidation && item.answerValidation !== "null") {
              words = item.answerValidation.split(" ");
            } else if (item.question) {
              words = item.question.split(" ");
            }
          }

          // Always return a valid QuizData object
          return {
            question: item.question || "",
            options,
            audioUrl,
            uploadFile,
            correctAnswer: item.answerValidation !== "null" ? item.answerValidation : undefined,
            type: type || "unknown",
            words,
            audioFile: item.audioFile,
            // Add more fields as needed
          };
        });
        console.log('quizData after mapping:', quizItems);
        setQuizData(quizItems);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        alert("Failed to load assignments");
      }
    };

    if (assignmentId) {
      fetchAssignments();
    }
  }, [assignmentId]);

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

  const handleWordClick = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleSkip = () => {
    setSelectedWords([]);
    setIsChecked(false);
    setIsCorrect(null);
    handleNextClick();
  };

  const handleCheck = () => {
    if (
      currentQuestion?.type === "word-match" &&
      currentQuestion?.correctAnswer
    ) {
      const correct = currentQuestion.correctAnswer.trim().toLowerCase();
      setIsChecked(true);
      if (selectedWords.length === 1) {
        // Single word answer
        if (selectedWords[0].trim().toLowerCase() === correct) {
          setIsCorrect(true);
          setScore((prev) => prev + 1);
        } else {
          setIsCorrect(false);
        }
      } else {
        // Phrase answer
        const userSentence = selectedWords.join(" ").trim().toLowerCase();
        if (userSentence === correct) {
          setIsCorrect(true);
          setScore((prev) => prev + 1);
        } else {
          setIsCorrect(false);
        }
      }
    }
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

    // Sentence builder scoring
    if (
      currentQuestion?.type === "word-match" &&
      currentQuestion?.correctAnswer
    ) {
      const userSentence = selectedWords.join(" ").trim().toLowerCase();
      const correctSentence = currentQuestion.correctAnswer
        .trim()
        .toLowerCase();
      if (userSentence === correctSentence) {
        setScore((prev) => prev + 1);
      }
    }

    // Move to the next question or submit the quiz
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }

    // Reset state after the user has selected an option
    setIsChecked(false);
    setIsCorrect(null);
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

  const [recordedText, setRecordedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechChecked, setIsSpeechChecked] = useState(false);
  const [isSpeechCorrect, setIsSpeechCorrect] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleStartSpeaking = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        setRecordedText(event.results[0][0].transcript);
      };
      recognition.onend = () => {
        setIsSpeaking(false);
      };
      recognitionRef.current = recognition;
      setRecordedText("");
      setIsSpeaking(true);
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };
  const handleStopSpeaking = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsSpeaking(false);
    }
  };
  const handleResetSpeaking = () => {
    setRecordedText("");
    setIsSpeechChecked(false);
    setIsSpeechCorrect(null);
  };
  const handleCheckSpeaking = () => {
    if (
      currentQuestion?.type === "speaking" &&
      currentQuestion?.words
    ) {
      setIsSpeechChecked(true);
      const user = recordedText.trim().toLowerCase();
      const requiredWords = currentQuestion.words.map(w => w.toLowerCase());
      const allWordsPresent = requiredWords.every(word => user.includes(word));
      if (allWordsPresent) {
        setIsSpeechCorrect(true);
        setScore((prev) => prev + 1);
      } else {
        setIsSpeechCorrect(false);
      }
    }
  };

  const renderQuizContent = () => {
    const q = currentQuestion;
    console.log('quizData:', quizData);
    console.log('currentQuestionIndex:', currentQuestionIndex);
    console.log('currentQuestion:', q);

    // Sentence Builder (Reorder Words) - always prioritize word-match type
    if (q?.type === "word-match" && q.words && q.words.length > 0) {
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            <h2 className="text-2xl font-bold text-[#223857] mb-2 text-center dark:text-[#fff] dark:opacity-80">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-4 flex flex-col items-center mx-auto min-h-[400px] justify-center">
              <h2 className="text-[16px] font-medium text-gray-800 mb-4 text-center dark:text-[#fff] dark:opacity-90">
                {q.question}
              </h2>

              {/* Cartoon character and speech bubble */}
              <div className="flex items-center justify-center mb-8 w-full">
                {/* Cartoon character (placeholder image) */}
                <div className="mr-4">
                  <img
                    src="/assets/images/q4.svg"
                    alt="Cartoon"
                    className="w-24 h-24"
                  />
                </div>
                {/* Speech bubble */}
                <div className="relative flex items-center">
                  <div className="bg-[#5c6bc0] text-white rounded-full px-8 py-6 flex items-center justify-center text-xl font-normal min-w-[180px] min-h-[70px] shadow-md relative">
                    <button
                      type="button"
                      onClick={handlePlaySentenceAudio}
                      className="focus:outline-none flex items-center justify-center mr-3"
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        cursor: "pointer",
                      }}
                      aria-label="Play audio"
                    >
                      <svg
                        width="32"
                        height="32"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.74 2.5-2.26 2.5-4.02z" />
                      </svg>
                    </button>
                    <span className="align-middle text-[12px]">
                      Tap & Listen
                    </span>
                    {/* Hidden audio element for playback */}
                    <audio
                      ref={sentenceBuilderAudioRef}
                      src={q.audioFile && q.audioFile.length > 10 && q.audioFile !== "null" ? `data:audio/wav;base64,${q.audioFile}` : undefined}
                      preload="auto"
                      onError={() => alert('Audio failed to play. Please check the audio format or backend data.')}
                    />
                  </div>
                  {/* Bubble tail - left middle */}
                  <svg
                    width="40"
                    height="80"
                    viewBox="0 0 32 32"
                    className="absolute -left-6 top-3/4 -translate-y-1/2 rotate-180"
                    style={{ zIndex: 1 }}
                  >
                    <path d="M32 16 Q8 12 0 32 Q16 16 32 16" fill="#5c6bc0" />
                  </svg>
                </div>
              </div>
              {/* Word buttons */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center">
                {q.words &&
                  q.words.map((word, idx) => {
                    // Determine button color after checking
                    let btnClass = "bg-white text-gray-800 hover:bg-gray-100";
                    if (isChecked && selectedWords.includes(word)) {
                      if (isCorrect) {
                        btnClass = "bg-green-600 text-white dark:bg-green-600";
                      } else {
                        btnClass = "bg-red-500 text-white dark:bg-red-500";
                      }
                    } else if (selectedWords.includes(word)) {
                      btnClass = "bg-gray-300 text-gray-400";
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleWordClick(word)}
                        disabled={selectedWords.includes(word) || isChecked}
                        className={`px-6 py-3 rounded-lg  border border-[#818790] bg-[#e6e9ed] dark:bg-[#818790] dark:text-[#fff] text-base font-medium transition-all shadow-sm ${btnClass}`}
                      >
                        {word}
                      </button>
                    );
                  })}
              </div>
              {/* Selected words preview */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 mb-6 min-h-[48px] justify-center">
                  {selectedWords.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-6 py-3 rounded-lg bg-blue-200 text-blue-900 dark:bg-[#818790] font-semibold cursor-pointer"
                      onClick={() => !isChecked && handleRemoveWord(idx)}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                {/* Skip and Check buttons below options */}
                <div className="flex flex-row w-full gap-[420px] mb-4">
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2 rounded-md border border-[#c4c4c4] dark:border  bg-transparent dark: text-gray-700 font-medium shadow-sm"
                    disabled={isChecked}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleCheck}
                    className={`px-6 py-2 rounded-md font-semibold ${
                      isChecked
                        ? isCorrect
                          ? "bg-[#377e36] text-white"
                          : "bg-red-500 text-white"
                        : "bg-[#377e36] text-white hover:bg-green-700"
                    } shadow-sm`}
                    disabled={selectedWords.length === 0 || isChecked}
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Feedback box */}
              {isChecked && (
                <div
                  className={`flex items-center gap-2 mb-6 px-6 py-4 rounded-md w-full max-w-md mx-auto font-semibold text-lg ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                  style={{
                    border: isCorrect
                      ? "1.5px solid #22c55e"
                      : "1.5px solid #ef4444",
                  }}
                >
                  {isCorrect ? (
                    <span className="mr-2">
                      <svg
                        width="28"
                        height="28"
                        fill="#22c55e"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="#22c55e"
                          opacity="0.15"
                        />
                        <path
                          d="M9.5 13.5l2 2 4-4"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="mr-2">
                      <svg
                        width="28"
                        height="28"
                        fill="#ef4444"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="#ef4444"
                          opacity="0.15"
                        />
                        <path
                          d="M15 9l-6 6M9 9l6 6"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  )}
                  {isCorrect ? "Correct Answer" : "Wrong Answer"}
                </div>
              )}
            </div>
            {/* Navigation */}
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7] cursor-not-allowed"
                    : "bg-gray-200 dark:bg-[#252628] text-gray-700 dark:text-[#818790] hover:bg-gray-300 dark:hover:bg-[#303538]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Listen & Write (only if not writing)
    if (q?.audioUrl && q?.type !== "writing") {
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            {/* Question Number */}
            <h2 className="text-2xl font-bold text-[#223857] mb-4 text-center dark:text-[#fff] dark:opacity-80">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-4 flex flex-col items-center mx-auto min-h-[400px] justify-center">
              {/* Question Text */}
              <h2 className="text-[14px] font-medium text-gray-800 mb-14 text-center dark:text-[#fff] dark:opacity-90">
                {q.question}
              </h2>
              <audio
                controls
                className="w-full max-w-sm mx-auto mb-6 dark:invert dark:hue-rotate-180"
              >
                <source src={q.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <input
                type="text"
                className="text-[10px] border border-[#babecc] rounded-xl px-4 py-3 w-[600px] h-[150px] mx-auto mb-6 bg-[#f4f5fb] dark:bg-[#343434] dark:border-[#fff] dark:border-opacity-40 dark:text-white dark:placeholder-gray-400"
                placeholder={q.placeholder || "Type what you hear..."}
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7] cursor-not-allowed"
                    : "bg-gray-200 dark:bg-[#252628] text-gray-700 dark:text-[#818790] hover:bg-gray-300 dark:hover:bg-[#303538]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={!writtenAnswer.trim()}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // True or False
    if (
      q?.type === "quiz" &&
      q.options &&
      q.options.length === 2 &&
      q.options.includes("True") &&
      q.options.includes("False")
    ) {
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            {/* Question Number */}
            <h2 className="text-2xl font-bold text-[#223857] dark:text-[#fff] dark:opacity-80 mb-4 text-center">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-6 flex flex-col items-center mx-auto min-h-[400px] justify-center">
              {/* Question Text */}
              <p className="text-lg font-semibold text-gray-800 mb-4 mt-5 text-center dark:text-[#fff] dark:opacity-90">
                {q.question}
              </p>
              {/* Options */}
              <div className="w-full flex flex-col gap-4 mb-8 items-center justify-center flex-1">
                {q.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`w-[300px] px-6 py-3 rounded-lg border border-[#babecc] text-lg font-medium flex items-center justify-center transition-all
                    ${
                      selectedOption === option
                        ? "bg-[#377e36] text-white border-none"
                        : "bg-[#f3f4fb] dark:bg-[#343434] text-gray-800 dark:text-[#818790] hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-bold mr-3">
                      {String.fromCharCode(97 + index) + ")"}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] border border-[#c2cae7] text-[#c2cae7] cursor-not-allowed"
                    : " hover:bg-gray-300 bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={!selectedOption}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Multiple Choice
    if (q?.type === "quiz" && q.options && q.options.length > 2) {
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            {/* Question Number */}
            <h2 className="text-2xl font-bold text-[#223857] dark:text-[#fff] dark:opacity-80 mb-4 text-center">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-6 flex flex-col items-center mx-auto min-h-[400px] justify-center">
              {/* Question Text */}
              <p className="text-lg font-semibold text-gray-800 dark:text-[#fff] dark:opacity-90 mb-8 text-center">
                {q.question}
              </p>
              {/* Options */}
              <div className="w-full flex flex-col gap-4 mb-8 items-center justify-center flex-1">
                {q.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`w-[300px] px-6 py-3 rounded-lg border border-[#babecc] text-lg font-medium flex items-center justify-center transition-all
                    ${
                      selectedOption === option
                        ? "bg-[#377e36] text-white border-none"
                        : "bg-[#f3f4fb] dark:bg-[#343434] text-gray-800 dark:text-[#818790] hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-bold mr-3">
                      {String.fromCharCode(97 + index) + ")"}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7] cursor-not-allowed"
                    : "bg-gray-200  text-gray-700 hover:bg-gray-300 "
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={!selectedOption}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Speaking Question
    if (q?.type === "speaking") {
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            <h2 className="text-2xl font-bold text-[#223857] mb-2 text-center dark:text-[#fff] dark:opacity-80">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-8 flex flex-row items-center mx-auto min-h-[400px] justify-center gap-8">
              {/* Character image */}
              <div className="flex-shrink-0">
                <img
                  src={q.imageUrl}
                  alt="Character"
                  className="w-40 h-40 object-contain"
                />
              </div>
              {/* Title and description */}
              <div>
                <div className="flex flex-col flex-1 max-w-[400px]">
                  <h3 className="text-xl font-bold text-[#223857] mb-2">
                    {q.question}
                  </h3>
                  <p className="text-gray-700 text-base mb-4">
                    {q.description}
                  </p>
                </div>
                {/* Record controls */}
                <div className="flex flex-row items-center justify-center gap-12 mt-8 mb-4">
                  {/* Reset */}
                  <button
                    onClick={handleResetSpeaking}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 text-xl"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4v5h.582M19.418 19A9 9 0 1 1 21 12" />
                      <path d="M4 4v5h.582" />
                    </svg>
                  </button>
                  {/* Record button */}
                  <button
                    onClick={
                      isSpeaking ? handleStopSpeaking : handleStartSpeaking
                    }
                    className={`w-24 h-24 flex items-center justify-center rounded-full border-4 ${
                      isSpeaking ? "border-blue-400" : "border-blue-200"
                    } bg-white shadow-lg relative`}
                  >
                    <span
                      className={`absolute w-24 h-24 rounded-full ${
                        isSpeaking
                          ? "animate-pulse border-4 border-blue-300"
                          : ""
                      }`}
                    ></span>
                    <svg
                      width="48"
                      height="48"
                      fill="#5c6bc0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm5-3a1 1 0 0 0-2 0v1a5 5 0 0 1-10 0v-1a1 1 0 0 0-2 0v1a7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-2.08A7 7 0 0 0 19 12v-1z" />
                    </svg>
                  </button>
                  {/* Cancel */}
                  <button
                    onClick={handleStopSpeaking}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 text-xl"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  
                </div>
                {/* Recognized text preview */}
                <div className="text-center text-gray-600 mb-4 min-h-[32px]">
                    {recordedText}
                  </div>
                  {/* Submit button */}
                  <div className="ml-6">
                  <button
                    onClick={handleCheckSpeaking}
                    className="w-48 py-3 ml-6 rounded-md bg-[#5c6bc0] text-white font-semibold text-lg mb-4"
                    disabled={!recordedText || isSpeechChecked}
                  >
                    Submit
                  </button>
                  {/* Feedback animation */}
                  {isSpeechChecked && (
                    <div className="flex items-center justify-center mt-4">
                      {isSpeechCorrect ? (
                        <span className="flex items-center text-green-600 text-2xl font-bold gap-2">
                          <svg
                            width="36"
                            height="36"
                            fill="#22c55e"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              fill="#22c55e"
                              opacity="0.15"
                            />
                            <path
                              d="M9.5 13.5l2 2 4-4"
                              stroke="#22c55e"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                          Correct!
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-2xl font-bold gap-2">
                          <svg
                            width="36"
                            height="36"
                            fill="#ef4444"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              fill="#ef4444"
                              opacity="0.15"
                            />
                            <path
                              d="M15 9l-6 6M9 9l6 6"
                              stroke="#ef4444"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                          Try again!
                        </span>
                      )}
                    </div>
                  )}
                  </div>
                  
              </div>
            </div>

            {/* Navigation */}
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7] cursor-not-allowed"
                    : "bg-gray-200 dark:bg-[#252628] text-gray-700 dark:text-[#818790] hover:bg-gray-300 dark:hover:bg-[#303538]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={!isSpeechChecked}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Identify the animal question
    if (q?.type === "image-identification") {
      console.log('Image Identification Image src:', q.uploadFile);
      return (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-full p-16 px-40 flex flex-col items-center mx-auto">
            <h2 className="text-2xl font-bold text-[#223857] mb-2 text-center dark:text-[#fff] dark:opacity-80">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <div className="w-full max-w-full bg-[#f4f5fb] dark:bg-[#343434] rounded-xl p-8 flex flex-row items-center mx-auto min-h-[400px] justify-center gap-8">
              {/* Left: Question and image */}
              <div className="flex flex-col items-start flex-1 px-56">
                <h3 className="text-xl font-bold text-[#223857] mb-4">
                  {q.question}
                </h3>
                <div className="flex-shrink-0">
                 <img
                   src={q.uploadFile}
                   alt="Character"
                   width={160}
                   height={160}
                   style={{ objectFit: 'cover', background: '#fff', borderRadius: '8px' }}
                   onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/160?text=No+Image'; }}
                 />
                </div>
              </div>
              
              {/* Right: Options */}
              <div className="flex flex-col gap-6 flex-1 min-w-[300px]">
                {q.options &&
                  q.options.map((option, idx) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className={`w-full px-6 py-4 rounded-lg border border-[#e0e0e0] text-lg font-medium text-left shadow-sm transition-all
                      ${
                        selectedOption === option
                          ? "bg-[#e6e9ed] border-[#576cbc] text-[#223857] font-bold"
                          : "bg-white text-[#223857] hover:bg-[#f3f4fb]"
                      }
                    `}
                    >
                      {option}
                    </button>
                  ))}
              </div>
            </div>
            {/* Navigation */}
            <div className="flex w-full justify-between mt-8">
              <button
                onClick={handleBackClick}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md font-semibold ${
                  currentQuestionIndex === 0
                    ? "bg-[#e1e4f3] dark:bg-[#252628] border border-[#c2cae7] dark:border-[#303538] dark:text-[#303538] text-[#c2cae7]"
                    : "bg-gray-200 dark:bg-[#252628] text-gray-700 dark:text-[#818790] hover:bg-gray-300 dark:hover:bg-[#303538]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                className="px-10 py-2 rounded-md font-semibold bg-[#576cbc] text-white hover:bg-[#223857] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fallback for unknown or unsupported types
    return <div className="text-center">Question type not supported yet</div>;
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
              <div className="items-center justify-center align-middle">
                {isLoading ? (
                  <p>Loading quiz data...</p>
                ) : (
                  <>
                    {/* <div className="flex items-center justify-between gap-10 mt-20 w-[600px] ml-60">
                      {currentQuestionIndex > 0 && (
                        <button onClick={handleBackClick}>
                          <IoPlaySkipBackCircle className="text-2xl" />
                        </button>
                      )}
                      <h2 className="text-sm font-medium text-gray-500">
                        Question {currentQuestionIndex + 1}
                      </h2>
                    </div> */}

                    <div className="items-center justify-between align-middle">
                      {renderQuizContent()}
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
