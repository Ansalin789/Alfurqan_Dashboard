"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoToggle, IoToggleOutline } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

// export interface Employee {
//     _id: string;
//     employeeId: string;

//     firstName: string;
//     lastName: string;
//     email: string;

//     phoneNumber: number;
//     nationality: string;
//     country: string;
//     city: string;
//     dateOfBirth: string;

//     gender: string;
//     residentialAddress: string;

//     higherQualification: string;
//     universityName: string;
//     previousJob: string;
//     experience: string;

//     bankName: string;
//     accountNumber: number;
//     bankCode: string;

//     passportNumber: string;
//     languagesKnown: string;

//     emergencyContactNumber: number;
//     relationshipWithEmployee: string;

//     address: string;

//     designation: string;
//     department: string;

//     preferedWorkingHours: number;

//     preferedShiftFrom: string;
//     preferedShiftTo: string;

//     comments: string;
//     profileImage: string;

//     applicationDate: string;
//     currency: string;
//     expectedSalary: number;

//     applicationStatus: string;
//     preferedWorkingDays: string;

//     status: string;
//     __v: number;
// }

interface Teacher {
    _id: string;
    userId: string;
    userName: string;
    password: string;
    email: string;
    profileImage: string | null;
    level?: string;
    subject?: string;
    position?: string;
    rating?: number;
    gender?: string;
}

interface TeacherNewDesignationProps {
    id?: string | null;
    onClose: () => void;
}

