"use client";

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts"
import { Search, Filter, Plus, ChevronDown, Eye, Moon, Sun } from "lucide-react"
import BaseLayout4 from '@/components/BaseLayout4';

// Sample data
const studentData = [
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Robert James",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 1,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 2,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Gia Rose",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 5,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Prasanna Popz",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 3,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 4,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 1,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 2,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 3,
    },
    {
        id: "#0983867",
        date: "11/02/2024",
        name: "Stefan Salvatore",
        teacher: "Katherine Pierce",
        contact: "9875645234",
        classes: 12,
        level: 5,
    },
]

const countriesData = [
    { name: "United States", flag: "/assets/images/flags/us.png", value: 110002, color: "#002c5f" },
    { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499, color: "#5b9bd5" },
    { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998, color: "#002c5f" },
    { name: "England", flag: "/assets/images/flags/england.png", value: 89061, color: "#5b9bd5" },
    { name: "France", flag: "/assets/images/flags/france.png", value: 82000, color: "#002c5f" },
];

const studentsBarChartData = [
    { name: "Total", value: 280, color: "#0f172a" },
    { name: "New", value: 120, color: "#bfdbfe" },
    { name: "Active", value: 180, color: "#7c3aed" },
    { name: "Inactive", value: 100, color: "#22d3ee" },
    { name: "On Leave", value: 80, color: "#3b82f6" },
]

const genderData = [
    { name: 'Female', value: 40, color: '#f472b6' }, // pink
    { name: 'Male', value: 60, color: '#22d3ee' },  // blue
];
// Define interfaces for props
interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

interface InputProps {
    className?: string;
    [key: string]: any;
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

interface TableProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface TableHeaderProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface TableBodyProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface TableRowProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface TableHeadProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface TableCellProps {
    children: React.ReactNode;
    [key: string]: any;
}

interface CheckboxProps {
    className?: string;
    [key: string]: any;
}

interface Country {
    country: string;
    flag: string;
    value: number;
}

interface CountryProgressListProps {
    countries: Country[];
}

interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
}

// UI Components
const Button = ({ children, className, ...props }: ButtonProps) => (
    <button className={`px-2 py-[5px] rounded-md ${className}`} {...props}>
        {children}
    </button>
);

const Input = ({ className, ...props }: InputProps) => (
    <input className={`px-2 py-[5px] border border-[#798391] rounded-md ${className}`} {...props} />
);

