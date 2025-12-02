"use client";

import FailedPopup from "@/app/supervisor/components/failedPopup";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { toast, ToastContainer } from "react-toastify";
export interface AvailableSlot {
  start: string;
  end: string;
}
type LeaveFormProps = {
  readonly onClose: () => void;
};

export interface CoachAvailability {
  academicCoachId: string;
  availableSlots: AvailableSlot[];
}
export interface AcademicCoach {
  academicCoachId: string;
  name: string;
  role: string;
  email: string;
}

export interface StudentDetails {
  _id: string;
  firstName: string;
  lastName: string;
  academicCoach: AcademicCoach;
  email: string;
  gender: string;
  phoneNumber: number;
  city: string;
  country: string;
  countryCode: string;
  learningInterest: string;
  numberOfStudents: number;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  timeZone: string;
  referralSource: string;
  startDate: string;
  evaluationStatus: string;
  refernceId: string;
  referredBy: string;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
  studentId: string;
  __v: number;
}

export interface StudentApiResponse {
  studentDetails: StudentDetails;
}

export default function newCourse({ onClose }: LeaveFormProps) {
  // TOP OF COMPONENT
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [familyMailId, setFamilyMailId] = useState("");

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [referralCode, setReferralCode] = useState("");

  const [timeZone, setTimeZone] = useState("");

  const [course, setCourse] = useState("");
  const [packageType, setPackageType] = useState("");
  const [privousPreferredTeacher, setPrivousPreferredTeacher] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [previousStartDate, setPreviousStartDate] = useState(new Date());

  const [learningInterest, setLearningInterest] = useState("");
  const [previousPreferredTeacher, setPreviousPreferredTeacher] = useState("");
  const [previousPreferredAC, setPreviousPreferredAC] = useState("");
  const [preferredTeacher, setPreferredTeacher] = useState("");
  const [openSlotIndex, setOpenSlotIndex] = useState(null);
  const [preferredFromTime, setPreferredFromTime] = useState<string | null>(
    null
  );
  const [preferredToTime, setPreferredToTime] = useState<string | null>(null);

  const [selectedCoachIndex, setSelectedCoachIndex] = useState<number | null>(
    null
  );

  const [selectedSlotTimes, setSelectedSlotTimes] = useState<AvailableSlot[]>(
    []
  );

  const [selectedACId, setSelectedACId] = useState<string | null>(null);
  const [toDate, setToDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSucces] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await axios.get<StudentApiResponse>(
          `http://localhost:5001/alstudentbyalfid/${studentId}`
        );

        const s = res.data.studentDetails;

        setStudentId(s.studentId || "");
        setFirstName(s.firstName || "");
        setLastName(s.lastName || "");
        setEmail(s.email || "");
        setGender(s.gender || "");
        setPhoneNumber(String(s.phoneNumber || ""));
        setCity(s.city || "");
        setCountry(s.country || "");
        setCourse(s.learningInterest || ""); // learningInterest = course
        setPreviousPreferredTeacher(s.preferredTeacher || "");
        setPreviousPreferredAC(s.academicCoach?.name || "");
        setPreferredFromTime(s.preferredFromTime || "");
        setPreferredToTime(s.preferredToTime || "");
        setTimeZone(s.timeZone || "");
        setReferralCode(s.refernceId || "");
        setPreviousStartDate(s.startDate ? new Date(s.startDate) : new Date());
      } catch (err) {
        console.error("Failed fetch", err);
      }
    }

    if (studentId.length > 0) fetchStudent();
  }, [studentId]);

  const loadAvailableTimes = async (scheduleDate: any) => {
    if (!scheduleDate) {
      console.warn("No scheduleDate provided to loadAvailableTimes");
      return;
    }

    try {
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/ac/availabletime?scheduleDate=${scheduleDate}`
      );
      const data = await response.json();

      console.log("Raw API response:", data);

      // Map over the array of coaches and only keep start times
      const uniqueCoaches = data.map((coach: any) => ({
        academicCoachId: coach.academicCoachId,
        availableSlots: coach.availableSlots.map((slot: any) => ({
          start: slot.start,
          end: slot.end,
        })),
      }));

      setAvailableTimes(uniqueCoaches);
    } catch (err) {
      console.error("Error fetching available times:", err);
      setAvailableTimes([]);
    }
  };

  const toggleSlot = (index: any) => {
    if (openSlotIndex === index) {
      setOpenSlotIndex(null);
      setPreferredFromTime(null);
      setPreferredToTime(null);
      setSelectedCoachIndex(null);
      setSelectedSlotTimes([]);
      setSelectedACId(null);
      console.log("AC ID cleared");
    } else {
      setOpenSlotIndex(index);
      setPreferredFromTime(null);
      setPreferredToTime(null);
      setSelectedCoachIndex(index);
      setSelectedSlotTimes(availableTimes[index]?.availableSlots || []);
      setSelectedACId(availableTimes[index]?.academicCoachId || null);
      console.log("Selected AC ID:", availableTimes[index]?.academicCoachId);
    }
  };

  const [availableTimes, setAvailableTimes] = useState<CoachAvailability[]>([]);
  const [step, setStep] = useState(1);
  const isTileDisabled = ({ date }: any) => {
    return date < new Date();
  };
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setStartDate(value);
      setToDate(value);

      // Format date as YYYY-MM-DD
      const formattedDate = value.toISOString().split("T")[0];

      loadAvailableTimes(formattedDate); // pass the date to loadAvailableTimes
    }
  };
  const validateStep2 = () => {
    // Check if at least one learning interest is selected
    return (
      learningInterest.length > 0 && // At least one interest must be selected
      // numberOfStudents &&
      preferredTeacher
    );
  };

  const validateStep3 = () => {
    if (!startDate || !toDate) return false;
    if (!preferredFromTime || !preferredToTime) return false;
    return !!preferredFromTime;
  };
  const nextStep = () => {
    if (step === 2) {
      if (!validateStep2()) {
        toast.warning("Please select the missing fields.");
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields before submission
      if (!validateStep2() || !validateStep3()) {
        // alert("Please fill in all required fields");
        setIsLoading(false);
        return;
      }
      // Clean and format the phone number - remove any non-numeric characters
      // const cleanPhoneNumber = phoneNumber.toString().replace(/\D/g, '');
      //  function formatDateLocal(date) {
      //    // Returns yyyy-mm-dd in local time
      //    const year = date.getFullYear();
      //    const month = String(date.getMonth() + 1).padStart(2, "0");
      //    const day = String(date.getDate()).padStart(2, "0");
      //    return `${year}-${month}-${day}`;
      //  }

      //  const formattedData = {
      //    id: uuidv4(),
      //    firstName: firstName.trim().padEnd(3),
      //    lastName: lastName.trim().padEnd(3),
      //    email: email.trim().toLowerCase(),
      //    gender: gender,
      //    phoneNumber: Number(phoneNumber),
      //    country: country.length >= 3 ? country : country.padEnd(3, " "),
      //    city: city,
      //    learningInterest: learningInterest[0],
      //    // numberOfStudents: Number(numberOfStudents),
      //    preferredTeacher: preferredTeacher,
      //    preferredFromTime: preferredFromTime,
      //    preferredToTime: preferredToTime,

      //    startDate: formatDateLocal(startDate),
      //    endDate: formatDateLocal(toDate),
      //    evaluationStatus: "PENDING",

      //    status: "Active",
      //    createdBy: "SYSTEM",
      //    lastUpdatedBy: "SYSTEM",
      //    timeZone: timeZone,
      //    academicCoach: {
      //      academicCoachId: availableTimes[selectedCoachIndex].academicCoachId,
      //    },
      //  };

      //  console.log("Form data with AC ID:", formattedData);
      //  console.log("Selected AC ID at submission:", selectedACId);

      //  // Debug log to check the data being sent
      //  console.log("Sending data:", formattedData);
      //  const response = await fetch(
      //    `https://api.blackstoneinfomaticstech.com/student`,
      //    {
      //      method: "POST",
      //      headers: {
      //        "Content-Type": "application/json",
      //        Accept: "application/json",
      //      },
      //      body: JSON.stringify(formattedData, null, 2),
      //      mode: "cors",
      //    }
      //  );

      //  // Log the raw response
      //  console.log("Raw response:", response);

      //  if (!response.ok) {
      //    const errorData = await response.json();
      //    console.error("Error response:", errorData);
      //    throw new Error(
      //      errorData.message || `Server returned ${response.status}`
      //    );
      //  }

      //  const data = await response.json();
      //  console.log("Success response:", data);

      // Reset form and redirect on success

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      const error = err as AxiosError;
      const status = error.response?.status;
      if (Number(status === 400)) {
        setFailedMessage("Please check the form inputs.");
        setFailed(true);
      } else if (status === 401) {
        setFailedMessage("Please login again.");
        setFailed(true);
      } else if (status === 403) {
        setFailedMessage("You don't have permission to perform this action.");
        setFailed(true);
      } else if (status === 500) {
        setFailedMessage("Server error");
        setFailed(true);
      } else {
        setFailed(true);
        console.error(`Unexpected error: ${status}`);
      }
      setTimeout(() => {
        onClose();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  const inputClass =
    "w-full p-2 rounded-lg text-[13px] text-[#010E30] bg-gray-50 border border-[#5C5C5C] \
dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] \
focus:outline-none focus:ring-1 focus:ring-[#293552]";
  const disabledInputClass =
    "w-full p-2 rounded-lg text-[13px] text-[#010E30] bg-gray-50 border border-[#5C5C5C] \
dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] \
focus:outline-none focus:ring-1 focus:ring-[#293552]";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      {/* GRADIENT MODAL + ANIMATION */}
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -40 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[100%] sm:max-w-[42%] mx-auto p-5 sm:p-6 
        rounded-br-[20px] rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[20px]
        shadow-lg bg-gradient-to-r from-[#ffffff] via-[#f8f8f8] to-[#ffffff]
        dark:bg-gradient-to-r dark:from-[#1D1D1D] dark:via-[#1A1A1A] dark:to-[#1E1E1E] scrollbar-none"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black mb-3 dark:text-white">
            Add New Course
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-black dark:text-white font-bold text-lg hover:text-red-500 dark:hover:text-red-400"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 120 }}
              transition={{ duration: 0.35 }}
              className="gap-4"
            >
              <div>
                {/* STUDENT ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div>
                    <label className="text-[14px] text-[#010E30] dark:text-white">
                      Enter Student Id
                    </label>
                    <input
                      type="text"
                      placeholder="Student Id"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] text-[#010E30] dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* NAME + LAST NAME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">Name</label>
                    <input
                      value={firstName}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* PHONE + GENDER */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Phone Number
                    </label>
                    <input
                      value={phoneNumber}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Gender
                    </label>
                    <input
                      value={gender}
                      disabled
                      className={disabledInputClass}
                    ></input>
                  </div>
                </div>

                {/* COUNTRY + CITY */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Country
                    </label>
                    <input
                      value={country}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">City</label>
                    <input
                      value={city}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* FAMILY ID + MAIL */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Family Id
                    </label>
                    <input
                      value={familyId}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Family Mail Id
                    </label>
                    <input
                      value={familyMailId}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* REFERRAL + TIME ZONE */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Referral Code
                    </label>
                    <input
                      value={referralCode}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Time Zone
                    </label>
                    <input
                      value={timeZone}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* PREVIOUS COURSE */}
                <h2 className="text-[14px] dark:text-white mb-2">
                  Previous Course Details
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Course
                    </label>
                    <input
                      value={course}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Academic Coach
                    </label>
                    <input
                      value={previousPreferredAC}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-[14px] dark:text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={previousStartDate.toISOString().split("T")[0]}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[14px] dark:text-white">
                      Academic Coach Preference
                    </label>
                    <input
                      value={previousPreferredTeacher}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>
                </div>

                {/* NEXT */}
                <div className="flex justify-end mt-3 gap-2">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-3 py-1 bg-[#576CBC] text-white rounded hover:bg-[#4459A9]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 120 }}
              transition={{ duration: 0.35 }}
              className="mt-2"
            >
              <div>
                {/* TITLE */}
                <h2 className="text-[12px] sm:text-[14px] text-center font-bold mb-4 text-[#010E30] dark:text-white">
                  What will you use AL Furqan for?
                </h2>

                {/* LEARNING INTEREST BUTTONS */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 text-[11px] sm:text-[11px]">
                  {["Quran", "Islamic Studies", "Arabic"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLearningInterest(option)}
                      className={`w-full rounded-xl p-3 shadow-sm text-[#010E30] dark:text-white border border-[#5C5C5C] dark:border-[#5C5C5C] bg-gray-100 dark:bg-[#343434] hover:bg-gray-200 dark:hover:bg-[#444] font-medium ${
                        learningInterest === option
                          ? "bg-[#374374] dark:bg-[#576CBC] font-semibold text-[#fff]"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* TEACHER PREFERENCE */}
                <h2 className="text-[14px] text-center font-bold mb-4 text-[#010E30] dark:text-white">
                  Which teacher would you like?
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-10 text-[11px]">
                  {["Male", "Female"].map((preference) => (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => setPreferredTeacher(preference)}
                      className={`w-full p-3 shadow-sm rounded-xl text-[#010E30] dark:text-white border border-[#5C5C5C] dark:border-[#5C5C5C] bg-gray-100 dark:bg-[#343434] hover:bg-gray-200 dark:hover:bg-[#444] ${
                        preferredTeacher === preference
                          ? "bg-[#374374] dark:bg-[#576CBC] font-semibold text-[#fff] "
                          : ""
                      }`}
                    >
                      {preference}
                    </button>
                  ))}
                </div>

                {/* NEXT & BACK BUTTONS */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-3 py-1 border border-[#576CBC] dark:border-[#4459A9] text-[#576CBC] dark:text-[#A0B0D0] rounded hover:bg-[#E6E9F5] dark:hover:bg-[#333]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-3 py-1 bg-[#576CBC] dark:bg-[#4459A9] text-white rounded hover:bg-[#4459A9] dark:hover:bg-[#576CBC]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.35 }}
            className="mt-2"
          >
            <div className="p-2 sm:p-4 rounded-3xl bg-white dark:bg-[#1e1e1e] justify-center align-middle">
              {/* TITLE */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-[14px] sm:text-[18px] font-bold text-[#293552] dark:text-white">
                  Select a Date and Time
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* CALENDAR */}
                <div className="w-full sm:w-auto p-2 rounded-[15px] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] bg-gray-50 dark:bg-[#2b2b2b]">
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                .react-calendar {
                  width: 100% !important;
                  background-color: rgb(229, 231, 235) !important;
                  border: none !important;
                  border-radius: 15px !important;
                  padding: 15px !important;
                }
                .react-calendar .react-calendar__month-view__days__day {
                  font-size: 10px !important;
                  color: black !important;
                }
                .react-calendar .react-calendar__month-view__days__day--weekend:nth-child(7n + 1) {
                  color: #ef4444 !important;
                }
                .react-calendar .react-calendar__tile--active,
                .react-calendar .selected-date {
                  background-color: #293552 !important;
                  color: white !important;
                  border-radius: 6px !important;
                }
                .scrollbar-hidden::-webkit-scrollbar { display: none; }
                .scrollbar-hidden { scrollbar-width: none; }
              `,
                    }}
                  />
                  <Calendar
                    onChange={handleDateChange}
                    value={startDate}
                    tileDisabled={isTileDisabled}
                    className="mx-auto custom-calendar"
                    selectRange={false}
                    minDate={new Date()}
                    tileClassName={({ date, view }) =>
                      view === "month" &&
                      date.toDateString() === startDate.toDateString()
                        ? "selected-date"
                        : null
                    }
                  />
                </div>

                {/* AVAILABLE SLOTS */}
                <div className="w-full sm:w-60 p-3 rounded-[15px] shadow-lg bg-gray-50 dark:bg-[#2b2b2b]">
                  <h3 className="text-sm text-center font-semibold mb-2 text-[#293552] dark:text-white">
                    Available Slots
                  </h3>

                  <div className="flex flex-col gap-2 h-[330px] overflow-scroll scrollbar-hide">
                    <style jsx>{`
                      .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                      }
                      .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>

                    {availableTimes.map((coach, index) => (
                      <div key={coach.academicCoachId || index}>
                        <button
                          onClick={() => toggleSlot(index)}
                          className={`w-full text-center px-2 py-2 rounded-full font-semibold ${
                            openSlotIndex === index
                              ? "bg-[#293552] text-white"
                              : "bg-gray-200 dark:bg-[#444] hover:bg-gray-400 dark:hover:bg-[#555] text-[#010E30] dark:text-white"
                          }`}
                        >
                          Slot {index + 1}
                        </button>

                        {openSlotIndex === index && selectedSlotTimes && (
                          <div className="mt-2 grid grid-cols-1 gap-3 text-xs">
                            {selectedSlotTimes.length > 0 ? (
                              selectedSlotTimes.map((slot, i) => (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => {
                                    setPreferredFromTime(slot.start);
                                    setPreferredToTime(slot.end);
                                    setSelectedCoachIndex(index);
                                  }}
                                  className={`p-2 rounded-lg text-center ${
                                    preferredFromTime === slot.start &&
                                    selectedCoachIndex === index
                                      ? "bg-gray-600 text-white"
                                      : "bg-gray-200 dark:bg-[#444] hover:bg-gray-400 dark:hover:bg-[#555] text-[#010E30] dark:text-white"
                                  }`}
                                >
                                  {slot.start}
                                </button>
                              ))
                            ) : (
                              <div className="col-span-2 text-center text-gray-500 dark:text-gray-300">
                                No available slots
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BACK + SUBMIT BUTTON */}
              <div className="flex justify-between mt-3">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-3 py-1 border border-[#576CBC] dark:border-[#4459A9] text-[#576CBC] dark:text-[#A0B0D0] rounded hover:bg-[#E6E9F5] dark:hover:bg-[#333]"
                >
                  Back
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-3 py-1 border 
              border-[#576CBC] dark:border-[#4459A9] 
              bg-[#576CBC] dark:bg-[#4459A9] 
              text-white rounded 
              hover:bg-[#4459A9] dark:hover:bg-[#576CBC] 
              flex items-center justify-center
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      {success && (
        <SuccessPopup
          onClose={() => setSucces(false)}
          title="Application Submitted"
        />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}
