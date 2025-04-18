"use client";
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

//////////////////TotalScheduledChart//////////////

const TotalScheduledChart = () => {
  const data = [
    { name: "Completed", value: 234, color: "#002c5f" },
    { name: "Pending", value: 123, color: "#5b9bd5" },
  ];
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Total Scheduled</h2>

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
              <span className="text-[10px] text-gray-600 ">{entry.name}({entry.value})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/////////////////countriesData//////////////////

const countriesData = [
  {
    name: "United States",
    flag: "/assets/images/flags/us.png",
    value: 110002,
    color: "#002c5f",
  },
  {
    name: "Germany",
    flag: "/assets/images/flags/germany.png",
    value: 103499,
    color: "#5b9bd5",
  },
  {
    name: "United Kingdom",
    flag: "/assets/images/flags/united-kingdom.png",
    value: 96998,
    color: "#002c5f",
  },
  {
    name: "England",
    flag: "/assets/images/flags/england.png",
    value: 89061,
    color: "#5b9bd5",
  },
];

const CountriesCard = () => {
  const maxValue = Math.max(...countriesData.map((c) => c.value)); // Find max for bar scaling

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Countries</h2>

      <div className="space-y-4 mt-4">
        {countriesData.map((country) => (
          <div key={country.name}>
            {/* Country Row */}
            <div className="flex items-center justify-between">
              {/* Flag & Name */}
              <div className="flex items-center space-x-3">
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-[12px] text-gray-700">
                  {country.name}
                </span>
              </div>

              {/* Value */}
              <span className="text-[12px] font-medium text-gray-900">
                {country.value.toLocaleString()}
              </span>
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
  {
    title: "Students",
    count: 1738,
    male: 1200,
    female: 538,
  },
];

const COLORS = ["#0D1B2A", "#4B9EFF", "#81878B"];

const PreferredTeachersCard = () => {
  return (
    <div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Preferred Teachers
        </h2>
        <div className="relative flex items-center justify-center">
          {data.map((item) => (
            <div key={item.count}>
              <PieChart width={150} height={150}>
                <Tooltip />
                {/* Male segment - larger */}
                <Pie
                  data={[{ value: item.male }]}
                  cx={75}
                  cy={75}
                  innerRadius={0}
                  outerRadius={55}
                  startAngle={-90}
                  endAngle={-90 + (item.male / (item.male + item.female)) * 360}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                  strokeWidth={0}
                  fill={COLORS[0]}
                />
                {/* Female segment - smaller */}
                <Pie
                  data={[{ value: item.female }]}
                  cx={75}
                  cy={75}
                  innerRadius={0}
                  outerRadius={50}
                  startAngle={
                    -90 + (item.male / (item.male + item.female)) * 360
                  }
                  endAngle={270}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                  strokeWidth={0}
                  fill={COLORS[1]}
                />
                {/* Outline for male segment */}
                <Pie
                  data={[{ value: item.male }]}
                  cx={75}
                  cy={75}
                  innerRadius={58}
                  outerRadius={62}
                  startAngle={-90}
                  endAngle={-90 + (item.male / (item.male + item.female)) * 360}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                  strokeWidth={0}
                  fill={COLORS[2]}
                />
              </PieChart>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-center gap-4 mt-14 text-gray-700 text-sm">
          <div className="flex items-center text-[10px]">
            <span className="w-2 h-2 bg-[#0D1B2A] rounded-sm mr-1"></span>
            Male
          </div>
          <div className="flex items-center text-[10px] ">
            <span className="w-2 h-2 bg-[#4B9EFF] rounded-sm mr-1"></span>
            Female
          </div>
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
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
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
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Courses</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart data={courseData} barCategoryGap={30}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#7f9cb6", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} />}
            wrapperStyle={{ backgroundColor: "transparent", border: "none" }} // Remove tooltip bg
          />

          {/* Bar with border radius on both top and bottom */}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1300px] mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <TotalScheduledChart />
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
