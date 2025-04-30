"use client";
import BaseLayout4 from "@/components/BaseLayout4";
import { FaStar } from "react-icons/fa";
import TabbedTable from "../../components/studenttab";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface StudentResponse {
  students: StudentItem[];
}

interface StudentItem {
  avatar: string;
  rating: number;
  percentage: any;
  _id: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
  classScheduleCount: number;
  student: StudentDetails;
}

interface StudentDetails {
  studentId: string;
  studentEmail: string;
  studentPhone: number;
  course: string;
  package: string;
  city: string;
  country: string;
  gender: string;
}

export default function StudentList() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  useEffect(() => {
    const fetchAndFilterStudent = async () => {
      try {
        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/alstudents"
        );
        const allStudents: StudentItem[] = response.data.students;

        // Filter the student by studentId
        const filteredStudent = allStudents.find(
          (s) => s._id === studentId
        );

        setStudent(filteredStudent || null);
        console.log("Filtered student:", filteredStudent);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    if (studentId) {
      fetchAndFilterStudent();
    }
  }, [studentId]);
  // re-run when studentId changes

  const [student, setStudent] = useState<StudentItem | null>(null);

  return (
    <BaseLayout4>
      {student && (
        <div className="p-4 w-full overflow-hidden">
          <div
            key={student._id}
            className="bg-white shadow-md rounded-lg p-4 flex border border-gray-300 w-full h-[200px] mb-4"
          >
            {/* Left Section */}
            <div className="w-1/4 flex flex-col items-center border-r pr-4">
              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <img
                  src={
                    student.avatar?.trim()
                      ? student.avatar
                      : "/assets/images/graduating-student.png"
                  }
                  alt={student.username}
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <h3 className="mt-1 text-sm font-semibold text-center">
                {student.username}
              </h3>

              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < student.rating
                        ? "text-yellow-500 text-xs"
                        : "text-gray-300 text-xs"
                    }
                  />
                ))}
              </div>

              <div className="w-full max-w-[120px] mt-2">
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 w-2 bg-green-500"
                    style={{
                      width: `${student.percentage?.replace("%", "") || 0}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 text-center">
                  Completion: {student.percentage || "0%"}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-3/4 pl-4">
              <h2 className="text-gray-800 font-semibold mb-1 text-sm">
                Contact & Details
              </h2>
              <div className="grid grid-cols-3 gap-x-7 gap-y-1 text-xs">
                <div className="mt-2">
                  <p className="text-gray-500">Student ID</p>
                  <p className="font-semibold">{student._id}</p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold">
                    {student.student.studentEmail}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500">Gender</p>
                  <p className="font-semibold">{student.student.gender}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Courses</p>
                  <p className="font-semibold">{student.student.course}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Country</p>
                  <p className="font-semibold">{student.student.country}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">City</p>
                  <p className="font-semibold">{student.student.city}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold">
                    {student.student.studentPhone}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Packages</p>
                  <p className="font-semibold">{student.student.package}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Table Section */}
          <div className="w-full overflow-hidden">
            <TabbedTable studentId={student._id} />
          </div>
        </div>
      )}
    </BaseLayout4>
  );
}
