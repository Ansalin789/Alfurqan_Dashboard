'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CountryDropdown } from "react-country-region-selector";
import ISO6391 from "iso-639-1";

import TimezoneSelect from "react-timezone-select";



// Define the return type of the getAllUsers function





interface AcademicCoach {
  academicCoachId: string; // Assuming it's a string or number
  name: string;
  role: string;
  email: string;
}

interface StudentData {
  _id: string; // Assuming _id is a string, or use ObjectId if you're using MongoDB
  firstName: string;
  lastName: string;
  academicCoach: AcademicCoach;
  email: string;
  phoneNumber: string; 
  city:string;// If it's a number, you can change this to `number`
  country: string;
  countryCode: string; // Assuming it's a string
  learningInterest: string; // Assuming it's a string, could be an array of strings if needed
  numberOfStudents: number; // Assuming this is a number
  preferredTeacher: string; // Assuming it's a string, or can be an object if needed
  preferredFromTime: string; // Or use `Date` if it's a Date object
  preferredToTime: string; // Or use `Date` if it's a Date object
  timeZone: string; // Assuming it's a string
  referralSource: string; // Assuming it's a string, could be an enum if fixed
  startDate: string; // Or use `Date` if it's a Date object
  evaluationStatus: string; // Assuming it's a string (e.g., "Completed", "Pending")
  status: string; // Assuming it's a string (e.g., "Active", "Inactive")
  createdDate: string; // Or use `Date` if it's a Date object
  createdBy: string; // Assuming it's a string (could be an object or ID if needed)
  lastUpdatedBy: string; // Same as createdBy
  lastUpdatedDate: string; // Or use `Date` if it's a Date object
}



// Interface for Evaluation Data
interface EvaluationData {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentCity: string;
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
      id:'step1',
      step: '1',
      title: 'Clarify',
      description: 'Clarify your interest from our experienced teacher',
      color: 'bg-gradient-to-br from-purple-600 to-blue-600',
      icon: '👋',
    },
    {
      id:'step2',
      step: '2',
      title: 'Assess',
      description: 'Assess your level with our best evaluation test exams',
      color: 'bg-gradient-to-br from-blue-500 to-teal-400',
      icon: '🖊️',
    },
    {
      id:'step3',
      step: '3',
      title: 'Schedule',
      description: 'Schedule a time for your evaluation',
      color: 'bg-gradient-to-br from-orange-400 to-pink-500',
      icon: '📅',
    },
    {
      id:'step4',
      step: '4',
      title: 'Question',
      description: 'Ask and clarify all your doubts',
      color: 'bg-gradient-to-br from-red-500 to-purple-500',
      icon: '❓',
    },
  ];




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


      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Purpose of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Evaluation</span>
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Begin your learning journey with a personalized evaluation process designed just for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.id}
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

