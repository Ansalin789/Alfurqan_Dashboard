'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BaseLayout2 from '@/components/BaseLayout2';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircle, IoMicCircleSharp, IoStopCircleSharp } from "react-icons/io5";
import { FaStar, FaImages  } from "react-icons/fa";
=======
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BaseLayout2 from '@/components/BaseLayout2';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircle } from "react-icons/io5";
import { FaStar, FaStarHalf } from "react-icons/fa";

>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78

type QuizData = {
  question: string;
  options?: string[];
  answer?: string;
  placeholder?: string;
  passage?: string;
  imageUrl?: string;
<<<<<<< HEAD
  audioUrl?: string;
  correctAnswer?: string;
  words?: string[]; // For Word Matching
  matches?: string[]; // For Word Matching
=======
  audioUrl?: string; // For Writing question type
  correctAnswer?: string; // For Writing question type
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
};

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Allow both string and null
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Allow MediaRecorder or null
  const audioChunks = useRef<Blob[]>([]); // Correct the type here
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Allow both File and null

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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
    if (mediaRecorderRef.current) { // Ensure it's not null
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  



  const mockQuizData: Record<string, QuizData[]> = {
    Quiz: [
      { question: 'What is the capital of France?', options: ['Paris', 'Rome', 'Berlin', 'Madrid'], answer: 'Paris' },
    ],
    Writing: [
      {
        question: 'Listen to the audio and write what you hear.',
        audioUrl: '/assets/audio/Ending.mp3',
        placeholder: 'Type your answer here...',
        correctAnswer: 'The quick brown fox jumps over the lazy dog',
=======

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
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
      },
    ],
    Reading: [
      {
        passage: 'Once upon a time, there was a brave knight...',
        question: 'What was the knight’s defining trait?',
        answer: 'Bravery',
      },
<<<<<<< HEAD
    ],
    'Image Identification': [
      { 
        imageUrl: '/assets/images/cat.jpeg', 
        question: 'Identify the animal', 
        options: ['(أ) قطة', '(ب) كلب', '(ج) أرنب', '(د) حصان'], 
        answer: '(أ) قطة' 
      },
    ],
    'Word Matching': [
      {
        question: 'Write this in English',
        audioUrl: '/assets/audio/sample.mp3',
        placeholder: 'Write your answer here...',
        options: ['Man', 'I am', 'water', 'The', 'cow'],
        correctAnswer: 'I am The Man',
      },
    ],
  };

=======
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
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
  useEffect(() => {
    if (type && mockQuizData[type]) {
      setQuizData(mockQuizData[type]);
    } else {
<<<<<<< HEAD
      setQuizData([]); 
    }
    setIsLoading(false); 
=======
      setQuizData([]); // If no valid type, set quiz data to an empty array
    }
    setIsLoading(false); // Set loading to false once data is fetched
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
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
<<<<<<< HEAD

    if (type === 'Writing' && writtenAnswer) {
      const writtenScore = calculateWritingScore(writtenAnswer, currentQuestion.correctAnswer ?? '');
      setScore((prev) => prev + writtenScore); 
    }

=======
  
    if (type === 'Writing' && writtenAnswer) {
      const writtenScore = calculateWritingScore(writtenAnswer, currentQuestion.correctAnswer ?? '');
      setScore((prev) => prev + writtenScore); // Update score for writing questions
    }
  
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
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
<<<<<<< HEAD
    const assignmentId = searchParams.get('id');
    const targetOrigin = "https://your-trusted-domain.com"; // Replace with the actual domain of the target
  
    if (assignmentId) {
      window.opener?.postMessage({ id: assignmentId, action: 'complete' }, targetOrigin);
    }
    router.push('/student/ui/assignment');
  };
  

  

  const calculateStarRating = (score: number) => {
    if (score === 1)
      return [<FaStar key="full-1" />, <FaStar key="full-2" />, <FaStar key="full-3"  />];
=======
    // Update query parameter with assignment ID and navigate
    router.push(`/student/ui/assignment?completedAssignment=${searchParams.get('id')}`);
  };

  const calculateStarRating = (score: number) => {
    if (score === 1)
      return [<FaStar key="full-1" />, <FaStarHalf key="half-1" />];
    if (score === 2)
      return [<FaStar key="full-1" />, <FaStar key="full-2" />, <FaStar key="full-3" />];
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
    return [
      <FaStar key="empty-1" className="text-gray-200" />,
      <FaStar key="empty-2" className="text-gray-200" />,
      <FaStar key="empty-3" className="text-gray-200" />,
      <FaStar key="empty-4" className="text-gray-200" />,
      <FaStar key="empty-5" className="text-gray-200" />,
    ];
  };

  const calculateWritingScore = (writtenAnswer: string, correctAnswer: string) => {
<<<<<<< HEAD
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
      return 3;
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
        {currentQuestion.imageUrl && (
          <img
            src={currentQuestion.imageUrl}
            alt={currentQuestion.question || 'Quiz question'}
            className="rounded-lg w-44 max-w-xs mx-auto mb-4 h-32" // Adjusted image size
          />
        )}
        <p className="text-lg font-semibold text-gray-800 mb-4"> {/* Reduced margin-bottom */}
          {currentQuestion.question}
        </p>

        {currentQuestion.options && (
          <div className="space-y-4 grid"> {/* Reduced spacing between buttons */}
            {currentQuestion.options.map((option) => (
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

=======
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
>>>>>>> c4859b93cbccfc3e927d62e0360c85f4a22e3f78
  );
};

export default QuizPage;
