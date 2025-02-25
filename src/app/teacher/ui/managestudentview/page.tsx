'use client';
import React, { useEffect, useState } from 'react';
import ManageStudentView from '../../components/managestudentview';
import AssignmentList from '../../components/assignmentlist';
import axios from 'axios';

interface Assignment {
  _id: string;
  studentId: string;
  assignmentName: string;
  assignedTeacher: string;
  assignmentType: string;
  chooseType: boolean;
  trueorfalseType: boolean;
  question: string;
  hasOptions: boolean;
  audioFile: string;
  uploadFile: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  level: string;
  courses: string;
  assignedDate: string;
  dueDate: string;
  __v: number;
}

const Page = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const storedStudentId = localStorage.getItem('studentviewcontrol');
      const auth = localStorage.getItem('TeacherAuthToken');
      try {
        const response = await axios.get("http://localhost:5001/allAssignment", {
          headers: {
            Authorization: `Bearer ${auth}`,
            "Content-Type": "application/json",
          },
        });

        const filteredAssignments = response.data.assignments.filter(
          (assignment: Assignment) => assignment.studentId === storedStudentId
        );

        setAssignments(filteredAssignments);
        console.log(filteredAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  // Calculate total and completed assignments
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (assignment:Assignment) => assignment.status === "completed"
  ).length;

  // Calculate percentage of completed assignments
  const completedPercentage = totalAssignments > 0 
  ? parseFloat(((completedAssignments / totalAssignments) * 100).toFixed(2)) 
  : 0;


  const cards = [
    {
      id: "card1",
      name: "Total Assignment Assigned",
      value: totalAssignments,  // Total assignments
      count: totalAssignments,  // Total count (assigned)
      icon: "📋",
      color: "#FEC64F",
    },
    {
      id: "card2",
      name: "Total Assignment Completed",
      value: completedPercentage, // Completed percentage
      count: completedAssignments, // Completed count
      icon: "📄",
      color: "#00D9B0",
    },
  ];
  return (
   
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto">
        {/* Left Section - Student Info */}
        <div className="md:col-span-1 md:mx-auto">
          <ManageStudentView />
        </div>

        {/* Right Section - Statistics and Assignment List */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 mx-auto w-[1100px]">
              <h1 className="text-2xl font-semibold text-gray-800 p-2 -ml-32">Assignment</h1>
              <div className="flex justify-center gap-6 p-2 ml-[230px] mt-[50px]">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="w-[500px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4"
                  >
                    {/* Circular Progress */}
                    <div className="mr-6 flex justify-center items-center relative">
                      <svg
                        className="w-[90px] h-[80px] transform rotate-[-90deg]"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-gray-300"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4" /* Background circle thickness */
                        ></path>
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={c.color}
                          strokeWidth="4" /* Progress circle thickness */
                          strokeDasharray={`${c.value}, 100`}
                        >
                        </path>
                      </svg>
                      {/* Percentage Value */}  
                      <div className="absolute text-[14px] font-bold text-gray-800">
                        {c.value}%
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 text-[14px] font-semibold mb-2">
                        {c.name}
                      </p>
                      <p className="text-gray-600 text-[12px] font-medium flex items-center gap-2">
                        {c.count} <span className="text-2xl">{c.icon}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
          </div>

          {/* Assignment List */}
          
          <div className="mt-8 mx-auto">
            <AssignmentList />
          </div>
        </div>
    </div>
  );
};

export default Page;