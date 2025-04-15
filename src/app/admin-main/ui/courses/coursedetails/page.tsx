'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';
import Link from 'next/link';

interface CourseData {
    title: string;
    courseId: string;
    description: string;
    duration: string;
    students: string;
    date: string;
    createdBy: string;
}

const Page = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Load data on mount
    useEffect(() => {
        const saved = localStorage.getItem('courses');
        console.log(saved);
        if (saved) {
            setCourses(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage when courses change
    useEffect(() => {
        console.log("courses added");
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);


    const [form, setForm] = useState<CourseData>({
        title: '',
        courseId: '',
        description: '',
        duration: '',
        students: '',
        date: '',
        createdBy: '',
    });

    const handleSubmit = () => {
        setCourses([...courses, form]);
        setForm({
            title: '',
            courseId: '',
            description: '',
            duration: '',
            students: '',
            date: '',
            createdBy: '',
        });
        setShowForm(false);
    };

    return (
        <BaseLayout4>
            <div className="min-h-screen p-8">
                <div className="flex flex-wrap gap-6">
                    {/* + Card */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-[260px] h-[290px] bg-white rounded-xl shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                    >
                        <div className="w-12 h-12 bg-[#0b2447] rounded-full flex items-center justify-center">
                            <Plus color="white" size={28} />
                        </div>
                    </button>

                    {/* Render Added Cards */}
                    {courses.map((course, idx) => (
                        <Link key={idx} href={`/admin-main/ui/courses/coursedetails/course`} className="w-[260px]">
                            <Card {...course} />
                        </Link>
                    ))}
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl p-4 w-[400px] max-h-[100vh] overflow-y-scroll scrollbar-none shadow-xl">
                        <h3 className="text-lg font-semibold text-[#002b4d] mb-6">
                        Add New Course                </h3>
                            <FormInput label="Course ID"  value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} />
                            <FormInput label="Course Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <FormInput label="Course Description"  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <FormInput label="Course Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                            <FormInput label="Number of Levels" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} />
                            <FormInput label="Creation Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            <FormInput label="Created By" value={form.createdBy} onChange={e => setForm({ ...form, createdBy: e.target.value })} />

                            <div className="mt-4 flex justify-end gap-4">
                                <button onClick={() => setShowForm(false)}className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                                <button onClick={handleSubmit} className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout4>
    );
};

const Card = ({
    title,
    courseId,
    description,
    duration,
    students,
    date,
    createdBy,
}: CourseData) => {
    return (
        <div className="w-[260px] h-[290px] bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-[#0b2447] mb-4 text-center">{title}</h2>
            <div className='grid grid-cols-2'>
                <div className="w-full h-24 border border-gray-400 rounded-xl mx-auto mb-4 grid grid-cols-1" />
                <p className="text-[10px] text-gray-600 mb-4 text-left ml-2 align-middle grid grid-cols-1">{description}</p>
            </div>
 
            <div className="text-[11px] text-gray-700 font-normal space-y-[2px] ml-2">
                <div className="flex justify-between"><span className="text-[11px] text-gray-700 font-medium">Course ID</span><span>{courseId}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-700 font-medium">Course Duration</span><span>{duration}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-700 font-medium">Number of Levels</span><span>{students}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-700 font-medium">Creation Date</span><span>{date}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-700 font-medium">Created by</span><span>{createdBy}</span></div>
            </div>
        </div>
    );
};

const FormInput = ({
    label,
    value,
    onChange,
    textarea = false,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    textarea?: boolean;
}) => (
    <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {textarea ? (
            <textarea
                value={value}
                onChange={onChange}
                className="mt-1 w-full px-3 py-2 text-sm border-[#fff] border-[2px] rounded-xl bg-[#F7F7F8]"
            />
        ) : (
            <input
                value={value}
                onChange={onChange}
                 className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
            />
        )}
    </div>
);

export default Page;
