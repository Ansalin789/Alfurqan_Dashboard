'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

import { useParams } from 'next/navigation';

// Define the return type of the getAllUsers function
interface User {
  trailId: string;
  fname: string;
  lname: string;
  email: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
  evaluationStatus?: string;
  city?: string;
  students?: number;
  comment?: string;
}


// Interface for Student Data from APIL
// interface StudentData {
//   academicCoach?: {
//     academicCoachId: string;
//     email: string;
//     role: string;
//     name: string;
//   };
//   country: string;
//   countryCode: string;
//   createdBy: string;
//   createdDate: Date;
//   email: string;
//   evaluationStatus: "PENDING" | "INPROGRESS" | "COMPLETED";
//   firstName: string;
//   lastName: string;
//   lastUpdatedBy: string;
//   lastUpdatedDate: Date;
//   learningInterest: "Quran" | "Islamic Studies" | "Arabic";
//   numberOfStudents: number;
//   phoneNumber: number;
//   preferredFromTime: string;
//   preferredToTime: string;
//   preferredTeacher: "Male" | "Female" | "Either";
//   referralSource: string;
//   startDate: Date;
//   status: "Active" | "Inactive" | "Deleted";
//   timeZone: string;
//   _id: string;
  
// }


interface StudentData{
  _id: any,
  firstName: any,
  lastName: any,
  cademicCoach: {
      academicCoachId: any,
      name: any,
      role: any,
      email: any
  },
  email: any,
  phoneNumber: any,
  country: any,
  countryCode: any,
  learningInterest: any,
  numberOfStudents: any,
  preferredTeacher: any,
  preferredFromTime: any,
  preferredToTime: any,
  timeZone: any,
  referralSource: any,
  startDate: any,
  evaluationStatus: any,
  status: any,
  createdDate: any,
  createdBy: any,
  lastUpdatedBy: any,
  lastUpdatedDate: any
 
}

// Interface for Evaluation Request
interface EvaluationRequest {
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentPhone: number;
    studentCountry: string;
    studentCountryCode: string;
    learningInterest: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime: string;
    preferredToTime: string;
    timeZone: string;
    referralSource: string;
    preferredDate: Date;
    evaluationStatus: string;
    status: string;
    createdDate: Date;
    createdBy: string;
  };
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  subscription: {
    subscriptionName: string;
    subscriptionPricePerHr: string;
  };
  classStartDate: Date;
  classEndDate: Date;
  classStartTime: string;
  classEndTime: string;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
}

// Interface for Evaluation Data
interface EvaluationData {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: number;
  studentCountry: string;
  studentCountryCode: string;
  learningInterest: string;
  numberOfStudents: number;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  timeZone: string;
  referralSource: string;
  preferredDate: Date;
  evaluationStatus: string;
  status: string;
  createdDate: Date;
  createdBy: string;
}

