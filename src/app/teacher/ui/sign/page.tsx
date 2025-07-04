"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { GrApple } from "react-icons/gr";
import { useRouter , useSearchParams  } from "next/navigation";
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export interface RoleModuleAccess {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface AdminModules {
  dashboard: RoleModuleAccess;
  evaluation: RoleModuleAccess;
  student: RoleModuleAccess;
  employees: RoleModuleAccess;
  courses: RoleModuleAccess;
  classes: RoleModuleAccess;
  invoice: RoleModuleAccess;
  analytics: RoleModuleAccess;
  messages: RoleModuleAccess;
  settings: RoleModuleAccess;
  meetings: RoleModuleAccess;
}

export interface AcademicModules {
  dashboard: RoleModuleAccess;
  scheduledevaluation: RoleModuleAccess;
  scheduledtrail: RoleModuleAccess;
  students: RoleModuleAccess;
  teachers: RoleModuleAccess;
  messages: RoleModuleAccess;
  support: RoleModuleAccess;
}

export interface SupervisorModules {
  dashboard: RoleModuleAccess;
  recuirement: RoleModuleAccess;
  meeting: RoleModuleAccess;
  teachers: RoleModuleAccess;
  messages: RoleModuleAccess;
  support: RoleModuleAccess;
}

export interface StudentModules {
  dashboard: RoleModuleAccess;
  classes: RoleModuleAccess;
  assignments: RoleModuleAccess;
  payments: RoleModuleAccess;
  knowledgebase: RoleModuleAccess;
  support: RoleModuleAccess;
}

export interface TeacherModules {
  dashboard: RoleModuleAccess;
  meeting: RoleModuleAccess;
  schedule: RoleModuleAccess;
  liveclass: RoleModuleAccess;
  assignment: RoleModuleAccess;
  messages: RoleModuleAccess;
  analytics: RoleModuleAccess;
  support: {
    read: boolean;
    write: boolean;
  };}

export interface RoleAccess {
  admin: boolean;
  adminmodules: AdminModules;
  academicCoach: boolean;
  academicmodules: AcademicModules;
  supervisor: boolean;
  supervisormodules: SupervisorModules;
  student: boolean;
  studentmodules: StudentModules;
  teacher: boolean;
  teachermodules: TeacherModules;
}

export interface EmployeeAccessData {
  _id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  designation: string[];
  dateOfJoining: string;
  roleAccess: RoleAccess;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  __v: number;
}

export interface AccessApiResponse {
  success: boolean;
  data: EmployeeAccessData;
}

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
 

const searchParams = useSearchParams();
  const [emailNotExist, setEmailNotExist] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
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
    const user = searchParams.get("username");
    const pass = searchParams.get("password");
  
    if (user) setUsername(user);
    if (pass) setPassword(pass);
  }, [error]);
  const signIn = async (username: string, password: string) => {
    try {
      const response = await axios.post("https://api.blackstoneinfomaticstech.com/signin", {
        username,
        password,
      });

      // Handle successful login response
      if (response.status === 200) {
        return response.data;
      }

      throw new Error("Unexpected error occurred");
    } catch (error: any) {
      // Handle backend errors, e.g., user not found
      if (error.response && error.response.status === 404) {
        throw new Error("Email not found"); // Specific error message
      }

      // Handle other errors
      throw new Error(error.message || "Login failed");
    }
  };

  const fetchrolebasedaccesscontrol = async (
    id: string,
    token: string,
    role?: string
  ) => {
    try {
      const response = await axios.get<AccessApiResponse>(
        `https://api.blackstoneinfomaticstech.com/update-access/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const roleAccess = response.data.data.roleAccess;

        console.log("Original Role Access from backend:", roleAccess);

        // ✅ Use role string to determine the real access (override incorrect backend flags)
        if (role?.includes("TEACHER")) {
          // Override if necessary
          roleAccess.teacher = true;
          roleAccess.admin = false;

          localStorage.setItem(
            "TeacherRolePermission",
            JSON.stringify(roleAccess.teachermodules)
          );

          console.log(
            "Stored only teachermodules after overriding admin flag"
          );
        } else {
          console.warn(
            "User is not an  Teacher. Ignoring teachermodules."
          );
        }
      } else {
        throw new Error("Failed to fetch role-based access control");
      }
    } catch (error) {
      console.log("Error fetching role-based access:", error);
    }
  };

  const setLoginError = (message: string) => {
    setError(message);
    setEmailNotExist(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const data = await signIn(username, password);
      const { accessToken, role, userId, userName } = data;
      if (!role?.includes("TEACHER")) {
        setLoginError("Only Teacher are allowed to log in.");
        return;
      }
      localStorage.setItem("TeacherAuthToken", accessToken);
      localStorage.setItem("TeacherPortalId", userId);
      localStorage.setItem("TeacherPortalName", userName);
      await fetchrolebasedaccesscontrol(userId, accessToken, role);
      const authToken = localStorage.getItem("TeacherAuthToken");
      console.log(accessToken);
      console.log(authToken);
      if (role?.includes("TEACHER")) {
        router.push("/teacher/ui/dashboard");
        alert("Login successful as Teacher");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setEmailNotExist(true);
        } else if (status === 404 && data.message === "Email not found") {
          setEmailNotExist(true);
        } else {
          setLoginError(
            data.message || "Login failed. Please try again later."
          );
        }
      } else {
        setLoginError("Login failed. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    if (!credential) {
      console.error("Google login failed: No credential received");
      setLoginError("Google login failed: No credential received");
      return;
    }
    const checkEmail = async (email: string) => {
      try {
        // Send a POST request to the backend to check if the email exists
        const response = await axios.post(
          `https://api.blackstoneinfomaticstech.com/allcheck-email`,
          { email }
        );

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
    const email = extractEmailFromCredential(credential); // Replace with your extraction logic
    try {
      // Call the checkEmail function to verify if the email exists
      const result = await checkEmail(email);

      const role = result?.data?.role;
      if (result?.message === "Email exists" && role?.includes("TEACHER")) {
        localStorage.setItem("TeacherAuthToken", result.data.accessToken);
        localStorage.setItem("TeacherPortalId", result.data.id);
        localStorage.setItem("TeacherPortalName", result.data.username);
        const authToken = localStorage.getItem("TeacherAuthToken");
        console.log(authToken);
        router.push("/teacher/ui/dashboard"); // Redirect to dashboard
      } else {
        setLoginError("Email not found"); // Display appropriate error message
        console.log(result?.message); // Log the error message for debugging
      }
    } catch (error) {
      // Handle unexpected errors during the checkEmail call
      console.error("Error during email verification:", error);
      setLoginError("An unexpected error occurred. Please try again.");
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
    router.push("https://alfweb.vercel.app/StudentForm");
  };
  return (
        <GoogleOAuthProvider clientId="45636645803-6arfjuthmcvfj3r6e6qep23dlpfntrc7.apps.googleusercontent.com">
    
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 mx-auto">
      {showError && error && (
        <div className="fixed top-0 right-4 p-4 bg-red-600 text-white rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {emailNotExist ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#E8EFF6] px-8 md:px-16 ">
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
              <button className="text-blue-600" onClick={newuserclick}>
                New user?
              </button>
            </p>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                className="w-full bg-[#42a7c3] px-4 py-2 hover:bg-[#42a7c3] text-white  rounded-md"
              >
                Book a Trial
              </button>
              <p className="text-center text-sm px-4 py-6 text-gray-500 mt-4">
                <a href="/signup" className="text-gray-500">
                  Already an existing user?
                </a>
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
            <div className='flex justify-center align-middle p-4 gap-2 mb-6 ml-44'>
              <Image src="/assets/images/alf1.png" width={150} height={150} className='bg-cover bg-center w-10 h-14' alt='logo' />
              <div className="text-white">
                <h3 className="font-bold text-[30px] text-[#293453] ">AL FURQAN</h3>
                <h4 className="font-normal text-[25px] text-[#F96484] justify-end ml-12 -mt-4 font-sans">academy</h4>
              </div>
            </div><div className="bg-white shadow-lg rounded-lg p-6 w-96 ml-32">
              <h2 className="text-center text-xl font-semibold text-gray-800 mb-8">
                Sign In
              </h2>

              {/* Sign In Form */}
              <form className="space-y-0 mb-10" onSubmit={handleFormSubmit}>
                <div className="my-4 flex gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full px-2 text-[12px] py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-2 text-[12px] py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1 text-gray-500 text-[12px]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white text-[10px] py-2 rounded-md"
                >
                  Submit
                </button>
              </form>

              {/* Sign In Options */}
              <div className="my-4 flex gap-4">
                <div
                  className="flex flex-col justify-center items-center w-full text-[9px]"
                  style={{ maxWidth: "800px", border: "none", padding: 0, fontSize: "8px" }} // Max width set here for Google login button
                >
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={errorWrapper}
                    useOneTap
                    shape="rectangular"
                    size="medium"
                    text="signin_with"
                    theme="outline"
                  />
                </div>
                <button
                  type="button"
                  className="w-full flex items-center justify-center border border-gray-300 py-0 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <GrApple className="w-4 h-5 mr-1" />
                  <span className="text-[12px] leading-none font-semibold">
                    Sign in with Apple
                  </span>
                </button>
              </div>

              {/* Book a Trial */}
              <button
                type="button"
                className="w-full bg-[#42a7c3] hover:bg-[#42a7c3] text-white py-2 rounded-md text-[12px]"
              >
                Book a Trial
              </button>

              {/* Sign Up Option */}
              <p className="text-center text-[11px] text-gray-500 mt-4">
                New user?{" "}
                <button className="text-blue-600" onClick={newuserclick}>
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:flex flex-1 bg-[#E8EFF6] items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="relative w-[400px] h-[500px] bg-[#4eb0cf] rounded-2xl p-6 shadow-lg overflow-hidden">
            <div className="absolute -bottom-10 -left-16 w-80 h-80 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-6 -left-14 w-72 h-72 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-12 w-64 h-64 bg-white/10 rounded-full"></div>

            {/* Static Frame */}
            <div className="relative border border-white/30 rounded-xl p-6 h-full flex flex-col justify-between">
              {/* Animated Text */}
              <div className="h-28 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-lg font-semibold leading-snug text-center"
                  >
                    {slides[currentIndex].text}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white" : "bg-white/50"
                      }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </GoogleOAuthProvider>
    
  );
};

export default SignIn;
