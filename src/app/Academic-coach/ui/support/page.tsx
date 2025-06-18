import BaseLayout1 from "@/components/BaseLayout1";

import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineArrowOutward } from "react-icons/md";
import AcademicHeader from "../../components/academicHeader";


const Support = () => {
  return (
    <BaseLayout1>
   <AcademicHeader currentSection="Support"/>
      <div className="p-4 mx-auto">
        <div className="flex gap-x-5 w-auto">
          <div className="bg-[#7689BD] shadow-lg rounded-xl p-4 h-[616px] w-[340px]">
            <h2 className="text-[20px] font-semibold text-[#fff] mb-4 p-4">
              Contact
            </h2>
            <div className="text-gray-800 space-y-4 justify-evenly px-6">
              <p>
                <strong className="text-white text-[16px] font-medium flex items-center gap-2">
                  <img
                    src="/assets/images/location.png"
                    alt="location"
                    className="w-4 h-4"
                  />
                  Visit Us :
                </strong>
                <div className="ml-6">
                <span className="text-[13px] font-normal text-white">
                  Come say Hello at Our Office HQ
                </span>
                <br />
                <span className="text-white text-[13px] font-normal">
                  {" "}
                  128, City Road, London, EC1V 2NX, United Kingdom
                </span>
                </div>
                
              </p>
              <p>
                <strong className="text-white text-[16px] font-medium flex items-center gap-2">
                  <img
                    src="/assets/images/call.png"
                    alt="call"
                    className="w-4 h-4"
                  />
                  Call Us :
                </strong>
                <div className="ml-6">
                <span className="text-[13px] font-normal text-white">
                  Monday – Sunday/ 24×7
                </span>
                <br />
                <span className="text-white text-[13px] font-normal">
                  UK +44 20 4577 1227
                  <br />
                  USA +1 85 5442 3380
                </span>
                </div>
              </p>
              <p>
                <strong className="text-white text-[16px] font-medium flex items-center gap-2">
                  <img
                    src="/assets/images/email.png"
                    alt="email"
                    className="w-4 h-4"
                  />
                  Email to Us :
                </strong>
                <div className="ml-6">
                <span className="text-[13px] font-normal text-white">
                  Our Friendly team is here to Help
                </span>
                <br />
                <span className="text-white text-[13px] font-normal">
                  contact@alfurqan.academy
                </span>
                </div>
              </p>
            </div>
          </div>

         <div className="bg-[#5E6578] shadow-lg rounded-xl p-6 w-[915px] relative pb-20">
            <h2 className="text-[20px] p-4 text-left font-semibold text-[#FAFAFA] mb-7">
              Do you have questions?
            </h2>
            <div className="px-6">
              <details className="group mb-6 py-2 w-full border-b border-b-[#818795]">
                <summary className="flex items-center justify-between text-[16px] font-normal text-[#fff] cursor-pointer">
                  What if I encounter technical issues?
                  <IoIosArrowDown className="text-white transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="text-[#BBBBBB] text-[14px] mt-2 break-words">
                  Visit the Help Center or Support section of the site. You can
                  often find troubleshooting guides or contact the support team
                  via email, chat, or phone.
                </div>
              </details>

              <details className="group py-2 mb-6 w-full border-b border-b-[#818795]">
                <summary className="flex items-center justify-between text-[16px] font-normal text-[#fff] cursor-pointer">
                  Can I use the Teacher Module to communicate with students?
                  <IoIosArrowDown className="text-white transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="text-[#BBBBBB] text-[14px] mt-2 break-words">
                  Yes, the Teacher Module provides features to communicate
                  directly with students.
                </div>
              </details>

              <details className="group py-2 mb-6 w-full border-b border-b-[#818795]">
                <summary className="flex items-center justify-between text-[16px] font-normal text-[#fff] cursor-pointer">
                  Can I track my students' progress?
                  <IoIosArrowDown className="text-white transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="text-[#BBBBBB] text-[14px] mt-2 break-words">
                  Yes, the Teacher Module allows tracking student progress
                  effectively.
                </div>
              </details>

              <details className="group py-2 mb-6 w-full border-b border-b-[#818795]">
                <summary className="flex items-center justify-between text-[16px] font-normal text-[#fff] cursor-pointer">
                  Does the platform support mobile access?
                  <IoIosArrowDown className="text-white transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="text-[#BBBBBB] text-[14px] mt-2 break-words">
                  Yes, the platform is fully responsive and can be accessed from
                  any mobile device.
                </div>
              </details>

              <details className="group py-2 mb-6 w-full border-b border-b-[#818795]">
                <summary className="flex items-center justify-between text-[16px] font-normal text-[#fff] cursor-pointer">
                  Can I provide personalized feedback to students?
                  <IoIosArrowDown className="text-white transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="text-[#BBBBBB] text-[14px] mt-2 break-words">
                  Yes, you can provide personalized feedback to students through
                  the platform.
                </div>
              </details>
            </div>

           <div className="absolute bottom-6 right-8 z-10">
           <button className="bg-[#FAFAFA] text-[#1B242C] px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
           Connect Us
           <MdOutlineArrowOutward className="w-4 h-4" />
           </button>
          </div>

          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default Support;
