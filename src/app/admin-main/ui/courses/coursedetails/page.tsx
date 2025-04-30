'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';
import Link from 'next/link';

interface CourseInfo {
    courseId: string;
    courseTitle: string;
    courseDuration: string;
    courseDescription: string;
    courseLevel: string;
  }
  
  interface Level {
    levelId: string;
    contentLevel: string;
    descriptions: {
      type: string;
      data: any;
    };
    duration: string;
    _id: string;
  }
  
  interface CourseAPIResponseItem {
    _id: string;
    course: CourseInfo;
    courseName: string;
    level: Level[];
    status: string;
    createdDate: string;
    createdBy: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
    __v: number;
  }
  
  interface CoursesListResponse {
    totalCount: number;
    courses: CourseAPIResponseItem[];
  }
  
  interface Course {
    courseId: string;
    courseTitle: string;
    courseDescription: string;
    courseDuration: string;
    numberOfLevels: string;
    createdDate: string;
    createdBy: string;
    status: string;
    maxLevels: number;
  }

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load courses from localStorage on component mount


  // Fetch courses from API
  const fetchCourses = async () => {
    console.log("📥 Fetching courses...");
    try {
      setIsLoading(true);

      const response = await fetch('https://api.blackstoneinfomaticstech.com/courses');
      console.log("✅ Response received:", response);

      if (!response.ok) {
        throw new Error(`❌ Failed to fetch courses — Status: ${response.status}`);
      }

      const data: CoursesListResponse = await response.json();
      console.log("📦 Parsed JSON:", data);

      if (!data.courses || !Array.isArray(data.courses)) {
        throw new Error('❌ Invalid data format: `courses` field missing or not an array');
      }

      const transformedCourses: Course[] = data.courses.map((courseItem) => {
        if (!courseItem.course) {
          console.warn("⚠️ Missing `course` object in item:", courseItem);
          return null;
        }

        return {
          courseId: courseItem.course.courseId,
          courseTitle: courseItem.course.courseTitle,
          courseDescription: courseItem.course.courseDescription,
          courseDuration: courseItem.course.courseDuration,
          numberOfLevels: courseItem.level?.length?.toString() || '0',
          maxLevels: courseItem.level?.length || 0,
          createdDate: new Date(courseItem.createdDate).toLocaleDateString(),
          createdBy: courseItem.createdBy,
          status: courseItem.status
        };
      }).filter(Boolean) as Course[];

      console.log("✅ Transformed Courses:", transformedCourses);
      setCourses(transformedCourses);

    } catch (err) {
      console.error('❌ Error in fetchCourses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
      console.log("🔚 Finished fetching courses.");
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const [form, setForm] = useState<Omit<Course, 'status'>>({
    courseId: '',
    courseTitle: '',
    courseDescription: '',
    courseDuration: '',
    numberOfLevels: '',
    maxLevels: 0,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: 'Admin'
  });

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      
      // Convert numberOfLevels to number and validate
      const numLevels = parseInt(form.numberOfLevels);
      if (isNaN(numLevels) || numLevels < 1) {
        throw new Error('Number of Levels must be a positive number');
      }

      // Create array of levels based on numberOfLevels
      const levels = Array.from({ length: numLevels }, (_, index) => ({
        levelId: `level_${Date.now()}_${index + 1}`,
        contentLevel: "Beginner",
        descriptions: form.courseDescription,
        duration: form.courseDuration
      }));
      
      // Prepare data for API
      const newCourse = {
        course: {
          courseId: form.courseId,
          courseTitle: form.courseTitle,
          courseDuration: form.courseDuration,
          courseDescription: form.courseDescription,
          courseLevel: "Beginner"
        },
        courseName: form.courseTitle,
        level: levels,
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: form.createdBy,
        lastUpdatedDate: new Date().toISOString(),
        lastUpdatedBy: "Admin"
      };

      console.log('Sending data to API:', newCourse);

      // API call to create course
      const response = await fetch('https://api.blackstoneinfomaticstech.com/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse)
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      // Reset form and close modal
      setForm({
        courseId: '',
        courseTitle: '',
        courseDescription: '',
        courseDuration: '',
        numberOfLevels: '',
        maxLevels: 0,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Admin'
      });
      setShowForm(false);

      // Fetch courses again to update the list
      await fetchCourses();

    } catch (err) {
      console.error('Error creating course:', err);
      setError(err instanceof Error ? err.message : 'Failed to create course');
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };
 


  return (
    <BaseLayout4>
      <div className="min-h-screen p-10 mx-auto">
        <div className="flex flex-wrap gap-6 ">
          {/* Add Course Card */}
          <button
            onClick={() => setShowForm(true)}
            className="w-[260px] h-[310px] bg-white border border-gray-500 rounded-xl shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-[#0b2447] rounded-full flex items-center justify-center">
              <Plus color="white" size={28} />
            </div>
          </button>

          {/* Course Cards */}
          {courses.map((course, idx) => (
            <Link 
              key={idx} 
              href={{
                pathname: `/admin-main/ui/courses/coursedetails/course`,
                query: { 
                  title: course.courseTitle,
                  courseId :course.courseId,
                  maxLevels: course.maxLevels.toString()
                }
              }}
              className="w-[260px]"
            >
              <CourseCard {...course} />
            </Link>
          ))}
        </div>

        {/* Add Course Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-4 w-[400px] max-h-[100vh] overflow-y-scroll scrollbar-none shadow-xl">
              <h3 className="text-lg font-semibold text-[#002b4d] mb-6">Add New Course</h3>
              
              {/* <CourseFormInput 
                label="Course ID" 
                value={form.courseId} 
                onChange={e => setForm({ ...form, courseId: e.target.value })} 
              /> */}
              
              <CourseFormInput 
                label="Course Title" 
                value={form.courseTitle} 
                onChange={e => setForm({ ...form, courseTitle: e.target.value })} 
              />
              
              <CourseFormInput 
                label="Course Description" 
                value={form.courseDescription} 
                onChange={e => setForm({ ...form, courseDescription: e.target.value })}
                textarea
              />
              
              <CourseFormInput 
                label="Course Duration" 
                value={form.courseDuration} 
                onChange={e => setForm({ ...form, courseDuration: e.target.value })} 
              />
              
              <CourseFormInput 
                label="Number of Levels" 
                value={form.numberOfLevels} 
                onChange={e => setForm({ ...form, numberOfLevels: e.target.value })} 
              />
              
              <CourseFormInput 
                label="Creation Date" 
                type="date"
                value={form.createdDate} 
                onChange={e => setForm({ ...form, createdDate: e.target.value })} 
              />
              
              <CourseFormInput 
                label="Created By" 
                value={form.createdBy} 
                onChange={e => setForm({ ...form, createdBy: e.target.value })} 
              />

              <div className="mt-4 flex justify-end gap-4">
                <button 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseLayout4>
  );
};

const CourseCard = ({
  courseTitle,
  courseId,
  courseDescription,
  courseDuration,
  numberOfLevels,
  maxLevels,
  createdDate,
  createdBy,
  status
}: Course) => {
  return (
    <div className="w-[260px] h-[310px] bg-white rounded-xl shadow border border-gray-500 p-5">
      <h2 className="text-lg font-bold text-[#0b2447] mb-4 text-center">{courseTitle}</h2>
      <div className='grid grid-cols-2'>
        <div className="w-full h-24 border border-gray-400 rounded-3xl mx-auto mb-4 grid grid-cols-1" />
        <p className="text-[10px] text-gray-600 mb-4 text-left ml-2 align-middle grid grid-cols-1">
          {courseDescription.length > 100 
            ? `${courseDescription.substring(0, 100)}...` 
            : courseDescription}
        </p>
      </div>
 
      <div className="text-[11px] text-gray-700 font-normal space-y-[2px] ml-2">
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-700 font-medium">Course ID</span>
          <span>{courseId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-700 font-medium">Course Duration</span>
          <span>{courseDuration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-700 font-medium">Number of Levels</span>
          <span>{numberOfLevels}/{maxLevels}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-700 font-medium">Creation Date</span>
          <span>{createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-700 font-medium">Created by</span>
          <span className="text-xs font-medium ${
            status === 'Active' ? 'text-gray-800' : 'text-gray-600'
          }">
            {createdBy}
          </span>
        </div>
      </div>
    </div>
  );
};

const CourseFormInput = ({
  label,
  value,
  onChange,
  textarea = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  type?: string;
}) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={3}
        className="mt-1 w-full px-3 py-2 text-sm border-[#fff] border-[2px] rounded-xl bg-[#F7F7F8]"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
      />
    )}
  </div>
);

export default Page;
