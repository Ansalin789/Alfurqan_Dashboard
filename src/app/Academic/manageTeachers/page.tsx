'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { LiaStarSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useRouter } from 'next/navigation';
import BaseLayout1 from '@/components/BaseLayout1';
import Modal from 'react-modal';
import { error } from 'console';
interface Teacher {
  userId: string;
  userName: string;
  email: string;
  profileImage?: string | null;
  level: string;
  subject: string;
  rating: number;
}

const ManageTeacher: React.FC = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [menuVisible, setMenuVisible] = useState<boolean[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    userName: '',
    email: '',
    password:'',
    role: ["TEACHER"],
    status: "Active",
    createdBy: "SYSTEM",
    profileImage:null,
    lastUpdatedBy: "SYSTEM",
  });
    useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const response = await fetch('http://localhost:5001/users?role=TEACHER', {
            headers: {
              'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciIsInN1YiI6IjY3MmRjMzZmNmRhNjJkYzc2ZWY5Yzg4NSIsImlhdCI6MTczNDM0NjcxNiwiZXhwIjoxNzM0NDMzMTE2fQ.bPGpuxQJxJa2hHtYTF2HkrjrGP0ieVZ_Pi1iaD7a5p4"}`,
            },
          });
          const data = await response.json();
  
          console.log('Fetched data:', data);
  
          // Access `users` array in the response
          if (data && Array.isArray(data.users)) {
            setTeachers(data.users);
          } else {
            console.error('Unexpected API response structure:', data);
          }
        } catch (error) {
          console.error('Error fetching teachers:', error);
// =======


//   useEffect(() => {
    

//     const fetchTeachers = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/users?role=TEACHER', {
//           headers: {
//             'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciIsInN1YiI6IjY3MmRjMzZmNmRhNjJkYzc2ZWY5Yzg4NSIsImlhdCI6MTczNDM0NjcxNiwiZXhwIjoxNzM0NDMzMTE2fQ.bPGpuxQJxJa2hHtYTF2HkrjrGP0ieVZ_Pi1iaD7a5p4"}`,
//           },
//         });
//         const data = await response.json();

//         console.log('Fetched data:', data);

//         // Access `users` array in the response
//         if (data && Array.isArray(data.users)) {
//           setTeachers(data.users);
//         } else {
//           console.error('Unexpected API response structure:', data);
// >>>>>>> 2d6a1dc0c1d2447cc20c04071e06bd19ba334117
//         }
//       } catch (error) {
//         console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);
  const handleViewTeachersList = () => {
    router.push('/Academic/viewteacherslist');
  };

// <<<<<<< HEAD
// =======
//   const handleViewTeachersList = () => {
//     router.push('/Academic/viewteacherslist');
//   };

// >>>>>>> 2d6a1dc0c1d2447cc20c04071e06bd19ba334117
  const handleViewTeacherSchedule = () => {
    router.push('/Academic/viewTeacherSchedule');
  };

  const toggleMenu = (index: number) => {
    setMenuVisible((prev) => {
      const newMenuVisible = [...prev];
      newMenuVisible[index] = !newMenuVisible[index];
      return newMenuVisible;
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
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

  const handleSave = async() => {
    console.log('New Teacher Data:', newTeacher);
   try{
    const response = await fetch('http://localhost:5001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeacher),
    });
    const responseData = await response.json();
      console.log('Response:', response.status, responseData);
   }catch{
    console.error('Error saving new teacher:');
   }
    closeModal();
  };
  return (
    <BaseLayout1>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-2">
          <div className='flex items-center space-x-2 p-4'>
            <h2 className="text-2xl font-semibold text-[#223857]">Teachers List</h2>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg p-2 mx-4 shadow`}
                />
                <button className="flex items-center bg-white px-4 rounded-lg shadow">
                  <FaFilter className="mr-2 text-[#223857]" /> Filter
                </button>
              </div>
              <div className='flex px-4'>
                <button className={`border p-2 rounded-lg shadow flex items-center mx-4 bg-[#223857] text-white`} onClick={openModal}>
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow `}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-6 gap-4 p-6" style={{ width: '100%' }}>
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 w-48">
                <div className="flex justify-between items-center">
                  <Image
                    src={teacher.profileImage || "/assets/images/proff.jpg"}
                    alt="Teacher"
                    className="w-12 h-12 ml-12 mt-4 rounded-full" width={40} height={40}
                  />
                  <button className="text-gray-400" onClick={() => toggleMenu(index)}>
                    <HiOutlineDotsVertical size={20} className='text-[#717579]' />
                  </button>
                </div>
                {menuVisible[index] && (
                  <div className="absolute bg-white shadow-lg rounded-lg -mt-4 ml-36">
                    <button className="block text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100" onClick={handleViewTeachersList}>
                      View Teacher List
                    </button>
                    {/* <button className="block text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100" onClick={() => { handleViewStudentList(); router.push('/Academic/viewTeacherSchedule'); }}>
                      View Schedule Classes
                    </button> */}
                    <button className="block text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100" onClick={() => { handleViewTeachersList(); router.push('/Academic/messages'); }}>Chat</button>
                    <button className="block text-left px-4 py-2 text-sm text-[#223857] hover:bg-gray-100" onClick={() => toggleMenu(index)}>
                      Cancel
                    </button>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <h3 className="text-base font-bold text-[#223857] mb-2">{teacher.userName}</h3>
                  <p className="text-[#717579] text-sm">Level: {teacher.level}</p>
                  <p className="text-[#717579] p-1 text-sm">{teacher.subject}</p>
                  <div className='flex text-center justify-center'>
                    {Array.from({ length: teacher.rating || 0 }).map((_, i) => (
                      <LiaStarSolid key={i} className='text-[#223857]' />
                    ))}
                  </div>
                  <button className="mt-4 text-[11px] bg-[#223857] text-white px-4 py-1 rounded-lg" onClick={handleViewTeacherSchedule}>
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
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
          <h2 className="text-[20px] font-semibold text-[#223857] mb-4">Add New Teacher</h2>
          <div className="mb-4">
            <label className="block text-[#223857] mb-2">Username</label>
            <input
              type="text"
              name="userName"
              value={newTeacher.userName}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#223857] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={newTeacher.email}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#223857] mb-2">Password</label>
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
    </BaseLayout1>
  );
}

export default ManageTeacher;




//onClick={() => { handleViewStudentList (); router.push('/Academic/viewTeacherSchedule');}}
