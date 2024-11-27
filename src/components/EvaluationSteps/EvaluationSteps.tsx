'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

// Step 1 Component
const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  const steps = [
    {
      step: '1',
      title: 'James Appleseed',
      description: 'UXMISFIT.TOOLS',
      color: 'bg-transparent',
      icon: '', // No icon for the card as per the design
    },
    {
      step: '2',
      title: 'Assess',
      description: 'Assess your level with our best evaluation test exams',
      color: 'bg-blue-100',
      icon: '🖊️',
    },
    {
      step: '3',
      title: 'Schedule',
      description: 'Schedule a time for your evaluation',
      color: 'bg-orange-100',
      icon: '📅',
    },
    {
      step: '4',
      title: 'Question',
      description: 'Ask and clarify all your doubts',
      color: 'bg-red-100',
      icon: '❓',
    },
  ];

  return (
    <div className="min-h-screen p-20 bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-white">Robert Baratheon</div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-8">Purpose of Evaluation</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className={`relative p-6 rounded-lg shadow-md ${idx === 0 ? 'bg-transparent border border-gray-700 backdrop-blur-lg backdrop-filter' : item.color}`}
          >
            {idx === 0 && (
              <>
                <div className="absolute w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-30 -top-10 -right-10"></div>
                <div className="absolute w-24 h-24 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full opacity-20 -bottom-10 -left-10"></div>
              </>
            )}
            <div className="relative z-10 flex flex-col items-center text-center">
              {idx === 0 && (
                <>
                  <div className="text-sm font-semibold text-white mb-4">MEMBERSHIP</div>
                  <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                  <p className="text-lg text-white mt-2">{item.description}</p>
                </>
              )}
              {idx !== 0 && (
                <>
                  <div className="text-4xl">{item.icon}</div>
                  <h2 className="text-xl font-semibold mt-4">{item.title}</h2>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-12 text-gray-400 text-sm">
        Unlocking Knowledge Anywhere, Anytime: Let's Learn Together!
      </p>
      <button
        className="bg-[#293552] text-white px-6 py-3 rounded-lg mt-6 hover:bg-[#1f283d]"
        onClick={nextStep}
      >
        Next →
      </button>
    </div>
  );
};

// Step 2 Component
const Step2 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>
      <h1 className="text-3xl font-bold mb-8">Student Details Verification</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          'First Name',
          'Last Name',
          'Email',
          'Phone Number',
          'City',
          'Country',
          'How many Students',
          'Preferred Teacher',
          'Course',
          'Preferred Date',
          'Preferred Time',
          'Comments',
        ].map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">{field}</label>
            <input
              type="text"
              defaultValue="Robert Baratheon"
              className="border rounded-lg p-2 text-gray-600"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 0 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"onClick={nextStep}>
          Next →
        </button>
      </div>
    </div>
  );
};

// Step 3 Component
const Step3 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10">
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <select className="border rounded-lg px-3 py-2 text-gray-700 appearance-none">
          <option>Skills: Arabic</option>
        </select>
        <div className="text-gray-600 font-semibold">Skills: Reading & Listening</div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Read the following word</h1>
      <div className="text-5xl font-bold text-gray-800 mb-8">ارسلها</div>
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 1 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10">
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Abdullah Sulaiman</div>
      </div>
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <select className="border rounded-lg px-3 py-2 text-gray-700">
          <option>Skills: Arabic</option>
        </select>
        <div className="text-gray-600 font-semibold">Skills: Reading & Listening</div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Talk about yourself within two minutes</h1>
      <div className="flex items-center justify-center mb-8">
        <div className="text-5xl font-bold text-gray-800 bg-white shadow-md rounded-lg p-8">
          {formatTime(time)}
        </div>
      </div>
      <button 
        className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
        onClick={handleStart}
        disabled={isActive}
      >
        {isActive ? 'Recording...' : 'Start'}
      </button>
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 2 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// Step 5 Component
const Step5 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10">
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">Arabic Language</h1>
        
        {/* Level Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="my-beautiful-language" className="h-5 w-5" />
            <label htmlFor="my-beautiful-language" className="text-gray-800 font-semibold">
              My beautiful language
            </label>
          </div>
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option>Level: A1</option>
          </select>
        </div>

        {/* Hours Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Preferred Hours</h2>
          <div className="flex space-x-4">
            {[1, 1.5, 2, 2.5, 3, 4, 5].map((hour) => (
              <button
                key={hour}
                className={`px-4 py-2 rounded-lg ${
                  hour === 3
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Preferred Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Simple", rate: "$8/h", price: "$32" },
              { label: "Essential", rate: "$9/h", price: "$36" },
              { label: "Pro", rate: "$11/h", price: "$44" },
              { label: "Elite", rate: "$16/h", price: "$64" },
            ].map((plan) => (
              <button
                key={plan.label}
                className="p-4 border rounded-lg hover:shadow-lg text-center bg-gray-200"
              >
                <h3 className="font-bold">{plan.label}</h3>
                <p>{plan.rate}</p>
                <p className="text-sm text-gray-600">{plan.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Completion Section */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-gray-600 text-sm">
            Accomplishment Time: <span className="font-semibold">150 hours</span>
          </p>
          <p className="text-gray-600 text-sm">
            Expected Finishing Date: <span className="font-semibold">37.5 months</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end mt-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 3 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
        
    </div>
  );
};

