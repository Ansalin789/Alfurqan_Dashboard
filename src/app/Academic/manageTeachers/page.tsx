import BaseLayout1 from '@/components/BaseLayout1';
import React from 'react';

export default function ManageTeacher() {
  return (
    <>
    <BaseLayout1>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
              </div>
              <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full flex items-center">
                <i className="fas fa-filter mr-2"></i> Filter
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full flex items-center">
                <i className="fas fa-calendar-alt mr-2"></i> Change Period
              </button>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-full flex items-center">
                <i className="fas fa-plus mr-2"></i> New Teachers
              </button>
            </div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <button className="text-gray-400">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Teacher Name</h3>
                  <p className="text-gray-600">Subject</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <i className="fas fa-star text-gray-300"></i>
                  </div>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span>Showing 10 from 46 data</span>
            <div className="flex space-x-2">
              <button className="bg-pink-500 text-white px-3 py-1 rounded-full">1</button>
              <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">2</button>
              <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">3</button>
              <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">4</button>
            </div>
          </div>
        </div>
      </div>
      </BaseLayout1>
    </>
  );
}
