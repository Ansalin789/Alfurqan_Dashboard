'use client'


import BaseLayout from '@/components/BaseLayout'
import React from 'react';
import PdfCard from '@/app/student/components/knowlegdebase/PdfCard';
import { FiFilter } from "react-icons/fi";
import { GrShare } from "react-icons/gr";
import RecordedClassesBase from '../../components/knowlegdebase/RecordedClassesBase';



const Knowledgebase: React.FC = () => {
    const userRole = "Student";
  return (
    <BaseLayout role={userRole}>
        <div className="p-2" style={{width: '1200px'}}>
            <section className=" bg-[#ffffff] p-6 py-3 rounded-xl">
                <div className="flex items-center justify-between p-1 border-b-2 border-b-[#525151]">
                    <h2 className="text-[25px] font-bold text-[#5C5F85]">Knowledge Base</h2>
                    <div className="flex items-center space-x-2 ">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7-6h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                        />
                        </svg>
                    </div>
                    </div>
                        <button >
                        <FiFilter className="w-6 h-6 text-[#687E9C]"/>
                        </button>
                    </div>
                </div>
                {/* <p className='text-end text-[#525151] text-[11px]'>view all ᐳ</p> */}

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 h-48 p-1 overflow-y-scroll scrollbar-thin scrollbar-track-black">
                {[...Array(15)].map((_, index) => (
                    <PdfCard
                    title="Sample PDF"
                    details="Details"
                    pdfUrl="/alf/public/assets/images/Ansalin sagar J.pdf"
                  />
                  
                ))}
                </div>
            </section>

            <RecordedClassesBase />

            <section>
                <h2 className="text-[25px] font-bold text-[#5C5F85] p-2 px-7">
                Learn More Courses
                </h2>
                <button className="bg-[#223857] flex text-white text-[10px] p-2 ml-4 px-7 text-sm rounded-full hover:bg-[#1f334e]">
                <GrShare className='mt-[2px]'/>&nbsp; Look More Courses
                </button>
            </section>
        </div>
    </BaseLayout>
  );
};

export default Knowledgebase;