// Step 6 Component
const Step6 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10 relative">
      {/* Logo */}
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>

      {/* Main Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">Information</h1>
        <form className="space-y-4">
          {/* Guardian's Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Guardian's Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Guardian's Email</label>
              <input
                type="email"
                placeholder="Example@gmail.com"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Phone Number and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Guardian's Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
                <option>Select country</option>
                <option>USA</option>
                <option>India</option>
                <option>UK</option>
              </select>
            </div>
          </div>

          {/* City and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
                <option>Select city</option>
                <option>New York</option>
                <option>London</option>
                <option>Delhi</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Language</label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
                <option>Select language</option>
                <option>English</option>
                <option>Arabic</option>
                <option>French</option>
              </select>
            </div>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Time Zone</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
              <option>Select time zone</option>
              <option>UTC</option>
              <option>GMT</option>
              <option>IST</option>
            </select>
          </div>
        </form>
        
      </div>
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 4 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
    </div>
  );
};


// Step 7 Component (Thank You Page)
const Step7 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10 relative">
      {/* Logo */}
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>

      {/* Thank You Message */}
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Thank you</h1>
        <p className="text-lg text-gray-600 text-center">
          Your information has been successfully submitted.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full max-w-4xl mt-8">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          onClick={prevStep}
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === 5 ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className="bg-[#293552] text-white px-6 py-3 rounded-lg hover:bg-[#1f283d]"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const Step8 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10 relative">
      {/* Logo */}
      <div className="absolute top-0 left-5 p-10">
        <Image src="/assets/images/alf1.png" alt="Logo" className="w-28" width={50} height={50} />
      </div>

      {/* User Info */}
      <div className="absolute top-5 right-5">
        <div className="text-sm font-semibold text-gray-800">Robert Baratheon</div>
      </div>
      <div className='flex gap-4 p-4 bg-[#293552] rounded-xl'>
        <div className='p-10'>
          <label className="block text-white font-medium mb-1 text-center p-4">Class Status</label>
          <select className="w-full border text-center rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 appearance-none cursor-pointer">
            <option>Joined</option>
            <option>Waiting</option>
            <option>Not Joined</option>
          </select>
        </div>

        <div className='p-10'>
          <label className="block text-white font-medium mb-1 p-4">Student Status</label>
          <select className="w-full border text-center rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 appearance-none cursor-pointer">
            <option>student1</option>
            <option>student2</option>
            <option>student3</option>
          </select>
        </div>
      </div>
      {/* Thank You Message */}

    </div>
  );
};


const EvaluationSteps: React.FC = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <>
      {step === 1 && <Step1 nextStep={nextStep} />}
      {step === 2 && <Step2 prevStep={prevStep} nextStep={nextStep} />}
      {step === 3 && <Step3 prevStep={prevStep} nextStep={nextStep} />}
      {step === 4 && <Step4 prevStep={prevStep} nextStep={nextStep} />}
      {step === 5 && <Step5 prevStep={prevStep} nextStep={nextStep} />}
      {step === 6 && <Step6 prevStep={prevStep} nextStep={nextStep} />}
      {step === 7 && <Step7 prevStep={prevStep} nextStep={nextStep}/>}
      {step === 8 && <Step8 prevStep={prevStep} nextStep={nextStep}/>}
    </>
  );
};




export default EvaluationSteps;
