"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { GrApple } from "react-icons/gr";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

const SignIn: React.FC = () => {
  const searchParams = useSearchParams();
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
      }, 5000);
    }
    const user = searchParams.get("username");
    const pass = searchParams.get("password");

    if (user) setUsername(user);
    if (pass) setPassword(pass);
  }, [error]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if(window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            "45636645803-6arfjuthmcvfj3r6e6qep23dlpfntrc7.apps.googleusercontent.com",
          callback: handleGoogleSuccess,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleButton")!,
          { theme: "outline", size: "large" }
        );
      } else {
        console.error("Google Identity script not loaded properly");
      }
    };

    document.body.appendChild(script);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await axios.post("https://api.blackstoneinfomaticstech.com/signin", {
        username,
        password,
      });

      if (response.status === 200) {
        return response.data;
      }

      throw new Error("Unexpected error occurred");
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new Error("Email not found");
      }
      throw new Error(error.message ?? "Login failed");
    }
  };

  const setLoginError = (message: string) => {
    setError(message);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signIn(username, password);
      const { accessToken, role, _id, userName } = data;

      localStorage.setItem("AdminAuthToken", accessToken);
      localStorage.setItem("AdminPortalId", _id);
      localStorage.setItem("AdminPortalName", userName);

      if (role?.includes("ADMIN")) {
        router.push("/admin-main/ui/dashboard");
        alert("Login successful as Admin");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          console.log(error);
        } else {
          setLoginError(data.message ?? "Login failed. Please try again later.");
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

    const email = extractEmailFromCredential(credential);

    const checkEmail = async (email: string) => {
      try {
        const response = await axios.post(
          "https://api.blackstoneinfomaticstech.com/allcheck-email",
          { email }
        );

        if (response.status === 200) {
          return { message: "Email exists", data: response.data };
        }
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 404) {
            return { message: "Email not found" };
          }
          if (error.response.status === 500) {
            return { message: "Internal Server Error" };
          }
        }
        return { message: "Unknown error occurred" };
      }
    };

    try {
      const result = await checkEmail(email);
      if (result?.message === "Email exists") {
        localStorage.setItem("AdminAuthToken", result.data.accessToken);
        localStorage.setItem("AdminPortalId", result.data.id);
        localStorage.setItem("AdminPortalName", result.data.username);
        router.push("/admin-main/ui/dashboard");
      } else {
        setLoginError("Email not found");
        console.log(result?.message);
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };
   
;

  const extractEmailFromCredential = (credential: string) => {
    const decodedCredential = JSON.parse(atob(credential.split(".")[1]));
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
        <div className="w-1/2 bg-white rounded-br-[150px] p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
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
                className="absolute right-3 top-7 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="p-4">
              <button
                type="submit"
                className="w-[30%] ml-32 py-2 text-center bg-[#293552] text-white rounded-3xl hover:bg-[#1a2133] transition"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="text-center py-5">or</p>
          <div className="my-4 space-y-5">
            <div
              className="flex flex-col justify-center items-center w-full px-100"
              style={{ maxWidth: "800px", border: "none", padding: 0 }}
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

        <div className="w-1/2 bg-[#293552] rounded-bl-[150px] text-white p-8 flex flex-col justify-center items-center">
          <Image
            src="/assets/images/alf.png"
            alt="logo"
            width={200}
            height={200}
            className="justify-center mb-8 p-4 rounded-bl-[35px] rounded-md bg-[#fff]"
          />
          <h2 className="text-3xl font-bold mb-4">Welcome to AL Furqan</h2>
          <i className="mb-4 text-center">
            “And do good; indeed, Allāh loves the doers of good.”
          </i>
          <p>Quran 2:195</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
