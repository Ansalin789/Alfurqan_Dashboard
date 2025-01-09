"use client";
import Image from "next/image";

const Profile = () => {
  return (
    <div className="bg-white border-1 border-b-black  rounded-lg w-[368px] h-[350px] overflow-hidden mr-6">
      {/* Profile Section */}
      <div className="text-center">
        <Image
          src="/assets/images/proff.png" // Replace with your image path
          alt="Will Jonto"
          width={100}
          height={100}
          className="rounded-full mx-auto"
        />
        <h2 className="text-[14px] font-semibold mt-2">Will Jonto</h2>
        <p className="text-gray-500 text-[12px]">Student</p>
        <div className="flex justify-center mt-2">
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-gray-300">⭐</span>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-gray-100 p-2 space-y-2 border-t border-black">
        {/* Recent Payments */}
        <div className="bg-blue-100 p-3  rounded-md text-center">
          <h3 className="text-sm font-semibold text-gray-700">Recent Payments</h3>
        </div>

        {/* Pending Fee */}
        <div className="bg-blue-100 p-3 rounded-md text-center">
          <h3 className="text-sm font-semibold text-gray-700">Pending Fee!</h3>
          <p className="text-xs text-gray-500 mt-1">Ends at: 06/04/25</p>
          <a
            href="/#"
            className="text-blue-500 font-semibold text-sm mt-2 inline-block"
          >
            Pay Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
