"use client";

import axios, { AxiosError } from "axios";
import { Paperclip } from "lucide-react";
import React, { useState } from "react";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";
type Props = {
  readonly onClose: () => void;
};

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
  resume: File | null | undefined;
  comment: string;
}

export default function AddApplicants({ onClose }: Props) {
  const [success, setSucces] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
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
      resume: null,
      comment: "",
    });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setAddApplicantForm((prev) => ({ ...prev, [name]: value }));
  }

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
    formData.append("skills", addApplicantForm.skills);
    formData.append("currency", "$"); // Changed
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
          resume: null,
          comment: "",
        });
      }
    } catch (err) {
      const error = err as AxiosError;

      const status = error.response?.status;
      if (Number(status === 400)) {
        console.log("please >");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAddApplicantForm({ ...addApplicantForm, resume: e.target.files[0] });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-4xl mx-3 text-sm"
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
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                Country
              </label>
              <input
                name="country"
                value={addApplicantForm.country}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
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
                <option value="Quran">Quran</option>
                <option value="Arabic">Arabic</option>
                <option value="Islamic">Islamic</option>
              </select>
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
          </div>

          {/* Right Column */}
          <div className="space-y-3">
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
                htmlFor="inonoin"
                className="block mb-1 text-black dark:text-white"
              >
                City
              </label>
              <input
                name="city"
                value={addApplicantForm.city}
                onChange={handleChange}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
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
              <input
                name="expectedSalary"
                value={addApplicantForm.expectedSalary}
                onChange={handleChange}
                type="number"
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
                  <Paperclip size={14} />
                  {"  "}
                  Upload Resume
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {addApplicantForm.resume?.name ?? "No file chosen"}
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
            onChange={handleChange}
            type="text"
            placeholder="e.g. JavaScript, React, Node.js"
            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
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
            className="px-3 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
      {success && (
        <SuccessPopup onClose={() => setSucces(false)} title="Applicant" />
      )}
      {failed &&  (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}
