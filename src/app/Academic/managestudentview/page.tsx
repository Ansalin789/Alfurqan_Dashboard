import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React from 'react';

const ManageStudentView = () => {
  return (
    <BaseLayout1>
        <div className="flex flex-col md:flex-row pt-14 pl-4 min-h-screen">
            <div className="flex flex-col items-center bg-[#fff] shadow-lg rounded-2xl w-full md:w-1/3 h-[600px]">
                <div className='bg-[#012a4a] align-middle p-6 w-full h-1/4 rounded-t-2xl '>
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
                    <div className='justify-center'>
                    <Image
                    src="/assets/images/proff.jpg"
                    alt="Profile"
                    className="rounded-full justify-center align-middle text-center ml-28 w-24 h-24 mb-4 mt-[45px]" width={150} height={150}
                    />
                    </div>
                    <div className='justify-center text-center border border-b-black'>
                        <h2 className="text-2xl font-semibold mb-2">Will Jonto</h2>
                        <p className="text-gray-500 mb-4">Student</p>
                    </div>
                    
                    <div className="text-left w-full p-2 pt-6">
                    <h3 className="font-semibold mb-2">Personal Info</h3>
                    <p className="text-gray-700"><span className="font-semibold">Full Name: </span>Will Jonto</p>
                    <p className="text-gray-700"><span className="font-semibold">Email: </span>willjontoax@gmail.com</p>
                    <p className="text-gray-700"><span className="font-semibold">Phone Number: </span>(1) 2536 2561 2365</p>
                    <p className="text-gray-700"><span className="font-semibold">Level: </span>1</p>
                    <p className="text-gray-700"><span className="font-semibold">Package: </span>Simple</p>
                    <p className="text-gray-700"><span className="font-semibold">Mother tongue: </span>English</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:ml-4 w-full md:w-2/3 md:mt-0 p-10 mt-20">
                <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-40">
                    <span className="text-blue-500 text-3xl font-semibold">97%</span>
                    <span className="text-gray-500">Attendance</span>
                </div>
                <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-40">
                    <span className="text-yellow-500 text-3xl font-semibold">64%</span>
                    <span className="text-gray-500">Performance</span>
                </div>
                <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-40">
                    <span className="text-purple-500 text-3xl font-semibold">Gold</span>
                    <span className="text-gray-500">Package</span>
                </div>
                <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-40">
                    <span className="text-pink-500 text-3xl font-semibold">245</span>
                    <span className="text-gray-500">Reward Points</span>
                </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-center w-full h-32">
                <button className="bg-blue-600 text-white p-4 rounded-full w-12 h-12 flex items-center justify-center">
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
    </BaseLayout1>
  );
};

export default ManageStudentView;
