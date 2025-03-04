"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { GrApple } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
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
      const response = await axios.post("http://alfurqanacademy.tech:5001/signin", {
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

  const setLoginError = (message: string) => {
    setError(message);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const data = await signIn(username, password);
      const { accessToken, role, _id, userName } = data;
      localStorage.setItem("SupervisorAuthToken", accessToken);
      localStorage.setItem("SupervisorPortalId", _id);
      localStorage.setItem("SupervisorPortalName", userName);
      const authToken = localStorage.getItem("SupervisorAuthToken");
      console.log(accessToken);
      console.log(authToken);
      if (role?.includes("SUPERVISOR")) {
        router.push("/supervisor/ui/dashboard");
        alert("Login successful as Supervisor");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          console.log(error);
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
          `http://alfurqanacademy.tech:5001/allcheck-email`,
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

      // Handle result based on the returned message
      if (result?.message === "Email exists") {
        localStorage.setItem("SupervisorAuthToken", result.data.accessToken);
        localStorage.setItem("SupervisorPortalId", result.data.id);
        localStorage.setItem("SupervisorPortalName", result.data.username);
        const authToken = localStorage.getItem("SupervisorAuthToken");
        console.log(authToken);
        router.push("/supervisor/ui/dashboard"); // Redirect to dashboard
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

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      {showError && error && (
        <div className="fixed top-0 right-4 p-4 bg-red-600 text-white rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      <div className="flex w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Sign In Section */}
        <div className="w-1/2 bg-white rounded-br-[150px] p-8">
          {/* <Image src="/assets/images/alf.png" alt="logo" width={150} height={150} className='justify-center ml-28 p-0'/> */}
          {/* <h2 className="text-3xl font-bold mb-4">Sign In</h2> */}

          <form onSubmit={handleFormSubmit} className="space-y-6">
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="my-4 space-y-5">
            <div
              className="flex flex-col justify-center items-center w-full px-100"
              style={{ maxWidth: "800px", border: "none", padding: 0 }} // Max width set here for Google login button
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={errorWrapper}
                useOneTap
                shape="rectangular"
                size="large"
              />
            </div>
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
};

export default SignIn;
