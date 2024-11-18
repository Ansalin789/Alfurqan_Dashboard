'use client'

import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation"; // Use the correct import path for `useRouter` in Next.js 13+

export default function BasicExample(): JSX.Element {
  // State to store whether the component is mounted
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component mounts (client-side)
    setIsClient(true);
  }, []);

  // Use the router only when it's mounted (client-side)
  if (!isClient) {
    return null; // Return null or a loading spinner while the component is mounting
  }

  const router = useRouter(); // Now it's safe to use useRouter()

  const handleGoogleSuccess = (response: any) => {
    console.log("Google login success:", response);
    // Handle Google login success here (e.g., redirect to dashboard)
    router.push("/"); // Example redirect
  };

  const handleGoogleFailure = (error: any) => {
    console.error("Google login error:", error);
  };

  const handleAppleSignIn = (response: any) => {
    console.log("Apple login success:", response);
    // Handle Apple login success here (e.g., redirect to dashboard)
    router.push("/"); // Example redirect
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:p-10">
      <div className="bg-[#ffffffee] p-10 w-1/2 align-middle justify-center ml-[350px] rounded-[20px] shadow">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/assets/images/alf.png"
            className="mx-auto w-[190px]"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            أهلا ومرحبا
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-2xl rounded-md p-10">
          <form action="#" method="POST" className="space-y-6">
            <div className="p-6">
              <label htmlFor="email" className="block text-sm/6 font-medium text-[#000]">
                User Name
              </label>
              <div className="mt-2">
                <input
                  name="text"
                  type="text"
                  required
                  autoComplete="email"
                  placeholder="Enter UserName"
                  className="w-full rounded-sm border-b-2 border-b-[#293552] p-2 py-3 text-gray-900 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out sm:text-sm/6"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-[#000]">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className="w-full rounded-sm border-b-2 border-b-[#293552] p-2 py-3 text-gray-900 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out sm:text-sm/6"
                />
              </div>
            </div>

            <div className="p-2 justify-center text-center">
              <button
                type="submit"
                className="text-[20px] p-6 align-middle py-3 bg-[#293552] text-white font-semibold rounded-full  transition-all font-sans"
              >
                Login
              </button>
            </div>
          </form>

          {/* Google Sign-In */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
            />
          </div>

          {/* Apple Sign-In Button (assuming it's already handled) */}
          <div className="mt-4 flex justify-center">
            {/* Apple Sign-In Button here */}
            <button
              onClick={handleAppleSignIn}
              className="bg-black text-white p-4 rounded-full"
            >
              Sign in with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
