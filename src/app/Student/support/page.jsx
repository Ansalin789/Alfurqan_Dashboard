'use client'

import BaseLayout2 from '@/components/BaseLayout2';
import React, { useState } from 'react';

export default function Support() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <>
    <BaseLayout2>
      <div className="flex h-screen">

        {/* Main Content */}
        <div className="flex-1 p-10 flex flex-col space-y-1">

          <h1 className="text-xl font-bold text-gray-800">Support</h1>

          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Admin</h2>
              <button className="flex items-center border border-gray-400 rounded-lg px-6 py-3 mb-3">
                <i className="fab fa-whatsapp text-xl text-green-500 mr-3"></i> Continue with WhatsApp
              </button>
              <button className="flex items-center border border-gray-400 rounded-lg px-6 py-3 mb-3">
                <i className="fas fa-envelope text-xl text-gray-600 mr-3"></i> Continue with Email
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Teacher</h2>
              <button className="flex items-center border border-gray-400 rounded-lg px-6 py-3">
                <i className="fab fa-whatsapp text-xl text-green-500 mr-3"></i> Continue with WhatsApp
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="grid grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
              <h2 className="text-xl font-bold mb-4">FAQ</h2>
              <div>
                {faqData.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 mb-2">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full flex justify-between items-center py-3 text-left text-gray-700 font-semibold focus:outline-none"
                    >
                      {faq.question}
                      <span>{activeQuestion === index ? '-' : '+'}</span>
                    </button>
                    {activeQuestion === index && (
                      <div className="p-2 text-gray-600">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Support Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-robot text-blue-500 mr-3"></i> Chat Support <span className="ml-2 text-green-500">• Online</span>
              </h2>
              <div className="flex-1 mb-4">
                {/* Chat messages */}
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-800">There are many programming languages that are used in designing...</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-800">So explain to me more...</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-800">These languages have different strengths...</p>
                  </div>
                </div>
              </div>
              {/* Input message */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Write your message"
                  className="w-full border border-gray-300 rounded-full py-3 px-5"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout2>
    </>
  );
}

const faqData = [
  { question: 'How do I access the Tajweed Masterclass learning platform?', answer: 'To access the platform...' },
  { question: 'What if I forget my password?', answer: 'If you forget your password...' },
  { question: 'Are the Tajweed lessons recorded?', answer: 'Yes, all lessons are recorded...' },
  { question: 'Who do I contact if I have technical issues?', answer: 'You can contact our support team...' },
  { question: 'What should I do if I miss a live class?', answer: 'If you miss a live class...' },
  { question: 'How do I provide feedback about the course?', answer: 'You can provide feedback by...' },
];
