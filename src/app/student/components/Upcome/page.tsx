"use client";
import React, { useEffect, useState } from "react";

type StudentData = {
  id: number;
  name: string;
  mobile: string;
  country: string;
  preferredTeacher: string;
  date: string;
  time: string;
};

const Upcome = () => {
  const [evaluationList, setEvaluationList] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from API
    const auth = localStorage.getItem("StudentAuthToken");
    fetch("http://localhost:5001/evaluationlist", {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedData: StudentData[] = data.evaluation.map(
          (
            item: {
              student: {
                studentFirstName: string;
                studentLastName: string;
                studentPhone: string;
                studentCountry: string;
                preferredTeacher: string;
                preferredDate: string;
                preferredFromTime: string;
                preferredToTime: string;
              };
            },
            index: number
          ) => ({
            id: index + 1,
            name: `${item.student.studentFirstName} ${item.student.studentLastName}`,
            mobile: item.student.studentPhone,
            country: item.student.studentCountry,
            preferredTeacher: item.student.preferredTeacher,
            date: new Date(item.student.preferredDate).toLocaleDateString(),
            time: `${item.student.preferredFromTime} - ${item.student.preferredToTime}`,
          })
        );
        setEvaluationList(formattedData.slice(-4)); // Keep only the latest 3 records
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="col-span-12 -mt-4">
      <h2 className="text-[16px] font-bold text-gray-800 px-4 mb-0">Upcoming Classes</h2>
      <div className="bg-[#969DB2] p-1 rounded-lg shadow-md">
        {evaluationList.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-white rounded-xl px-4 py-[4px]"
          >
            <div className="flex">
              <span className="font-semibold text-[11px]">{`${item.id} - ${item.name}`}</span>
            </div>
            <div className="flex text-center">
              <span className="text-[10px] text-center">by {item.preferredTeacher}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-2 text-[11px]">
                <i className="fa fa-calendar" aria-hidden="true"></i>
                {item.date}
              </span>
            </div>
            <div
              className="text-[11px] px-4 py-[1px] rounded-md font-medium"
              style={{
                backgroundColor:
                  item.id % 3 === 0 ? "#7C88CC" : item.id % 3 === 1 ? "#FFD700" : "#FF69B4",
                color: "white",
                fontSize:"11px",
              }}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upcome;
