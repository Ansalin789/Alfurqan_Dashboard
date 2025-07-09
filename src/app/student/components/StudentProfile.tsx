"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [studentImage, setStudentImage] = useState<string | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem("StudentPortalId");
    const token = localStorage.getItem("StudentAuthToken");

    setStudentName(localStorage.getItem("StudentPortalName"));
    setStudentEmail(localStorage.getItem("StudentPortalEmail"));

    const fetchStudentImage = async () => {
      try {
        if (!studentId || !token) return;

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/classShedule/totalhours",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.invoice?.length > 0) {
          // Optional: Set student image if API has it
          // setStudentImage(response.data.invoice[0]?.student?.profileImage ?? null);
        }
      } catch (error) {
        console.error("Error fetching student image:", error);
      }
    };

    fetchStudentImage();
  }, []);

  return (
    <div className="rounded-xl shadow-lg bg-white h-[280px] dark:bg-[#343434] p-4 relative">
      <h3 className="text-[#010E30] font-semibold text-[16px] mb-2 dark:text-white">
        Student Profile
      </h3>

      <img
        src={studentImage || "https://randomuser.me/api/portraits/men/32.jpg"}
        alt="profile"
        className="w-20 h-20 rounded-full mx-auto mb-2"
      />

      <h3 className="text-[#010E30] font-bold text-[16px] dark:text-white text-center">
        {studentName ?? "Loading..."}
      </h3>
      <p className="text-gray-500 text-[12px] text-center">
        {studentEmail ?? "Loading..."}
      </p>
      <p className="text-gray-500 text-[12px] mb-2 text-center">Level - 2</p>

      <div className="flex justify-center space-x-1 mb-2">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
        <span className="text-gray-300 text-lg">★</span>
      </div>
    </div>
  );
};

export default StudentProfile;
