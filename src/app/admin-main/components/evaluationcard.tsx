"use client";

import { useEffect, useState } from "react";
import countries from "i18n-iso-countries";
import Flag from "react-world-flags";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface CourseStats {
  totalPercentage: number;
  quranPercentage: string;
  arabicPercentage: string;
  islamicPercentage: string;
}

interface CountryData {
  country: string;
  count: number;
  percentage: number;
}
interface ApiResponse {
  evaluationCount: number;
  studentCountByCountry: CountryData[];
}

interface TrialClassData {
  _id: string | null;
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  completedCount: number;
  pendingCount: number;
  studentJointCount: number;
  studentNotJointCount: number;
}

//////////////////TotalRequestChart//////////////

const TotalRequestChart = () => {
  const [chartData, setChartData] = useState([
    { name: "male", value: 0, color: "#002c5f" },
    { name: "female", value: 0, color: "#5b9bd5" },
  ]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/totaltrialclass");
        const result: TrialClassData[] = await res.json();

        if (result && result.length > 0) {
          const { totalCount = 0, maleCount = 0, femaleCount = 0 } = result[0];

          setChartData([
            { name: "male", value: maleCount, color: "#002c5f" },
            { name: "female", value: femaleCount, color: "#5b9bd5" },
          ]);

          setTotal(totalCount);
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Total Request</h2>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width={150} height={189}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text inside the chart */}
        <div className="absolute text-center">
          <div className="text-gray-500 text-sm">Total</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-3 px-3">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex flex-col items-center">
            <div className="flex items-center">
              <span
                className="w-2 h-2 rounded-sm mr-1"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-[10px] text-gray-600">
                {entry.name}({entry.value})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/////////////////countriesData//////////////////

const CountriesCard = () => {
  const [data, setData] = useState<CountryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/countiescount");
        const result: ApiResponse = await res.json();
        setData(result.studentCountByCountry);
      } catch (err) {
        console.error("Failed to fetch country data:", err);
      }
    };

    fetchData();
  }, []);

  const maxCount = Math.max(...data.map((c) => c.count), 1); // prevent divide by zero

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Countries</h2>

      <div className="space-y-4 mt-4 h-52 overflow-y-scroll scrollbar-none">
        {data.map((countryInfo) => {
          const countryCode = countries.getAlpha2Code(
            countryInfo.country,
            "en"
          );

          return (
            <div key={countryInfo.country}>
              {/* Country Row */}
              <div className="flex items-center justify-between">
                {/* Flag & Name */}
                <div className="flex items-center space-x-3">
                  {countryCode ? (
                    <Flag
                      code={countryCode}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )}
                  <span className="text-[12px] text-gray-700">
                    {countryInfo.country}
                  </span>
                </div>

                {/* Count */}
                <span className="text-[12px] font-medium text-gray-900">
                  {countryInfo.count}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#7F9CB6] mt-1">
                <div
                  className="h-2 rounded-full bg-[#0d1b2a]"
                  style={{
                    width: `${(countryInfo.count / maxCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

///////////////////PreferredTeachersCard//////////////

const COLORS = ["#0D1B2A", "#4B9EFF", "#81878B"];

const CustomTooltips = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const label = payload[0]?.name;
    const value = payload[0]?.value;
    return (
      <div className="bg-white border rounded px-2 py-1 text-xs text-gray-800 shadow">
        {label} - {value}
      </div>
    );
  }
  return null;
};

const PreferredTeachersCard = () => {
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.blackstoneinfomaticstech.com/preferedteacher"
      );
      const result = await response.json();

      // Calculate actual counts based on percentage
      const total = result.preferedTeacherPercentage;
      const maleCount = Math.round(
        (parseFloat(result.preferedTeacherMalePercentage) / 100) * total
      );
      const femaleCount = Math.round(
        (parseFloat(result.preferedTeacherFemalePercentage) / 100) * total
      );

      setMale(maleCount);
      setFemale(femaleCount);
    };

    fetchData();
  }, []);
  return (
    <div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Preferred Teachers
        </h2>
        <div className="relative flex items-center justify-center">
          <PieChart width={150} height={150}>
            <Tooltip content={<CustomTooltips />} />

            {/* Male Segment */}
            <Pie
              data={[{ name: "Male", value: male }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={55}
              startAngle={-90}
              endAngle={-90 + (male / (male + female)) * 360}
              dataKey="value"
              strokeWidth={0}
              fill={COLORS[0]}
            />

            {/* Female Segment */}
            <Pie
              data={[{ name: "Female", value: female }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={50}
              startAngle={-90 + (male / (male + female)) * 360}
              endAngle={270}
              dataKey="value"
              strokeWidth={0}
              fill={COLORS[1]}
            />

            {/* Outline */}
            <Pie
              data={[{ name: "Male", value: male }]}
              cx={75}
              cy={75}
              innerRadius={58}
              outerRadius={62}
              startAngle={-90}
              endAngle={-90 + (male / (male + female)) * 360}
              dataKey="value"
              strokeWidth={0}
              fill={COLORS[2]}
            />
          </PieChart>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-14 text-gray-700 text-sm">
        <div className="flex items-center text-[10px]">
          <span className="w-2 h-2 bg-[#0D1B2A] rounded-sm mr-1"></span>
          Male
        </div>
        <div className="flex items-center text-[10px]">
          <span className="w-2 h-2 bg-[#4B9EFF] rounded-sm mr-1"></span>
          Female
        </div>
      </div>
    </div>
  );
};

///////////////////////CoursesCard/////////////////

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white text-gray-900 text-sm px-2 py-1 rounded shadow-md border">
        {payload[0]?.value}%
      </div>
    );
  }
  return null;
};

const CoursesChart = () => {
  const [courseData, setCourseData] = useState([
    { name: "Quran", value: 0, color: "#7f9cb6" },
    { name: "Arabic", value: 0, color: "#001d3d" },
    { name: "Islamic", value: 0, color: "#4a90e2" },
  ]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/studentcourse");
        const data: CourseStats = await res.json();

        setCourseData([
          {
            name: "Quran",
            value: parseFloat(parseFloat(data.quranPercentage).toFixed()),
            color: "#7f9cb6",
          },
          {
            name: "Arabic",
            value: parseFloat(parseFloat(data.arabicPercentage).toFixed()),
            color: "#001d3d",
          },
          {
            name: "Islamic",
            value: parseFloat(parseFloat(data.islamicPercentage).toFixed(1)),
            color: "#4a90e2",
          },
        ]);
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    fetchCourseData();
  }, []);
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Courses</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart data={courseData} barCategoryGap={30}>
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} />}
            wrapperStyle={{ backgroundColor: "transparent", border: "none", boxShadow: "none",
              padding: 0, }}
              cursor={{ fill: 'transparent' }} // Optional: removes the bar hover highlight

          />
          <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={25}>
            {courseData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-6">
        {courseData.map((entry) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[10px] text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full w-full px-2 py-4 md:mr-10 scrollbar-none">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <TotalRequestChart />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <CountriesCard />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <PreferredTeachersCard />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <CoursesChart />
      </div>
    </div>
  );
}
