"use client";

import React, { useEffect, useState } from "react";
import PdfCard from "@/app/student/components/knowlegdebase/PdfCard";
import BaseLayout2 from "@/components/BaseLayout2";
import { GrShare } from "react-icons/gr";
import RecordedClassesBase from "../../components/knowlegdebase/RecordedClassesBase";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";

interface Knowledge {
  assigmentId: string;
  name: string;
  pdfUrl?: string;
}

const arrayBufferToBase64 = (buffer: number[]) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const Knowledge: React.FC = () => {
  // PDF Section States
  const [pdfSearchQuery, setPdfSearchQuery] = useState("");
  const [pdfShowFilter, setPdfShowFilter] = useState(false);
  const [pdfFilteredClass, setPdfFilteredClass] = useState<Knowledge[]>([]);
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const displayedPdfClasses = pdfFilteredClass
    .filter((item) => item.name.toLowerCase().includes(pdfSearchQuery.toLowerCase()))
    .slice((pdfCurrentPage - 1) * itemsPerPage, pdfCurrentPage * itemsPerPage);

  const totalPdfPages = Math.ceil(
    pdfFilteredClass.filter((item) =>
      item.name.toLowerCase().includes(pdfSearchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  // Recorded Section States
  const [recordedSearchQuery, setRecordedSearchQuery] = useState("");
  const [recordedShowFilter, setRecordedShowFilter] = useState(false);

  useEffect(() => {
    const fetchKnowledgeList = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;

        if (!token) {
          console.error("❌ StudentAuthToken not found");
          return;
        }

        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/knowledgebase/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (result.status === "success" && result.data) {
          const formatted = result.data.map((item: any) => ({
            assigmentId: item._id,
            name: item.subjectTitle,
            pdfUrl: `data:application/pdf;base64,${arrayBufferToBase64(
              item.uploadedFile?.data || []
            )}`,
          }));
          setPdfFilteredClass(formatted);
        } else {
          console.error("❌ Failed to fetch knowledge base list:", result.message);
        }
      } catch (error) {
        console.error("❌ Error fetching knowledge base list:", error);
      }
    };

    fetchKnowledgeList();
  }, []);

  const renderPagination = () => {
    const pages = [];

    if (pdfCurrentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setPdfCurrentPage(pdfCurrentPage - 1)}
          className="mx-1 w-8 h-8 text-[20px] rounded bg-[#F8F8FA] dark:bg-[#717171] dark:text-[#9A9A9A] text-[#223857] hover:bg-[#eaeaea] dark:hover:bg-gray-600"
        >
          ‹
        </button>
      );
    }

    for (let i = 1; i <= totalPdfPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPdfCurrentPage(i)}
          className={`mx-1 w-8 h-8 rounded text-sm font-medium ${
            i === pdfCurrentPage
              ? "bg-white dark:bg-[#717171] dark:text-white border border-[#223857] text-[#223857]"
              : "bg-[#F8F8FA] dark:bg-[#3F3F3F] text-[#203F78] dark:text-[#BDBDBD] hover:bg-[#eaeaea] dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    if (pdfCurrentPage < totalPdfPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setPdfCurrentPage(pdfCurrentPage + 1)}
          className="mx-1 w-8 h-8 text-[20px] rounded bg-[#F8F8FA] dark:bg-[#717171] dark:text-[#9A9A9A] text-[#223857] hover:bg-[#eaeaea] dark:hover:bg-gray-600"
        >
          ›
        </button>
      );
    }

    return (
      <div className="sticky bottom-0 w-full dark:bg-[#242424] z-10 py-3 px-2 flex justify-end border-t border-gray-200 dark:border-[#3b3b3b]">
        <div className="flex flex-wrap">{pages}</div>
      </div>
    );
  };

  return (
    <BaseLayout2>
      <TeacherHeader currentSection="Knowledge Base" />
      <div className="w-full px-2 sm:px-4 py-6 min-h-screen">
        {/* PDF Section */}
        <section className="w-full bg-[#F5F5F5] dark:bg-[#3B3B3B] py-3 rounded-xl shadow">
          <div className="flex flex-col md:flex-row items-center justify-between w-full bg-[#FAFAFB] dark:bg-[#343434] px-4 sm:px-6 -mt-3 rounded-t-xl gap-4">
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Keyword"
                value={pdfSearchQuery}
                onChange={(e) => setPdfSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setPdfShowFilter(!pdfShowFilter)}
              className="flex-1 flex items-center justify-between text-sm text-gray-400 cursor-pointer border-y-0 border-x-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4"
            >
              <span className="flex items-center gap-2">
                <MdTune className="w-5 h-5" />
                Filter
              </span>
              <span className="ml-auto text-[20px]">&#9662;</span>
            </button>
            <div className="flex-1 flex items-center text-sm text-gray-500">
              <span>
                Showing {displayedPdfClasses.length} of {pdfFilteredClass.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {displayedPdfClasses.map((item, index) => (
              <PdfCard
                key={item.assigmentId || index}
                title={item.name}
                details="View Details"
                pdfUrl={item.pdfUrl || ""}
              />
            ))}
          </div>
        </section>

        {renderPagination()}

       {/* Recorded Classes Section */}
<div className="mt-6">
  <h2 className="text-xl font-semibold text-[#0a0a0a] dark:text-white dark:bg-[#242424] pb-3">
    Recorded Classes
  </h2>
  <section className="w-full bg-[#F5F5F5] dark:bg-[#3b3b3b] py-4 rounded-xl shadow">
    <div className="flex flex-col md:flex-row items-center dark:bg-[#343434] bg-[#FAFAFB] justify-between w-full px-4 sm:px-6 -mt-4 rounded-t-xl gap-4">
      <div className="flex-1 flex items-center gap-2 text-sm text-gray-500">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Keyword"
          value={recordedSearchQuery}
          onChange={(e) => setRecordedSearchQuery(e.target.value)}
          className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      <button
        onClick={() => setRecordedShowFilter(!recordedShowFilter)}
        className="flex-1 flex items-center justify-between text-sm text-gray-400 cursor-pointer border-y-0 border-x-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4"
      >
        <span className="flex items-center gap-2">
          <MdTune className="w-5 h-5" />
          Filter
        </span>
        <span className="ml-auto text-[20px]">&#9662;</span>
      </button>

      <div className="flex-1 flex items-center text-sm text-gray-500">
        <span>
          Showing : {recordedSearchQuery ? `1 of 1` : `2 of 2`}
        </span>
      </div>
    </div>

    {/* RecordedClassesBase will handle searchValue internally */}
    <RecordedClassesBase searchValue={recordedSearchQuery} />
  </section>
</div>


        <section className="mt-8">
          <h2 className="text-[18px] font-semibold text-[#5C5F85] p-1">Learn More Courses</h2>
          <button className="bg-[#223857] flex text-white text-[10px] p-[3px] mt-1 px-4 rounded-full hover:bg-[#1f334e]">
            <GrShare className="mt-[1px]" />
            &nbsp; Look More Courses
          </button>
        </section>
      </div>
    </BaseLayout2>
  );
};

export default Knowledge;
