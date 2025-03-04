"use client";
import axios from "axios";
import React, {  useEffect, useState } from "react";
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

function  AssignList(){

    const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const storedStudentId = localStorage.getItem('StudentPortalId');
      const auth = localStorage.getItem('TeacherAuthToken');
      try {
        const response = await axios.get("http://alfurqanacademy.tech:5001/allAssignment", {
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
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (assignment:Assignment) => assignment.status === "completed"
  ).length;
  const pendingAssignments = totalAssignments - completedAssignments;
    const cards = [
      {
        id: "card1",
        name: "Total Assignment Assigned",
        value: totalAssignments,
        count: totalAssignments,
        icon: "📋",
        color: "#FEC64F",
      },
      {
        id: "card2",
        name: "Total Assignment Completed",
        value: completedAssignments ,
        count: completedAssignments ,
        icon: "📄",
        color: "#00D9B0",
      },
      {
        id: "card3",
        name: "Total Assignment Pending",
        value: pendingAssignments,
        count: pendingAssignments,
        icon: "⏳",
        color: "#FC6B57",
      },
    ];
    return (
      <div className="p-4 w-[1250px] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 p-2 -ml-4">
          Current Status
        </h2>
        <div className="flex justify-center gap-6 p-4 -ml-14">
          {cards.map((c) => (
            <div
              key={c.id}
              className="w-[330px] h-[150px] bg-white rounded-lg shadow-md flex items-center p-4"
            >
              {/* Circular Progress */}
              <div className="mr-6 flex justify-center items-center relative">
                <svg
                  className="w-[100px] h-[90px] transform rotate-[-90deg]"
                  viewBox="0 0 36 36"
                >
                  {/* Background Circle */}
                  <path
                    className="text-gray-300"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4" /* Background circle thickness */
                  ></path>
                  {/* Progress Circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c.color}
                    strokeWidth="4.5" /* Progress circle thickness */
                    strokeDasharray={`${c.value}, 100`}
                  ></path>
                </svg>
                {/* Percentage Value */}
                <div className="absolute text-[14px] font-bold text-gray-800">
                  {c.value}%
                </div>
              </div>
              {/* Text and Icon */}
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
    );
  }


export default AssignList;
