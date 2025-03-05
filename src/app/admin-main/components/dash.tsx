"use client";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,TooltipProps } from "recharts";




//////////////////TotalScheduledChart//////////////
const TotalScheduledChart = () => {
  const data = [
    { name: "Completed", value: 234, color: "#002c5f" },
    { name: "Pending", value: 123, color: "#5b9bd5" }
  ];
  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64 text-center border border-gray-200">
    <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Scheduled</h2>

    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={150} height={189}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            dataKey="value"
            startAngle={90}
            endAngle={-270} // Ensures the gap is at the top
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center text inside the chart */}
      <div className="absolute text-center">
        <div className="text-gray-500 text-sm">Total</div>
        <div className="text-2xl font-bold text-gray-900">
          {data.reduce((sum, entry) => sum + entry.value, 0)}
        </div>
      </div>
    </div>

    {/* Legend */}
    <div className="flex justify-between mt-3 px-3">
      {data.map((entry) => (
        <div key={entry.name} className="flex flex-col items-center">
          <div className="flex items-center">
            <span
              className="w-2 h-2 rounded-sm mr-1"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-[13px] text-gray-600 ">{entry.name}</span>
          </div>
          <div className="text-[12px] font-semibold text-gray-900">{entry.value}</div>
        </div>
      ))}
    </div>
  </div>

  );
};





/////////////////countriesData//////////////////

const countriesData = [
  { name: "United States", flag: "/assets/images/flags/us.png", value: 110002, color: "#002c5f" },
  { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499, color: "#5b9bd5" },
  { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998, color: "#002c5f" },
  { name: "England", flag: "/assets/images/flags/england.png", value: 89061, color: "#5b9bd5" },
  { name: "France", flag: "/assets/images/flags/france.png", value: 82000, color: "#002c5f" },
];

const CountriesCard = () => {
  const maxValue = Math.max(...countriesData.map((c) => c.value)); // Find max for bar scaling

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Countries</h2>

      <div className="space-y-4">
        {countriesData.map((country) => (
          <div key={country.name}>
            {/* Country Row */}
            <div className="flex items-center justify-between">
              {/* Flag & Name */}
              <div className="flex items-center space-x-3">
                <img src={country.flag} alt={country.name} className="w-6 h-6 rounded-full" />
                <span className="text-[12px] text-gray-700">{country.name}</span>
              </div>

              {/* Value */}
              <span className="text-sm font-semibold text-gray-600">{country.value.toLocaleString()}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-gray-200 mt-1">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(country.value / maxValue) * 100}%`,
                  background: country.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


  
    

///////////////////PreferredTeachersCard//////////////

const data = [
  { name: "Male", value: 82, color: "#002c5f" },
  { name: "Female", value: 18, color: "#4a90e2" },
];

const PreferredTeachersCard = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Preferred Teachers</h2>

      <div className="relative flex justify-center">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={6}
            >
              <Cell fill={data[0].color} />
              <Cell fill={data[1].color} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <p className="text-xl font-semibold text-gray-900">{data[0].value}%</p>
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data[0].color }}></div>
          <span className="text-sm text-gray-700">{data[0].name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data[1].color }}></div>
          <span className="text-[12px] text-gray-700">{data[1].name}</span>
        </div>
      </div>
    </div>
  );
};

///////////////////////CoursesCard/////////////////







const courseData = [
  { name: "Quran", value: 30, color: "#7f9cb6" },
  { name: "Arabic", value: 45, color: "#001d3d" },
  { name: "Islamic", value: 60, color: "#4a90e2" },
];
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white text-gray-900 text-sm px-2 py-1 rounded shadow-md border">
        {payload[0]?.value}
      </div>
    );
  }
  return null;
};

const CoursesChart = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64 border border-gray-200 ">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Courses</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart
          data={courseData}
          barCategoryGap={30} // Controls the gap between bars
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "#7f9cb6", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
          
          <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={35}> {/* Set bar width */}
            {courseData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-6">
        {courseData.map((entry) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-[12px] text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};









export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4  w-full max-w-[1300px] mx-auto">
      <TotalScheduledChart />
      <CountriesCard />
      <PreferredTeachersCard />
      <CoursesChart />
    </div>
  );
}



  
