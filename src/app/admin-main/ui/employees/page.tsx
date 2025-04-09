'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sun, Bell } from "lucide-react";
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Line } from "recharts";


const datas = [
    { name: "Female", value: 40, color: "#FF82F5" }, // Pink for Female
    { name: "Male", value: 60, color: "#00CCFF" }, // Blue for Male
];
const empdatas = [
    { name: "Female", value: 40, color: "#FF82F5" }, // Pink for Female
    { name: "Male", value: 60, color: "#00CCFF" }, // Blue for Male
];
const data = [
    { name: "Total Teachers", value: 100, color: "#012A4A" },
    { name: "Active Teachers", value: 80, color: "#6256BA" },
    { name: "Inactive Teachers", value: 50, color: "#00CCFF" },
    { name: "Students on Leave", value: 60, color: "#0074FF" },
];

const empdata = [
    { name: "Academic Coach", value: 100, color: "#012A4A" },
    { name: "Supervisor", value: 50, color: "#A6C3E5" },
];

const countriesData = [
    { name: "United States", flag: "/assets/images/flags/us.png", value: 110002 },
    { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499 },
    { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998 },
    { name: "England", flag: "/assets/images/flags/england.png", value: 89061 },
    { name: "France", flag: "/assets/images/flags/france.png", value: 82000 },
];

const empcountriesData = [
    { name: "United States", flag: "/assets/images/flags/us.png", value: 110002 },
    { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499 },
    { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998 },
    { name: "England", flag: "/assets/images/flags/england.png", value: 89061 },
    { name: "France", flag: "/assets/images/flags/france.png", value: 82000 },
];

interface Teacher {
    _id: string;
    userId: string;
    userName: string;
    email: string;
    profileImage?: string | null;
    level: string;
    subject: string;
    rating: number;
}
interface OtherEmployees {
    _id: string;
    userId: string;
    userName: string;
    email: string;
    profileImage?: string | null;
    level: string;
    subject: string;
    rating: number;
}

// Mock data for teachers
const mockTeachers: Teacher[] = [
    {
        _id: "1",
        userId: "user1",
        userName: "John Smith",
        email: "john.smith@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Senior",
        subject: "Mathematics",
        rating: 4.5
    },
    {
        _id: "2",
        userId: "user2",
        userName: "Sarah Johnson",
        email: "sarah.j@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Physics",
        rating: 4.2
    },
    {
        _id: "3",
        userId: "user3",
        userName: "Michael Brown",
        email: "michael.b@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Senior",
        subject: "Chemistry",
        rating: 4.8
    },
    {
        _id: "4",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    },
    {
        _id: "5",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    },
    {
        _id: "6",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    },
    {
        _id: "7",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    },
    {
        _id: "8",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    },
    {
        _id: "9",
        userId: "user4",
        userName: "Emily Davis",
        email: "emily.d@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Biology",
        rating: 4.0
    }
];

// Mock data for other employees
const mockOtherEmployees: OtherEmployees[] = [
    {
        _id: "1",
        userId: "user5",
        userName: "David Wilson",
        email: "david.w@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Senior",
        subject: "Administration",
        rating: 4.3
    },
    {
        _id: "2",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "HR",
        rating: 4.1
    },
    {
        _id: "3",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Teacher",
        rating: 4.1
    },
    {
        _id: "4",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Supervisor",
        rating: 4.1
    },
    {
        _id: "5",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "HR",
        rating: 4.1
    },
    {
        _id: "6",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Teacher",
        rating: 4.1
    },
    {
        _id: "7",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "Academic",
        rating: 4.1
    },
    {
        _id: "8",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "HR",
        rating: 4.1
    },
    {
        _id: "9",
        userId: "user6",
        userName: "Lisa Anderson",
        email: "lisa.a@example.com",
        profileImage: "/assets/images/proff.jpg",
        level: "Junior",
        subject: "HR",
        rating: 4.1
    }
];

