import Image from 'next/image';
import React from 'react';


const ProfileCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[300px] mt-14">
      <div className="bg-[#012A4A] relative">
        <div className="flex flex-col items-center pt-6 pb-4">
          <Image
            className="rounded-full border-4 border-white"
            src="/assets/images/proff.jpg"
            width={96} // Updated size to match the image
            height={96} // Updated size to match the image
            alt="Profile"
          />
          <h2 className="mt-4 text-xl font-semibold text-white">Will Jonto</h2>
          <p className="text-gray-300">Teacher</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>Full Name:</strong> Will Jonto</li>
          <li><strong>Email:</strong> willjontoax@gmail.com</li>
          {/* <li><strong>Phone Number:</strong> (1) 2536 2561 2365</li>
          <li><strong>Time Zone:</strong> USA(time)</li>
          <li><strong>Country:</strong> USA</li>
          <li><strong>Working Hours:</strong> Arabic</li> */}
          <li><strong>Bio:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
