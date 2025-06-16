// 'use client';

// import axios from "axios";
// import React, { useState, useEffect } from "react";

// // Define interfaces for the API response
// interface Student {
//   studentFirstName: string;
//   studentLastName: string;
//   studentEmail: string;
//   studentPhone: number;
//   studentCountry: string;
//   preferredTeacher: string;
//   learningInterest: string;
// }

// interface Evaluation {
//   _id: string;
//   classStartDate: string;
//   classStartTime: string;
//   classEndTime: string;
//   student: Student;
// }

// const UpcomingClasses: React.FC = () => {
//   const [classes, setClasses] = useState<
//     { id: string; date: string; time: string; title: string; color: string }[]
//   >([]);
// //   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//          const token =
//     typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

//   if (!token) {
//     console.error("❌ AdminAuthToken not found");
//     return;
//   }
//         const academicId = localStorage.getItem("AcademicCoachPortalId");
//         console.log("academicId>>", academicId);
//         const response = await axios.get(
//           `https://api.blackstoneinfomaticstech.com/evaluationlist`,
//           {
//             method: "GET",
//             params: { academicCoachId: academicId },
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.data) {
//           throw new Error(`Failed to fetch classes: ${response.statusText}`);
//         }

//         const data = await response.data;
//         const upcomingClasses = data.evaluation
//           .filter((item: Evaluation) => {
//             const classStartDate = new Date(item.classStartDate);
//             const now = new Date();
//             return classStartDate > now; // Filter for future classes
//           })
//           .sort((a: Evaluation, b: Evaluation) => {
//             return (
//               new Date(a.classStartDate).getTime() -
//               new Date(b.classStartDate).getTime()
//             );
//           })
//           .slice(0, 2) // Take only the first 2 upcoming classes
//           .map((item: Evaluation) => ({
//             id: item._id, // Use the unique ID as the key
//             date: new Date(item.classStartDate).toLocaleDateString(), // Format date
//             time: `${item.classStartTime} - ${item.classEndTime}`, // Combine start and end time
//             title: item.student.learningInterest || "Class", // Use learning interest as title
//             color:
//               item.student.preferredTeacher === "Female"
//                 ? "blue-500"
//                 : "red-500", // Example color logic
//           }));

//         setClasses(upcomingClasses);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unexpected error occurred");
//         }
//       } finally {
//         // setLoading(false);
//       }
//     };

//     fetchClasses();
//   }, []);

// //   if (loading) {
// //     return <div className="text-center text-gray-600">Loading...</div>;
// //   }

//   if (error) {
//     return <div className="text-center text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="items-center justify-center p-4 shadow-lg rounded-[20px] bg-slate-100">
//       <h3 className="text-[13px] font-semibold text-gray-800 mb-4 text-center">
//         Upcoming Classes
//       </h3>
//       <div className="space-y-4">
//         {classes.length === 0 ? (
//           <p className="text-center text-gray-600 text-[11px]">
//             No upcoming classes.
//           </p>
//         ) : (
//           classes.map((classItem) => (
//             <div
//               key={classItem.id} // Use the unique ID as the key
//               className={`relative border-l-4 bg-white p-4 rounded-md shadow-md ${
//                 classItem.color === "blue-500"
//                   ? "border-blue-500"
//                   : "border-red-500"
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <p className="text-[11px] text-gray-600">{classItem.date}</p>
//                 <p className="text-[11px] text-gray-600">{classItem.time}</p>
//               </div>
//               <h4 className="mt-2 text-[13px] font-medium text-gray-800">
//                 {classItem.title}
//               </h4>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpcomingClasses;




'use client';

import axios from "axios";
import React, { useState, useEffect } from "react";

interface Student {
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  learningInterest: string;
}

interface Evaluation {
  _id: string;
  classStartDate: string;
  classStartTime: string;
  classEndTime: string;
  student: Student;
}

const UpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<
    { id: string; date: string; time: string; title: string; color: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found");
          return;
        }

        const academicId = localStorage.getItem("AcademicCoachPortalId");

        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/evaluationlist`,
          {
            method: "GET",
            params: { academicCoachId: academicId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data) {
          throw new Error(`Failed to fetch classes: ${response.statusText}`);
        }

        const data = response.data;
        const upcomingClasses = data.evaluation
          .filter((item: Evaluation) => {
            const classStartDate = new Date(item.classStartDate);
            const now = new Date();
            return classStartDate > now;
          })
          .sort((a: Evaluation, b: Evaluation) => {
            return (
              new Date(a.classStartDate).getTime() -
              new Date(b.classStartDate).getTime()
            );
          })
          .slice(0, 2)
          .map((item: Evaluation) => ({
            id: item._id,
            date: new Date(item.classStartDate).toLocaleDateString("en-GB"),
            time: `${item.classStartTime} - ${item.classEndTime}`,
            title: item.student.learningInterest || "Class",
            color:
              item.student.preferredTeacher === "Female"
                ? "blue-400"
                : "rose-400",
          }));

        setClasses(upcomingClasses);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchClasses();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Classes</h3>
        <button className="text-sm px-2 py-1 bg-gray-100 rounded-md text-blue-600">
          Today
        </button>
      </div>
      <div className="relative border-l-2 border-dashed border-gray-300 ml-5 space-y-6">
        {classes.length === 0 ? (
          <p className="text-center text-gray-600 text-sm">No upcoming classes.</p>
        ) : (
          classes.map((classItem, index) => (
            <div key={classItem.id} className="relative flex items-start gap-3">
              {/* Time and dot */}
              <div className="absolute -left-[40px] flex flex-col items-center">
                <span className="text-xs font-medium text-gray-700">{classItem.time.split(' ')[0]}</span>
                <div
                  className={`w-3 h-3 rounded-full mt-1 bg-${classItem.color} border-2 border-white shadow-md`}
                />
              </div>

              {/* Card */}
              <div className="bg-gray-100 rounded-md p-3 w-full shadow-sm">
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>{classItem.date}</span>
                  <span>{classItem.time}</span>
                </div>
                <h4 className={`mt-1 text-[14px] font-semibold text-${classItem.color}`}>
                  {classItem.title}
                </h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;