const Card = ({ children, className, ...props }: CardProps) => (
    <div className={`bg-white text-white rounded-lg border shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

const Table = ({ children, ...props }: TableProps) => (
    <table className="w-full" {...props}>
        {children}
    </table>
);

const TableHeader = ({ children, ...props }: TableHeaderProps) => (
    <thead className="bg-gray-100 " {...props}>
        {children}
    </thead>
);

const TableBody = ({ children, ...props }: TableBodyProps) => (
    <tbody {...props}>{children}</tbody>
);

const TableRow = ({ children, ...props }: TableRowProps) => (
    <tr className="border-t hover:bg-gray-50 " {...props}>
        {children}
    </tr>
);

const TableHead = ({ children, ...props }: TableHeadProps) => (
    <th className="h-8 px-4 text-left align-middle font-medium text-gray-500 " {...props}>
        {children}
    </th>
);

const TableCell = ({ children, ...props }: TableCellProps) => (
    <td className="p-2 align-middle" {...props}>
        {children}
    </td>
);

const Checkbox = ({ className, ...props }: CheckboxProps) => (
    <input type="checkbox" className={`form-checkbox h-4 w-4 ${className}`} {...props} />
);

// Chart Components
const StudentsBarChart = () => (
    <div className="bg-[#FBFCFE] rounded-xl p-5 border border-[#D0D0D0]">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Students Record</h3>
        <div className="flex gap-6">
            <div className="w-1/4 ">
                {studentsBarChartData.map((item) => (
                    <div key={item.name} className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                ))}
            </div>
            <div className="w-3/4 h-[168px] ">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsBarChartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                        <YAxis axisLine={false} tickLine={false} tick={false} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {studentsBarChartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="value" position="top" className="fill-current font-medium text-xs" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const GenderGaugeChart = () => (
    <div className="bg-white rounded-xl p-4 shadow-md w-full border border-[#D0D0D0]">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Gender</h3>

        <div className="relative w-full h-[100px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={genderData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="70%"
                        outerRadius="100%"
                        dataKey="value"
                        paddingAngle={1}
                    >
                        {genderData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Center Circle */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-white border-[3px] border-[#22d3ee] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                </div>
            </div>
        </div>

        {/* Percentage Labels */}
        <div className="flex justify-between items-center mt-6">
            <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-800">40%</span>
                <span className="text-xs text-gray-500">Female</span>
                <div className="w-12 h-1 bg-[#f472b6] mt-1" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-800">60%</span>
                <span className="text-xs text-gray-500">Male</span>
                <div className="w-12 h-1 bg-[#22d3ee] mt-1" />
            </div>
        </div>
    </div>
);

const CountriesCard = () => {
    const maxValue = Math.max(...countriesData.map((c) => c.value)); // Find max for bar scaling

    return (
        <div className="bg-[#FBFCFE] p-5 rounded-xl shadow-md border border-[#D0D0D0]">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Countries</h2>

            <div className="space-y-2 relative w-full h-[170px] items-center justify-center">
                {countriesData.map((country) => (
                    <div key={country.name}>
                        {/* Country Row */}
                        <div className="flex items-center justify-between">
                            {/* Flag & Name */}
                            <div className="flex items-center space-x-3">
                                <img src={country.flag} alt={country.name} className="w-4 h-4 rounded-full" />
                                <span className="text-[12px] text-gray-700">{country.name}</span>
                            </div>

                            {/* Value */}
                            <span className="text-[12px] font-semibold text-gray-600">{country.value.toLocaleString()}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full mt-1">
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

// Theme Components

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

// Main Component
export default function StudentDashboard() {
    const [mounted, setMounted] = useState(false);
    const [selectedRows, setSelectedRows] = useState([studentData[0].id]);
    const [searchQuery, setSearchQuery] = useState("");

    // Handle mounting state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid hydration mismatch by not rendering until mounted
    if (!mounted) {
        return null; // or return a loading skeleton
    }

    const toggleRow = (id: string) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const getLevelStyle = (level: number) => {
        switch (level) {
            case 1:
                return "bg-green-100 text-green-800";
            case 2:
                return "bg-blue-100 text-blue-800";
            case 3:
                return "bg-purple-100 text-purple-800";
            case 4:
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-red-100 text-red-800";
        }
    };

    return (
        <BaseLayout4>
            <div className="min-h-screen w-[full] p-0">
                <div className="w-full mx-auto p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl md:text-2xl font-bold">Students List</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
                                <span className="sr-only">Notifications</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                </svg>
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                                    H
                                </div>
                                <span className="hidden md:inline font-semibold">Harsh</span>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        <Card className="col-span-1 lg:col-span-2 p-4 rounded-xl">
                            {/* <h2 className="text-lg font-semibold mb-2 text-[#223857]">Students Record</h2> */}
                            <StudentsBarChart />
                        </Card>

                        <Card className="col-span-1 lg:col-span-1 p-4 rounded-xl shadow-md text-[#223857]">
                            {/* <h2 className="text-lg font-semibold mb-2 text-[#223857]">Gender</h2> */}
                            <GenderGaugeChart />
                        </Card>

                        <Card className="col-span-1 lg:col-span-1 p-4 text-[#223857]">
                            {/* <h2 className="text-lg font-semibold mb-2">Countries</h2> */}
                            <CountriesCard />
                        </Card>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                            <Input
                                placeholder="Search here..."
                                className="pl-10 w-full md:w-[200px] text-[12px]"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" className="flex items-center gap-2 bg-gray-300 text-[12px]">
                                <Filter className="h-3 w-3" />
                                Filter
                            </Button>
                            <Button className="ml-auto md:ml-0 flex items-center gap-2 bg-[#223857] text-white text-[12px]">
                                <Plus className="h-3 w-3" />
                                Add new
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2 bg-[#223857] text-white text-[12px]">
                                Duration : Last month
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="">
                        <div className="overflow-y-auto max-h-[250px] overflow-x-auto p-2 scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
                            <table className="min-w-full rounded-lg shadow bg-[#fff]"
                                style={{ width: "100%", tableLayout: "fixed" }}>
                                <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold py-6">
                                    <tr>
                                        {/* <th className="w-[10px]">
                                            <Checkbox />
                                        </th> */}
                                        <th>Student ID</th>
                                        <th>Date of Joining</th>
                                        <th>Student Name</th>
                                        <th>Teacher Name</th>
                                        <th>Contact</th>
                                        <th>Scheduled Classes</th>
                                        <th>Level</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.map((student, index) => (
                                        <tr key={student.id} className={`text-[9px] text-center font-medium mt-0 ${index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                                            }`}>
                                            {/* <td>
                                                <Checkbox checked={selectedRows.includes(student.id)} onChange={() => toggleRow(student.id)} />
                                            </td> */}
                                            <td>{student.id}</td>
                                            <td>{student.date}</td>
                                            <td>{student.name}</td>
                                            <td className="text-gray-500">{student.teacher}</td>
                                            <td>{student.contact}</td>
                                            <td className="text-center">{student.classes}</td>
                                            <td>
                                                <span className={`px-2 py-1 rounded-md ${getLevelStyle(student.level)}`}>
                                                    {student.level}
                                                </span>
                                            </td>
                                            <td>
                                                <Button variant="outline" size="sm" className="">
                                                    <span className="flex"><Eye className="h-2 w-2 mr-1" />
                                                        View</span>

                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout4>
    )
}
