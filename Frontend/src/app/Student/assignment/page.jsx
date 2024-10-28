import BaseLayout2 from '@/components/BaseLayout2';
import Image from 'next/image';
import React from 'react';

export default function Assignment() {
  return (
    <>
    <BaseLayout2>
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-grow p-8 mt-4">
        <h1 className="text-2xl font-semibold mb-8">Assignments</h1>
        <div className="grid grid-cols-2 gap-4">
          {/* Assignment Card */}
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <Image src="/assets/images/alf1.png" alt="Quiz" className="w-24 h-24 mb-4" />
            <h2 className="text-lg font-medium">Quiz</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <Image src="/assets/images/alf1.png" alt="Reading" className="w-24 h-24 mb-4" />
            <h2 className="text-lg font-medium">Reading</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <Image src="/assets/images/alf1.png" alt="Writing" className="w-24 h-24 mb-4" />
            <h2 className="text-lg font-medium">Writing</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <Image src="/assets/images/alf1.png" alt="Identify the image" className="w-24 h-24 mb-4" />
            <h2 className="text-lg font-medium">Identify the image</h2>
          </div>
          
        </div>
      </div>
    </div>
    </BaseLayout2>
    </>
  );
}
