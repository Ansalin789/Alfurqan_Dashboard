'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';
import { useSearchParams } from 'next/navigation';

interface Level {
    levelId: string;
    contentLevel: string;
    descriptions: string;
    duration: string;
}

interface Course {
    courseId: string;
    courseTitle: string;
    courseDuration: string;
    courseDescription: string;
    courseLevel: string;
}

interface CoursePayload {
    course: Course;
    courseName: string;
    level: Level[];
    status: string;
    createdDate: string;
    createdBy: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
}

interface CourseData {
    courseName: string;
    description: string;
    level: string;
    duration: string;
    maxLevels: number;
    levelNumber: number;
}

const Page = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [showForm, setShowForm] = useState(false);
    const searchParams = useSearchParams();
    const courseTitle = searchParams.get('title');
    const courseId = searchParams.get('courseId');
    const maxLevels = parseInt(searchParams.get('maxLevels') || '0');
    const [currentLevelCount, setCurrentLevelCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch levels from database
    const fetchLevels = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://api.blackstoneinfomaticstech.com/courseslevels?courseId=${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course details');
            
            const data = await response.json(); 
             console.log(data);
            // Because response is not an array, update accordingly
            if (data && data.courses && data.courses.length > 0 && Array.isArray(data.courses[0].level)) {
                const levels = data.courses[0].level.map((level: any, index: number) => ({
                    courseName: data.courses[0].course?.courseTitle || courseTitle || '',
                    description: level.descriptions.data,
                    level: level.contentLevel,
                    duration: level.duration,
                    maxLevels,
                    levelNumber: index + 1
                }));
               console.log(levels)
                setCourses(levels);
                setCurrentLevelCount(levels.length);
            }
        } catch (error) {
            console.error('Error fetching levels:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        if (courseTitle) {
            fetchLevels();
        }
    }, [courseTitle]);

    const [form, setForm] = useState<CourseData>({
        courseName: courseTitle || '',
        description: '',
        duration: '',
        level: '',
        maxLevels,
        levelNumber: 0
    });

    const handleSubmit = async () => {
        // Check if we've reached the maximum number of levels
        if (currentLevelCount >= maxLevels) {
            alert(`Cannot add more levels. Maximum ${maxLevels} levels allowed for this course.`);
            return;
        }

        const newLevelNumber = currentLevelCount + 1;
        const payload: CoursePayload = {
            course: {
                courseId: courseId ?? '',
                courseTitle: form.courseName,
                courseDuration: form.duration,
                courseDescription: form.description,
                courseLevel: form.level,
            },
            courseName: form.courseName,
            level: [
                {
                    levelId: `level-${Date.now()}`,
                    contentLevel: form.level,
                    descriptions: form.description,
                    duration: form.duration,
                },
            ],
            status: "Active",
            createdDate: new Date().toISOString().split("T")[0],
            createdBy: "System",
            lastUpdatedDate: new Date().toISOString().split("T")[0],
            lastUpdatedBy: "System",
        };

        try {
            const res = await fetch(`https://api.blackstoneinfomaticstech.com/courses/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update course level");

            // Add the new level with its specific number
            const newCourse = { 
                ...form, 
                maxLevels,
                levelNumber: newLevelNumber
            };
            
            setCourses(prevCourses => [...prevCourses, newCourse]);
            setCurrentLevelCount(newLevelNumber);
            
            setForm({ 
                courseName: courseTitle || '', 
                description: '', 
                duration: '', 
                level: '', 
                maxLevels,
                levelNumber: 0 
            });
            setShowForm(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit. Please try again.");
        }
    };

    const handleCardClick = (course: CourseData) => {
        console.log("Course clicked:", course);
    };

    return (
        <BaseLayout4>
            <div className="min-h-screen p-6">
                <div className="flex justify-between items-center">
                    <h2 className='font-semibold text-[23px] py-8'>{courseTitle}</h2>
                    <div className="text-sm text-gray-600">
                        Levels: {currentLevelCount}/{maxLevels}
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    {currentLevelCount < maxLevels && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-[260px] h-[220px] bg-white rounded-xl shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="w-12 h-12 bg-[#0b2447] rounded-full flex items-center justify-center">
                                <Plus color="white" size={28} />
                            </div>
                        </button>
                    )}

                    {courses.map((course, idx) => (
                        <button key={idx} onClick={() => handleCardClick(course)} className="w-[260px] cursor-pointer">
                            <Card {...course} />
                        </button>
                    ))}
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl p-4 w-[400px] max-h-[100vh] overflow-y-scroll scrollbar-none shadow-xl">
                            <h3 className="text-lg font-semibold text-[#002b4d] mb-6">Add Level Form</h3>
                            <label htmlFor="Course Name" className='block text-sm font-medium text-gray-700 mb-2 mt-2'>Course Name</label>
                            <input type='text' value={courseTitle || ''} className='w-full border rounded-xl px-4 py-2 text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]' readOnly/>
                            <FormInput label="Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
                            <FormInput label="Level Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <FormInput label="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />

                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                                <button onClick={()=>handleSubmit()} className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout4>
    );
};

const Card = ({ courseName, description, level, duration, maxLevels, levelNumber }: CourseData) => (
    <div className="w-[260px] bg-white rounded-xl shadow p-5 h-[220px]">
        <div className='grid grid-cols-2'>
            <div className="w-20 h-16 border border-gray-400 rounded-xl mx-auto mb-4" />
            <div className='font-semibold'>
                <div className="flex justify-between">
                    <span className="text-[16px] text-gray-700 font-semibold">Level {levelNumber}</span>
                </div>
                <div className="flex justify-between py-5">
                    <span className="text-[12px] text-[#7C7C7C] font-medium">Duration</span>
                    <span className='text-[9px] mt-[2px] text-[#7C7C7C]'>{duration}</span>
                </div>
            </div>
        </div>
        <div className="text-[11px] text-gray-700 font-normal space-y-[2px] ml-2 mt-3">
            <p className="text-[10px] text-[#7C7C7C] mb-4 text-left ml-2 align-middle grid grid-cols-1 overflow-hidden">{description}</p>
        </div>
    </div>
);

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
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">{label}</label>
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
