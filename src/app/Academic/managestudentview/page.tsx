'use client'


import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { IoArrowBackCircleSharp } from "react-icons/io5";


const ManageStudentView = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <BaseLayout1>
      <div className="flex flex-col md:flex-row pt-14 pl-4 min-h-screen">
        <div className='p-2'>
            <IoArrowBackCircleSharp className='size-[25px] bg-[#fff] rounded-full text-[#012a4a]'/>
        </div>
        <div className="flex flex-col items-center bg-[#fff] shadow-lg rounded-2xl md:w-[300px] h-[600px]">
          <div className="bg-[#012a4a] align-middle p-6 w-full h-1/4 rounded-t-2xl">
            <div className="w-full flex justify-end">
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.293 6.293a1 1 0 011.414 0l1 1a1 1 0 010 1.414l-12 12a1 1 0 01-.39.22l-4 1a1 1 0 01-1.22-1.22l1-4a1 1 0 01.22-.39l12-12z"
                  />
                </svg>
              </button>
            </div>
            <div className="justify-center">
              <Image
                src="/assets/images/proff.jpg"
                alt="Profile"
                className="rounded-full justify-center align-middle text-center ml-28 w-24 h-24 mb-4 mt-[45px]"
                width={150}
                height={150}
              />
            </div>
            <div className="justify-center text-center border border-b-black">
              <h2 className="text-2xl font-semibold mb-2">Will Jonto</h2>
              <p className="text-gray-500 mb-4">Student</p>
            </div>

            <div className="text-left w-full p-2 pt-6">
              <h3 className="font-semibold mb-2">Personal Info</h3>
              <p className="text-gray-700">
                <span className="font-semibold">Full Name: </span>Will Jonto
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email: </span>willjontoax@gmail.com
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Phone Number: </span>(1) 2536 2561 2365
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Level: </span>1
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Package: </span>Simple
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Mother tongue: </span>English
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:ml-28 w-full md:w-2/3 md:mt-0 p-10 -mt-10">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-blue-500 text-3xl font-semibold">97%</span>
                <span className="text-gray-500">Attendance</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-yellow-500 text-3xl font-semibold">64%</span>
                <span className="text-gray-500">Performance</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-purple-500 text-3xl font-semibold">Gold</span>
                <span className="text-gray-500">Package</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-pink-500 text-3xl font-semibold">245</span>
                <span className="text-gray-500">Reward Points</span>
              </div>
            </div>
          </div>

          <div className="bg-white ml-7 shadow-lg rounded-lg p-6 flex items-center justify-center text-center align-middle w-[500px] h-32">
            <button
              className="bg-[#012a4a] text-white p-4 rounded-full w-12 h-12 flex items-center justify-center"
              onClick={openModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Schedule Classes Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 w-[800px] h-[500px] overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Schedule Classes</h2>
          <div className='grid grid-cols-2'>
            <div className="grid grid-cols-3 gap-4 p-10">
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">S</label>
                    <input type="checkbox" className="form-checkbox text-[12px]" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Monday</label>
                    <input type="checkbox" className="form-checkbox" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Time</label>
                    <input type="time" className="form-input w-full" />
                </div>
                <div className='flex'>
                    <label className="block font-medium text-gray-700 mb-1 text-[12px]">Duration</label>
                    <input type="text" className="form-input w-full" placeholder="Duration" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                <label className="block font-medium text-gray-700 mb-1">Package</label>
                <input type="text" className="form-input w-full" placeholder="Simple" />
                </div>
                <div>
                <label className="block font-medium text-gray-700 mb-1">Total Hours</label>
                <input type="number" className="form-input w-full" placeholder="1" />
                </div>
                <div>
                <label className="block font-medium text-gray-700 mb-1">Preferred Teacher</label>
                <select className="form-select w-full">
                    <option>Male</option>
                    <option>Female</option>
                </select>
                </div>
                <div>
                <label className="block font-medium text-gray-700 mb-1">Course</label>
                <select className="form-select w-full">
                    <option>Arabic</option>
                    <option>English</option>
                </select>
                </div>
                <div>
                <label className="block font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" className="form-input w-full" />
                </div>
                <div>
                <label className="block font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" className="form-input w-full" />
                </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </BaseLayout1>
  );
};

export default ManageStudentView;
