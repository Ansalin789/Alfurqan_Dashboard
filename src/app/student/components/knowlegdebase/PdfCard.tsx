'use client';
import React from 'react';

interface PdfCardProps {
  title: string;
  details: string;
  pdfUrl: string;
}

const PdfCard: React.FC<PdfCardProps> = ({ title, details, pdfUrl }) => {
  return (
    <div className="w-full dark:bg-[#343434] dark:border-white  bg-[#FFFFFF] rounded-xl shadow p-6 flex flex-col items-center text-center">
      {/* PDF Icon */}
      <div className="mb-3">
        <img
          src="/assets/images/pdf2.svg"
          alt="PDF Icon"
          className="w-14 h-14"
        />
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-semibold dark:text-white text-[#223857] mb-1 line-clamp-2">
        {title}
      </h3>

      {/* Subtitle / Details */}
      <p className="text-[11px] dark:text-white text-[#717579] mb-3 line-clamp-2">
        {details}
      </p>

      {/* View Button */}
      {/* View Button */}
<a
  href={pdfUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-2 px-6 py-2 bg-[#576CBC] text-white text-[12px] rounded hover:bg-[#1b2f45] transition-colors"
>
  View File
</a>



    </div>
  );
};

export default PdfCard;
