"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrApple } from "react-icons/gr";

const SignIn: React.FC = () => {
  const [emailNotExist, setEmailNotExist] = useState(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock check for email existence (replace with actual API check)
    const emailExists = false; // Replace with actual check logic
    if (!emailExists) {
      setEmailNotExist(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {emailNotExist ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#E8EFF6]  ">
             <div className="flex justify-center mb-8">
              <Image
                src="/assets/images/alf.png"
                width={150}
                height={150}
                alt="Al Furqan Academy"
                className="h-12"
              />
            </div>
            <h4 className="text-center text-xl font-semibold text-gray-700 mt-4 ">
            This email isn’t associated with us.
          </h4>
            <div className="w-[50%] max-w-lg h-auto min-h-[500px] p-3">
          {/* Display uploaded image */}
          <input
                  type="text"
                  placeholder="Enter your Email ID"
                  className="w-full px-4 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
         <p className="text-center text-sm px-4 py-2 text-gray-500 mt-4">
               <a href="/signup" className="text-blue-600">New user?</a>
            </p>
          <div className="mt-6 space-y-2">
            <button
              type="button"
              className="w-full bg-[#42a7c3] px-4 py-2 hover:bg-[#42a7c3] text-white  rounded-md"
            >
              Book a Trial
            </button>
            <p className="text-center text-sm px-4 py-6 text-gray-500 mt-4">
               <a href="/signup" className="text-gray-500">Already an existing user?</a>
            </p>
            <button
              type="button"
              className="w-full border px-4 py-2 border-gray-300  rounded-md hover:bg-gray-100"
            >
              Contact Support for Help
            </button>
          </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#E8EFF6] px-8 md:px-16">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/images/alf.png"
                width={150}
                height={150}
                alt="Al Furqan Academy"
                className="h-12"
              />
            </div>
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-8">
              Sign In
            </h2>

            {/* Sign In Form */}
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Name or Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-300 hover:bg-gray-300 text-white py-2 rounded-md"
              >
                Submit
              </button>
            </form>

            {/* Sign In Options */}
            <div className="my-4 space-y-5">
              <button
                type="button"
                className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              >
                <FcGoogle className="w-5 h-6 mr-2" />
                <span className="text-sm leading-none font-semibold">
                  Sign in with Google
                </span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              >
                <GrApple className="w-5 h-6 mr-2" />
                <span className="text-sm leading-none font-semibold">
                  Sign in with Apple
                </span>
              </button>
            </div>

            {/* Book a Trial */}
            <button
              type="button"
              className="w-full bg-[#42a7c3] hover:bg-[#42a7c3] text-white py-2 rounded-md"
            >
              Book a Trial
            </button>

            {/* Sign Up Option */}
            <p className="text-center text-sm text-gray-500 mt-4">
              New user? <a href="/signup" className="text-blue-500">Sign Up</a>
            </p>
          </div>
        </div>
      )}

      {/* Right Section - Information */}
      <div className="hidden md:flex flex-1 bg-[#E8EFF6] items-center justify-center">
        <Image
          src="/assets/images/side right.png"
          width={550}
          height={550}
          alt="Al Furqan Academy"
          className="object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default SignIn;