// Step 1 Component
const Step1: React.FC<{ nextStep: (data: any) => void }> = ({ nextStep }) => {
  const steps = [
    {
      step: '1',
      title: 'Clarify',
      description: 'Clarify your interest from our experienced teacher',
      color: 'bg-gradient-to-br from-purple-600 to-blue-600',
      icon: '👋',
    },
    {
      step: '2',
      title: 'Assess',
      description: 'Assess your level with our best evaluation test exams',
      color: 'bg-gradient-to-br from-blue-500 to-teal-400',
      icon: '🖊️',
    },
    {
      step: '3',
      title: 'Schedule',
      description: 'Schedule a time for your evaluation',
      color: 'bg-gradient-to-br from-orange-400 to-pink-500',
      icon: '📅',
    },
    {
      step: '4',
      title: 'Question',
      description: 'Ask and clarify all your doubts',
      color: 'bg-gradient-to-br from-red-500 to-purple-500',
      icon: '❓',
    },
  ];

const [trialId, setTrialId] = useState<string | null>(null); // Assuming you have a state for trialId


  const handleStartEvaluations = () => {
    console.log("1>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...");
    const validData = { /* your valid data here */ };
    nextStep(validData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
      
      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image 
          src="/assets/images/whitelogo.png" 
          alt="Logo" 
          className="w-40 drop-shadow-2xl" 
          width={100} 
          height={100} 
        />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Purpose of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Evaluation</span>
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Begin your learning journey with a personalized evaluation process designed just for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className={`absolute inset-0 ${item.color} opacity-90`}></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              
              <div className="relative p-6 h-full flex flex-col items-center text-center">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-6">
            Unlocking Knowledge Anywhere Anytime Lets Learn Together
          </p>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full
                     font-semibold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 
                     transition-all duration-200 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
            onClick={handleStartEvaluations}
          >
            Start Evaluations →
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2 Component
const Step2: React.FC<{ prevStep: () => void; nextStep: () => void; evaluationData: EvaluationData }> = ({ prevStep, nextStep, evaluationData }) => {
  const [studentData, setStudentData] = useState<StudentData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = window.location.href
  const queryString = id.split('?')[1]; // Extract the query string
  const params = new URLSearchParams(queryString);
  const studentId = params.get('studentId');

  useEffect(() => {
  
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/studentlist/${studentId}`);
        console.log("response>>>",response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched student data:', data);
        
        // if (!Array.isArray(data.data)) {
        //   throw new Error('Expected array of students');
        // }

        const  studentArray = data;
        console.log("response data", studentArray); 

        setStudentData(studentArray);
       localStorage.setItem('studentData', data[0]);
      console.log(">>>>",  studentData);

      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading student data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">No student data available</div>
      </div>
    );
  }

  console.log('Evaluation Data:', evaluationData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Student Details
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
        
            <div key={studentData.email || studentData.phoneNumber?.toString()} className="mb-8 last:mb-0">
          <h2 className="text-2xl font-semibold text-white mb-4">
        {studentData.firstName || 'N/A'} {studentData.lastName || 'N/A'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Email', value: studentData.email || 'N/A', icon: '📧' },
          { label: 'Phone Number', value: studentData.phoneNumber?.toString() || 'N/A', icon: '📞' },
          { label: 'Country', value: studentData.country || 'N/A', icon: '🌍' },
          { label: 'Country Code', value: studentData.countryCode || 'N/A', icon: '🌍' },
          { label: 'Learning Interest', value: studentData.learningInterest || 'N/A', icon: '📚' },
          { label: 'Number of Students', value: studentData.numberOfStudents?.toString() || 'N/A', icon: '👥' },
          { label: 'Preferred Teacher', value: studentData.preferredTeacher || 'N/A', icon: '👨‍🏫' },
          { label: 'Preferred From Time', value: studentData.preferredFromTime || 'N/A', icon: '⏰' },
          { label: 'Preferred To Time', value: studentData.preferredToTime || 'N/A', icon: '⏰' },
          { label: 'Time Zone', value: studentData.timeZone || 'N/A', icon: '🌐' },
          { label: 'Referral Source', value: studentData.referralSource || 'N/A', icon: '📢' },
          { label: 'Evaluation Status', value: studentData.evaluationStatus || 'N/A', icon: '📋' },
        ].map((field) => (
          <div key={field.label} className="group">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-white/60 group-hover:text-white/90 transition-colors">
                {field.icon}
              </span>
              <label className="text-sm font-semibold text-white/60 group-hover:text-white/90 transition-colors">
                {field.label}
              </label>
            </div>
            <input
              type="text"
              value={field.value}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white
                       focus:bg-white/10 focus:border-white/20 focus:ring-2 focus:ring-purple-500/20
                       transition-all duration-200"
            />
          </div>
        ))}
      </div>
    </div>

</div>


        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                     bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                     bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 rounded-lg group"
          >
            <span>Next</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3 Component
const Step3 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Skills Selection */}
        <div className="flex items-center justify-between mb-12">
          <div className="relative group">
            <select className="appearance-none bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg
                           border border-white/20 focus:border-white/30 focus:ring-2 focus:ring-purple-500/20
                           transition-all duration-200 pr-12">
              <option>Skills: Arabic</option>
              <option>Skills: English</option>
              <option>Skills: French</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none
                          group-hover:text-white/90 transition-colors">
              ▼
            </div>
          </div>
          <div className="text-white/80 font-medium px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg
                         border border-white/20">
            Skills: Reading & Listening
          </div>
        </div>

        {/* Word Display Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center mb-12
                     transform hover:scale-105 transition-all duration-300">
          <h1 className="text-3xl font-bold text-white mb-8">
            Read the following word
          </h1>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur"></div>
            <div className="relative bg-gray-900 rounded-lg p-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                           from-blue-400 to-purple-400 arabic-text">
                ارسلها
              </div>
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex justify-center mb-12">
          <button className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full
                         hover:bg-white/20 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <span className="text-white/60 group-hover:text-white/90">🎙️</span>
              <span className="text-white/80 group-hover:text-white">Click to Record</span>
            </div>
          </button>
        </div>

        {/* Navigation Buttons - Add this at the bottom of the main content div */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                       bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex space-x-2">
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === 1 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                     flex items-center space-x-2"
            onClick={nextStep}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Optional: Add floating decorative elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
    </div>
  );
};

// Step 4 Component
const Step4 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [time, setTime] = useState(120); // 120 seconds = 2 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isActive && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    if (time === 0) {
      setIsActive(false);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setTime(120);
    setIsActive(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Skills Selection */}
        <div className="flex items-center justify-between mb-12">
          <div className="relative group">
            <select className="appearance-none bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg
                           border border-white/20 focus:border-white/30 focus:ring-2 focus:ring-purple-500/20
                           transition-all duration-200 pr-12">
              <option>Skills: Arabic</option>
              <option>Skills: English</option>
              <option>Skills: French</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none
                          group-hover:text-white/90 transition-colors">
              ▼
            </div>
          </div>
          <div className="text-white/80 font-medium px-6 py-2 bg-white/10 backdrop-blur-md rounded-lg
                         border border-white/20">
            Skills: Speaking
          </div>
        </div>

        {/* Timer Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center mb-12">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                      from-blue-400 to-purple-400 mb-8">
            Talk about yourself within two minutes
          </h1>
          
          {/* Timer Display */}
          <div className="relative mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-md rounded-full p-8 inline-block">
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                           from-blue-400 to-purple-400 tabular-nums">
                {formatTime(time)}
              </div>
            </div>
          </div>

          {/* Recording Button */}
          <button 
            className={`relative group px-8 py-4 rounded-full transition-all duration-300 
                     ${isActive 
                       ? 'bg-red-500/20 hover:bg-red-500/30' 
                       : 'bg-white/10 hover:bg-white/20'}`}
            onClick={handleStart}
            disabled={isActive}
          >
            <div className="flex items-center space-x-3">
              {isActive && (
                <span className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              )}
              <span className={`text-2xl ${isActive ? 'text-red-400' : 'text-white/60'} 
                            group-hover:scale-110 transition-transform`}>
                🎙️
              </span>
              <span className="text-white/80 group-hover:text-white">
                {isActive ? 'Recording...' : 'Click to Start Recording'}
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Buttons - Add this at the bottom of the main content div */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                       bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex space-x-2">
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === 2 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                     flex items-center space-x-2"
            onClick={nextStep}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 transition-all duration-500"></div>
      )}
    </div>
  );
};

// Define the Evaluation interface based on your backend schema
interface IEvaluation {
  student: {
    studentId: string; // This should be set when the student is created
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentPhone: number;
    studentCity?: string;
    studentCountry: string;
    studentCountryCode: string; // Add this if needed
    learningInterest: string; // Adjust to your enum type
    numberOfStudents: number;
    preferredTeacher: string; // Adjust to your enum type
    preferredFromTime?: string;
    preferredToTime?: string;
    timeZone: string;
    referralSource: string; // Adjust to your enum type
    preferredDate?: Date;
    evaluationStatus: string; // Adjust to your enum type
    status: string; // Adjust to your enum type
    createdDate?: Date;
    createdBy?: string;
  };
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel?: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  subscription: {
    subscriptionName: string;
    subscriptionPricePerHr: number;
  };
  classStartDate: Date;
  accomplishmentTime: string;
  studentRate: number;
  expectedFinishingDate: number;
  classEndDate?: Date;
  classStartTime: string;
  classEndTime: string;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  studentStatus?: string;
  classStatus?: string;
  comments?: string;
  trialClassStatus?: string;
  status?: string;
  createdDate?: Date;
  createdBy?: string;
  updatedDate?: Date;
  updatedBy?: string;
}

// Step 5 Component
const Step5 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [evaluationData, setEvaluationData] = useState<any>(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const response = await fetch('http://localhost:5001/evaluation');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvaluationData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEvaluationData();
  }, []);

  // Add state for selected hours
  const [selectedHours, setSelectedHours] = useState<number>(3); // Default to 3 hours

  // Calculate prices based on selected hours
  const calculatePrice = (rate: number) => {
    return `$${(selectedHours * rate).toFixed(2)}`;
  };

  // Pricing plans data
  const pricingPlans = [
    { label: "Simple", rate: 8, basePrice: "$8/h"},
    { label: "Essential", rate: 9, basePrice: "$9/h"},
    { label: "Pro", rate: 11, basePrice: "$11/h"},
    { label: "Elite", rate: 16, basePrice: "$16/h"},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Arabic Language Course Selection
          </h1>

          <h2 className="text-white/90 font-semibold hover:text-white transition-colors mb-4">Level</h2>

          {/* Level Section */}
          <div className="flex items-center justify-between mb-8 bg-white/5 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="my-beautiful-language" 
                  className="w-3 h-3 border-white/20 bg-white/10
                           checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded opacity-0 
                              group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
              <label htmlFor="my-beautiful-language" className="text-white/90 font-normal text-[12px] hover:text-white transition-colors">
                My Beautiful Language
              </label>
            </div>
            <select className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]">
              <option className="bg-gray-900">Level: A1</option>
              <option className="bg-gray-900">Level: A2</option>
              <option className="bg-gray-900">Level: B1</option>
              <option className="bg-gray-900">Level: B2</option>
            </select>

            <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reading"
                  className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="reading" className="text-white font-normal text-[12px]">
                  Reading
                </label>
                <select className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]">
                  <option className="bg-gray-900">1</option>
                  <option className="bg-gray-900">2</option>
                  <option className="bg-gray-900">3</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="grammar"
                  className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="grammar" className="text-white font-normal text-[12px]">
                  Grammar
                </label>
                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]">
                  <option className="bg-gray-900">0</option>
                  <option className="bg-gray-900">1</option>
                  <option className="bg-gray-900">2</option>
                </select>
              </div>
          </div> 

          {/* Hours Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white/90 mb-4">Select Preferred Hours</h2>
            <div className="flex flex-wrap gap-3">
              {[1, 1.5, 2, 2.5, 3, 4, 5].map((hour) => (
                <button
                  key={hour}
                  onClick={() => setSelectedHours(hour)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105
                           ${hour === selectedHours
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {hour}h
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white/90 mb-4">Select Preferred Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.label}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10
                               group-hover:border-white/20 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{plan.label}</h3>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                                from-blue-400 to-purple-400 mb-1">
                      {plan.basePrice}
                    </div>
                    <div className="text-sm text-white/60 mb-4">
                      Total: {calculatePrice(plan.rate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>  

          {/* Completion Section */}
          <div className="flex flex-wrap items-center justify-between mt-8 bg-white/5 p-4 rounded-xl">
            <div className="text-white/80">
              Accomplishment Time: <span className="font-semibold text-white">150 hours</span>
            </div>
            <div className="text-white/80">
              Your Rate: <span className="font-semibold text-white">0 hr/week</span>
            </div>
            <div className="text-white/80">
              Expected Finishing Date: <span className="font-semibold text-white">37.5 months</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Add this at the bottom of the main content div */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                       bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex space-x-2">
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === 3 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                     flex items-center space-x-2"
            onClick={nextStep}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
    </div>
  );
};








// Step 6 Component
const Step6 = ({ prevStep, nextStep, evaluationData }: { prevStep: () => void; nextStep: () => void; evaluationData: any }) => {
  const [guardianName, setGuardianName] = useState<string>('');
  const [guardianEmail, setGuardianEmail] = useState<string>('');
  const [guardianPhone, setGuardianPhone] = useState<string>('');
  const [guardianCountry, setGuardianCountry] = useState<string>('');
  const [guardianCity, setGuardianCity] = useState<string>('');
  const [guardianLanguage, setGuardianLanguage] = useState<string>('');
  const [guardianTimeZone, setGuardianTimeZone] = useState<string>('');

  const handleSubmit = async () => {
    const postData = {
      name: guardianName,
      email: guardianEmail,
      phone: guardianPhone,
      country: guardianCountry,
      city: guardianCity,
      language: guardianLanguage,
      timeZone: guardianTimeZone,
    };

    try {
      const response = await fetch('http://localhost:5001/evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the error message from the response
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Proceed to the next step after successful submission
      nextStep();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Guardian Information
          </h1>

          <div className="space-y-6">
            {/* Guardian's Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guardian's Name */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Guardian &apos; s Name</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter guardian's name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>

              {/* Guardian's Email */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>📧</span>
                    <span>Guardian Email</span>
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter guardian's email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>

              {/* Phone Number */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>📱</span>
                    <span>Phone Number</span>
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>

              {/* Country */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>🌍</span>
                    <span>Country</span>
                  </span>
                </label>
                <select
                  value={guardianCountry}
                  onChange={(e) => setGuardianCountry(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                               focus:bg-white/10 focus:border-white/20 focus:ring-2 
                               focus:ring-purple-500/20 transition-all duration-200">
                  <option value="" className="bg-gray-900">Select country</option>
                  <option value="us" className="bg-gray-900">United States</option>
                  <option value="uk" className="bg-gray-900">United Kingdom</option>
                  <option value="ca" className="bg-gray-900">Canada</option>
                </select>
              </div>
            </div>

            {/* City and Language Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>🏙️</span>
                    <span>City</span>
                  </span>
                </label>
                <select
                  value={guardianCity}
                  onChange={(e) => setGuardianCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                               focus:bg-white/10 focus:border-white/20 focus:ring-2 
                               focus:ring-purple-500/20 transition-all duration-200">
                  <option value="" className="bg-gray-900">Select city</option>
                  <option value="ny" className="bg-gray-900">New York</option>
                  <option value="ld" className="bg-gray-900">London</option>
                  <option value="tk" className="bg-gray-900">Tokyo</option>
                </select>
              </div>

              {/* Language */}
              <div className="group">
                <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>🗣️</span>
                    <span>Preferred Language</span>
                  </span>
                </label>
                <select
                  value={guardianLanguage}
                  onChange={(e) => setGuardianLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                               focus:bg-white/10 focus:border-white/20 focus:ring-2 
                               focus:ring-purple-500/20 transition-all duration-200">
                  <option value="" className="bg-gray-900">Select language</option>
                  <option value="en" className="bg-gray-900">English</option>
                  <option value="ar" className="bg-gray-900">Arabic</option>
                  <option value="fr" className="bg-gray-900">French</option>
                </select>
              </div>
            </div>

            {/* Time Zone Section */}
            <div className="group">
              <label className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                <span className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>Time Zone</span>
                </span>
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                             focus:bg-white/10 focus:border-white/20 focus:ring-2 
                             focus:ring-purple-500/20 transition-all duration-200">
                <option value="" className="bg-gray-900">Select time zone</option>
                <option value="est" className="bg-gray-900">Eastern Time (ET)</option>
                <option value="pst" className="bg-gray-900">Pacific Time (PT)</option>
                <option value="gmt" className="bg-gray-900">Greenwich Mean Time (GMT)</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-3 group">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 rounded border-white/20 bg-white/10
                         checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500
                         focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
              <label htmlFor="terms" className="text-white/60 group-hover:text-white/90 text-sm transition-colors">
                I agree to the terms and conditions
              </label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Add this at the bottom of the main content div */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                       bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex space-x-2">
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === 4 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                     flex items-center space-x-2"
            onClick={nextStep}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 7 Component (Thank You Page)
const Step7 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-float"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-28 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center text-right justify-between mb-8">
        <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                     bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>
          <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg
                        hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                        flex items-center space-x-2"
                onClick={nextStep}
              >
                <span>→</span>
              </button>
            </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl text-center">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-400 to-blue-400 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Thank You!
          </h1>
          
          <p className="text-xl text-white/80 mb-8">
            Your information has been successfully submitted.
          </p>
        </div>
        
      </div>

    </div>
  );
};

// Step 8 Component
const Step8 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [classStatus, setClassStatus] = useState('Completed');
  const [studentStatus, setStudentStatus] = useState('Joined');

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Get student data from localStorage (assuming it was stored in Step2)
      const studentData = localStorage.getItem('studentData');
      
      // Prepare the data to be sent
      const submitData = {
        classStatus,
        studentStatus,
        studentData: studentData ? JSON.parse(studentData) : null,
        // Add any other data you want to include
        submittedAt: new Date().toISOString()
      };

      // Make POST request to your API
      const response = await fetch('http://localhost:5001/evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Status updated successfully:', result);

      // Optional: Show success message
      alert('Status updated successfully!');

      // Optional: Move to next step or redirect
      nextStep();

    } catch (error) {
      console.error('Error submitting status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-40 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          Robert Baratheon
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                     bg-white/10 hover:bg-white/20 rounded-lg group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            className="items-center gap-2 px-6 py-3 text-white transition-all duration-300 
                     bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 rounded-lg group hidden"
          >
            <span>Next</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Final Status Update
          </h1>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Class Status Card */}
            <div className="group">
              <label className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👨‍🏫</span>
                  <span>Class Status</span>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </label>
              <div className="relative">
                <select 
                  value={classStatus}
                  onChange={(e) => setClassStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
                            appearance-none cursor-pointer focus:outline-none focus:ring-2 
                            focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
                            hover:bg-white/10"
                >
                  <option value="Completed" className="bg-gray-900">Completed</option>
                  <option value="Not Completed" className="bg-gray-900">Not Completed</option>
                </select>
              </div>
            </div>

            {/* Student Status Card */}
            <div className="group">
              <label className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👥</span>
                  <span>Student Status</span>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </label>
              <div className="relative">
                <select 
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
                            appearance-none cursor-pointer focus:outline-none focus:ring-2 
                            focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
                            hover:bg-white/10"
                >
                  <option value="Joined" className="bg-gray-900">Joined</option>
                  <option value="Not Joined" className="bg-gray-900">Not Joined</option>
                  <option value="Waiting" className="bg-gray-900">Waiting</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl
                      hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]
                      font-semibold text-lg shadow-lg"
          >
            Submit
          </button>
        </div>

        
      </div>
    </div>
  );
};

// Main EvaluationSteps component - Update total number of steps
const EvaluationSteps: React.FC<{ userId: string }> = ({ userId }) => {
  const [step, setStep] = useState(1);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const totalSteps = 8;

  const nextStep = (data: any) => {
    console.log('Current step:', step);
    if (step < totalSteps) {
      setEvaluationData(data);
      setStep((prev) => prev + 1);
    }
  };
  
  const prevStep = () => {
    console.log('Current step:', step);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  console.log('Rendering step:', step);

  return (
    <>
      {step === 1 && <Step1 nextStep={nextStep} />}
      {step === 2 && <Step2 prevStep={prevStep} nextStep={nextStep} evaluationData={evaluationData} />}
      {step === 3 && <Step3 prevStep={prevStep} nextStep={nextStep} />}
      {step === 4 && <Step4 prevStep={prevStep} nextStep={nextStep} />}
      {step === 5 && <Step5 prevStep={prevStep} nextStep={nextStep} />}
      {step === 6 && <Step6 prevStep={prevStep} nextStep={nextStep} />}
      {step === 7 && <Step7 prevStep={prevStep} nextStep={nextStep} />}
      {step === 8 && <Step8 prevStep={prevStep} nextStep={nextStep} />}
    </>
  );
};

export default EvaluationSteps;
