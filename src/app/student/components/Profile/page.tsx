"use client";
import Image from "next/image";

const Profile = () => {
  return (
    <div className="bg-white rounded-tl-lg rounded-tr-lg border-b border-b-[#727272] px-4 w-full max-w-sm sm:w-[368px] h-auto sm:h-[350px] overflow-hidden mr-0 sm:mr-6 mx-auto">
      {/* Profile Section */}
      <div className="text-center p-4">
        <Image
          src="/assets/images/proff.png" // Replace with your image path
          alt="Will Jonto"
          width={80}
          height={80}
          className="rounded-full mx-auto sm:w-[100px] sm:h-[100px]"
        />
        <h2 className="text-[16px] sm:text-[14px] font-semibold mt-2">Will Jonto</h2>
        <p className="text-gray-500 text-[14px] sm:text-[12px]">Student</p>
        <div className="flex justify-center mt-2">
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-yellow-500">⭐</span>
          <span className="text-gray-300">⭐</span>
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-4  border-t-[1px] border-t-[#727272]">
        {/* Recent Payments */}
        <div className="bg-[#E8EFF6] border-l-4 border-[#9882BB] p-3 rounded-md text-center">
          <h3 className="text-sm font-semibold text-gray-700">Recent Payments</h3>
        </div>

        {/* Pending Fee */}
        <div className="bg-[#E8EFF6] p-3 rounded-md text-center border-l-4 border-[#9882BB]">
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