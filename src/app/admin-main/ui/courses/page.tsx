import BaseLayout4 from '@/components/BaseLayout4';
import React from 'react';
import Link from 'next/link';

const cardData = [
    {
        title: 'Courses',
        idLabel: 'Course ID',
        id: 'HBC/ENG/28/29',
        totalLabel: 'Total Levels',
        total: '100',
        course: 'Islamic History',
        city: 'India',
        href: '/admin-main/ui/courses/coursedetails',
    },
    {
        title: 'Assignments',
        idLabel: 'Assignment ID',
        id: 'HBC/ENG/28/30',
        totalLabel: 'Total Levels',
        total: '100',
        course: 'Islamic History',
        city: 'UAE',
        href: '/admin-main/ui/assignments',
    },
    {
        title: 'Assessments',
        idLabel: 'Assessment ID',
        id: 'HBC/ENG/28/31',
        totalLabel: 'Total Levels',
        total: '100',
        course: 'Islamic History',
        city: 'US',
        href: '/admin-main/ui/assessments',
    },
    {
        title: 'Knowledge Base',
        idLabel: 'Knowledge Base ID',
        id: 'HBC/ENG/28/32',
        totalLabel: 'Total Levels',
        total: '100',
        course: 'Islamic History',
        city: 'India',
        href: '/admin-main/ui/knowledge',
    },
    {
        title: 'Packages',
        idLabel: 'Package ID',
        id: 'HBC/ENG/28/33',
        totalLabel: 'Total Packages',
        total: '100',
        href: '/admin-main/ui/package',
    },
];

const Page = () => {
    return (
        <BaseLayout4>
            <div className="min-h-screen mx-auto p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center overflow-y-scroll scrollbar-none h-[680px] mt-10">
                    {cardData.map((item, idx) => (
                        <Link key={idx} href={item.href} className="w-[370px]  h-[410px] bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-lg font-bold text-[#0b2447] mb-4 text-center">
                                {item.title}
                            </h2>
                            <div className='flex'>
                                <div className="w-full h-28 border border-gray-400 rounded-lg mx-auto mb-4" />
                                <p className="text-[10px] text-left text-gray-600 mb-4 leading-snug px-4">
                                    Description for this particular {item.title.toLowerCase()}, description for this particular {item.title.toLowerCase()}, description for this particular {item.title.toLowerCase()}
                                </p>
                            </div>
                            <div className="text-[10px] text-gray-600 space-y-[13px] mt-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.idLabel}</span>
                                    <span>{item.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.totalLabel}</span>
                                    <span>{item.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Date added</span>
                                    <span>11/04/2024</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Course</span>
                                    <span>{item.course}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">City</span>
                                    <span>{item.city}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Country</span>
                                    <span>Egyptian</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </BaseLayout4>
    );
};

export default Page;
