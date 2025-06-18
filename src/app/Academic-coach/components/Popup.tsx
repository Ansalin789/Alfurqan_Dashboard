"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

interface PopupProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user: User | null;
  isEditMode: boolean; // Add this line

  onSave: (user: User) => void;
}

interface User {
  studentId: string;
  fname: string;
  lname: string;
  email: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
  evaluationStatus?: string;
  city: string;
  numberofstudents?: string;
  comment?: string;
  [key: string]: any;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string;
}

interface ApiResponseUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  learningInterest: string;
  numberOfStudents: string;
  preferredTeacher: string;
  startDate: string;
  preferredFromTime: string;
  preferredToTime: string;
  evaluationStatus?: string;
  city: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onRequestClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({
    studentId: "",
    fname: "",
    lname: "",
    email: "",
    number: "",
    country: "",
    course: "",
    preferredTeacher: "",
    date: "",
    time: "",
    evaluationStatus: "PENDING",
    numberofstudents: "",
    comment: "",
    city: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  console.log(users);

  const getAllUsers = async (): Promise<GetAllUsersResponse> => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/studentlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rawData = await response.json();
      console.log("Raw API Response:", rawData);
      // console.log(response)

      // Check if rawData.students exists and is an array
      if (!rawData.students || !Array.isArray(rawData.students)) {
        throw new Error("Invalid data structure received from API");
      }

      // Transform API data to match User interface
      const transformedData = rawData.students.map((item: ApiResponseUser) => ({
        studentId: item._id,
        fname: item.firstName,
        lname: item.lastName,
        email: item.email,
        number: item.phoneNumber.toString(),
        country: item.country,
        course: item.learningInterest,
        numberofstudents: item.numberOfStudents,
        preferredTeacher: item.preferredTeacher,
        date: new Date(item.startDate).toLocaleDateString(),
        time: `${item.preferredFromTime}`,
        evaluationStatus: item.evaluationStatus,
        city: item.city,
      }));

      return {
        success: true,
        data: transformedData,
        message: "Users fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        data: [],
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "student.studentFirstName") {
      setFormData((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          studentFirstName: value,
        },
      }));
    } else if (name === "student.studentLastName") {
      setFormData((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          studentLastName: value,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const router = useRouter();

  const handleStart = () => {
    console.log("Navigating with Student ID:", formData.studentId);
    router.push(`/evaluation?studentId=${formData.studentId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 "
    >
      <div className="bg-[#FFFFFF] rounded-xl shadow-2xl p-8 w-[800px] max-h-[90vh] overflow-y-auto  scrollbar-none dark:bg-[#252525]">
        <div className="flex justify-between items-center mb-6 pb-4  dark:text-[#FFFFFF] dark:bg-[#252525]">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-[#ffffff]">
            {user ? "Edit Student" : "Add Student"}
          </h2>
          <button
            onClick={onRequestClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-300  dark:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-5 ">
            {/* First Name */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                First Name
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Last Name
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Phone Number
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                {/* add more countries as needed */}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select City</option>
                <option value="Texas">Texas</option>
                <option value="Delhi">Delhi</option>
                {/* add more cities as needed */}
              </select>
            </div>

            {/* Preferred Teacher */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Preferred Teacher
              </label>
              <select
                name="preferredTeacher"
                value={formData.preferredTeacher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="">Select Course</option>
                <option value="Arabic">Arabic</option>
                <option value="Quran">Quran</option>
              </select>
            </div>

            {/* Number of Students */}
            {/* <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Number of Students
              </label>
              <input
                type="number"
                name="numberofstudents"
                value={formData.numberofstudents}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div> */}

            {/* Preferred Date */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Preferred Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-') : ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Preferred Time
              </label>
              <input
                type="text"
                name="time"
                placeholder="9:00 AM - 8:00 PM"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Evaluation Status */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
                Evaluation Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-[#D6D6D6]">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none  dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
            />
          </div>

          {/* Start Evaluation Button */}
          <div className="flex justify-end">
            <button
              className="bg-[#576CBC] text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
              onClick={handleStart}
            >
              <span>Start Evaluation</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Popup;
