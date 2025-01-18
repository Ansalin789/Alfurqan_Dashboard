"use client";
import Image from "next/image";
import React, { useState,useEffect } from "react";
import { GrApple } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { signIn,checkEmail } from "../../endpoints/page"; 
import { GoogleLogin,CredentialResponse } from '@react-oauth/google';
const SignIn: React.FC = () => {
  const [emailNotExist, setEmailNotExist] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    try {
      const data = await signIn(username, password);
      const { accessToken, role } = data;
      localStorage.setItem('StudentAuthToken', accessToken);
      const authToken=localStorage.getItem('StudentAuthToken');
      console.log(accessToken);
      console.log(authToken);
      if (role?.includes('Student')) {
        router.push('/student/ui/liveclass');
        alert("Login successful as Student");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setEmailNotExist(true);
        } else if (status === 404 && data.message === 'Email not found') {
          setEmailNotExist(true); 
        } else {
          setError(data.message || 'Login failed. Please try again later.');
        }
      } else {
        setError('Login failed. Please try again later.');
        setEmailNotExist(true);
      }
      console.error('Login error:', error);
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
      // Call the checkEmail function to verify if the email exists
      const result = await checkEmail(email);
  
      // Handle result based on the returned message
      if (result?.message === 'Email exists') {
        localStorage.setItem('StudentAuthToken',result.data.accessToken);
        const authToken=localStorage.getItem('StudentAuthToken');
        console.log(authToken);
        router.push('/student/ui/liveclass'); // Redirect to dashboard
      } else {
        setError("Email not found"); // Display appropriate error message
        console.log(result?.message); // Log the error message for debugging
      }
    } catch (error) {
      // Handle unexpected errors during the checkEmail call
      console.error("Error during email verification:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  
  const extractEmailFromCredential = (credential: string) => {
    const decodedCredential = JSON.parse(atob(credential.split('.')[1])); // Decode the payload (base64)
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
  const newuserclick=()=>{
    router.push('/form');
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
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
               <button className="text-blue-600" onClick={newuserclick} >New user?</button>
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
                  placeholder="Username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
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
              <button
                type="submit"
                className="w-full bg-gray-300 hover:bg-gray-300 text-white py-2 rounded-md"
              >
                Submit
              </button>
            </form>

            {/* Sign In Options */}
            <div className="my-4 space-y-5">
      <div
        className="flex flex-col justify-center items-center w-full px-100"
        style={{ maxWidth: '800px' , border: 'none',padding:0}} // Max width set here for Google login button
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

            {/* Book a Trial */}
            <button
              type="button"
              className="w-full bg-[#42a7c3] hover:bg-[#42a7c3] text-white py-2 rounded-md"
            >
              Book a Trial
            </button>

            {/* Sign Up Option */}
            <p className="text-center text-sm text-gray-500 mt-4">
              New user?  <button className="text-blue-600" onClick={newuserclick} >Sign up</button>
            </p>
          </div>
        </div>
      )}
      <div className="hidden md:flex flex-1 bg-[#E8EFF6] items-center justify-center">
        <Image
          src="/assets/images/sideright.png"
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