// Step 2 Component
const Step2: React.FC<{ prevStep: () => void;
  nextStep: (data: StudentData) => void;
  studentDatas?: StudentData;  }> = ({ prevStep, nextStep, studentDatas }) => {
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
        const auth=localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5001/studentlist/${studentId}`,{
          headers: {
            'Authorization': `Bearer ${auth}`,        
              },
        });
        console.log("response>>>",response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched student data:', data);
      setStudentData(data);
      localStorage.setItem('studentData', JSON.stringify(data));
      console.log(studentData);
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
          { label: 'City', value: studentData.city || 'N/A', icon: '🌍' },
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
            onClick={()=>{
              console.log('Passing studentData to next step:', studentData)
              nextStep(studentData || {} as StudentData)}}
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
const Step3 = ({ prevStep, nextStep ,studentData}: { prevStep: () => void; nextStep: (studentData: StudentData) =>void; studentData: StudentData  }) => {
  console.log("Student Data in Step3:", studentData);
  
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
        {studentData.firstName}&nbsp;{studentData.lastName}
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
                رسلها
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
            onClick={()=>{nextStep(studentData)}}
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
const Step4 = ({ prevStep, nextStep ,studentData}: { prevStep: () => void; nextStep: (studentData: StudentData) => void;studentData:StudentData }) => {
  const [time, setTime] = useState(120); // 120 seconds = 2 minutes
  const [isActive, setIsActive] = useState(false);
   console.log(studentData);
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
        {studentData.firstName}&nbsp;{studentData.lastName}
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
            onClick={()=>{nextStep(studentData)}}
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



// Step 5 Component
const Step5 = ({ prevStep, nextStep ,studentData}: { prevStep: () => void; nextStep: (updatedStudentData:any ) => void;studentData:StudentData }) => {
  const [isLanguageChecked, setIsLanguageChecked] = useState(false);
  const [isReadingChecked, setIsReadingChecked] = useState(false);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const[languageLevel,setLanguageLevel]=useState("");
  const[readingLevel,setReadingLevel]=useState("");
  const[grammarLevel,setGrammarLevel]=useState<string>("");
  const [accomplishmentTime, setAccomplishmentTime] = useState<number>(0);
  const[studentRate,setStudentRate]=useState(0);
  const[expectedFinishingDate]=useState(28);
  const[subscriptionName,setSubscriptionName]=useState<string>();
   const[planTotalPrice,setPlanTotalPrice]=useState<number>();
  const [selectedHours, setSelectedHours] = useState<number>(3); // Default to 3 hours

  // First, add state to track which plan's total is being calculated
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
   console.log(selectedPlan);
  // Modify the calculatePrice function to return null if plan isn't selected
  const calculatePrice = (rate: number, planLabel: string) => {
    if (selectedPlan !== planLabel) {
      return "";
    }
    return selectedHours * rate * 4;
  };
  useEffect(() => {
    // Only set planTotalPrice when a plan is selected
    if (selectedPlan) {
      const plan = pricingPlans.find(p => p.label === selectedPlan);
      if (plan) {
       const price= calculatePrice(plan.rate, plan.label);
       setPlanTotalPrice(price || 0);
      }
    }
  }, [selectedPlan, selectedHours]); 

  // Pricing plans data
  const pricingPlans = [
    { label: "Simple", rate: 8, basePrice: "$8/h"},
    { label: "Essential", rate: 9, basePrice: "$9/h"},
    { label: "Pro", rate: 11, basePrice: "$11/h"},
    { label: "Elite", rate: 16, basePrice: "$16/h"},
  ];
  const handleNextStep = () => {
    const updatedStudentData = {
      ...studentData, 
      isLanguageChecked,
      isReadingChecked,
      isGrammarChecked,
      languageLevel,
      readingLevel,
      grammarLevel,
      accomplishmentTime,
      studentRate,
      expectedFinishingDate,
      subscriptionName,
      selectedHours,
      planTotalPrice,
    };
    nextStep(updatedStudentData); // Pass updated data to nextStep
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
          {studentData.firstName}&nbsp;{studentData.lastName}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Arabic Language Course Selection
          </h1>

          <h2 className="text-white/90 font-normal hover:text-white transition-colors mb-4">Level</h2>

          {/* Level Section */}
          <div className="flex items-center justify-between mb-8 bg-white/5 p-4 rounded-xl">
            {/* My Beautiful Language Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="my-beautiful-language" 
                  checked={isLanguageChecked}
                  onChange={(e) => setIsLanguageChecked(e.target.checked)}
                  className="w-3 h-3 border-white/20 bg-white/10
                           checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />&nbsp; &nbsp;
                <label htmlFor="my-beautiful-language" className="text-white/90 font-normal text-[12px] hover:text-white transition-colors">
                  My Beautiful Language
                </label>
              </div>
              {isLanguageChecked && (
                <select className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
                                focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]" onChange={(e)=>setLanguageLevel(e.target.value)}>
                  
                  <option className="bg-gray-900">Level: A1</option>
                  <option className="bg-gray-900">Level: A2</option>
                  <option className="bg-gray-900">Level: A3</option>
                  <option className="bg-gray-900">Level: A4</option>
                </select>
              )}
            </div>
            
            {/* Reading Section */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reading"
                checked={isReadingChecked}
                onChange={(e) => setIsReadingChecked(e.target.checked)}
                className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="reading" className="text-white font-normal text-[12px]">
                Reading
              </label>
              {isReadingChecked && (
                <select className="bg-white/10 text-white/90 border border-white/20 rounded-lg px-4 py-2
                                focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]" onChange={(e)=>setReadingLevel(e.target.value)}>
                  <option className="bg-gray-900">1</option>
                  <option className="bg-gray-900">2</option>
                  <option className="bg-gray-900">3</option>
                  <option className="bg-gray-900">4</option>
                  <option className="bg-gray-900">5</option>
                </select>
              )}
            </div>

            {/* Grammar Section */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="grammar"
                checked={isGrammarChecked}
                onChange={(e) => setIsGrammarChecked(e.target.checked)}
                className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="grammar" className="text-white font-normal text-[12px]">
                Grammar
              </label>
              {isGrammarChecked && (
                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2
                                focus:ring-2 focus:ring-purple-500/20 focus:border-white/30 transition-all duration-200 text-[12px]" onChange={(e)=>setGrammarLevel(e.target.value)}>
                  <option className="bg-gray-900">0</option>
                  <option className="bg-gray-900">1</option>
                  <option className="bg-gray-900">2</option>
                  <option className="bg-gray-900">3</option>
                  <option className="bg-gray-900">4</option>
                  <option className="bg-gray-900">5</option>
                </select>
              )}
            </div>
          </div> 

          {/* Hours Section */}
          <div className="mb-8">
            <h2 className="text-base font-normal text-white/90 mb-4">Select Preferred Hours / week</h2>
            <div className="flex flex-wrap gap-3">
              {[1, 1.5, 2, 2.5, 3, 4, 5].map((hour) => (
                <button
                  key={hour}
                  onClick={() => {setSelectedHours(hour); setAccomplishmentTime(hour*4);setStudentRate(hour)}}
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
      <h2 className="text-base font-normal text-white/90 mb-4">Select Preferred Pricing per month</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pricingPlans.map((plan) => (
          
          <button
            key={plan.label}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
            onClick={() => {
              if (selectedHours > 0) {
                setSelectedPlan(plan.label);
                setSubscriptionName(plan.label); // Set the selected plan when clicked
              } else {
                alert('Please select preferred hours first'); // Alert if no hours are selected
              }
            }}
          >
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10
                            group-hover:border-white/20 transition-all duration-300">
              {/* Plan Name Section */}
              <div className="border-b border-white/10 pb-3 mb-3">
                <h3 className="text-sm font-bold text-white">{plan.label}</h3>
              </div>
              
              {/* Rate Per Hour Section */}
              <div className="border-b border-white/10 pb-3 mb-3">
                <div className="text-lg text-center font-bold text-transparent bg-clip-text bg-gradient-to-r 
                                from-blue-400 to-purple-400">
                  {plan.basePrice}
                </div>
              </div>
              
              {/* Total Section */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 mb-1">Total</div>
                <div className="text-xl font-semibold text-white">
                {
                  (() => {
                    if (selectedPlan === plan.label && planTotalPrice !== undefined) {
                     return `$${planTotalPrice.toFixed(2)}`;
                       }
                           return ''; // Return an empty string if conditions are not met
                    })()
                   }
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>

          {/* Completion Section */}
          <div className="flex flex-wrap items-center justify-between mt-8 bg-white/5 p-4 rounded-xl">
            <div className="text-white/80 text-[13px]">
              Accomplishment Time: <span className="font-normal text-white text-[11px]">{accomplishmentTime} Hours</span>
            </div>
            <div className="text-white/80 text-[13px]">
              Your Rate: <span className="font-normal text-white text-[11px]">{studentRate} hr/week</span>
            </div>
            <div className="text-white/80 text-[13px]">
              Expected Finishing Date: <span className="font-normal text-[11px] text-white">28 Days</span>
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
            onClick={handleNextStep}
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
const Step6 = ({ prevStep, nextStep,updatedStudentData }: { prevStep: (updatedStudentData:any) => void; nextStep: (updatedStudentDatas: any) => void;updatedStudentData:any }) => {
  console.log(updatedStudentData);
  interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface ScheduleItem {
  day: string;
  times: TimeSlot[];
  isSelected: boolean;
}
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  interface Teacher {
    _id: string;
    userName: string;
    email: string;
    password: string;
    role: string[]; // Array of roles, e.g., "TEACHER"
    profileImage: string | null; // Could be a URL or null
    status: string; // Active/Inactive status
    createdBy: string; // Who created the record
    lastUpdatedBy: string; // Who last updated the record
    userId: string; // Unique ID for the user
    lastLoginDate: string; // Last login timestamp
    createdDate: string; // Creation timestamp
    lastUpdatedDate: string; // Last update timestamp
}
  useEffect(
    () => {
      const fetchTeachers = async () => {
        try {
          const auth=localStorage.getItem('authToken');
          const response = await fetch('http://alfurqanacademy.tech:5001/users?role=TEACHER', {
            headers: {
                   'Authorization': `Bearer ${auth}`,
            },
          });
          const data = await response.json();
  
          console.log('Fetched data:', data);
  
          // Access `users` array in the response
          if (data && Array.isArray(data.users)) {
            setTeachers(data.users);
          } else {
            console.error('Unexpected API response structure:', data);
          }
        } catch (error) {
          console.error('Error fetching teachers:', error);}
        }
        fetchTeachers();
},[]);
const handleNextStep = () => {
  const updatedStudentDatas = {
    ...updatedStudentData,
    teacher: {
      teacherId: selectedTeacher?._id ?? "",
      teacherName: selectedTeacher?.userName ?? "",
      teacherEmail: selectedTeacher?.email ?? "",
    },
    classDay: schedule.filter((item) => item.isSelected).map((item) => ({
      label: item.day,
      value: item.day,
    })),
    startTime: schedule
      .filter((item) => item.isSelected)
      .flatMap((item) =>
        item.times.map((time) => ({
          label: time.startTime,
          value: time.startTime,
        }))
      ),
    endTime: schedule
      .filter((item) => item.isSelected)
      .flatMap((item) =>
        item.times.map((time) => ({
          label: time.endTime,
          value: time.endTime,
        }))
      ),
  };
  nextStep(updatedStudentDatas); // Pass updated data to nextStep
};
interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface ScheduleItem {
  day: string;
  times: TimeSlot[];
  isSelected: boolean;
}
const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

const [schedule, setSchedule] = useState<ScheduleItem[]>(
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
    day,
    times: [], // Array of start and end times
    isSelected: false,
  }))
);
const handleAddTimeSlot = (index: number) => {
  const updatedSchedule = [...schedule];

  // Prevent duplicate empty slots
  if (
    updatedSchedule[index].times.some((slot) => slot.startTime === "" || slot.endTime === "")
  ) {
    return;
  }

  // Add an empty time slot (user must fill it manually)
  updatedSchedule[index].times.push({ startTime: "", endTime: "" });
  setSchedule(updatedSchedule);
};

const handleTimeChange = (
  dayIndex: number,
  timeIndex: number,
  field: "startTime" | "endTime",
  value: string
) => {
  const updatedSchedule = [...schedule];
  updatedSchedule[dayIndex].times[timeIndex][field] = value;
  setSchedule(updatedSchedule);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-28 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          {updatedStudentData.firstName} &nbsp; {updatedStudentData.lastName}
        </div>
      </div>
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Schedule Classes</h2>
          <div className="grid grid-cols-3 grid-rows-3 gap-2">
  {/* Schedule Selection */}
  {schedule.map((item, index) => (
  <div key={item.day} className="flex flex-col justify-between p-1 border rounded-lg border-[#D4D6D9] bg-[#f7f7f8] w-50 min-h-16">
    {/* Day Name + Checkbox */}
    <div className="flex items-center justify-between">
      <label className="font-medium text-[#333B4C] text-xs">{item.day}</label>
      <input
        type="checkbox"
        className="w-3 h-3"
        checked={item.isSelected}
        onChange={() => {
          const updatedSchedule = [...schedule];
          updatedSchedule[index].isSelected = !updatedSchedule[index].isSelected;
          setSchedule(updatedSchedule);
        }}
      />
    </div>

    {/* Time Slots (Shown Only If Day is Selected) */}
    {item.isSelected && (
      <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-24 scrollbar-hidden scroll-smooth">
        {item.times.map((time, timeIndex) => (
          <div key={timeIndex} className="flex items-center space-x-1 text-xs">
            <input
              type="time"
              value={time.startTime}
              onChange={(e) => handleTimeChange(index, timeIndex, "startTime", e.target.value)}
              className="form-input p-1 border rounded-lg w-20 h-6 text-xs"
            />
            <span>-</span>
            <input
              type="time"
              value={time.endTime}
              onChange={(e) => handleTimeChange(index, timeIndex, "endTime", e.target.value)}
              className="form-input p-1 border rounded-lg w-20 h-6 text-xs"
            />
          </div>
        ))}
        <button
          onClick={() => handleAddTimeSlot(index)}
          className="mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-lg text-xs"
        >
          + Add
        </button>
      </div>
    )}
  </div>
))}

    

  {/* Teacher Selection */}
  <div className="col-span-3 flex justify-center">
    <div className="w-40 min-h-16 flex flex-col justify-center">
      <label htmlFor="select-teacher" className="block font-medium text-black text-xs">Select Teacher</label>
      <select 
  className="form-select w-full text-xs border border-[#D4D6D9] bg-[#f7f7f8] p-1 rounded-lg"
  onChange={(e) => {
    const selected = teachers.find((teacher) => teacher.userId === e.target.value);
    setSelectedTeacher(selected || null);
  }}
>
  <option value="">Select a Teacher</option>
  {teachers.map((teacher) => (
    <option key={teacher.userId} value={teacher.userId}>
      {teacher.userName}
    </option>
  ))}
</select>
    </div>
  </div>
</div>


         
          </div>
        </div>
        
        

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mt-4">
        <div className="flex items-center text-right justify-between mb-8">
        <button
            onClick={()=>prevStep(updatedStudentData)}
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
                onClick={handleNextStep}
              >
                <span>→</span>
              </button>
            </div>
      </div>
    </div>
  );
};


// Step 6 Component
const Step7 = ({ prevStep, nextStep, updatedStudentDatas }: { prevStep: () => void; nextStep: (updatedStudentDatass:any) => void; updatedStudentDatas:any }) => {
  const [guardianName, setGuardianName] = useState<string>('');
  const [guardianEmail, setGuardianEmail] = useState<string>('');
  const [guardianPhone, setGuardianPhone] = useState<string>('');
  const [guardianCountry, setGuardianCountry] = useState<string>('');
  const [guardianCity, setGuardianCity] = useState<string>('');
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [guardianTimeZone, setGuardianTimeZone] = useState<string>(defaultTimezone);
  const [cities, setCities] = useState ([]);
  const countriesCities = require("countries-cities");
  const [guardianLanguage, setGuardianLanguage] = useState("");

  
  




  // Get all languages
  const languages = ISO6391.getAllNames();
  const languageCodes = ISO6391.getAllCodes();

    console.log(updatedStudentDatas);
    const handleNextStep = () => {
      const updatedStudentDatass = {
        ...updatedStudentDatas,
        guardianName,
        guardianEmail,
        guardianPhone,
        guardianCountry,
        guardianCity,
        guardianLanguage,
        guardianTimeZone,
      };
      nextStep(updatedStudentDatass); // Pass updated data to nextStep
    };

    useEffect(() => {
      const fetchedCities = countriesCities.getCities(guardianCountry);
      setCities(fetchedCities);
      setGuardianCity("")
    }, [guardianCountry]);


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
         {updatedStudentDatas.firstName} &nbsp;{updatedStudentDatas.lastName}
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
                <label htmlFor="guardian-name" 
                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Guardian&apos;s Name</span>
                  </span>
                <input
                  id="guardian-name" 
                  type="text"
                  placeholder="Enter guardian's name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200" 
                           aria-labelledby="guardian-name" 
                />
                </label>

              </div>

              {/* Guardian's Email */}
              <div className="group">
                <label htmlFor='guardianEmail' className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>📧</span>
                    <span>Guardian Email</span>
                  </span>
                <input
                  type="text"
                  placeholder="Enter guardian's email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                           aria-labelledby="guardian-email" 

                />
                </label>
              </div>

              {/* Phone Number */}
              <div className="group">
                <label htmlFor='guardianPhone'
                   className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>📱</span>
                    <span>Phone Number</span>
                  </span>
                
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                           placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                           focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                           aria-labelledby="guardian-phone" 
                           
                />
                </label>
              </div>

              {/* Country */}
              <div className="group relative">
                    <label
                      htmlFor="guardianCountry" aria-label="Select your country"
                      className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-0 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Country</span>
                      </span>
                    </label>
                    <CountryDropdown
                      value={guardianCountry}
                      onChange={(val) => { 
                        setGuardianCountry(val)
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                                placeholder-white/30 focus:bg-white/10 focus:border-white/20 
                                focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 
                                text-[13px] font-semibold appearance-none cursor-pointer"
                      style={{
                        backgroundColor: "", // Background of the select
                        color: "white", // Text color of the select
                      }}
                    />
                    {/* Inline styles for options (workaround using JS) */}
                    <style>
                      {`
                        select option {
                          background-color: black !important; 
                          color: white !important;
                        }
                      `}
                    </style>
                  </div>
              </div>  

            {/* City and Language Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="group">
                <label  htmlFor='guardianCity' aria-label="Select your countrys"
                    className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-0 transition-colors">
                  <span className="flex items-center gap-2">
                    <span>🏙️</span>
                    <span>City</span>
                  </span>
                
                </label>
                <select
                  id="city"
                  value={guardianCity}
                  onChange={(e) => setGuardianCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                              focus:bg-white/10 focus:border-white/20 focus:ring-2 
                              focus:ring-purple-500/20 transition-all duration-200"
                              aria-labelledby="city"
                >
                  <option value="" className="bg-gray-900">
                      Select a city
                    </option>
                  {cities?.map((cityName) => (
                    <option key={cityName} value={cityName} className="bg-gray-900">
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="group">
                <label
                  htmlFor="guardianLanguage"
                  className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🗣️</span>
                    <span>Preferred Language</span>
                  </span>
                  <select
                    value={guardianLanguage}
                    onChange={(e) => setGuardianLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white
                              focus:bg-white/10 focus:border-white/20 focus:ring-2 
                              focus:ring-purple-500/20 transition-all duration-200"
                    aria-labelledby="guardian-language"
                  >
                    <option value="" className="bg-gray-900">
                      Select language
                    </option>
                    {languages.map((lang, index) => (
                      <option key={languageCodes[index]} value={languageCodes[index]} className="bg-gray-900">
                        {lang}
                      </option>
                    ))}
                  </select>
                </label>
                
              </div>
            </div>

            {/* Time Zone Section */}
            <div className="group relative">
                <label
                  htmlFor="guardianTimeZone" aria-label="Select your countrzczy"
                  className="block text-white/60 group-hover:text-white/90 text-sm font-semibold mb-2 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🕒</span>
                    <span>Time Zone</span>
                  </span>
                </label>

                <TimezoneSelect
                    value={{ value: guardianTimeZone, label: guardianTimeZone.replace("_", " ") }}
                    onChange={(timezone) => setGuardianTimeZone(timezone.value)} // ✅ Store only string
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "#444A60", // ✅ Input box background color
                        borderColor: "#444A60", // ✅ Border color
                        color: "#fff", // ✅ Text color inside input
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: "#444A60", // ✅ Dropdown menu background color
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? "#5A6080" : "#444A60", // ✅ Hover & default color
                        color: "#fff", // ✅ Text color
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "#fff", // ✅ Selected value text color
                      }),
                    }}
                  />
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
            onClick={handleNextStep}
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
const Step8 = ({ prevStep, nextStep,updatedStudentDatass }: { prevStep: (updatedStudentDatass:any) => void; nextStep: (updatedStudentDatass: any) => void;updatedStudentDatass:any }) => {
  console.log(updatedStudentDatass);
  const handlenextstep=()=>{
    nextStep(updatedStudentDatass);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Animated Background Circles */}
      {/* <div className="absolute inset-0 overflow-hidden">
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
      </div> */}

      {/* Logo */}
      <div className="absolute top-0 left-5 p-10 hover:scale-105 transition-transform">
        <Image src="/assets/images/whitelogo.png" alt="Logo" className="w-28 drop-shadow-2xl" width={100} height={100} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          {updatedStudentDatass.firstName} &nbsp; {updatedStudentDatass.lastName}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center text-right justify-between mb-8">
        <button
            onClick={()=>prevStep(updatedStudentDatass)}
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
                onClick={handlenextstep}
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
const Step9 = ({ prevStep, nextStep,updatedStudentDatass }: { prevStep: () => void; nextStep: (data?: any) => void;updatedStudentDatass:any }) => {
  const router = useRouter();
  const [classStatus, setClassStatus] = useState('Completed');
  const [studentStatus, setStudentStatus] = useState('Joined');
   console.log(updatedStudentDatass);
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      console.log(">>>",updatedStudentDatass.academicCoach.academicCoachId)
      const submitData = {
        academicCoachId:updatedStudentDatass.academicCoach.academicCoachId,
        student: {
          studentId: updatedStudentDatass._id,
          studentFirstName: updatedStudentDatass.firstName,
          studentLastName: updatedStudentDatass.lastName,
          studentEmail: updatedStudentDatass.email,
          studentPhone: updatedStudentDatass.phoneNumber,
          studentCity: updatedStudentDatass.city ?? 'N/A',
          studentCountry: updatedStudentDatass.country,
          studentCountryCode: updatedStudentDatass.countryCode,
          learningInterest: updatedStudentDatass.learningInterest,
          numberOfStudents: updatedStudentDatass.numberOfStudents,
          preferredTeacher: updatedStudentDatass.preferredTeacher,
          preferredFromTime: updatedStudentDatass.preferredFromTime,
          preferredToTime: updatedStudentDatass.preferredToTime,
          timeZone: updatedStudentDatass.timeZone,
          referralSource: updatedStudentDatass.referralSource,
          preferredDate: updatedStudentDatass.startDate,
          evaluationStatus:'COMPLETED',
          status: updatedStudentDatass.status,
          createdDate: updatedStudentDatass.createdDate,
          createdBy: updatedStudentDatass.createdBy,
        },
        isLanguageLevel: updatedStudentDatass.isLanguageChecked,
        languageLevel: updatedStudentDatass.languageLevel,
        isReadingLevel: updatedStudentDatass.isReadingChecked,
        readingLevel: updatedStudentDatass.readingLevel,
        isGrammarLevel: updatedStudentDatass.isGrammarChecked,
        grammarLevel: updatedStudentDatass.grammarLevel,
        hours: updatedStudentDatass.selectedHours,
        subscription: {
          subscriptionName: updatedStudentDatass.subscriptionName,
        },
        teacher:{
          teacherId:updatedStudentDatass.teacher.teacherId,
          teacherName:updatedStudentDatass.teacher.teacherName,
          teacherEmail:updatedStudentDatass.teacher.teacherEmail,
        },
        classDay:updatedStudentDatass.classDay,
        startTime:updatedStudentDatass.startTime,
        endTime:updatedStudentDatass.endTime,
        planTotalPrice: updatedStudentDatass.planTotalPrice,
        classStartDate: updatedStudentDatass.startDate,
        classEndDate: updatedStudentDatass.classEndDate,
        classStartTime: updatedStudentDatass.preferredFromTime,
        classEndTime: updatedStudentDatass.preferredToTime,
        accomplishmentTime: updatedStudentDatass.accomplishmentTime.toString(),
        studentRate: updatedStudentDatass.studentRate,
        expectedFinishingDate: updatedStudentDatass.expectedFinishingDate,
        gardianName: updatedStudentDatass.guardianName,
        gardianEmail: updatedStudentDatass.guardianEmail,
        gardianPhone: updatedStudentDatass.guardianPhone.toString(),
        gardianCity: updatedStudentDatass.guardianCity,
        gardianCountry: updatedStudentDatass.guardianCountry,
        gardianTimeZone: updatedStudentDatass.guardianTimeZone,
        gardianLanguage: updatedStudentDatass.guardianLanguage,
        assignedTeacher: updatedStudentDatass.assignedTeacher,
        studentStatus: studentStatus,
        classStatus: classStatus,
        trialClassStatus: updatedStudentDatass.trialClassStatus,
        status: updatedStudentDatass.status,
        createdDate: updatedStudentDatass.createdDate,
        createdBy: updatedStudentDatass.academicCoach.name,
        updatedDate: new Date().toISOString(),
        updatedBy:"system", // or replace with the current user's email/ID
      };
      console.log("Payload being sent:", JSON.stringify(submitData, null, 2));
      const auth=localStorage.getItem('authToken');
      // Make POST request to your API
      const response = await fetch(`http://localhost:5001/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,  
        },
        body: JSON.stringify(submitData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Server error details:', errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Status updated successfully:', result);
      alert('Status updated successfully!');
      router.push("/Academic/trailSection");
  
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
         {updatedStudentDatass.firstName} &nbsp;{updatedStudentDatass.lastName}
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
              <label htmlFor='classstatus' className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👨‍🏫</span>
                  <span>Class Status</span>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
             
              <div className="relative">
                <select 
                  value={classStatus}
                  onChange={(e) => setClassStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
                            appearance-none cursor-pointer focus:outline-none focus:ring-2 
                            focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
                            hover:bg-white/10"
                            aria-labelledby="classstatus" 
                >
                  <option value="Completed" className="bg-gray-900">Completed</option>
                  <option value="Not Completed" className="bg-gray-900">Not Completed</option>
                </select>
              </div>
              </label>
            </div>

            {/* Student Status Card */}
            <div className="group">
              <label  htmlFor='studentstatus' className="block text-white/60 group-hover:text-white/90 text-lg font-semibold mb-4 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👥</span>
                  <span>Student Status</span>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
             
              <div className="relative">
                <select 
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white
                            appearance-none cursor-pointer focus:outline-none focus:ring-2 
                            focus:ring-purple-500/20 focus:border-white/20 transition-all duration-200
                            hover:bg-white/10"
                            aria-labelledby="studentstatus"
                            
                >
                  <option value="Joined" className="bg-gray-900">Joined</option>
                  <option value="Not Joined" className="bg-gray-900">Not Joined</option>
                  <option value="Waiting" className="bg-gray-900">Waiting</option>
                </select>
              </div>
              </label>
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
  const [studentData, setStudentData] = useState<StudentData>();
   const[updatedStudentData,setUpdatedStudentData]=useState<any>(null);
   const[updatedStudentDatas,setUpdatedStudentDatas]=useState<any>(null);
   const[updatedStudentDatass,setUpdatedStudentDatass]=useState<any>({});
  const totalSteps = 9;

  const nextStep = (data: any) => {
    console.log('Current step:', step);
    if (step === 2 && 3 && 4) {
      setStudentData(data); // Store studentData when moving to the next step
    }
    if(step === 5){
      setUpdatedStudentData(data);
    }
    if(step === 6 || step === 7  ){
      setUpdatedStudentDatas(data);
      setUpdatedStudentDatass(data);
    }
    if(step === 8 || step === 9)  {
      setUpdatedStudentDatass(data);
    }
    if (step < totalSteps) {
      setStudentData(data);
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
    {step === 2 && (
      <Step2
        prevStep={prevStep}
        nextStep={(data: StudentData) => nextStep(data)}
        studentDatas={studentData ?? {} as StudentData} // Handle undefined
      />
    )}
    {step === 3 && (
      <Step3
        prevStep={prevStep}
        nextStep={(data: StudentData) => nextStep(data)}
        studentData={studentData ?? {} as StudentData}
      />
    )}
    {step === 4 && (
      <Step4
        prevStep={prevStep}
        nextStep={(data: StudentData) => nextStep(data)}
        studentData={studentData ?? {} as StudentData}
      />
    )}
    {step === 5 && (
      <Step5
        prevStep={prevStep}
        nextStep={(data: StudentData) => nextStep(data)}
        studentData={studentData ?? {} as StudentData}
      />
    )}
    {step === 6 && (
      <Step6
        prevStep={prevStep}
        nextStep={(data: any) => nextStep(data)}
        updatedStudentData={updatedStudentData}
      />
    )}
    {step === 7 && (
      <Step7
        prevStep={prevStep}
        nextStep={(data: any) => nextStep(data)}
        updatedStudentDatas={updatedStudentDatas}
      />
    )}
    {step === 8 && (
      <Step8
        prevStep={prevStep}
        nextStep={nextStep}
        updatedStudentDatass={updatedStudentDatass}
      />
    )}
     {step === 9 && (
      <Step9
        prevStep={prevStep}
        nextStep={(data: any) => nextStep(data)}
        updatedStudentDatass={updatedStudentDatass}
      />
    )}
  </>
);
};

export default EvaluationSteps;
