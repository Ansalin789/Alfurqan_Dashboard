"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";
import PhoneInput, { isValidPhoneNumber , getCountryCallingCode  } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, City, ICountry, ICity } from "country-state-city";
import type { E164Number } from "libphonenumber-js";


type LeaveFormProps = {
  readonly onClose: () => void;
};

type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: string[];
  children?: React.ReactNode;
  disabled?: boolean;
};

type TimeSlot = { day: string; from: string; to: string };

export interface StudentForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: E164Number | undefined;
  country: string;
  city: string;
  language: string;
  preferredTeacher: string;
  preferredDate: string;
  preferredHours: string;
  classType: string;
  selectTeacher: string;
  guardianName: string;
  guardianPhone: E164Number | undefined;
  guardianEmail: string;
  studentStatus: string;
  timeZone: string;
  course: string;
  level: string;
  preferredPackage: string;
  classStatus: string;
  preferredTime: { day: string; from: string; to: string }[];
}
 interface Teacher {
      _id: string;
      userName: string;
      email: string;
      password: string;
      role: string[]; // Array of roles, e.g., "TEACHER"
      profileImage: string | null; // Could be a URL or null
      status: string; // Active/Inactive status
      createdBy: string; // Who created the record
      lastUpdatedBy: string; // Who last updated the record
      userId: string; // Unique ID for the user
      lastLoginDate: string; // Last login timestamp
      createdDate: string; // Creation timestamp
      lastUpdatedDate: string; // Last update timestamp
    }

