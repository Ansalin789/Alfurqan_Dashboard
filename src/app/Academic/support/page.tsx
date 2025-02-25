import BaseLayout from "@/components/BaseLayout";
import React from "react";


const Support = () => {
  return (
    <BaseLayout>
      <div className="p-2 mx-auto">
            {/* Page Title */}
        <h1 className="mb-0 p-2 text-[25px] font-semibold text-gray-800">
          Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1 p-0 h-[10vh]">
            <div className="bg-[#4CBC9A] shadow-lg rounded-xl p-2">
              <h2 className="text-[18px] font-semibold text-gray-800 mb-1 p-6">Contact Details</h2>
              <div className="text-gray-800 space-y-4 justify-evenly px-6">
                <p>
                  <strong className="text-white text-[13px] font-semibold">Visit Us:</strong><br /><span className="text-[11px] font-medium">Come say Hello at Our Office HQ</span> 
                  <br />
                <span className="text-white text-[11px] font-normal"> 128, City Road, London, EC1V 2NX, United Kingdom</span>
                </p>
                <p>
                  <strong className="text-white text-[13px] font-semibold">Call Us:</strong><br /><span className="text-[11px] font-medium">Monday – Sunday/ 24×7</span> 
                  <br />
                  <span className="text-white text-[11px] font-medium">UK +44 20 4577 1227
                  <br />
                  USA +1 85 5442 3380</span> 
                </p>
                <p>
                  <strong className="text-white text-[13px] font-semibold">Chat to Us:</strong><br /><span className="text-[11px] font-medium">Our Friendly team is here to Help</span> 
                  <br />
                  <span className="text-white text-[11px] font-medium">contact@alfurqan.academy</span>
                </p>
              </div>
            </div>
            <div className="p-1 mt-4">
              <div className="mt-0 text-center p-3">
                <h3 className="text-lg font-semibold text-[#1C3557]">WE’RE HERE TO ASSIST YOU!</h3>
              </div>
              <div className="justify-center align-middle text-center p-5">
                <img src="/assets/images/support.png" alt="" className="w-60 justify-center ml-12"/>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-[#223857] shadow-lg rounded-xl p-6 w-full max-w-[400px] h-[570px]">
            <h2 className="text-[14px] text-center font-semibold text-[#fff] mb-6">
              Do you have questions?
            </h2>
            <details className="mb-4 p-2 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                What if I encounter technical issues?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Visit the Help Center or Support section of the site. You can often find
                troubleshooting guides or contact the support team via email, chat, or phone.
              </div>
            </details>
            <details className="p-2 mb-4 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                Can I use Teacher  communicate with students?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Yes, the Teacher Module provides features to communicate directly with students.
              </div>
            </details>
            <details className="p-2 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                Can I track my teacher progress?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Yes, the Teacher progress  to communicate directly with students.
              </div>
            </details>

            <div className="flex gap-3 mt-10 text-[#fff] text-center p-2">
              <p className="p-2">
                My question is not here
              </p>
              <button className="bg-slate-950 p-2 rounded-lg">
                Connect Us
              </button>
            </div>
          </div>

        </div>
      </div>
    </BaseLayout>
  );
};

export default Support;
