import { url } from "inspector";
import React from "react";


export default function BasicExample(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:p-10 bg-[#000]">
      <div className="bg-[#ffffffee] p-10 w-1/2 align-middle justify-center ml-[350px] rounded-[20px] shadow">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/assets/images/alf.png"
              className="mx-auto w-[190px]"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            أهلا ومرحبا</h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-2xl rounded-md">
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

              <div  className="p-6">
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

              <div  className="p-6">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#2c3a5c] px-3 py-3 font-semibold text-white text-xl shadow-sm hover:bg-[#222e4a] font-poppins">
                  Login
                </button>
              </div>
            </form>
          </div>
      </div>
        
      </div>
  );
}
