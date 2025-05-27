import BaseLayout3 from "@/components/BaseLayout3";
import React from "react";
const Support = () => {
  return (
    <BaseLayout3>
      <div className="p-4 mx-auto ml-[16px] mt-[16px] mb-[16px] mr-[16px]">
        <div className="flex gap-x-44 w-auto">
          <div className="bg-[#7689BD] shadow-lg rounded-xl p-4 h-[616px] w-[340px]">
            <h2 className="text-[18px] font-semibold text-[#fff] mb-1 p-6">
              Contact
            </h2>
            <div className="text-gray-800 space-y-4 justify-evenly px-6">
              <p>
                <strong className="text-white text-[13px] font-semibold">
                  Visit Us:
                </strong>
                <br />
                <span className="text-[11px] font-medium">
                  Come say Hello at Our Office HQ
                </span>
                <br />
                <span className="text-white text-[11px] font-normal">
                  {" "}
                  128, City Road, London, EC1V 2NX, United Kingdom
                </span>
              </p>
              <p>
                <strong className="text-white text-[13px] font-semibold">
                  Call Us:
                </strong>
                <br />
                <span className="text-[11px] font-medium">
                  Monday – Sunday/ 24×7
                </span>
                <br />
                <span className="text-white text-[11px] font-medium">
                  UK +44 20 4577 1227
                  <br />
                  USA +1 85 5442 3380
                </span>
              </p>
              <p>
                <strong className="text-white text-[13px] font-semibold">
                  Chat to Us:
                </strong>
                <br />
                <span className="text-[11px] font-medium">
                  Our Friendly team is here to Help
                </span>
                <br />
                <span className="text-white text-[11px] font-medium">
                  contact@alfurqan.academy
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#5E6578] shadow-lg rounded-xl p-4 w-[811px] h-[616px]">
            <h2 className="text-[14px] text-center font-semibold text-[#fff] mb-6">
              Do you have questions?
            </h2>
            <details className="mb-4 p-2 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                What if I encounter technical issues?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Visit the Help Center or Support section of the site. You can
                often find troubleshooting guides or contact the support team
                via email, chat, or phone.
              </div>
            </details>
            <details className="p-2 mb-4 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                Can I use Teacher communicate with students?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Yes, the Teacher Module provides features to communicate
                directly with students.
              </div>
            </details>
            <details className="p-2 w-full border-b border-b-[#fff]">
              <summary className="text-[13px] font-medium text-[#fff] cursor-pointer">
                Can I track my teacher progress?
              </summary>
              <div className="text-[#fff] text-[11px] mt-2 break-words">
                Yes, the Teacher progress to communicate directly with students.
              </div>
            </details>

            <div className="flex gap-3 mt-10 text-[#fff] text-center p-2">
              <p className="p-2">My question is not here</p>
              <button className="bg-white text-[#020617] hover:bg-[#020617] hover:text-white p-2 rounded-lg">
                Connect Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default Support;
