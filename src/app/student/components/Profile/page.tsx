"use client";
import Image from "next/image";
import Link from "next/link";

const Profile = () => {
  return (
    <div className="bg-white rounded-tl-lg rounded-tr-lg h-auto sm:h-[350px] overflow-hidden mr-0 sm:mr-6 mx-auto">
      <div className="text-center p-0">
        <Image
          src="/assets/images/proff.png" 
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
      <div className="p-2 space-y-2 justify-center ml-5 border-t-[1px] border-t-[#727272] border-b-[1px] border-b-[#727272]">
        {/* Recent Payments */}
        <div className="bg-[#E8EFF6] border-l-4 border-[#9882BB] p-3 h-[9vh]  rounded-md text-center">
          <h3 className="text-[12px] font-semibold text-gray-700">Recent Payments</h3>
          <p className="text-[11px] text-gray-500 mt-1"></p>
        </div>

        <div className="bg-[#E8EFF6] p-3 h-16 rounded-md text-center border-l-4 border-[#9882BB]">
          <h3 className="text-[12px] font-semibold text-gray-700">Pending Fee!</h3>
          <div className="justify-start text-start">
            <p className="text-[11px] text-gray-600 mt-1">Ends at: 06/04/25</p>
            <p className="text-[#1C3557] text-[10px] font-semibold -mt-1"><Link href="/#">Pay Now</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;