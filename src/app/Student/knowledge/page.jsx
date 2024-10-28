import BaseLayout2 from '@/components/BaseLayout2';
import Image from 'next/image';
import React from 'react';

export default function Knowledge() {
  return (
    <>
    <BaseLayout2>
    <div className="flex h-screen bg-gray-200">

{/* Main Content */}
<div className="flex-1 p-10">
  {/* Knowledge Base Section */}
  <h1 className="text-4xl font-bold text-gray-800 mb-6">Knowledge Base</h1>
  <div className="grid grid-cols-4 gap-6 mb-10">
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <Image src="/doc-icon.png" alt="Doc" className="h-16 w-16 mx-auto mb-4" />
      <p className="text-lg font-semibold">Doc</p>
      <button className="text-blue-500 mt-2">Download</button>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <Image src="/pdf-icon.png" alt="PDF" className="h-16 w-16 mx-auto mb-4" />
      <p className="text-lg font-semibold">PDF</p>
      <button className="text-blue-500 mt-2">Download</button>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <Image src="/doc-icon.png" alt="Doc" className="h-16 w-16 mx-auto mb-4" />
      <p className="text-lg font-semibold">Doc</p>
      <button className="text-blue-500 mt-2">Download</button>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <Image src="/pdf-icon.png" alt="PDF" className="h-16 w-16 mx-auto mb-4" />
      <p className="text-lg font-semibold">PDF</p>
      <button className="text-blue-500 mt-2">Download</button>
    </div>
  </div>

  {/* Recorded Classes Section */}
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Recorded Classes</h2>
  <div className="grid grid-cols-3 gap-6 mb-10">
    <div className="bg-gray-300 p-4 rounded-lg shadow-md text-center">
      <div className="bg-gray-400 h-24 mb-2"></div>
      <p className="text-lg font-semibold">Bulbuli | Coke Studio Bangla</p>
      <p className="text-sm text-gray-500">1.5M views • 2 days ago</p>
    </div>
    <div className="bg-gray-300 p-4 rounded-lg shadow-md text-center">
      <div className="bg-gray-400 h-24 mb-2"></div>
      <p className="text-lg font-semibold">Bulbuli | Coke Studio Bangla</p>
      <p className="text-sm text-gray-500">1.5M views • 2 days ago</p>
    </div>
    <div className="bg-gray-300 p-4 rounded-lg shadow-md text-center">
      <div className="bg-gray-400 h-24 mb-2"></div>
      <p className="text-lg font-semibold">Bulbuli | Coke Studio Bangla</p>
      <p className="text-sm text-gray-500">1.5M views • 2 days ago</p>
    </div>
  </div>

  {/* Learn More Courses Section */}
  <div className="text-center">
    <button className="bg-blue-900 text-white py-3 px-6 rounded-lg shadow-md text-lg">
      Look More Courses
    </button>
  </div>
</div>
</div>
    </BaseLayout2>
    </>
  );
}
