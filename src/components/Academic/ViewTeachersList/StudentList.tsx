import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalStudents = () => {
  const [uniqueStudentNames, setUniqueStudentNames] = useState<string[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("authToken");
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const response = await axios.get("http://localhost:5001/classShedule", {
          headers: { Authorization: `Bearer ${auth}` },
        });

        const filteredData = response.data.students.filter(
          (item: any) => item.teacher.teacherId === teacherIdToFilter
        );

        // Get unique student names
        const studentNamesSet = new Set<string>();
        filteredData.forEach((item: any) => {
          const fullName = `${item.student.studentFirstName} ${item.student.studentLastName}`;
          studentNamesSet.add(fullName);
        });

        setUniqueStudentNames(Array.from(studentNamesSet));
        setTotalStudents(filteredData.length); // Total count of students
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="bg-[#CED4DC] rounded-lg shadow-lg p-6 w-72 h-[300px] ml-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Students List</h3>
        <span className="text-lg font-semibold">  {uniqueStudentNames.length}</span>
        {/* <span className="text-lg font-semibold">  {totalStudents}</span> */}

      </div>
  
        <ul className="space-y-2 overflow-y-auto h-40 scrollbar-thin scrollbar-track-black">
        
        {uniqueStudentNames.map((name) => (
            <li key={uniqueStudentNames.length} className="py-1">{name}</li>
          ))}        
        </ul>
    </div>
  );
};

export default TotalStudents;
