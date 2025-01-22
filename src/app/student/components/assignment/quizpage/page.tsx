'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BaseLayout2 from '@/components/BaseLayout2';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircle } from "react-icons/io5";
import { FaStar, FaStarHalf } from "react-icons/fa";


type QuizData = {
  question: string;
  options?: string[];
  answer?: string;
  placeholder?: string;
  passage?: string;
  imageUrl?: string;
  audioUrl?: string; // For Writing question type
  correctAnswer?: string; // For Writing question type
};

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define the mock quiz data with proper types
  const mockQuizData: Record<string, QuizData[]> = {
    Quiz: [
      { question: 'What is the capital of France?', options: ['Paris', 'Rome', 'Berlin', 'Madrid'], answer: 'Paris' },
      { question: 'What is 5 + 3?', options: ['5', '8', '10', '12'], answer: '8' },
    ],
    Writing: [
      {
        question: 'Listen to the audio and write the words you hear.',
        audioUrl: '/assets/audio/Ending.mp3',
        placeholder: 'Write your answer here...',
        correctAnswer: 'The Ending was Terrific', // Corrected spelling of 'Terrific'
      },
      {
        question: 'Listen to the audio and write the words you hear.',
        audioUrl: '/assets/audio/Ending.mp3',
        placeholder: 'Write your answer here...',
        correctAnswer: 'The Ending was Terrific', // Corrected spelling of 'Terrific'
      },
    ],
    Reading: [
      {
        passage: 'Once upon a time, there was a brave knight...',
        question: 'What was the knight’s defining trait?',
        answer: 'Bravery',
      },
      {
        passage: 'In a small village, there lived a clever fox...',
        question: 'What made the fox special?',
        answer: 'Cleverness',
      },
    ],
    'Image Identification': [
      { imageUrl: '/images/sample.png', question: 'What is this an image of?', options: ['Cat', 'Dog', 'Rabbit', 'Bird'], answer: 'Cat' },
    ],
  };
  

  // Fetch quiz data based on type
  useEffect(() => {
    if (type && mockQuizData[type]) {
      setQuizData(mockQuizData[type]);
    } else {
      setQuizData([]); // If no valid type, set quiz data to an empty array
    }
    setIsLoading(false); // Set loading to false once data is fetched
  }, [type]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    if (currentQuestion.options && selectedOption === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  
    if (type === 'Writing' && writtenAnswer) {
      const writtenScore = calculateWritingScore(writtenAnswer, currentQuestion.correctAnswer ?? '');
      setScore((prev) => prev + writtenScore); // Update score for writing questions
    }
  
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setWrittenAnswer('');
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setWrittenAnswer('');
    }
  };

  const handleSubmitClick = () => {
    // Update query parameter with assignment ID and navigate
    router.push(`/student/ui/assignment?completedAssignment=${searchParams.get('id')}`);
  };

  const calculateStarRating = (score: number) => {
    if (score === 1)
      return [<FaStar key="full-1" />, <FaStarHalf key="half-1" />];
    if (score === 2)
      return [<FaStar key="full-1" />, <FaStar key="full-2" />, <FaStar key="full-3" />];
    return [
      <FaStar key="empty-1" className="text-gray-200" />,
      <FaStar key="empty-2" className="text-gray-200" />,
      <FaStar key="empty-3" className="text-gray-200" />,
      <FaStar key="empty-4" className="text-gray-200" />,
      <FaStar key="empty-5" className="text-gray-200" />,
    ];
  };

  const calculateWritingScore = (writtenAnswer: string, correctAnswer: string) => {
    // Sanitize both answers to ignore case and extra spaces
    const sanitizedWrittenAnswer = writtenAnswer.trim().toLowerCase();
    const sanitizedCorrectAnswer = correctAnswer.trim().toLowerCase();
  
    // If the written answer exactly matches the correct answer, award full points
    if (sanitizedWrittenAnswer === sanitizedCorrectAnswer) {
      return 3; // Full match, 3 stars
    }
  
    // If the written answer contains more than 50% of the correct words, award partial points
    const writtenWords = sanitizedWrittenAnswer.split(/\s+/);
    const correctWords = sanitizedCorrectAnswer.split(/\s+/);
  
    const matchedWords = writtenWords.filter(word => correctWords.includes(word)).length;
    const accuracy = matchedWords / correctWords.length;
  
    if (accuracy >= 0.5) {
      return 1.5; // Above 50% match, 1.5 stars
    }
  
    return 0; // No match
  };
  
  

  const stars = calculateStarRating(score);

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
              {stars.map((star, index) => (
                <span key={index} className={star ? 'text-[#223857] text-xl' : 'text-gray-200 text-xl'}>
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
                onClick={() => setIsQuizCompleted(false)} // Retry logic
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="items-center justify-center align-middle -ml-72 p-10">
          {/* Loading State */}
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
                  {/* Conditional rendering based on currentQuestion */}
                  {currentQuestion ? (
                    <>
                      <p className="text-lg font-bold text-gray-800 mb-6 text-center">{currentQuestion.question}</p>
                      {currentQuestion.options && (
                        <div className="space-y-4">
                          {currentQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className={`w-1/2 px-4 py-3 rounded-lg text-center text-gray-800  shadow-lg transition-all ${
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

                      {type === 'Writing' && (
                        <>
                          <audio controls className='ml-32'>
                            <source src={currentQuestion.audioUrl} />
                            Your browser does not support the audio element.
                          </audio>
                          <textarea
                            placeholder={currentQuestion.placeholder}
                            className="w-full mt-4 p-4 border rounded-lg shadow-lg"
                            value={writtenAnswer}
                            onChange={(e) => setWrittenAnswer(e.target.value)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <p>Invalid question type</p>
                  )}
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
