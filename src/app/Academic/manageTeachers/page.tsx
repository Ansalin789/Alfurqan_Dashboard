import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { LiaStarSolid } from "react-icons/lia";


export default function ManageTeacher() {
  return (
      <BaseLayout1>
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg p-2 mx-4 shadow`}
                />
                <button
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
              <button
                  className={`border p-2 rounded-lg shadow flex items-center mx-4 bg-[#111317] text-white`}
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow `}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
            {/* Cards */}
            <div className="grid grid-cols-7 gap-6 p-10 ">
              {Array.from({ length: 14 }).map((_, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <Image
                      src={`/assets/images/proff.jpg${index}.jpg`}
                      alt="Teacher"
                      className="w-16 h-16 rounded-full"
                    />
                    <button className="text-gray-400">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold">Angela Moss</h3>
                    <p className="text-gray-600">Level: 3</p>
                    <p className="text-gray-600">Arabic Language</p>
                    <div className='flex'>
                    <LiaStarSolid /><LiaStarSolid /><LiaStarSolid /><LiaStarSolid /><LiaStarSolid />
                    </div>
                    
                    <div className="flex justify-center items-center mt-2">
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      <i className="fas fa-star text-gray-300"></i>
                    </div>
                    <button className="mt-4 text-[12px] bg-[#111317] text-white px-4 py-2 rounded-xl">
                      View Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseLayout1>
  );
}