export default function LeaveForm({ onClose }: LeaveFormProps) {
  const [form, setForm] = useState<StudentForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: undefined,
    country: "",
    city: "",
    language: "",
    preferredTeacher: "",
    preferredDate: "",
    preferredHours: "",
    classType: "",
    selectTeacher: "",
    guardianName: "",
    guardianPhone: undefined,
    guardianEmail: "",
    studentStatus: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    course: "",
    level: "",
    preferredPackage: "",
    classStatus: "",
    preferredTime: [],
  });
   const [teachers, setTeachers] = useState<Teacher[]>([]);
   const [countryCode, setCountryCode] = useState("")
     const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [success, setSucces] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const [selectedDay, setSelectedDay] = useState("");
  
  const handleAddSlot = () => {
    if (!selectedDay || isLimitReached()) return;

    setForm((prev) => ({
      ...prev,
      preferredTime: [
        ...prev.preferredTime,
        { day: selectedDay, from: "", to: "" },
      ],
    }));
  };
  const packageRates: { [key: string]: number } = {
  Simple: 8,
  Essential: 9,
  Pro: 11,
  Elite: 16,
};
useEffect(() => {
    const fetchTeachers = async () => {
      try {
         const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/users?role=TEACHER",{
            headers:{
              "Authorization": `Bearer ${token}`,
            }
          });
        const data = await response.json();

        console.log("Fetched data:", data);

        // Access `users` array in the response
        if (data && Array.isArray(data.users)) {
          setTeachers(data.users);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);
    useEffect(() => {
    const rate = packageRates[form.preferredPackage] || 0;
    setTotalAmount(rate * Number(form.preferredHours) * 4);
  }, [form.preferredPackage, form.preferredHours]);

  const handleRemove = (index: number) => {
    const updated = [...form.preferredTime];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, preferredTime: updated }));
  };

  const calculateTotalHours = () => {
    let total = 0;
    for (let slot of form.preferredTime) {
      if (!slot.from || !slot.to) continue;

      const [fh, fm] = slot.from.split(":").map(Number);
      const [th, tm] = slot.to.split(":").map(Number);
      const fromMins = fh * 60 + fm;
      const toMins = th * 60 + tm;

      if (toMins > fromMins) {
        total += (toMins - fromMins) / 60;
      }
    }
    return total;
  };
  const handleChange1 = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updated = [...form.preferredTime];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, preferredTime: updated }));
  };

  const totalHours = calculateTotalHours();
  const isLimitReached = () => totalHours.toString() >= form.preferredHours;
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);
   const timeZones = useMemo(() => {
    return Intl.supportedValuesOf('timeZone')
      .map((tz) => {
        const parts = Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          timeZoneName: 'shortOffset',
        }).formatToParts();

        const offsetPart = parts.find((part) => part.type === 'timeZoneName');

        return {
          name: tz,
          label: tz.replace('_', ' ').replace('/', ' / '),
          offset: offsetPart?.value ?? '',
        };
      })
      // Optional: Sort by offset then name
      .sort((a, b) => {
        if (a.offset !== b.offset) return a.offset.localeCompare(b.offset);
        return a.name.localeCompare(b.name);
      });
  }, []);
  useEffect(() => {
    if (form.country) {
      const selectedCountry = countries.find((c) => c.name === form.country);
      if (selectedCountry) {
        const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
        const allCities = allStates.flatMap((state) =>
          City.getCitiesOfState(selectedCountry.isoCode, state.isoCode)
        );

        // 🔥 Deduplicate by city name
        const uniqueCities = Array.from(
          new Map(allCities.map((city) => [city.name, city])).values()
        );
        console.log(uniqueCities);
        setCities(uniqueCities);
      } else {
        setCities([]);
      }
    }
  }, [form.country, countries]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachPortalId") : null;
  const now = new Date();
const isoDate = now.toISOString(); // returns in UTC
let hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
const formattedHours = String(hours).padStart(2, '0');

const currentTime = `${formattedHours}:${minutes} ${ampm}`;
const preferredTime = form.preferredTime;
 const isGroupClass = form.classType === "GROUPCLASS";
const classDay = preferredTime.map((slot) => ({
  label: slot.day,
  value: slot.day,
}));

const startTime = preferredTime.map((slot) => ({
  label: slot.from,
  value: slot.from,
}));

const endTime = preferredTime.map((slot) => ({
  label: slot.to,
  value: slot.to,
}));
const classEndDate = new Date(isoDate); // clone the date object

classEndDate.setDate(classEndDate.getDate() + 28); // add 28 days

const isoEndDate = classEndDate.toISOString();
const submitData = {
        academicCoachId: token,
        student: {
          studentId: "",
          studentFirstName: form.firstName,
          studentLastName: form.lastName,
          studentEmail: form.email,
          studentPhone: Number(form.phoneNumber),
          studentCity: form.city ?? "N/A",
          studentCountry: form.country,
          studentCountryCode: countryCode,
          learningInterest: form.course,
          numberOfStudents: 1,
          preferredTeacher: form.preferredTeacher,
          preferredFromTime: currentTime,
          preferredToTime: currentTime,
          timeZone: form.timeZone,
          referralSource: "Google",
          preferredDate:isoDate,
          evaluationStatus: "COMPLETED",
          status: "Active",
          createdDate:isoDate,
          createdBy: "Academic Coach",
        },
        isLanguageLevel: false,
        languageLevel: "1",
        isReadingLevel:false,
        readingLevel: "1",
        isGrammarLevel: false,
        grammarLevel: "1",
        hours: Number(form.preferredHours),
        subscription: {
          subscriptionName: form.preferredPackage,
        },
        teacher: isGroupClass ? [] : {
          teacherId: selectedTeacher?._id ?? " N/A",
          teacherName: selectedTeacher?.userName ?? " N/A",
          teacherEmail:selectedTeacher?.email ??  " N/A",
        },
        classDay: isGroupClass ? [] : classDay,
        startTime: isGroupClass ? [] :  startTime,
        endTime: isGroupClass ? [] :  endTime,
        planTotalPrice: totalAmount,
        classType:form.classType,
        classStartDate:form.preferredDate,
        classEndDate:isoEndDate,
        classStartTime: currentTime,
        classEndTime: currentTime,
        accomplishmentTime: (Number(form.preferredHours) * 4).toString(),
        studentRate: Number(form.preferredHours),
        expectedFinishingDate: isoEndDate,
        gardianName: form.guardianName,
        gardianEmail: form.guardianEmail,
        gardianPhone: form.guardianPhone?.toString(),
        gardianCity: "",
        gardianCountry:  "",
        gardianTimeZone: "",
        gardianLanguage: "",
        assignedTeacher:selectedTeacher?.userName ?? " N/A",
        studentStatus: form.studentStatus,
        classStatus: form.classStatus,
        trialClassStatus: "Pending",
        status: 'Active',
        createdDate: isoDate,
        createdBy: token,
        updatedDate: new Date().toISOString(),
        updatedBy: "system", // or replace with the current user's email/ID
      };
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;
      console.log("submit",submitData);
      const response = await axios.post(
        "http://localhost:5001/evaluation",
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        setSucces(true);
        setForm({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: undefined,
    country: "",
    city: "",
    language: "",
    preferredTeacher: "",
    preferredDate: "",
    preferredHours: "",
    classType: "",
    selectTeacher: "",
    guardianName: "",
    guardianPhone: undefined,
    guardianEmail: "",
    studentStatus: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    course: "",
    level: "",
    preferredPackage: "",
    classStatus: "",
    preferredTime: [],
  });
  setTeachers([]);
      }
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <form
        className="bg-white rounded-lg shadow-xl p-5 w-full max-w-4xl mx-3 scrollbar-none text-sm dark:bg-[#1D1D1D]"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h1 className="text-lg font-semibold mt-2 text-black mb-3 dark:text-[#FFFFFF]">
          Add Student
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Section */}
          <div>
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <label
              htmlFor="country"
              className="text-sm text-[#010E30] dark:text-white mb-1 "
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={form.country}
             onChange={(e) => {
    const selectedCountry = e.target.value;

    // Update form field
    setForm((prev) => ({
      ...prev,
      country: selectedCountry,
    }));

    // Get country ISO code from `countries` array
    const selected = countries.find((c) => c.name === selectedCountry);

    if (selected?.isoCode) {
  const code = getCountryCallingCode(selected.isoCode as any); // suppresses TS error
  setCountryCode(code);
}
  }}

              className="w-full px-3 py-2 border border-[#5C5C5C] mb-2 mt-1 rounded-md dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <Input
              label="Language"
              name="language"
              value={form.language}
              onChange={handleChange}
            />
            <div className="mb-4">
  <label
    htmlFor="preferredTeacher"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Preferred Teacher
  </label>
  <select
    name="preferredTeacher"
    id="preferredTeacher"
    value={form.preferredTeacher}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Preferred Teacher</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>

            <Input
              label="Preferred Date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              type="date"
            />
            <Input
              label="Preferred Hours"
              name="preferredHours"
              value={form.preferredHours}
              onChange={handleChange}
            />
          <div className="mb-4">
  <label
    htmlFor="classType"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Class Type
  </label>
  <select
    name="classType"
    id="classType"
    value={form.classType}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Class Type</option>
    <option value="REGULARCLASS">REGULARCLASS</option>
    <option value="GROUPCLASS">GROUPCLASS</option>
  </select>
