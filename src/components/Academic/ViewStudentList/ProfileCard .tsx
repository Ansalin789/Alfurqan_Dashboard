import Image from 'next/image';
import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full md:w-1/3">
      <div className="flex flex-col items-center">
        <Image
          className="w-24 h-24 rounded-full"
          src="/assets/images/proff.jpg" width={50} height={50}
          alt="Profile"
        />
        <h2 className="mt-4 text-xl font-semibold">Will Jonto</h2>
        <p className="text-gray-500">Teacher</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Personal Info</h3>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong>Full Name:</strong> Will Jonto</li>
          <li><strong>Email:</strong> willjontoax@gmail.com</li>
          <li><strong>Phone Number:</strong> (1) 2536 2561 2365</li>
          <li><strong>Level:</strong> 1</li>
          <li><strong>Time Zone:</strong> USA(time)</li>
          <li><strong>Country:</strong> USA</li>
          <li><strong>Course Handling:</strong> Arabic</li>
          <li><strong>Working Hours:</strong> Arabic</li>
          <li><strong>Bio:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
