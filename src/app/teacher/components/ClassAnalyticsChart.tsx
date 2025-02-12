import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Schedule {
  student: Student;
  teacher: Teacher;
  _id: string;
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  classStatus:string;
  scheduleStatus: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  students: Schedule[];
}

const API_URL = "http://localhost:5001/classShedule";

const ClassAnalyticsChart = () => {
  const [chartData, setChartData] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("TeacherAuthToken");
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const response = await axios.get<ApiResponse>(API_URL, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });

        const filteredData = response.data.students.filter(
          (item) => item.teacher.teacherId === teacherIdToFilter
        );

        const studentScheduleMap = new Map<string, Schedule>();

        filteredData.forEach((item) => {
          studentScheduleMap.set(item.student.studentId, item);
        });

        const uniqueSchedules = Array.from(studentScheduleMap.values());

        // Count schedule statuses
        const scheduledCount = uniqueSchedules.filter(
          (item) => item.scheduleStatus === "Scheduled"
        ).length;
        const completedCount = uniqueSchedules.filter(
          (item) => item.scheduleStatus === "Completed"
        ).length;
        const absentCount = uniqueSchedules.filter(
          (item) => item.scheduleStatus === "Absent"
        ).length;

        setChartData([scheduledCount, completedCount, absentCount]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data: ChartData<"doughnut"> = {
    labels: ["Scheduled", "Completed", "Absent"],
    datasets: [
      {
        data: chartData,
        backgroundColor: ["#FEC64F", "#0BF4C8", "#F2A0FF"],
        borderWidth: 0,
      },
    ],
  };

  const total = chartData.reduce((sum, value) => sum + value, 0);

  const options: ChartOptions<"doughnut"> = {
    cutout: "50%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"doughnut">) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        formatter: (value: number) => `${value}`,
        color: "white",
        font: {
          weight: 600,
          size: 14,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="w-[100%] bg-[#3E68A1] p-4 rounded-[17px] shadow-lg flex justify-between">
      <div className="relative w-36 h-36 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[12px] font-bold text-white bg-[#223857] rounded-full p-3">
            {total}
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
          <span>{total}</span>
        </div>
        <div className="flex flex-col ml-4 mt-3 text-[10px] text-[#A098AE]">
            {(data.labels as string[])?.map((label, index) => (
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

export default ClassAnalyticsChart;
