"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Search } from "lucide-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import Pagination from "@/components/Pagination";

interface Teacher {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profileImage?: string | null;
  level: string;
  subject: string;
  rating: number;
}

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

const ManageTeacher: React.FC = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [menuVisible, setMenuVisible] = useState<boolean[]>([]);

 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const startIndex = (currentPage - 1) * itemsPerPage;
   // Calculate pagination
   const endIndex = startIndex + itemsPerPage;
   const currentApplicants = teachers.slice(startIndex, endIndex);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    userName: "",
    email: "",
    password: "",
    role: ["TEACHER"],
    status: "Active",
    createdBy: "SYSTEM",
    profileImage: null,
    lastUpdatedBy: "SYSTEM",
  });
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/users?role=TEACHER`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "appliation/json",
            },
          }
        );
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
    setMenuVisible(Array(teachers.length).fill(false));
  }, [teachers]);

  const handleViewTeacherSchedule = (teacherId: string) => {
    if (!teacherId) {
      console.error("Teacher ID is undefined.");
      return;
    }
    localStorage.setItem("supervisormanageTeacherId", teacherId);
    console.log("Teacher ID:", teacherId); // Debugging
    router.push("/supervisor/ui/teacherDetails");
  };

  const toggleMenu = (index: number) => {
    setMenuVisible((prev) => {
      const newMenuVisible = [...prev];
      newMenuVisible[index] = !newMenuVisible[index];
      return newMenuVisible;
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("New Teacher Data:", newTeacher);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTeacher),
        }
      );
      const responseData = await response.json();
      console.log("Response:", response.status, responseData);
    } catch {
      console.error("Error saving new teacher:");
    }
    closeModal();
  };
  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Teacher's List" />
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1">
          {/* Cards */}
          <div className="w-full h-[600px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434] dark:text-[#dedede]">
            <div className="flex justify-between items-center px-4 rounded-md dark:bg-[#343434] h-[44px]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3 "
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                {/* <BsFilterLeft /> */}
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.33594 16C1.0526 16 0.815271 15.904 0.623938 15.712C0.431938 15.5207 0.335938 15.2833 0.335938 15C0.335938 14.7167 0.431938 14.4793 0.623938 14.288C0.815271 14.096 1.0526 14 1.33594 14H5.33594C5.61927 14 5.85694 14.096 6.04894 14.288C6.24027 14.4793 6.33594 14.7167 6.33594 15C6.33594 15.2833 6.24027 15.5207 6.04894 15.712C5.85694 15.904 5.61927 16 5.33594 16H1.33594ZM1.33594 4C1.0526 4 0.815271 3.90433 0.623938 3.713C0.431938 3.521 0.335938 3.28333 0.335938 3C0.335938 2.71667 0.431938 2.479 0.623938 2.287C0.815271 2.09567 1.0526 2 1.33594 2H9.33594C9.61927 2 9.85694 2.09567 10.0489 2.287C10.2403 2.479 10.3359 2.71667 10.3359 3C10.3359 3.28333 10.2403 3.521 10.0489 3.713C9.85694 3.90433 9.61927 4 9.33594 4H1.33594ZM9.33594 18C9.0526 18 8.81527 17.904 8.62394 17.712C8.43194 17.5207 8.33594 17.2833 8.33594 17V13C8.33594 12.7167 8.43194 12.479 8.62394 12.287C8.81527 12.0957 9.0526 12 9.33594 12C9.61927 12 9.85694 12.0957 10.0489 12.287C10.2403 12.479 10.3359 12.7167 10.3359 13V14H17.3359C17.6193 14 17.8566 14.096 18.0479 14.288C18.2399 14.4793 18.3359 14.7167 18.3359 15C18.3359 15.2833 18.2399 15.5207 18.0479 15.712C17.8566 15.904 17.6193 16 17.3359 16H10.3359V17C10.3359 17.2833 10.2403 17.5207 10.0489 17.712C9.85694 17.904 9.61927 18 9.33594 18ZM5.33594 12C5.0526 12 4.81494 11.904 4.62294 11.712C4.4316 11.5207 4.33594 11.2833 4.33594 11V10H1.33594C1.0526 10 0.815271 9.904 0.623938 9.712C0.431938 9.52067 0.335938 9.28333 0.335938 9C0.335938 8.71667 0.431938 8.479 0.623938 8.287C0.815271 8.09567 1.0526 8 1.33594 8H4.33594V7C4.33594 6.71667 4.4316 6.479 4.62294 6.287C4.81494 6.09567 5.0526 6 5.33594 6C5.61927 6 5.85694 6.09567 6.04894 6.287C6.24027 6.479 6.33594 6.71667 6.33594 7V11C6.33594 11.2833 6.24027 11.5207 6.04894 11.712C5.85694 11.904 5.61927 12 5.33594 12ZM9.33594 10C9.0526 10 8.81527 9.904 8.62394 9.712C8.43194 9.52067 8.33594 9.28333 8.33594 9C8.33594 8.71667 8.43194 8.479 8.62394 8.287C8.81527 8.09567 9.0526 8 9.33594 8H17.3359C17.6193 8 17.8566 8.09567 18.0479 8.287C18.2399 8.479 18.3359 8.71667 18.3359 9C18.3359 9.28333 18.2399 9.52067 18.0479 9.712C17.8566 9.904 17.6193 10 17.3359 10H9.33594ZM13.3359 6C13.0526 6 12.8153 5.904 12.6239 5.712C12.4319 5.52067 12.3359 5.28333 12.3359 5V1C12.3359 0.716667 12.4319 0.479 12.6239 0.287C12.8153 0.0956666 13.0526 0 13.3359 0C13.6193 0 13.8566 0.0956666 14.0479 0.287C14.2399 0.479 14.3359 0.716667 14.3359 1V2H17.3359C17.6193 2 17.8566 2.09567 18.0479 2.287C18.2399 2.479 18.3359 2.71667 18.3359 3C18.3359 3.28333 18.2399 3.521 18.0479 3.713C17.8566 3.90433 17.6193 4 17.3359 4H14.3359V5C14.3359 5.28333 14.2399 5.52067 14.0479 5.712C13.8566 5.904 13.6193 6 13.3359 6Z"
                    fill="#DEDEDE"
                    fill-opacity="0.7"
                  />
                </svg>
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60">
                  Showing {currentApplicants.length} Of {teachers.length}
                </span>
              </div>
            </div>
            <div
              className="grid grid-cols-6 gap-4 gap-x-7 p-3 px-4 shadow-md rounded-b-lg bg-[#f5f5f5] dark:bg-[#3b3b3b]"
            >
              {currentApplicants.map((teacher, index) => (
                <div
                  key={teacher._id}
                  className="bg-white dark:bg-[#343434] h-[260px] shadow-md rounded-lg p-4"
                >
                  <div className="items-center">
                    <div className="h-[126px] rounded-md bg-[#e8e8e8] dark:bg-[#dadada] flex items-center justify-center">
                      <Image
                        src={teacher.profileImage ?? "/assets/images/proff.jpg"}
                        alt="Teacher"
                        className="rounded-full"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-[12px] font-semibold text-[#010e30] dark:text-[#fff] mb-1">
                      {teacher.userName}
                    </h3>
                    <p className="text-[#717579] text-[10px] dark:text-[#fff]">
                      Level: {teacher.level}
                    </p>
                    <p className="text-[#717579] text-[10px] dark:text-[#fff]">{teacher.subject} Subject</p>
                    {/* Star Rating */}
                    {/* {teacher.rating} */}
                    <div className="flex justify-center">
                      <FaStar className="text-[#faab3c] text-[10px]" />
                      <FaStar className="text-[#faab3c] text-[10px] mx-1" />
                      <FaStar className="text-[#faab3c] text-[10px]" />
                      <FaStar className="text-gray-300 text-[10px] mx-1" />
                      <FaStar className="text-gray-300 text-[10px]" />
                    </div>
                    <button 
                      className="mt-[8px] text-[11px] bg-[#576cbc] text-[#fff] px-4 py-1 rounded-lg w-full h-[27px]"
                      onClick={() => handleViewTeacherSchedule(teacher._id)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add New Teacher"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="p-3">
          <h2 className="text-[20px] font-semibold text-[#223857] mb-4">
            Add New Teacher
          </h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[#223857] mb-2">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={newTeacher.userName}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#223857] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newTeacher.email}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#223857] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={newTeacher.password}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-200 text-[#223857] px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#223857] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
              
      </Modal>
    </BaseLayout3>
  );
};

export default ManageTeacher;

//onClick={() => { handleViewStudentList (); router.push('/Academic/viewTeacherSchedule');}}
