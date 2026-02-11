'use client';
import React from 'react';

interface PdfClass {
  id: string;
  courseName?: string;
  subjectTitle?: string;
  pdfUrl?: string;
  time?: string;
}

interface Props {
  displayedPdfs: PdfClass[];
}

const PdfTable: React.FC<Props> = ({ displayedPdfs }) => {
   const fetchAndOpenFile = async (fileId: string) => {
  try {
    console.log("file ",fileId)
    const res = await fetch(`https://api.blackstoneinfomaticstech.com/files/view/${fileId}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch file");
   const blob = await res.blob();     // ✅ ONLY READ ONCE
console.log("res", blob.type);
      const newBlobUrl = URL.createObjectURL(blob);
      if (!newBlobUrl) {
        console.log("Failed to load resume");
        return;
      }

      // Open in new tab
      window.open(newBlobUrl, "_blank");
  } catch (err) {
    console.error("Error fetching file:", err);
  }
};
  

  return (
    <div className="overflow-x-auto shadow-sm border dark:border-[#3a3a3a]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#3B568E] text-white text-sm text-left">
            <th className="px-4 py-3 font-medium">Course Name</th>
            <th className="px-4 py-3 font-medium">Subject</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedPdfs.length > 0 ? (
            displayedPdfs.map((pdf, index) => (
              <tr
                key={pdf.id || index}
                className={`text-sm ${
                  index % 2 === 0
                    ? 'bg-white dark:bg-[#3b3b3b]'
                    : 'bg-gray-50 dark:bg-[#2f2f2f]'
                }`}
              >
                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                  {pdf.courseName || 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                  {pdf.subjectTitle || 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                  {pdf.time || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                   onClick={() =>fetchAndOpenFile(pdf.pdfUrl || "") }
                    className="text-xs px-4 py-1 rounded-md transition bg-[#4459A9] text-white hover:bg-[#3a4c90]"
                  >
                    View file
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                No PDF files found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PdfTable;
