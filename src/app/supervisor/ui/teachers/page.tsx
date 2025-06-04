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
import { MdTune } from "react-icons/md";

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
  const [Filter, setFilter] = useState(false);

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
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434] h-10">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3 "
                />
              </div>

              <div className="relative ">
                {/* Filter Button: Tune + Filter Left, Arrow Right */}
                <div
                  className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                  onClick={() => setFilter(true)}
                >
                  {/* <BsFilterLeft /> */}
                  <MdTune className="w-4 h-4" />
                  <span>Filter</span>
                </div>

                {/* Filter Popup */}
                {Filter && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[350px] relative dark:bg-[#252525]">
                      {/* Close Icon */}
                      <button
                        className="absolute top-2 right-3 text-gray-400 text-xl"
                        onClick={() => setFilter(false)}
                      >
                        &times;
                      </button>

                      <h2 className="text-lg font-semibold mb-4">Filter by</h2>

                      {/* Position Applied */}
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <div>
                          <input
                            type="text"
                            className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium mb-1"
                        >
                          Level
                        </label>
                        <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium mb-1"
                        >
                          Subject
                        </label>
                        <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                          <option>Quran</option>
                          <option>Arabic</option>
                          <option>Islamic</option>
                        </select>
                      </div>
                      {/* Buttons */}
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setFilter(false)}
                          className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60 ">
                  Showing {currentApplicants.length} Of {teachers.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 gap-x-7 p-3 px-4 shadow-md rounded-b-lg bg-[#f5f5f5] dark:bg-[#3b3b3b]">
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
                    <p className="text-[#717579] text-[10px] dark:text-[#fff]">
                      {teacher.subject} Subject
                    </p>
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
