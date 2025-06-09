"use client";

import axios, { AxiosError } from "axios";
import { Paperclip } from "lucide-react";
import React, { useEffect, useState } from "react";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";
import { Country, State, City, ICountry, ICity } from "country-state-city";

type Props = {
  readonly onClose: () => void;
};

interface Experience {
  jobRole: string;
  organizationName: string;
  jobLocation: string;
  fromDate: string;
  toDate: string;
  jobDescription: string;
}

interface AddApplicantFormData {
  applicationDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
  city: string;
  skills: string;
  position: string;
  expectedSalary: string;
  workingHours: string;
  professionalExperience:Experience[];
  skillList: string[];
  resume: File | null | undefined;
  comment: string;
}

export default function AddApplicants({ onClose }: Props) {
  const [success, setSucces] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [addApplicantForm, setAddApplicantForm] =
    useState<AddApplicantFormData>({
      applicationDate: new Date().toISOString().split("T")[0],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      country: "USA",
      city: "",
      position: "Arabic Teacher",
      expectedSalary: "",
      workingHours: "",
      skills: "",
      professionalExperience:[],
      skillList: [],
      resume: null,
      comment: "",
    });
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      jobRole: "",
      organizationName: "",
      jobLocation: "",
      fromDate: "",
      toDate: "",
      jobDescription: "",
    },
  ]);

  const handleChange1 = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  // Add a new empty experience form
  const addExperienceForm = () => {
    setExperiences((prev) => [
      ...prev,
      {
        jobRole: "",
        organizationName: "",
        jobLocation: "",
        fromDate: "",
        toDate: "",
        jobDescription: "",
      },
    ]);
  };
  const removeExperienceForm = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  // You might want to validate here or on submit
  const canAddNewForm = experiences.every(
    (exp) =>
      exp.jobRole && exp.organizationName && exp.jobLocation && exp.fromDate && exp.toDate
  );

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setAddApplicantForm((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);
 useEffect(() => {
  if (addApplicantForm.country) {
    const selectedCountry = countries.find(
      (c) => c.name === addApplicantForm.country
    );
    if (selectedCountry) {
      const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
      const allCities = allStates.flatMap((state) =>
        City.getCitiesOfState(selectedCountry.isoCode, state.isoCode)
      );

      // 🔥 Deduplicate by city name
      const uniqueCities = Array.from(
        new Map(allCities.map(city => [city.name, city])).values()
      );

      setCities(uniqueCities);
    } else {
      setCities([]);
    }
  }
}, [addApplicantForm.country, countries]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("applicationDate", addApplicantForm.applicationDate);
    formData.append("candidateFirstName", addApplicantForm.firstName); // Changed
    formData.append("candidateLastName", addApplicantForm.lastName); // Changed
    formData.append("candidateEmail", addApplicantForm.email); // Changed
    formData.append("candidatePhoneNumber", addApplicantForm.phone); // Changed
    formData.append("candidateCountry", addApplicantForm.country); // Changed
    formData.append("candidateCity", addApplicantForm.city); // Changed
    formData.append("positionApplied", addApplicantForm.position);
    formData.append("gender", addApplicantForm.gender);
    formData.append("skills", addApplicantForm.skillList.join(","));
    formData.append("currency", "$"); // Changed
    formData.append("professionalExperience", JSON.stringify(experiences));
    formData.append("expectedSalary", addApplicantForm.expectedSalary); // Changed
    formData.append("preferedWorkingHours", addApplicantForm.workingHours); // Changed
    formData.append("comments", addApplicantForm.comment); // Changed
    formData.append("applicationStatus", "NEWAPPLICATION");
    formData.append("overallRating", "1");
    formData.append("status", "Active");

    if (addApplicantForm.resume) {
      formData.append("uploadResume", addApplicantForm.resume);
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }
      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/recruit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        setSucces(true);
        setAddApplicantForm({
          applicationDate: new Date().toISOString().split("T")[0],
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "USA",
          city: "",
          gender: "",
          position: "Arabic Teacher",
          expectedSalary: "",
          workingHours: "",
          skills: " ",
          skillList: [],
          professionalExperience:[],
          resume: null,
          comment: "",
        });
      }
    } catch (err) {
      const error = err as AxiosError;

      const status = error.response?.status;
      if (Number(status === 400)) {
        console.log("please >");
        setFailedMessage("Please check the inputs fields.");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setFailedMessage("Please upload only PDF, DOC, or DOCX files");
        setFailed(true);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFailedMessage("File size should be less than 5MB");
        setFailed(true);
        return;
      }

      setAddApplicantForm(prev => ({
        ...prev,
        resume: file
      }));
    }
  };
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddApplicantForm((prev) => ({
      ...prev,
      skills: e.target.value,
    }));
  };
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && addApplicantForm.skills.trim()) {
      e.preventDefault();
      const newSkill = addApplicantForm.skills.trim();

      if (!addApplicantForm.skillList.includes(newSkill)) {
        setAddApplicantForm((prev) => ({
          ...prev,
          skillList: [...prev.skillList, newSkill],
          skills: "", // clear input
        }));
      }
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setAddApplicantForm((prev) => ({
      ...prev,
      skillList: prev.skillList.filter((skill) => skill !== skillToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 ">
      <form
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-4xl mx-3 text-sm scrollbar-none"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h1 className="text-lg font-semibold mt-2 text-black mb-3 dark:text-[#FFFFFF]">
          Add Applicant
        </h1>

        {/* Applicant Date */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="inonoin"
                className="block text-sm font-normal text-black mb-1 dark:text-[#FFFFFF]"
              >
                Applicant Date
              </label>
              <input
                name="fromDate"
                value={addApplicantForm.applicationDate}
                onChange={handleChange}
                type="date"
                className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                First Name
              </label>
              <input
                name="firstName"
                value={addApplicantForm.firstName}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Last Name
              </label>
              <input
                name="lastName"
                value={addApplicantForm.lastName}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Email
              </label>
              <input
                name="email"
                value={addApplicantForm.email}
                onChange={handleChange}
                type="email"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="vhvihvuih"
                className="block mb-1 text-black dark:text-white"
              >
                Country
              </label>
              <select
                name="country"
                value={addApplicantForm.country}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="position"
                className="block mb-1 text-black dark:text-white"
              >
                Position Applied
              </label>
              <select
                name="position"
                value={addApplicantForm.position}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select Position</option>
                <option value="Quran Teacher">Quran Teacher</option>
                <option value="Arabic Teacher">Arabic Teacher</option>
                <option value="Islamic Teacher">Islamic Teacher</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Phone Number
              </label>
              <input
                name="phone"
                value={addApplicantForm.phone}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="ibivi"
                className="block mb-1 text-black dark:text-white"
              >
                City
              </label>
              <select
                name="city"
                value={addApplicantForm.city}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block mb-1 text-black dark:text-white"
              >
                Gender
              </label>
              <select
                name="gender"
                value={addApplicantForm.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Expected Salary / Hour
              </label>
              <div className="relative ">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-900 dark:text-white">
                  $
                </span>
                <input
                  name="expectedSalary"
                  value={addApplicantForm.expectedSalary}
                  onChange={handleChange}
                  type="number"
                  className="w-full border pl-6 rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Preferred Working Hours
              </label>
              <input
                name="workingHours"
                value={addApplicantForm.workingHours}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
            <div>
              <label
                htmlFor="jbjb"
                className="block mb-2 text-black dark:text-white"
              >
                Upload Resume
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="resumeUpload"
                  className="cursor-pointer mb-2 inline-flex items-center px-3 py-1.5 bg-[#576CBC] text-white text-xs rounded hover:bg-blue-700 transition "
                >
                  <Paperclip size={14} className="mr-1" />
                  Upload Resume
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {addApplicantForm.resume ? addApplicantForm.resume.name : "No file chosen"}
                </span>
                <input
                  id="resumeUpload"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-4">
          <label
            htmlFor="skills"
            className="block mb-1 text-black dark:text-white"
          >
            Skills
          </label>
          <input
            name="skills"
            value={addApplicantForm.skills}
            onChange={handleSkillChange}
            onKeyDown={handleSkillKeyDown}
            type="text"
            placeholder="Type a skill and press Enter"
            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />

          {/* Show added skills below */}
          <div className="mt-2 flex flex-wrap gap-2">
            {addApplicantForm.skillList.map((skill, idx) => (
              <button
                key={skill}
                className="bg-[#576CBC] text-white text-xs px-2 py-1 rounded cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="vhviuv"
            className="text-sm text-black dark:text-white mb-2 block"
          >
            Add Experience
          </label>
          <div
            style={{ maxHeight: "700px" }} // adjust height as you want
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
          >
            {/* Render multiple experience input forms */}
            {experiences.map((exp, index) => (
              <div
                key={exp.jobRole}
                className="mb-4 p-3 border rounded  dark:border-[#5C5C5C] dark:text-white relative"
              >
                <button
                  type="button"
                  onClick={() => removeExperienceForm(index)}
                  className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
                >
                  ×
                </button>

                <input
                  placeholder="Role"
                  className="w-full mb-2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={exp.jobRole}
                  onChange={(e) => handleChange1(index, "jobRole", e.target.value)}
                />
                <input
                  placeholder="Organization"
                  className="w-full mb-2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={exp.organizationName}
                  onChange={(e) =>
                    handleChange1(index, "organizationName", e.target.value)
                  }
                />
                <input
                  placeholder="Place"
                  className="w-full mb-2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={exp.jobLocation}
                  onChange={(e) =>
                    handleChange1(index, "jobLocation", e.target.value)
                  }
                />
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                    value={exp.fromDate}
                    onChange={(e) =>
                      handleChange1(index, "fromDate", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                    value={exp.toDate}
                    onChange={(e) =>
                      handleChange1(index, "toDate", e.target.value)
                    }
                  />
                </div>
                <textarea
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={exp.jobDescription}
                  onChange={(e) =>
                    handleChange1(index, "jobDescription", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          {/* Add new experience form button */}
          <button
            type="button"
            onClick={addExperienceForm}
            disabled={!canAddNewForm}
            className={`px-4 py-1 rounded text-white ${
              canAddNewForm
                ? "bg-[#576CBC] hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Another Experience
          </button>
        </div>

        <div className="mt-4">
          <label
            htmlFor="inonoin"
            className="block mb-1 text-black dark:text-white"
          >
            Comments
          </label>
          <textarea
            name="comment"
            value={addApplicantForm.comment}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        {/* Action Buttons */}
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
        <SuccessPopup onClose={() => setSucces(false)} title="Applicant" />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}