</div>

            <Input
              label="Guardian Name"
              name="guardianName"
              value={form.guardianName}
              onChange={handleChange}
            />
            <label
              htmlFor="guardianPhone"
              className="text-[14px] text-[#293453] dark:text-white mb-1"
            >
              Guardian Phone
            </label>
            <PhoneInput
              id="guardianPhone"
              defaultCountry="IN"
              value={form.guardianPhone}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, guardianPhone: value }));
                if (!value || !isValidPhoneNumber(value)) {
                  setPhoneError("Invalid phone number");
                } else {
                  setPhoneError("");
                }
              }}
              className="PhoneInput w-full mb-3 mt-2 border "
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
<div className="mb-4">
  <label
    htmlFor="studentStatus"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Student Status
  </label>
  <select
    name="studentStatus"
    id="studentStatus"
    value={form.studentStatus}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Status</option>
    <option value="JOINED">JOINED</option>
    <option value="NOT JOINED">NOT JOINED</option>
  </select>
</div>

          </div>

          {/* Right Section */}
          <div>
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            <label
              htmlFor="Phone"
              className="text-[14px] text-[#293453] dark:text-white mb-1"
            >
              Phone Number
            </label>
            <PhoneInput
              id="phonenumber"
              defaultCountry="IN"
              value={form.phoneNumber}
             onChange={(value) => {
    setForm((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
   
                if (!value || !isValidPhoneNumber(value)) {
                  setPhoneError("Invalid phone number");
                } else {
                  setPhoneError("");
                }
              }}
              className="PhoneInput w-full mb-4 mt-1"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}

            <label
              htmlFor="country"
              className="text-sm text-[#010E30] dark:text-white mb-1"
            >
              City
            </label>
            <select
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border mb-2 mt-1 border-[#5C5C5C] rounded-md dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
            >
              <option value="">Select City</option>
  {cities.map((city) => (
    <option key={city.name} value={city.name}>
      {city.name}
    </option>
  ))}
            </select>

            <div className="w-full mb-3">
  <label
    htmlFor="timeZone"
    className="text-sm text-[#010E30] dark:text-white mb-1 block"
  >
    Time Zone
  </label>

  <select
        id="timeZone"
        name="timeZone"
        value={form.timeZone}
        onChange={handleChange}
        className="w-full px-2 py-2 text-xs mb-1 text-[#010E30] dark:text-white bg-white dark:bg-[#343434] border border-[#555] dark:border-[#666] rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIH3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] scrollbar-none"
      >
        <option value="">Select Timezone</option>
        {timeZones.map(({ name, label, offset }) => (
          <option
            key={name}
            value={name}
            className="text-[#010E30] dark:text-white bg-white dark:bg-[#343434]"
          >
            {label} ({offset})
          </option>
        ))}
      </select>
</div>

           <div className="mb-4">
  <label
    htmlFor="course"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Course
  </label>
  <select
    name="course"
    id="course"
    value={form.course}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Course</option>
    <option value="Quran">Quran</option>
    <option value="Arabic">Arabic</option>
    <option value="Islamic">Islamic</option>
  </select>
</div>

            <Input
              label="Level"
              name="level"
              value={form.level}
              onChange={handleChange}
            />
            <Select
  label="Select Teacher"
  name="selectTeacher"
  value={form.selectTeacher}
  disabled={form.classType === "GROUPCLASS"}
  onChange={(e) => {
    const selected = teachers.find(
      (teacher) => teacher.userId === e.target.value
    );
    setSelectedTeacher(selected || null);
    setForm((prev) => ({ ...prev, selectTeacher: e.target.value }));
  }}
>
  <option value="">Select a Teacher</option>
  {teachers.map((teacher) => (
    <option
      key={teacher.userId}
      value={teacher.userId}
      className="text-[#010E30] dark:text-white bg-white dark:bg-[#343434]"
    >
      {teacher.userName}
    </option>
  ))}
</Select>

           <div className="mb-4">
  <label
    htmlFor="preferredPackage"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Preferred Package
  </label>
  <select
    name="preferredPackage"
    id="preferredPackage"
    value={form.preferredPackage}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Package</option>
    {Object.keys(packageRates).map((pkg) => (
      <option key={pkg} value={pkg}>
        {pkg} (₹{packageRates[pkg]}/hr)
      </option>
    ))}
  </select>
</div>


            <Input
              label="Guardian Email"
              name="guardianEmail"
              value={form.guardianEmail}
              onChange={handleChange}
            />
            <div className="mb-4">
  <label
    htmlFor="classStatus"
    className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
  >
    Class Status
  </label>
  <select
    name="classStatus"
    id="classStatus"
    value={form.classStatus}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Status</option>
    <option value="COMPLETED">COMPLETED</option>
    <option value="NOT COMPLETED">NOT COMPLETED</option>
  </select>
</div>

            <label
              htmlFor="hvhv"
              className="block text-sm font-base mb-1 text-[#010E30] dark:text-white"
            >
              Preferred Time
            </label>

            <div className="mb-2 flex gap-2 items-center">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="dark:bg-[#343434] bg-[#ffff] border border-[#5C5C5C] dark:text-white px-3 py-2 rounded w-full"
              >
                <option value="">Select a Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedDay || isLimitReached()}
                onClick={handleAddSlot}
                className="bg-[#576CBC] text-white px-4 py-2 text-sm rounded disabled:opacity-40 flex flex-col items-center justify-center space-x-1"
              >
                Add
              </button>
            </div>

            {form.preferredTime.map((slot, index) => (
              <div
                key={index}
                className="dark:bg-[#2a2a2a]  bg-[#ffff] p-3 rounded mb-2 flex flex-wrap gap-2 items-center"
              >
                <span className="text-sm  font-medium w-14">{slot.day}</span>
                <select
                  value={slot.from.split(":")[0] ?? ""}
                  onChange={(e) =>
                    handleChange1(
                      index,
                      "from",
                      `${e.target.value}:${slot.from.split(":")[1] ?? "00"}`
                    )
                  }
                  className="dark:bg-[#1f1f1f]  bg-[#576CBC] text-white rounded px-2 py-1 scrollbar-none"
                >
                  <option value="">HH</option>
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  value={slot.from.split(":")[1] ?? ""}
                  onChange={(e) =>
                    handleChange1(
                      index,
                      "from",
                      `${slot.from.split(":")[0] ?? "00"}:${e.target.value}`
                    )
                  }
                  className="dark:bg-[#1f1f1f] bg-[#576CBC] text-white rounded px-2 py-1  scrollbar-none"
                >
                  <option value="">MM</option>
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <span className="px-2">to</span>

                <select
                  value={slot.to.split(":")[0] ?? ""}
                  onChange={(e) =>
                    handleChange1(
                      index,
                      "to",
                      `${e.target.value}:${slot.to.split(":")[1] ?? "00"}`
                    )
                  }
                  className="dark:bg-[#1f1f1f] bg-[#576CBC] text-white rounded px-2 py-1  scrollbar-none"
                >
                  <option value="">HH</option>
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  value={slot.to.split(":")[1] ?? ""}
                  onChange={(e) =>
                    handleChange1(
                      index,
                      "to",
                      `${slot.to.split(":")[0] ?? "00"}:${e.target.value}`
                    )
                  }
                  className="dark:bg-[#1f1f1f] bg-[#576CBC] text-white rounded px-2 py-1  scrollbar-none"
                >
                  <option value="">MM</option>
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-400 text-xs font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="text-sm mt-2">
              <span
                className={isLimitReached() ? "text-red-400" : "text-green-400"}
              >
                Total Hours: {totalHours.toFixed(2)} / {form.preferredHours}
              </span>
            </div>

            {isLimitReached() && (
              <p className="text-xs text-red-400 mt-1">
                Preferred hour limit reached. You can't add more slots.
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border border-[#576CBC] rounded text-[#576CBC] hover:bg-gray-100 transition "
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-3 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
      {success && (
        <SuccessPopup onClose={() => setSucces(false)} title="Form Submitted" />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-normal text-[#010E30]  mb-1 dark:text-[#FFFFFF]"
      >
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
      />
    </div>
  );
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options = [],
  children,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-normal text-[#010E30] mb-1 dark:text-white"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border rounded px-3 py-2 border-[#5C5C5C] text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
      >
        {children ??
          options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
    </div>
  );
};


function MultiSelect({ label, name, value, onChange, disabled }: any) {
  // Placeholder: Replace with proper multi-day, from-time/to-time dropdown logic
  return (
    <div className="mb-4">
      <label className="block text-sm font-normal text-[#010E30] mb-1 dark:text-[#FFFFFF]">
        {label}
      </label>
      <input
        type="text"
        value={value.join(", ")}
        readOnly
        disabled={disabled}
        className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
      />
    </div>
  );
}
