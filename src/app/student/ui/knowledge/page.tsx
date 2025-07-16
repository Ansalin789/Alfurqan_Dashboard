'use client';

import React, { useEffect, useState } from 'react';
import PdfCard from '@/app/student/components/knowlegdebase/PdfCard';
import BaseLayout2 from '@/components/BaseLayout2';
import TeacherHeader from '@/app/teacher/components/TeacherHeader';
import { MdTune } from 'react-icons/md';
import { Search } from 'lucide-react';
import RecordedClassesBase from '../../components/knowlegdebase/RecordedClassesBase';
import StudentHeader from '../../components/StudentHeader';

interface Knowledge {
  assigmentId: string;
  name: string;
  pdfUrl?: string;
}

const arrayBufferToBase64 = (buffer: number[]) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const Knowledge: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filteredClass, setFilteredClass] = useState<Knowledge[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const displayedClasses = filteredClass
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🔍 Check user package type
  useEffect(() => {
    const checkUserPackage = () => {
      const userPackage = localStorage.getItem('StudentPackage');
      const userEmail = localStorage.getItem('StudentEmail');

      console.log(`📧 User Email: ${userEmail}`);
      console.log(`🎁 User Package: ${userPackage}`);

      if (userPackage !== 'Pro') {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    };

    checkUserPackage();
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showPopup]);

  useEffect(() => {
    const fetchKnowledgeList = async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('StudentAuthToken')
            : null;

        if (!token) {
          console.error('❌ StudentAuthToken not found');
          return;
        }

        const response = await fetch(
          'https://api.blackstoneinfomaticstech.com/knowledgebase/list',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (result.status === 'success' && result.data) {
          const formatted = result.data.map((item: any) => ({
            assigmentId: item._id,
            name: item.subjectTitle,
            pdfUrl: `data:application/pdf;base64,${arrayBufferToBase64(
              item.uploadedFile?.data || []
            )}`,
          }));
          setFilteredClass(formatted);
        } else {
          console.error('❌ Failed to fetch knowledge base list:', result.message);
        }
      } catch (error) {
        console.error('❌ Error fetching knowledge base list:', error);
      }
    };

    fetchKnowledgeList();
  }, []);

  const totalPages = Math.ceil(
    filteredClass.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="mx-1 w-8 h-8 text-[20px] rounded bg-[#F8F8FA] dark:bg-[#717171] dark:text-[#9A9A9A] text-[#223857] hover:bg-[#eaeaea] dark:hover:bg-gray-600"
        >
          ‹
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 w-8 h-8 rounded text-sm font-medium ${
            i === currentPage
              ? 'bg-white dark:bg-[#717171] dark:text-white border border-[#223857] text-[#223857]'
              : 'bg-[#F8F8FA] dark:bg-[#3F3F3F] text-[#203F78] dark:text-[#BDBDBD] hover:bg-[#eaeaea] dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
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
      <StudentHeader currentSection="Knowledge Base" />
      <div className="w-full px-2 sm:px-4 py-6 min-h-screen">
        <section className="w-full bg-[#F5F5F5] dark:bg-[#3B3B3B] py-3 rounded-xl shadow">
          <div className="flex flex-col md:flex-row items-center justify-between w-full bg-[#FAFAFB] dark:bg-[#343434] px-4 sm:px-6 -mt-3 rounded-t-xl gap-4">
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilter(true)}
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
                Showing {displayedClasses.length} of {filteredClass.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {displayedClasses.map((item, index) => (
              <PdfCard
                key={item.assigmentId || index}
                title={item.name}
                details="View Details"
                pdfUrl={item.pdfUrl || ''}
              />
            ))}
          </div>
        </section>

        {renderPagination()}

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setShowFilter(true)}
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
                  Showing {displayedClasses.length} of {filteredClass.length}
                </span>
              </div>
            </div>
            <RecordedClassesBase searchValue={searchQuery} />
          </section>
        </div>
      </div>

      {/* 🔒 Popup if not Pro */}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70">
          <div className="bg-white dark:bg-[#2c2c2c] text-gray-800 dark:text-white rounded-2xl p-6 w-[320px] shadow-2xl flex flex-col items-center space-y-5 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-purple-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              !
            </div>
            <p className="text-center text-[16px] font-medium">
              Applicable for Only <br /> Pro Users!
            </p>
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-[14px] font-semibold py-2 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Upgrade Now <span className="text-white text-sm">⚡</span>
            </button>
          </div>
        </div>
      )}
    </BaseLayout2>
  );
};

export default Knowledge;
