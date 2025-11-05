"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    text: "Start your journey by one click, explore beautiful world!",
  },
  {
    text: "Discover new places and create unforgettable memories!",
  },
  {
    text: "Adventure awaits, take the first step today!",
  },
];
const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username1, setUsername1] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const googleLoginRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000); // Hide the error after 5 seconds
    }
  }, [error]);
  const signIn = async (username: string, password: string) => {
    try {
      const url = "http://localhost:5001/studentsignin";
      const payload = {
        username,
        // mask password in logs, but send real value in request body
        password,
      };
      console.log("[Student SignIn] Request URL:", url);
      console.log("[Student SignIn] Request Payload:", {
        username,
        password: password ? `*** (len:${password.length})` : "<empty>",
      });

      const response = await axios.post(url, payload);
      console.log("[Student SignIn] Response Status:", response.status);
      console.log("[Student SignIn] Response Data:", response.data);
      // Handle successful login response
      if (response.status === 200) {
        return response.data;
  
      }

      throw new Error("Unexpected error occurred");
    } catch (error: any) {
      console.log("[Student SignIn] Error Occurred:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method,
      });
      // Handle backend errors, e.g., user not found
      if (error.response && error.response.status === 404) {
        throw new Error("Email not found"); // Specific error message
      }

      // Handle other errors
      throw new Error(error.message || "Login failed");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("[Student SignIn] Submitting form with:", {
      username: username1,
      password: password ? `*** (len:${password.length})` : "<empty>",
    });
    try {
      const data = await signIn(username1, password);
      const { accessToken, role, _id, username } = data;
      console.log("[Student SignIn] Parsed Response:", {
        hasAccessToken: Boolean(accessToken),
        role,
        _id,
        username,
      });
      localStorage.setItem("StudentAuthToken", accessToken);
      localStorage.setItem("StudentPortalId", _id);
      localStorage.setItem("StudentcourseName", data.student.course);
      localStorage.setItem("StudentPortalName", username);
      localStorage.setItem("StudentPackage",data.student.package);
      if (role?.includes("Student")) {
        router.push("/student/ui/dashboard");
        // alert("Login successful as Student");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          setError("Email not found");
        } else {
          setError(data.message || "Login failed. Please try again later.");
        }
      } else {
        setError("Login failed. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };
  const checkEmail = async (email: string) => {
    try {
      // Send a POST request to the backend to check if the email exists
      const response = await axios.post(`http://localhost:5001/check-email`, {
        email,
      });

      // If the response status is 200, the email exists
      if (response.status === 200) {
        console.log("Email exists:", response.data);
        return { message: "Email exists", data: response.data }; // Return email data
      }
    } catch (error: any) {
      // Handle errors based on status code if available
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Email not found");
          return { message: "Email not found" }; // Email not found
        }

        if (error.response.status === 500) {
          console.log("Internal Server Error");
          return { message: "Internal Server Error" }; // Handle server errors
        }
      }

      // Handle non-HTTP errors or unexpected issues (network error, etc.)
      console.log("Error occurred:", error.message || "Unknown error");
      return { message: "Unknown error occurred" }; // Return unknown error message
    }
  };
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    if (!credential) {
      console.error("Google login failed: No credential received");
      setError("Google login failed: No credential received");
      return;
    }
    const email = extractEmailFromCredential(credential); // Replace with your extraction logic
    try {
      setLoading(true);
      // Call the checkEmail function to verify if the email exists
      const result = await checkEmail(email);

      const role = result?.data?.role;
      if (result?.message === "Email exists" && role?.includes("Student")) {
        localStorage.setItem("StudentAuthToken", result.data.accessToken);
        localStorage.setItem("StudentPortalId", result.data.id);
        localStorage.setItem("StudentPortalName", result.data.username);
        localStorage.setItem("StudentPackage",result.data.package);
        router.push("/student/ui/dashboard"); // Redirect to dashboard
      } else {
        setError("Email not found"); // Display appropriate error message
        console.log(result?.message); // Log the error message for debugging
      }
    } catch (error) {
      // Handle unexpected errors during the checkEmail call
      console.error("Error during email verification:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const extractEmailFromCredential = (credential: string) => {
    const decodedCredential = JSON.parse(atob(credential.split(".")[1])); // Decode the payload (base64)
    return decodedCredential.email;
  };

  interface GoogleError {
    error: string;
    details?: string;
  }

  const handleGoogleFailure = (error: GoogleError) => {
    console.error("Google login failed:", error.error);
    if (error.details) {
      console.error("Error details:", error.details);
    }
  };

  const errorWrapper = () => {
    const error: GoogleError = { error: "Some error message" };
    handleGoogleFailure(error);
  };
  const newuserclick = () => {
    router.push("https://alfurqanwebsite.vercel.app/StudentForm");
  };
  return (
      <div className="h-screen flex overflow-hidden">
        {showError && error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <AlertCircle size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-wide">Error</span>
                <span className="text-sm opacity-90">{error}</span>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="ml-3 text-white/80 hover:text-white text-sm font-medium transition"
              >
                ✕
              </button>
            </motion.div>
          </AnimatePresence>
        )}
        
        <>
            {/* Left Section - Sign In Form */}
            <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col overflow-hidden">
              <div className="px-8 py-1">
                <Image src="/assets/images/Logo - Website - big size 1.svg" alt="logo" width={150} height={160} priority style={{ height: 'auto' }} className='justify-left ml-[38px] mt-5 p-0'/>
              </div>

              <div className="flex-1 flex items-center justify-center px-8 overflow-auto scrollbar-none">
                <div className="w-full max-w-md">
                <h2 className="text-[32px] font-bold text-black mb-2 mt-32 ">Sign in</h2>
                  <p className="text-[#718096] mb-8 text-[14px]">
                    Don't have an account?{' '}
                    <button onClick={newuserclick} className="text-[#5A73B3] hover:text-[#4d6295] underline">
                      Create now
                    </button>
                  </p>

                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-[#718096] mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        value={username1}
                        onChange={(e) => setUsername1(e.target.value)}
                        placeholder="AffurqanAcademy"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#4A5568] focus:ring-2 focus:ring-[#5A73B3] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="password" className="block text-sm font-medium text-[#718096] mb-1">
                        Password
                      </label>
                      <div className="relative text-[#4A5568]">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="@#*%"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A73B3] focus:border-transparent outline-none transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300 text-[#5A73B3] focus:ring-[#5A73B3]"
                        />
                        <span className="text-[12px] text-[#718096]">Remember me</span>
                      </label>
                      <a href="#" className="text-[12px] text-[#5A73B3] hover:text-[#4d6295] underline">
                        Forgot Password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#5A73B3] hover:bg-[#4d6299] text-white font-medium py-3 rounded-2xl transition-colors mb-4"
                    >
                      Sign in
                    </button>

                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#718096]"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-[#718096]">OR</span>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <div ref={googleLoginRef} className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: '1px', height: '1px' }}>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={errorWrapper}
                          useOneTap={false}
                          auto_select={false}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const googleButton = googleLoginRef.current?.querySelector('div[role="button"]') as HTMLElement;
                          if (googleButton) {
                            googleButton.click();
                          }
                        }}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 bg-white border border-[#CBD5E0] hover:bg-gray-50 text-[#67728A] font-medium py-3 rounded-2xl transition-all shadow-sm ${
                          loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
                        }`}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        )}
                        {loading ? "Signing in..." : "Continue with Google"}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 bg-white border border-[#CBD5E0] hover:bg-gray-50 text-[#67728A] font-medium py-3 rounded-2xl transition-colors mb-4"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Continue with Apple
                    </button>

                    {/* <button
                      type="button"
                      className="w-full bg-[#5A73B3] hover:bg-[#4d6299] text-white font-medium py-3 rounded-2xl transition-colors mt-4"
                    >
                      Book a Trial
                    </button> */}
                  </form>
                </div>
              </div>
            </div>

            {/* Right Section - Feature Showcase */}
            <div className="relative w-full lg:w-1/2 h-screen overflow-hidden">
              {/* Background Image */}
              <Image
                src="/assets/images/Frame 2147226048.svg"
                alt="logo"
                width={1920}
                height={1080}
                priority
                className="hidden lg:block w-full h-full object-cover absolute inset-0 "
              />

              {/* Overlay Content */}
              <div className="relative z-10 flex flex-col justify-between w-full h-full px-6 lg:px-12 text-center py-6">
                {/* Top Card */}
                <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-2xl mt-14">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="flex-1 text-left">
                      <h2 className="text-2xl font-bold text-[#5A73B3] mb-2">
                        Lorem ipsum dolor sit amet
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                        ipsum dolor sit amet.
                      </p>
                      <button className="bg-[#5A73B3] hover:bg-[#4d6295] text-xs text-white px-6 py-2 rounded-full font-medium transition-colors">
                        Learn more
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src="/assets/images/close-up-hands-holding-diplomas-caps.svg"
                        alt="Students"
                        className="w-36 h-40 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="text-center text-white mx-auto">
                  <h2 className="text-2xl font-semibold mb-2">Introducing new features</h2>
                  <p className="text-[#CFD9E0] text-sm leading-relaxed max-w-md mx-auto mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>

                  {/* Navigation Dots */}
                  <div className="flex items-center justify-center gap-4 mt-2">
                    {/* Left Arrow */}
                    <button className="w-6 h-6 flex items-center justify-center text-[#A6B4E2] hover:text-white transition-colors">
                      <ChevronLeft size={16} />
                    </button>

                    {/* Dots Section */}
                    <div className="flex items-center gap-2">
                      {/* Left small dot */}
                      <div className="w-2 h-2 rounded-full bg-[#A6B4E2]" />

                      {/* Center active dot with arc */}
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        {/* Main dot */}
                        <div className="w-2 h-2 rounded-full bg-[#E8EBF9]" />
                        {/* Arc effect */}
                        <div className="absolute w-full h-full rounded-full border-[3px] border-[#E8EBF9] border-t-transparent rotate-[25deg]" />
                      </div>

                      {/* Right small dot */}
                      <div className="w-2 h-2 rounded-full bg-[#A6B4E2]" />
                    </div>

                    {/* Right Arrow */}
                    <button className="w-6 h-6 flex items-center justify-center text-[#A6B4E2] hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </>
      </div>
  );
};

export default SignIn;
