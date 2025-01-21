import BaseLayout2 from "@/components/BaseLayout2";
import React from "react";

const Support = () => {
  return (
    <BaseLayout2>
      <div className="min-h-screen p-8">
        {/* Page Title */}
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-8 bg-[#C4C4C4]">
          Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="col-span-1 bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                <span className="mr-2">🤖</span> Chat Support
              </h2>
              <span className="text-green-500 font-medium">● Online</span>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
                <p>
                  There are many programming languages in the market that are
                  used in designing and building websites, various applications,
                  and other tasks. All these languages are popular in their
                  place and in the way they are used, and many programmers learn
                  and use them.
                </p>
              </div>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                So explain to me more
              </button>
              <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
                <p>
                  There are many programming languages in the market that are
                  used in designing and building websites, various applications,
                  and other tasks. All these languages are popular in their
                  place and in the way they are used, and many programmers learn
                  and use them.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Write your message"
                className="flex-grow bg-gray-100 rounded-lg p-3 outline-none"
              />
              <button className="ml-2 bg-blue-500 text-white p-3 rounded-lg">
                🎤
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-span-1 bg-green-100 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact</h2>
            <div className="text-gray-800 space-y-4">
              <p>
                <strong>Visit Us:</strong> Come say Hello at Our Office HQ
                <br />
                128, City Road, London, EC1V 2NX, United Kingdom
              </p>
              <p>
                <strong>Call Us:</strong> Monday – Sunday/ 24×7
                <br />
                UK +44 20 4577 1227
                <br />
                USA +1 85 5442 3380
              </p>
              <p>
                <strong>Chat to Us:</strong> Our Friendly team is here to Help
                <br />
                <span className="text-blue-600">contact@alfurqan.academy</span>
              </p>
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-lg font-bold">WE’RE HERE TO ASSIST YOU!</h3>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="col-span-1 bg-blue-100 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Do you have questions?
            </h2>
            <details className="mb-4">
              <summary className="text-lg font-medium text-gray-800 cursor-pointer">
                What if I encounter technical issues?
              </summary>
              <p className="text-gray-700 mt-2">
                Visit the Help Center or Support section of the site. You can
                often find troubleshooting guides or contact the support team
                via email, chat, or phone.
              </p>
            </details>
            <details>
              <summary className="text-lg font-medium text-gray-800 cursor-pointer">
                Can I use the Teacher Module to communicate with students?
              </summary>
              <p className="text-gray-700 mt-2">
                Yes, the Teacher Module provides features to communicate
                directly with students.
              </p>
            </details>
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Support;
