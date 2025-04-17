'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';

interface CourseData {
    courseName: string;
    description: string;
    level: string;
    duration: string;
}

const Page = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Load data on mount
    useEffect(() => {
        const saved = localStorage.getItem('courses');
        if (saved) {
            setCourses(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage when courses change
    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    const [form, setForm] = useState<CourseData>({
        courseName: '',
        description: '',
        duration: '',
        level: '',
    });

    const handleSubmit = () => {
        setCourses([...courses, form]);
        setForm({
            courseName: '',
            description: '',
            duration: '',
            level: '',
        });
        setShowForm(false);
    };

    const handleCardClick = (course: CourseData) => {
        // Handle the click event for the course card
        console.log("Course clicked:", course);
        // You can add logic here to show more details or perform other actions
    };

    return (
        <BaseLayout4>
            <div className="min-h-screen p-6">
                <h2 className='font-semibold text-[23px] py-8'>Quran</h2>
                <div className="flex flex-wrap gap-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-[260px] h-[220px] bg-white rounded-xl shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                    >
                        <div className="w-12 h-12 bg-[#0b2447] rounded-full flex items-center justify-center">
                            <Plus color="white" size={28} />
                        </div>
                    </button>

                    {/* Render Added Cards */}
                    {courses.map((course, idx) => (
                        <button key={idx} onClick={() => handleCardClick(course)} className="w-[260px] cursor-pointer">
                            <Card {...course} />
                        </button>
                    ))}
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl p-4 w-[400px] max-h-[100vh] overflow-y-scroll scrollbar-none shadow-xl">
                        <h3 className="text-lg font-semibold text-[#002b4d] mb-6">
                        Add Level Form                </h3>
                            <FormInput label="Course Name" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} />
                            <FormInput label="Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
                            <FormInput label="Level Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <FormInput label="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />

                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition">Cancel</button>
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
    courseName,
    description,
    level,
    duration,
}: CourseData) => {
    return (
        <div className="w-[260px] bg-white rounded-xl shadow p-5 h-[220px]">
            <div className='grid grid-cols-2'>
                <div className="w-20 h-16 border border-gray-400 rounded-xl mx-auto mb-4" />
                <div className=' font-semibold'>
                    <div className="flex justify-between"><span className="text-[16px] text-gray-700 font-semibold">Level</span><span>{level}</span></div>
                    <div className="flex justify-between py-5"><span className="text-[12px] text-[#7C7C7C] font-medium">Duration</span><span className='text-[9px] mt-[2px] text-[#7C7C7C]'>{duration}</span></div>
                </div>
            </div>
            <div className="text-[11px] text-gray-700 font-normal space-y-[2px] ml-2 mt-3">
                <p className="text-[10px] text-[#7C7C7C] mb-4 text-left ml-2 align-middle grid grid-cols-1">{description}</p>
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
