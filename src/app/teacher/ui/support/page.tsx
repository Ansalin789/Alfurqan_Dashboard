import BaseLayout from "@/components/BaseLayout";
import React from "react";
import { BiLogoTelegram } from "react-icons/bi";


const Support = () => {
  return (
    <BaseLayout>
      <div className="min-h-screen p-8">
        {/* Page Title */}
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-8 bg-[#C4C4C4] p-3 rounded-lg">
          Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="col-span-1 bg-white shadow-lg rounded-xl p-6 h-[80vh]">
          <div className="flex items-center justify-between mb-4">
      <h2 className="text-[15px] font-semibold text-gray-800 flex items-center">
        <span className="mr-2">🤖</span> Chat Support
      </h2>
      <span className="text-green-500 font-medium text-[12px]">● Online</span>
    </div>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg text-gray-700 text-[12px]">
                <p>
                  There are many programming languages in the market that are
                  used in designing and building websites, various applications,
                  and other tasks. All these languages are popular in their
                  place and in the way they are used, and many programmers learn
                  and use them.
                </p>
              </div>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-tr-lg rounded-tl-lg rounded-bl-lg ml-32">
                So explain to me more
              </button>
              <div className="bg-gray-100 p-4 rounded-lg text-gray-700 text-[12px]">
                <p>
                  There are many programming languages in the market that are
                  used in designing and building websites, various applications,
                  and other tasks. All these languages are popular in their
                  place and in the way they are used, and many programmers learn
                  and use them.
                </p>
              </div>
            </div>
            <div className="mt-24 flex items-center">
              <input
                type="text"
                placeholder="Write your message"
                className="flex-grow bg-gray-100 rounded-lg p-3 outline-none border text-[13px]"
              />
              <button className="ml-2 bg-blue-500 text-white p-3 rounded-lg">
                <BiLogoTelegram />
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-span-1 bg-[#4CBC9A] shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact</h2>
            <div className="text-gray-800 space-y-4">
              <p>
                <strong className="text-white font-semibold">Visit Us:</strong><br /><span className="text-[13px]">Come say Hello at Our Office HQ</span> 
                <br />
               <span className="text-white text-[13px]"> 128, City Road, London, EC1V 2NX, United Kingdom</span>
              </p>
              <p>
                <strong className="text-white font-semibold">Call Us:</strong><br /><span className="text-[13px]">Monday – Sunday/ 24×7</span> 
                <br />
                <span className="text-white text-[13px]">UK +44 20 4577 1227
                <br />
                USA +1 85 5442 3380</span> 
              </p>
              <p>
                <strong className="text-white font-semibold">Chat to Us:</strong><br /><span className="text-[13px]">Our Friendly team is here to Help</span> 
                <br />
                <span className="text-white text-[13px]">contact@alfurqan.academy</span>
              </p>
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-[#1C3557]">WE’RE HERE TO ASSIST YOU!</h3>
            </div>
            <img src="/assets/images/support.png" alt="" className="w-60 justify-center ml-16"/>
          </div>

          {/* FAQ Section */}
          <div className="col-span-1 bg-[#223857] shadow-lg rounded-xl p-6 justify-evenly">
            <h2 className="text-xl font-semibold text-[#fff] mb-4">
              Do you have questions?
            </h2>
            <details className="mb-4 p-2">
              <summary className="text-[13px]  font-medium text-[#fff] cursor-pointer">
                What if I encounter technical issues?
              </summary>
              <p className="text-[#fff] text-[11px] mt-2">
                Visit the Help Center or Support section of the site. You can
                often find troubleshooting guides or contact the support team
                via email, chat, or phone.
              </p>
            </details>
            <details className="p-2">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                Can I use the Teacher Module to communicate with students?
              </summary>
              <p className="text-[#fff] text-[11px] mt-2">
                Yes, the Teacher Module provides features to communicate
                directly with students.
              </p>
            </details>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Support;
