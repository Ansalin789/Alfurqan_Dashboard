import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  gender: "MALE" | "FEMALE";
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassSchedule {
  _id: string;
  student: Student;
  teacher: Teacher;
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  classStatus: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
  teacherAttendee: string;
}




const ClassAnalytics: React.FC = () => {
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('classData',classData);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const auth = localStorage.getItem("TeacherAuthToken");
  
        if (!teacherId) {
          setError("Teacher ID not found");
          setLoading(false);
          return;
        }
  
        const response = await axios.get<{ classSchedule: ClassSchedule[] }>(
          "https://alfurqanacademy.tech/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );
  
        const classSchedule = response.data.classSchedule;
  
        const statusCount: Record<string, number> = {
          Scheduled: 0,
          Completed: 0,
          Absent: 0,
        };
  
        classSchedule.forEach((cls) => {
          if (cls.classStatus?.toLowerCase() === "pending") {
            statusCount["Scheduled"] += 1;
          } else if (cls.classStatus?.toLowerCase() === "completed") {
            statusCount["Completed"] += 1;
          }
  
          if (cls.teacherAttendee?.toLowerCase() === "absent") {
            statusCount["Absent"] += 1;
          }
        });
  
        // Ensure total includes all statuses (Scheduled + Completed + Absent)
        const total = statusCount["Scheduled"] + statusCount["Completed"] + statusCount["Absent"];

      // Function to calculate percentage
      const calculatePercentage = (count: number) =>
        total > 0 ? ((count / total) * 100).toFixed(0) + "%" : "0%";

      // Update labels with percentage values
      const updatedLabels = [
        `Scheduled (${calculatePercentage(statusCount["Scheduled"])})`,
        `Completed (${calculatePercentage(statusCount["Completed"])})`,
        `Absent (${calculatePercentage(statusCount["Absent"])})`,
      ];
  
        setLabels(updatedLabels);
        setChartData(Object.values(statusCount));
        setTotalClasses(total); // Fix: This now correctly includes all statuses
        setClassData(classSchedule);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassData();
  }, []);
  
  

  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: ["#FEC64F", "#0BF4C8", "#F2A0FF"], // Ensure "Absent" has a color
        hoverBackgroundColor: ["#FEC64F", "#0BF4C8", "#FF6384"],
        borderWidth: 0, // ✅ Removes the white border
      },
    ],
  };
  
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "white",
        formatter: (value: number, ctx: any) => {
          let total = ctx.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          return total > 0 ? ((value / total) * 100).toFixed(0) + "%" : "0%";
        },
        font: { weight: "bold" as const, size: 12 }, // ✅ Fix applied here
      },
    },
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-[100%] bg-[#3E68A1] p-4 rounded-[17px] shadow-lg flex justify-between">
      <div className="relative w-36 h-36 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[12px] font-bold text-white bg-[#223857] rounded-full p-3">
            {totalClasses}
          </span>
        </div>
      </div>
      <div className="text-white text-sm w-[60%]">
        <h3 className="text-[13px] font-semibold ml-4 justify-center">
          Class Analytics
        </h3>
        <div className="flex justify-between items-center mr-2">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#FEC64F] mr-2"></div>
            <p className="text-[#6BF4FD] font-semibold text-[11px]">
              TOTAL CLASS ASSIGNED
            </p>
          </span>
          <span>{totalClasses}</span>
        </div>
        <div className="flex flex-col ml-4 mt-3 text-[10px] text-[#A098AE]">
          {labels.map((label, index) => (
            <div key={label} className="flex justify-between items-center">
              <span className="flex items-center">
                <div
                  className="w-2 h-2 rounded-sm mr-2"
                  style={{
                    backgroundColor: Array.isArray(data.datasets?.[0]?.backgroundColor)
                      ? data.datasets[0].backgroundColor[index] || "#000"
                      : "#000",
                  }}
                ></div>
                {label}
              </span>
              <span>{chartData[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;