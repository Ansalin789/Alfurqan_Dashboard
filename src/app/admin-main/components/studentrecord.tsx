"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface GenderResponse {
  studentFemalePercentage: string;
  studentMalePercentage: string;
}

interface CountryStat {
  country: string;
  count: number;
  percentage: number;
}
countries.registerLocale(enLocale);




const StudentsRecord = () => {

  const [barData, setBarData] = useState<ChartDataItem[]>([]);
  const [genderData, setGenderData] = useState<ChartDataItem[]>([]);
  const [countryData, setCountryData] = useState<CountryStat[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchStudentCounts(token);
        fetchGenderData(token);
        fetchCountryStats(token);
      } else {
        alert("No auth token found.");
      }
    }
  }, []);
  
  const fetchStudentCounts = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:5001/alstudents/studentsrecordcount", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const count = response.data[0];
      const chartData: ChartDataItem[] = [
        { name: "Total Students", value: count.studentTotalCount, color: "#012A4A" },
        { name: "Students on Hold", value: count.onHoldStudent, color: "#A6C3E5" },
        { name: "Active Students", value: count.activeStudent, color: "#6D5DD3" },
        { name: "Inactive Students", value: count.inActiveStudent, color: "#00CFFF" },
        { name: "Students on Break", value: count.studentOnBreak, color: "#007BFF" },
      ];
      setBarData(chartData);
    } catch (error) {
      console.error("Error fetching student status count:", error);
    }
  };
  
  const fetchGenderData = async (token: string) => {
    try {
      const response = await axios.get<GenderResponse>(
        "http://localhost:5001/alstudents/studentsGender",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      const genderChartData: ChartDataItem[] = [
        { name: "Female", value: parseFloat(response.data.studentFemalePercentage), color: "#FF82F5" },
        { name: "Male", value: parseFloat(response.data.studentMalePercentage), color: "#00CFFF" },
      ];
      setGenderData(genderChartData);
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };
  
  const fetchCountryStats = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:5001/alstudents/studentscountrycount", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      setCountryData(response.data.studentCountByCountry);
    } catch (error) {
      console.error("Failed to fetch country stats", error);
    }
  };
  

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14 w-full">
    {/* Student Record */}
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full lg:max-w-[580px] h-auto lg:h-[250px]">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Student Record</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="space-y-4 text-xs mb-3 sm:mb-0 sm:mr-3">
            {barData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tick={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
  
                {/* Gender Chart */}
                      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[250px] flex flex-col items-center justify-between relative">
    <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>
  
    {/* Chart */}
    <div className="relative w-[170px] h-[100px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genderData}
            dataKey="value"
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
          >
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Optional center line below pie */}
      <div className="absolute left-1/2 bottom-0 w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
    </div>
  
    {/* Labels */}
    <div className="flex justify-between w-full px-5 text-gray-700 text-[14px] mb-5">
      {genderData.map((item) => (
        <div key={item.name} className="flex flex-col items-center">
          <span className="text-[18px] font-bold">{item.value}%</span>
          <span className="text-[12px]">{item.name}</span>
          <div
            className="w-10 h-1 mt-1 rounded-full"
            style={{ backgroundColor: item.color }}
          ></div>
        </div>
      ))}
    </div>
  </div>
  
                    {/* Countries Block */}
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full sm:max-w-[270px] h-[250px] space-y-3 overflow-y-auto scrollbar-hide">
        <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
        {countryData.map((country, i) => {
          // Get 2-letter country code
          const countryCode = countries.getAlpha2Code(country.country, "en");
          // Construct the flag URL
          const flagUrl = countryCode
            ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
            : "/assets/images/flags/default.png"; // Use a default image if no flag is found
  
          return (
            <div key={i} className="flex items-center gap-2">
              {/* Flag */}
              <img
                src={flagUrl}
                alt={country.country}
                className="w-5 h-5 rounded-full"
              />
  
              <div className="w-full">
                {/* Country name and value */}
                <div className="flex justify-between text-[13px] font-medium text-gray-800">
                  <span>{country.country}</span>
                  <span className="text-[#809FB8]">
                    {country.count.toLocaleString()}
                  </span>
                </div>
  
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-2 bg-[#012A4A] rounded-full"
                    style={{
                      width: `${country.percentage}%`, // Using percentage directly from response
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
  </div>
  
  );
};

export default StudentsRecord;
