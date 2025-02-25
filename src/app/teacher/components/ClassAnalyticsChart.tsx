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
          "http://localhost:5001/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );
    
        const classSchedule = response.data.classSchedule;
    
        // Map classStatus and teacherAttendee
        const statusCount: Record<string, number> = {
          Scheduled: 0,
          Completed: 0,
          Absent: 0, // Add Absent field
        };
    
        classSchedule.forEach((cls) => {
          let status = "Other";
        
          if (cls.classStatus) {
            const classStatusLower = cls.classStatus.toLowerCase();
            if (classStatusLower === "pending") {
              status = "Scheduled";
            } else if (classStatusLower === "completed") {
              status = "Completed";
            }
          }
        
          if (status !== "Other") {
            statusCount[status] = (statusCount[status] || 0) + 1;
          }
        
          // Count Absent based on teacherAttendee field
          if (cls.teacherAttendee?.toLowerCase() === "absent") {
            statusCount["Absent"] += 1;
          }
        });
        
    
        setLabels(Object.keys(statusCount));
        setChartData(Object.values(statusCount));
        setTotalClasses(classSchedule.length);
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
        backgroundColor: ["#FEC64F", "#6BF4FD", "#F2A0FF"], // Ensure "Absent" has a color
        hoverBackgroundColor: ["#FEC64F", "#6BF4FD", "#FF6384"],
      },
    ],
  };
  
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
        <h3 className="text-[16px] font-semibold text-center justify-center mb-2">
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
                {label} ({chartData[index]})
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
