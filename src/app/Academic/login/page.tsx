"use client";

import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Image from "next/image";
import axios from "axios";

export default function SignInSignUp(): JSX.Element {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  // Define the handler functions first
  const handleGoogleSuccess = async (tokenResponse: {
    access_token: string;
  }) => {
    try {
      // Get user info using the access token
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciIsInN1YiI6IjY3MmRjMzZmNmRhNjJkYzc2ZWY5Yzg4NSIsImlhdCI6MTczNDQxMzA4MywiZXhwIjoxNzM0NDk5NDgzfQ.ZoWZ2uCXuKPRwEpZMGwVpYcAqVV95lqenlS1tMKTKfs"}`,
          },
        }
      );

      // Send the Google token to your backend
      const response = await axios.post(
        `https://alfurqanacademy.tech/google-signin`,
        {
          googleToken: tokenResponse.access_token,
          email: userInfo.data.email,
        }
      );

      // Handle the response from your backend
      const { token, role, _id } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("AcademicId", _id);
      // Redirect based on role
      if (role?.includes("ACADEMIC COACH")) {
        router.push("/Academic");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google login error:");
  };

  // Now use the functions in the hook
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      (async () => {
        try {
          await handleGoogleSuccess(tokenResponse);
        } catch (error) {
          console.error("Error in Google login success handler:", error);
        }
      })();
    },
    onError: handleGoogleFailure,
    flow: "implicit",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  const handleAppleSignIn = (response: unknown) => {
    console.log("Apple login success:", response);
    // Handle Apple login success here (e.g., redirect to dashboard)
    router.push("/"); // Example redirect
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `http://alfurqanacademy.tech:5001/signin`,
        { username, password }
      );
      const { accessToken, role, _id } = response.data;
      console.log(response.data);
      console.log(accessToken);
      // Store the token securely
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("academicId", _id);
      // Optional: Store token expiry
      const tokenExpiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
      localStorage.setItem("tokenExpiry", tokenExpiry.toString());

      // Redirect based on role
      if (role?.includes("ACADEMICCOACH")) {
        router.push("/Academic");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Sign In Section */}
        <div className="w-1/2 bg-white rounded-br-[150px] p-8">
          {/* <Image src="/assets/images/alf.png" alt="logo" width={150} height={150} className='justify-center ml-28 p-0'/> */}
          {/* <h2 className="text-3xl font-bold mb-4">Sign In</h2> */}

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Enter Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="p-4">
              <button
                type="submit"
                className="w-[30%] ml-32 py-2 text-center  bg-[#293552] text-white rounded-3xl hover:bg-[#1a2133] transition"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="text-center py-5">or</p>
          <p className="text-center  text-gray-500 mb-4">
            Sign In with{" "}
            <button
              onClick={() => googleLogin()}
              className="p-2 bg-[#ccc] rounded-full hover:bg-[#293552] transition"
            >
              <FcGoogle className="text-xl" style={{ color: "#4285F4" }} />
            </button>{" "}
            or{" "}
            <button
              onClick={handleAppleSignIn}
              className=" bg-black hover:bg-[#293552] text-white p-2 rounded-lg  items-center"
            >
              <FaApple className="" />
            </button>
          </p>
        </div>

        {/* Sign Up Section */}
        <div className="w-1/2 bg-[#293552] rounded-bl-[150px] text-white p-8 flex flex-col justify-center items-center">
          <Image
            src="/assets/images/alf.png"
            alt="logo"
            width={200}
            height={200}
            className="justify-center mb-8 p-4 rounded-bl-[35px] rounded-md bg-[#fff] "
          />
          <h2 className="text-3xl font-bold mb-4">Welcome to AL Furqan</h2>
          <i className="mb-4 text-center">
            `&quot;` And do good`&ldquo;` indeed`&#34;` Allāh loves the doers of
            good`&rdquo;`
          </i>
          <p>Quran 2:195:</p>
        </div>
      </div>
    </div>
  );
}
