import React from 'react';

interface PdfCardProps {
  title: string;
  details: string;
  pdfUrl: string; // Add a prop for the PDF file URL
}

const PdfCard: React.FC<PdfCardProps> = ({ title, details, pdfUrl }) => {
  return (
    <div className="w-40 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center">
      {/* PDF Icon */}
      <div className="mb-3">
        <img
          src="/assets/images/pdf.svg" // Replace with your actual PDF icon path
          alt="PDF Icon"
          className="w-16 h-16"
        />
      </div>
      {/* Title */}
      <h3 className="text-[13px] font-semibold text-[#223857] mb-1">{title}</h3>
      {/* Subtitle */}
      <p className="text-[11px] text-[#717579] mb-2">{details}</p>
      {/* Button */}
      <a
        href={pdfUrl} // Provide the URL of the PDF file
        download // This enables the browser to download the file
        className="bg-[#223857] text-[13px] text-white px-5 py-1 text-sm rounded-md hover:bg-[#1e324e]"
      >
        View
      </a>
    </div>
  );
};

export default PdfCard;