const Page = () => {
    const [activeTab, setActiveTab] = useState<'teachers' | 'otheremployees' | 'recruitment'>('teachers');
    const maxValue = Math.max(...countriesData.map((c) => c.value));
    const maxValue1 = Math.max(...empcountriesData.map((c) => c.value));

    const needleValue = 40; // Adjust needle based on percentage

    const cx = 90; // Center X (Adjusted for new size)
    const cy = 90; // Center Y
    const needleLength = 35; // Adjusted needle length
    const angle = (needleValue / 100) * 180; // Rotate needle based on percentage
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    const [otherEmployees, setOtherEmployees] = useState<OtherEmployees[]>(mockOtherEmployees);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchQuery1, setSearchQuery1] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        userName: "",
        email: "",
        password: "",
        role: ["TEACHER"],
        status: "Active",
        createdBy: "SYSTEM",
        profileImage: null,
        lastUpdatedBy: "SYSTEM",
    });

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTeacher((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        console.log("New Teacher Data:", newTeacher);
        try {

            const response = await fetch(`https://alfurqanacademy.tech/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTeacher),
            });
            const responseData = await response.json();
            console.log("Response:", response.status, responseData);
        } catch {
            console.error("Error saving new teacher:");
        }
        closeModal();
    };

    const handleViewTeacher = (teacherId: string) => {
        if (!teacherId) {
            console.error("Teacher ID is undefined.");
            return;
        }
        localStorage.setItem("manageTeacherId", teacherId);
        console.log("Teacher ID:", teacherId);
        router.push("/admin-main/ui/employees/teacher");
    };

    const handleViewEmployee = (employeeId: string) => {
        if (!employeeId) {
            console.error("Employee ID is undefined.");
            return;
        }
        localStorage.setItem("manageTeacherId", employeeId);
        console.log("Employee ID:", employeeId);
        router.push("/admin-main/ui/employees/otheremployees");
    };

    return (
        <BaseLayout4>
            <div className="p-6 min-h-screen mx-auto">
                <div className="p-0 flex items-center justify-between">
                    <div className="relative">
                        <h2 className='text-xl font-semibold mb-4'>Employees</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
                            <Sun size={16} className="text-black" />
                        </button>
                        <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
                            <Bell size={16} className="text-black" />
                        </button>
                        <Link href="#">
                            <img
                                src="/assets/images/student-profile.png"
                                alt="Profile"
                                className="w-8 h-8 rounded-lg border border-gray-300 shadow"
                            />
                        </Link>
                    </div>
                </div>
                <div className="flex space-x-4 border-b py-2">
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'teachers' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('teachers')}
                    >
                        Teachers
                    </button>
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'otheremployees' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('otheremployees')}
                    >
                        Other Employees
                    </button>
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'recruitment' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('recruitment')}
                    >
                        Recruitment
                    </button>
                </div>

                {/* Tab Content */}
                <div className="">
                    {activeTab === 'teachers' && (
                        <div className="flex">
                            <main className="flex-grow py-2">
                                <div className="flex gap-10 w-full">
                                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-[400px] h-[230px]">
                                        <h2 className="text-[14px] font-semibold mb-4 text-gray-700">Teachers Records</h2>
                                        <div className="flex">
                                            {/* Legend */}
                                            <div className="space-y-4 mr-8">
                                                {data.map((item) => (
                                                    <div key={item.name} className="flex items-center space-x-3">
                                                        <div className="w-[10px] h-[10px] rounded-[3px]" style={{ background: item.color }}></div>
                                                        <span className="text-[12px] text-gray-600">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Chart */}
                                            <div className="">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={data} barSize={50}>
                                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" axisLine={false} tick={false} />
                                                        <YAxis hide />
                                                        <Tooltip cursor={{ fill: "transparent" }} />
                                                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                                            {data.map((entry, index) => (
                                                                <Cell key={index} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-[230px] w-[250px]">
                                        {/* Title */}
                                        <h2 className="text-[14px] font-semibold text-gray-700">Gender</h2>

                                        {/* Chart Container */}
                                        <div className="flex flex-col items-center">
                                            <ResponsiveContainer width={180} height={105}>
                                                <PieChart>
                                                    {/* Semi-circle Gauge */}
                                                    <Pie
                                                        data={datas}
                                                        dataKey="value"
                                                        cx="50%"
                                                        cy="100%"
                                                        startAngle={180}
                                                        endAngle={0}
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        fill="#ccc"
                                                        stroke="none"
                                                    >
                                                        {datas.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>

                                                    {/* Needle */}
                                                    <Line
                                                        x1={cx}
                                                        y1={cy}
                                                        x2={cx + needleLength * Math.cos((angle * Math.PI) / 180)}
                                                        y2={cy - needleLength * Math.sin((angle * Math.PI) / 180)}
                                                        stroke="black"
                                                        strokeWidth={2}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>

                                            {/* Percentage Labels */}
                                            <div className="flex justify-between w-full px-6 mt-2 text-gray-700">
                                                {/* Female Section */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[18px] font-semibold">40%</span>
                                                    <span className="text-[10px]">Female</span>
                                                    <div className="w-14 h-1 bg-[#FF82F5] mt-1"></div>
                                                </div>

                                                {/* Male Section */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[18px] font-semibold">60%</span>
                                                    <span className="text-[10px]">Male</span>
                                                    <div className="w-14 h-1 bg-[#00CCFF] mt-1"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-[350px]">
                                        <h2 className="text-[16px] font-semibold mb-2 text-gray-800">Countries</h2>

                                        <div className="space-y-2">
                                            {countriesData.map((country) => (
                                                <div key={country.name} className="flex flex-1 flex-row gap-6">
                                                    {/* Top Row: Flag + Country Name & Value */}
                                                    <div>
                                                        <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
                                                    </div>
                                                    <div className="-mt-2">
                                                        <div className="flex justify-between">
                                                            <div className="gap-2">
                                                                <span className="text-[11px] font-medium text-gray-700">{country.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] font-semibold text-[#809FB8]">
                                                                    {country.value.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Progress Bar */}
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-[250px]">
                                                            <div
                                                                className="h-2 bg-[#012A4A] rounded-full"
                                                                style={{ width: `${(country.value / maxValue) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-2 w-[490px]">
                                    <div className="flex">
                                        <div className="flex-1 p-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex flex-1 space-x-0 items-center justify-between">
                                                    <div className="flex ml-0">
                                                        <input
                                                            type="text"
                                                            placeholder="Search here..."
                                                            className="border rounded-lg px-2 py-2 text-[12px] mr-4 shadow"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex">
                                                        {/* <button className={`border p-2 rounded-lg shadow flex items-center mx-4 bg-[#223857] text-white`} onClick={openModal}>
                  <FaPlus className="mr-2" /> Add new
                </button> */}<h2 className='text-[12px] mt-2 p-2 font-semibold'>Duration:</h2>
                                                        <select className="border rounded-lg p-2 shadow text-[12px]">
                                                            <option>Last month</option>
                                                            <option>Last week</option>
                                                            <option>Last year</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Cards */}
                                            <div className="grid grid-cols-6 gap-x-[216px] gap-y-[18px] py-2 h-56 overflow-y-scroll scrollbar-none" style={{ width: "100%" }}>
                                                {teachers
                                                    .filter(
                                                        (teacher) =>
                                                            teacher.userName
                                                                .toLowerCase()
                                                                .includes(searchQuery.toLowerCase()) ||
                                                            teacher.email
                                                                .toLowerCase()
                                                                .includes(searchQuery.toLowerCase())
                                                    )
                                                    .map((teacher, index) => (
                                                        <div
                                                            key={teacher._id}
                                                            className="bg-white shadow-md rounded-lg w-48 h-44"
                                                        >
                                                            <div className="flex justify-between items-center gap-4">
                                                                <Image
                                                                    src="/assets/images/proff.jpg"
                                                                    alt="Teacher"
                                                                    className="w-10 h-10 ml-[80px] mt-3 rounded-full"
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            </div>
                                                            <div className="mt-3 text-center">
                                                                <h3 className="text-sm font-semibold text-[#223857] mb-2">
                                                                    {teacher.userName}
                                                                </h3>
                                                                <p className="text-[#717579] text-xs">
                                                                    Level: {teacher.level}
                                                                </p>
                                                                <p className="text-[#717579] p-1 text-xs">
                                                                    {teacher.subject}
                                                                </p>
                                                                <div className="flex text-center justify-center"></div>
                                                                <button
                                                                    className="mt-2 text-[11px] bg-[#223857] text-white px-4 py-1 rounded-lg"
                                                                    onClick={() => handleViewTeacher(teacher._id)}
                                                                >
                                                                    View Profile
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    )}
                    {activeTab === 'otheremployees' && (
                        <div className="flex">
                            <main className="flex-grow py-2">
                                <div className="flex gap-10 w-full">
                                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-[400px] h-[230px]">
                                        <h2 className="text-[14px] font-semibold mb-4 text-gray-700">Employee - Department Wise</h2>
                                        <div className="flex">
                                            {/* Legend */}
                                            <div className="space-y-4 mr-8">
                                                {empdata.map((item) => (
                                                    <div key={item.name} className="flex items-center space-x-3">
                                                        <div className="w-[10px] h-[10px] rounded-[3px]" style={{ background: item.color }}></div>
                                                        <span className="text-[12px] text-gray-600">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Chart */}
                                            <div className="">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={empdata} barSize={50}>
                                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" axisLine={false} tick={false} />
                                                        <YAxis hide />
                                                        <Tooltip cursor={{ fill: "transparent" }} />
                                                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                                            {empdata.map((entry, index) => (
                                                                <Cell key={index} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-[230px] w-[250px]">
                                        {/* Title */}
                                        <h2 className="text-[14px] font-semibold text-gray-700">Gender</h2>

                                        {/* Chart Container */}
                                        <div className="flex flex-col items-center">
                                            <ResponsiveContainer width={180} height={105}>
                                                <PieChart>
                                                    {/* Semi-circle Gauge */}
                                                    <Pie
                                                        data={empdatas}
                                                        dataKey="value"
                                                        cx="50%"
                                                        cy="100%"
                                                        startAngle={180}
                                                        endAngle={0}
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        fill="#ccc"
                                                        stroke="none"
                                                    >
                                                        {empdatas.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>

                                                    {/* Needle */}
                                                    <Line
                                                        x1={cx}
                                                        y1={cy}
                                                        x2={cx + needleLength * Math.cos((angle * Math.PI) / 180)}
                                                        y2={cy - needleLength * Math.sin((angle * Math.PI) / 180)}
                                                        stroke="black"
                                                        strokeWidth={2}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>

                                            {/* Percentage Labels */}
                                            <div className="flex justify-between w-full px-6 mt-2 text-gray-700">
                                                {/* Female Section */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[18px] font-semibold">40%</span>
                                                    <span className="text-[10px]">Female</span>
                                                    <div className="w-14 h-1 bg-[#FF82F5] mt-1"></div>
                                                </div>

                                                {/* Male Section */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[18px] font-semibold">60%</span>
                                                    <span className="text-[10px]">Male</span>
                                                    <div className="w-14 h-1 bg-[#00CCFF] mt-1"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-[350px]">
                                        <h2 className="text-[16px] font-semibold mb-2 text-gray-800">Countries</h2>

                                        <div className="space-y-2">
                                            {empcountriesData.map((country) => (
                                                <div key={country.name} className="flex flex-1 flex-row gap-6">
                                                    {/* Top Row: Flag + Country Name & Value */}
                                                    <div>
                                                        <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
                                                    </div>
                                                    <div className="-mt-2">
                                                        <div className="flex justify-between">
                                                            <div className="gap-2">
                                                                <span className="text-[11px] font-medium text-gray-700">{country.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] font-semibold text-[#809FB8]">
                                                                    {country.value.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Progress Bar */}
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-[250px]">
                                                            <div
                                                                className="h-2 bg-[#012A4A] rounded-full"
                                                                style={{ width: `${(country.value / maxValue1) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex gap-4 mt-2 w-[490px]">
                                        <div className="flex">
                                            <div className="flex-1 p-0">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex flex-1 space-x-0 items-center justify-between">
                                                        <div className="flex ml-0">
                                                            <input
                                                                type="text"
                                                                placeholder="Search here..."
                                                                className="border rounded-lg px-2 py-2 text-[12px] mr-4 shadow"
                                                                value={searchQuery1}
                                                                onChange={(e) => setSearchQuery1(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex">
                                                            {/* <button className={`border p-2 rounded-lg shadow flex items-center mx-4 bg-[#223857] text-white`} onClick={openModal}>
                  <FaPlus className="mr-2" /> Add new
                </button> */}
                                                            <select className="border rounded-lg p-2 shadow text-[12px]">
                                                                <option>Duration: Last month</option>
                                                                <option>Duration: Last week</option>
                                                                <option>Duration: Last year</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Cards */}
                                                <div className="grid grid-cols-6 gap-x-[214px] gap-y-[21px]  py-2 h-52 overflow-y-scroll scrollbar-thin" style={{ width: "100%" }}>
                                                    {otherEmployees
                                                        .filter(
                                                            (employee) =>
                                                                employee.userName
                                                                    .toLowerCase()
                                                                    .includes(searchQuery1.toLowerCase()) ||
                                                                employee.email
                                                                    .toLowerCase()
                                                                    .includes(searchQuery1.toLowerCase())
                                                        )
                                                        .map((employee) => (
                                                            <div
                                                                key={employee._id}
                                                                className="bg-white shadow-md rounded-lg w-48 h-44"
                                                            >
                                                                <div className="flex justify-between items-center gap-4">
                                                                    <Image
                                                                        src={employee.profileImage ?? "/assets/images/proff.jpg"}
                                                                        alt="Employee"
                                                                        className="w-10 h-10 ml-[80px] mt-3 rounded-full"
                                                                        width={40}
                                                                        height={40}
                                                                    />
                                                                </div>
                                                                <div className="mt-3 text-center">
                                                                    <h3 className="text-sm font-bold text-[#223857] mb-2">
                                                                        {employee.userName}
                                                                    </h3>
                                                                    <p className="text-[#717579] text-xs">
                                                                        {employee.level}
                                                                    </p>
                                                                    <p className="text-[#717579] p-1 text-xs">
                                                                        {employee.subject}
                                                                    </p>
                                                                    <div className="flex text-center justify-center"></div>
                                                                    <button
                                                                        className="mt-2 text-[11px] bg-[#223857] text-white px-4 py-1 rounded-lg"
                                                                        onClick={() => handleViewEmployee(employee._id)}
                                                                    >
                                                                        View Profile
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </main>
                        </div>
                    )}
                    {activeTab === 'recruitment' && (
                        <div>
                            <h2 className="text-xl font-bold">Recruitment Section</h2>
                            <p>Details about recruitment will go here.</p>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayout4>
    );
};

export default Page;
