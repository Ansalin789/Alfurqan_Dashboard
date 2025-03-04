"use client";

import React, { useState } from "react";
import PdfCard from "@/app/student/components/knowlegdebase/PdfCard";
import BaseLayout2 from "@/components/BaseLayout2";
import { FiFilter } from "react-icons/fi";
import { GrShare } from "react-icons/gr";
import RecordedClassesBase from "../../components/knowlegdebase/RecordedClassesBase";

const Knowledge: React.FC = () => {
  const [userType, setUserType] = useState("normal");
  const [showPopup, setShowPopup] = useState(true);

  const handleRecordedClassesClick = () => {
    if (userType === "normal") {
      setShowPopup(false);
    }
  };

  return (
    <BaseLayout2>
      <div
        onClick={handleRecordedClassesClick}
        className={`${
          userType === "normal"
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : ""
        } w-full p-4 px-4 mr-8`}
      >
        <section className=" bg-[#ffffff] p-6 py-3 rounded-xl w-full">
          <div className="flex items-center justify-between p-1 border-b-2 border-b-[#525151] w-full">
            <h2 className="text-[18px] font-semibold text-[#5C5F85]">
              Knowledge Base
            </h2>
            {/* Date and Filter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="MM/DD/YYYY"
                  className="border border-gray-300 rounded-lg px-2 py-1 text-[10px] w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
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
              <button>
                <FiFilter className="w-4 h-4 text-[#687E9C]" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-1 overflow-y-scroll scrollbar-thin scrollbar-track-black">
            {[...Array(6)].map((_, index) => (
              <PdfCard
                key={`pdf-card-${index}`}
                title="Sample PDF"
                details="Details"
                pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              />
            ))}
          </div>
        </section>

        <div>
          <RecordedClassesBase />
        </div>

        <section>
          <h2 className="text-[18px] font-semibold text-[#5C5F85] p-1 px-7">
            Learn More Courses
          </h2>
          <button className="bg-[#223857] flex text-white text-[10px] p-[3px] ml-7 px-4 rounded-full hover:bg-[#1f334e]">
            <GrShare className="mt-[1px]" />
            &nbsp; Look More Courses
          </button>
        </section>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-[12px]">
              Please upgrade your plan to access this feature.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 bg-[#223857] text-white px-2 text-center justify-center py-1 rounded text-[12px] ml-28"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </BaseLayout2>
  );
};

export default Knowledge;
