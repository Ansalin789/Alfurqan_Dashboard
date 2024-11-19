'use client'

import React, { useEffect, useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation"; 
import { FaApple } from "react-icons/fa";

export default function BasicExample(): JSX.Element {
  const router = useRouter(); // Ensure useRouter is called unconditionally

  // State to store whether the component is mounted
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component mounts (client-side)
    setIsClient(true);
  }, []);

  // Use the router only when it's mounted (client-side)
  if (!isClient) {
    return <div>Loading...</div>; // Return a loading spinner or a simple div while the component is mounting
  }

  const handleGoogleSuccess = (response: CredentialResponse) => {
    console.log("Google login success:", response);
    // Handle Google login success here (e.g., redirect to dashboard)
    router.push("/"); // Example redirect
  };

  const handleGoogleFailure = () => {
    console.error("Google login error:");
  };

  const handleAppleSignIn = (response: unknown) => {
    console.log("Apple login success:", response);
    // Handle Apple login success here (e.g., redirect to dashboard)
    router.push("/"); // Example redirect
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:p-8">
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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-2xl rounded-md p-4">
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
                className="text-[20px] p-6 align-middle py-2 bg-[#293552] text-white font-semibold rounded-lg transition-all font-sans"
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex justify-between">
            {/* Google Sign-In */}
            <div className="mt-4 p-1">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
            </div>

            {/* Apple Sign-In Button */}
            <div className="mt-4 p-1">
              <button
                onClick={handleAppleSignIn}
                className="bg-black text-white p-2 rounded-lg flex"
              >
                Sign in with <FaApple className="ml-[6px] size-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