const TeacherNewDesignation: React.FC<TeacherNewDesignationProps> = ({
    onClose,
    id,
}) => {
    const [formData, setFormData] = useState<Teacher | null>(null);
    const [TeacherNewDesignation, setTeacherNewDesignation] = useState<Teacher | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [showRoleSection, setShowRoleSection] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [step, setStep] = useState(1);
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);





    const [toast, setToast] = useState<{ type: string; message: string } | null>(
        null
    );
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [toast]);
    //   const [employee, setEmployee] = useState<Employee | null>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("AdminAuthToken")
            : null;

    if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
    }
    const roleAccessRaw = localStorage.getItem("AdminRolePermission");

    if (roleAccessRaw) {
        try {
            const roleAccess = JSON.parse(roleAccessRaw);
            const hasRead = roleAccess?.employees?.write ?? false;
            console.log(hasRead);
        } catch (error) {
            console.error("Invalid JSON in AdminRolePermission:", error);
        }
    }

    const fetchTeachers = async (id: string) => {
        try {
            const res = await axios.get(
                "https://api.blackstoneinfomaticstech.com/users?role=TEACHER",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const teacherData: Teacher[] = res.data.users.map((user: any) => ({
                _id: user._id,
                userId: user.userId,
                userName: user.userName,
                password: user.password,
                email: user.email,
                profileImage: user.profileImage ?? "/assets/images/proff.jpg",
                position: user.position ?? "General",
                rating: 1.0, // optionally calculate or default
                gender: user.gender,
            }));
            setTeachers(teacherData);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };
    // fetchTeachers();

    useEffect(() => {
        if (id) {
            fetchTeachers(id);
        }
    }, [id]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="w-full max-w-[600px] h-[90vh] bg-white dark:bg-[#1F1F1F] dark:text-[#FFFFFF] rounded-2xl shadow-lg m-4">
                <div className="h-full overflow-y-scroll scrollbar-none p-6 space-y-6">
                    <div className="flex justify-end items-center">
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form>
                        {step === 1 && (
                            <div>
                                <div>
                                    <h2 className="text-md font-semibold text-start mb-8">Teacher Form</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData?.userName}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData?.userName}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Gender
                                            </label>
                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData?.gender}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData?.email}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phoneNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="number"
                                                name="phoneNumber"
                                                // value={formData?.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="dateOfBirth" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="text"
                                                name="dateOfBirth"
                                                // value={formData?.dateOfBirth}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] dark:[color-scheme:dark]"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                // value={formData?.city}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="country" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                // value={formData?.country}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                            />
                                        </div>


                                        <div className="col-span-2 flex justify-end mt-8 border-t border-[#DBDADA] pt-[20px]">
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h2 className="text-md font-semibold text-start mb-8">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label htmlFor="nationality" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            // value={formData?.nationality}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="occupation" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Occupation
                                        </label>
                                        <input
                                            type="text"
                                            name="occupation"
                                            // value={formData?.occupation}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maritalStatus" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Marital Status
                                        </label>
                                        <input
                                            type="text"
                                            name="maritalStatus"
                                            // value={formData?.maritalStatus}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="linkedIn" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Linked In
                                        </label>
                                        <input
                                            type="text"
                                            name="linkedIn"
                                            // value={formData?.linkedIn}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="profileImage" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Profile Image
                                        </label>
                                        <input
                                            type="text"
                                            name="profileImage"
                                            // value={formData?.profileImage}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-between mt-[105px] border-t border-[#DBDADA] pt-[20px]">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 text-xs bg-[#eff1f9] text-[#576CBC] rounded-lg border border-[#576CBC]"
                                        >
                                            ← Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div>
                                <div className="mb-[14px]">
                                    <h1 className="text-md font-semibold text-start">Academic & Professional Information</h1>
                                    <p className="text-xs text-start text-[#8B8B8B]">Please tell us about your education, occupation and experience</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="mt-3">
                                        <label htmlFor="Education" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Education
                                        </label>
                                        <input
                                            type="text"
                                            name="Education"
                                            // value={formData?.Education}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label htmlFor="yearOfExperience" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Year of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="yearOfExperience"
                                            // value={formData?.yearOfExperience}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="motherLanguage" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Mother Language
                                        </label>
                                        <input
                                            type="text"
                                            name="motherLanguage"
                                            // value={formData?.motherLanguage}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="otherLanguage" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Other Language
                                        </label>
                                        <input
                                            type="text"
                                            name="otherLanguage"
                                            // value={formData?.otherLanguage}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cv" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Upload CV
                                        </label>
                                        <input
                                            type="file"
                                            name="cv"
                                            // value={formData?.cv}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="degreeCertificate" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Degree Certificate
                                        </label>
                                        <input
                                            type="file"
                                            name="degreeCertificate"
                                            // value={formData?.degreeCertificate}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="trainingCertificate" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Training Certificate
                                        </label>
                                        <input
                                            type="file"
                                            name="trainingCertificate"
                                            // value={formData?.trainingCertificate}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="ljazahCertificate" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Ljazah or Other Certificate
                                        </label>
                                        <input
                                            type="file"
                                            name="ljazahCertificate"
                                            // value={formData?.ljazahCertificate}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-between mt-[23px] border-t border-[#DBDADA] pt-[20px]">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 text-xs bg-[#eff1f9] text-[#576CBC] rounded-lg border border-[#576CBC]"
                                        >
                                            ← Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <div className="mb-[14px]">
                                    <h1 className="text-md font-semibold text-start">Reading & Reciting</h1>
                                    <p className="text-xs text-start text-[#8B8B8B]">Please read and recite the below and upload an audio file</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2 mt-6">
                                        <div className="flex justify-between">
                                            <label htmlFor="cv" className="block text-xs font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Read the above paragraph and upload audio file
                                            </label>
                                            <p className="text-[9px] text-start text-[#8B8B8B]">Accepted formats MP3, WAV, Max size 10mb</p>
                                        </div>
                                        <input
                                            type="file"
                                            name="cv"
                                            // value={formData?.cv}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="col-span-2 mt-8">
                                        <div className="flex justify-between">
                                            <label htmlFor="degreeCertificate" className="block text-xs font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                                Please recite the first 10 ayah of Surah An-Naba & Upload audio file
                                            </label>
                                            <p className="text-[9px] text-start text-[#8B8B8B]">Accepted formats MP3, WAV, Max size 10mb</p>
                                        </div>
                                        <input
                                            type="file"
                                            name="degreeCertificate"
                                            // value={formData?.degreeCertificate}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-[7px] text-[8px] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-between mt-[118px] border-t border-[#DBDADA] pt-[20px]">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 text-xs bg-[#eff1f9] text-[#576CBC] rounded-lg border border-[#576CBC]"
                                        >
                                            ← Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 5 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="appliedPosition" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Applied Position
                                    </label>
                                    <input
                                        type="text"
                                        name="appliedPosition"
                                        // value={formData?.appliedPosition}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="doYouHaveLjazah" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Do You Have Ljazah
                                    </label>
                                    <input
                                        type="text"
                                        name="doYouHaveLjazah"
                                        // value={formData?.doYouHaveLjazah}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="canYouTajweedInEnglish" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Can You Tajweed in English ?
                                    </label>
                                    <input
                                        type="text"
                                        name="canYouTajweedInEnglish"
                                        // value={formData?.canYouTajweedInEnglish}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="doYouHaveChildren" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Do You Have Children ?
                                    </label>
                                    <input
                                        type="text"
                                        name="doYouHaveChildren"
                                        // value={formData?.doYouHaveChildren}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="interviewTime" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Interview time
                                    </label>
                                    <input
                                        type="text"
                                        name="interviewTime"
                                        // value={formData?.interviewTime}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="expectedSalaryPerHour" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Expected Salary (USD Per Hour)
                                    </label>
                                    <input
                                        type="text"
                                        name="expectedSalaryPerHour"
                                        // value={formData?.expectedSalaryPerHour}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="howManyHoursPerWeek" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        How Many Hours Per Week
                                    </label>
                                    <input
                                        type="text"
                                        name="howManyHoursPerWeek"
                                        // value={formData?.howManyHoursPerWeek}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="employmentType" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Employment Type
                                    </label>
                                    <input
                                        type="text"
                                        name="employmentType"
                                        // value={formData?.employmentType}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="status" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Status
                                    </label>
                                    <input
                                        type="text"
                                        name="status"
                                        // value={formData?.status}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <label htmlFor="designation" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                            Designation
                                        </label>
                                        <span
                                            className={`text-xs cursor-pointer ${showRoleSection ? "text-red-500" : "text-blue-500"
                                                }`}
                                            onClick={() => setShowRoleSection(!showRoleSection)}
                                        >
                                            {showRoleSection ? "Hide Role" : "Add Role"}
                                        </span>

                                    </div>
                                    <input
                                        type="text"
                                        name="designation"
                                        // value={formData?.designation}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        // value={formData?.department}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                {showRoleSection && (
                                    <>
                                        <div className="md:col-span-2 bg-[#EFF1F9] dark:bg-[#B3C2FF] dark:opacity-60 p-4 rounded-md">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="designation"
                                                        className="block text-sm font-normal text-left justify-between flex items-center text-[#576cbc] mb-1 dark:text-[#FFFFFF]"
                                                    >
                                                        Previous Designation

                                                        {/* Toggle */}
                                                        <span
                                                            className="flex items-center gap-2 cursor-pointer text-[#576cbc] "
                                                            onClick={() => setIsActive(!isActive)}
                                                        >
                                                            <span className={isActive ? "text-green-600" : "text-red-500"}>
                                                                {isActive ? "Active" : "Inactive"}
                                                            </span>

                                                            {isActive ? (
                                                                <IoToggle size={22} className="text-green-600" />
                                                            ) : (
                                                                <IoToggle size={22} className="text-gray-400 rotate-180" />
                                                            )}
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="designation"
                                                        // value={formData?.designation}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#576cbc] rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="previousDepartment"
                                                        className="block text-sm font-normal text-left text-[#576cbc] mb-1 dark:text-[#FFFFFF]"
                                                    >
                                                        New Designation
                                                    </label>
                                                    <select
                                                        name="NewDepartment"
                                                        // value={formData?.designation || ""}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev!,
                                                                designation: e.target.value,
                                                            }))
                                                        }

                                                        className="w-full border border-[#576cbc] rounded px-3 py-2 text-xs text-[#576cbc] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                                    >
                                                        <option value="">Select Designation</option>
                                                        <option value="SUPERVISOR">SUPERVISOR</option>
                                                        <option value="ACADEMICCOACH">ACADEMIC COACH</option>
                                                        <option value="TEACHER">TEACHER</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="col-span-2 flex justify-between mt-[30px] border-t border-[#DBDADA] pt-[20px]">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-4 py-2 text-xs bg-[#eff1f9] text-[#576CBC] rounded-lg border border-[#576CBC]"
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-4 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 6 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="bankName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        // value={formData?.bankName}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bankCode" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Bank Code
                                    </label>
                                    <input
                                        type="text"
                                        name="bankCode"
                                        // value={formData?.bankCode}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="accountNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        // value={formData?.accountNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="passportNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Passport Number
                                    </label>
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        // value={formData?.passportNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="languagesKnown" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Languages Known
                                    </label>
                                    <input
                                        type="text"
                                        name="languagesKnown"
                                        // value={formData?.languagesKnown}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="emergencyContactNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Emergency Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="emergencyContactNumber"
                                        // value={formData?.emergencyContactNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="relationshipWithEmployee" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Relationship with Employee
                                    </label>
                                    <input
                                        type="text"
                                        name="relationshipWithEmployee"
                                        // value={formData?.relationshipWithEmployee}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="address" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        // value={formData?.address}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="whatMakesYouIdealCandidate" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                        What Makes You Ideal Candidate
                                    </label>
                                    <textarea
                                        name="whatMakesYouIdealCandidate"
                                        // value={formData?.whatMakesYouIdealCandidate}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-between mt-[8px] border-t border-[#DBDADA] pt-[20px]">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-4 py-2 text-xs bg-[#eff1f9] text-[#576CBC] rounded-lg border border-[#576CBC]"
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        type="button"
                                        // onClick={handleUpdate}
                                        className="px-5 py-2 text-xs bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}


                    </form>
                </div>
            </div >
        </div >
    );
};

export default TeacherNewDesignation;