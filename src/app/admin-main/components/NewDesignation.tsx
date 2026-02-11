"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoToggle, IoToggleOutline } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export interface Employee {
    _id: string;
    employeeId: string;

    firstName: string;
    lastName: string;
    email: string;

    phoneNumber: number;
    nationality: string;
    country: string;
    city: string;
    dateOfBirth: string;

    gender: string;
    residentialAddress: string;

    higherQualification: string;
    universityName: string;
    previousJob: string;
    experience: string;

    bankName: string;
    accountNumber: number;
    bankCode: string;

    passportNumber: string;
    languagesKnown: string;

    emergencyContactNumber: number;
    relationshipWithEmployee: string;

    address: string;

    designation: string;
    department: string;

    preferedWorkingHours: number;

    preferedShiftFrom: string;
    preferedShiftTo: string;

    comments: string;
    profileImage: string;

    applicationDate: string;
    currency: string;
    expectedSalary: number;

    applicationStatus: string;
    preferedWorkingDays: string;

    status: string;
    __v: number;
}

interface NewDesignationProps {
    id?: string | null;
    onClose: () => void;
}

interface PreviousRole {
    id: string;
    name: string;
    isActive: boolean;
}
const NewDesignation: React.FC<NewDesignationProps> = ({
    onClose,
    id,
}) => {
    const [formData, setFormData] = useState<Employee | null>(null);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [newDesignation, setNewDesignation] = useState<Employee | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [showRoleSection, setShowRoleSection] = useState(false);


    const [previousRoles, setPreviousRoles] = useState<PreviousRole[]>([
    ]);

    const [rolePayload, setRolePayload] = useState<{
        roleName: string;
        isRoleActive: boolean;
    } | null>(null);


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


    const fetchEmployee = async (_id: string) => {
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("AdminAuthToken")
                    : null;

            if (!token) {
                console.error("No token");
                return;
            }

            const response = await axios.get<Employee>(
                `https://api.blackstoneinfomaticstech.com/otheremp/${_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmployee(response.data);
            console.log("employee", employee);
            setFormData(response.data);
            console.log("haiiiii", response.data);
            if (response.data.designation) {
                const roles = response.data.designation
                    .split(",") // ["ACADEMICCOACH", "TEACHER"]
                    .map((role, index) => ({
                        id: String(index + 1),
                        name: role.trim(), // ACADEMICCOACH → ACADEMIC COACH
                        isActive: true, // or customize logic if needed
                    }));
                console.log("roles", roles);
                setPreviousRoles(roles);
            }
        } catch (error: any) {
            console.error("Fetch error:", error.response?.data);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEmployee(id);
        }
    }, [id]);


    const handleUpdate = async () => {
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("AdminAuthToken")
                    : null;

            if (!token) {
                setToast({ type: "error", message: "Auth token not found" });
                return;
            }

            const payload = {
                isRole: rolePayload?.isRoleActive ? "Added" : "Removed",
                designation: [rolePayload?.roleName],
            };

            alert(JSON.stringify(payload))

            const res = await fetch(
                `http://localhost:5001/otheremp/roleupdate/${employee?._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                setToast({
                    type: "error",
                    message: result.message || "Failed to update role",
                });
                return;
            }

            setToast({
                type: "success",
                message: `Role ${rolePayload?.roleName} ${rolePayload?.isRoleActive ? "activated" : "deactivated"}`,
            });
        } catch (error) {
            console.error(error);
            setToast({ type: "error", message: "Something went wrong!" });
        }
    };





    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="w-full max-w-[600px] h-[90vh] bg-white dark:bg-[#1F1F1F] dark:text-[#FFFFFF] rounded-2xl shadow-lg m-4">
                <div className="h-full overflow-y-scroll scrollbar-none p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold">Update Employee</h2>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData?.firstName}
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
                                    value={formData?.lastName}
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
                                    Phone Number
                                </label>
                                <input
                                    type="number"
                                    name="phoneNumber"
                                    value={formData?.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData?.city}
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
                                    value={formData?.country}
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
                                    value={formData?.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] dark:[color-scheme:dark]"
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
                            <div className="md:col-span-2">
                                <label htmlFor="residentialAddress" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Residential Address
                                </label>
                                <input
                                    type="text"
                                    name="residentialAddress"
                                    value={formData?.residentialAddress}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="higherQualification" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Highest Qualification
                                </label>
                                <input
                                    type="text"
                                    name="higherQualification"
                                    value={formData?.higherQualification}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="universityName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    University/Institute Name
                                </label>
                                <input
                                    type="text"
                                    name="universityName"
                                    value={formData?.universityName}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="previousJob" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Previous Job Title
                                </label>
                                <input
                                    type="text"
                                    name="previousJob"
                                    value={formData?.previousJob}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Experience (in years)
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData?.experience}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="bankName" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData?.bankName}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="accountNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Account Number
                                </label>
                                <input
                                    type="number"
                                    name="accountNumber"
                                    value={formData?.accountNumber}
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
                                    value={formData?.bankCode}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>

                            </div>
                            <div>
                                <label htmlFor="passportNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Passport Number
                                </label>
                                <input
                                    type="text"
                                    name="passportNumber"
                                    value={formData?.passportNumber}
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
                                    value={formData?.languagesKnown}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyContactNumber" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Emergency Contact Number
                                </label>
                                <input
                                    type="number"
                                    name="emergencyContactNumber"
                                    value={formData?.emergencyContactNumber}
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
                                    value={formData?.relationshipWithEmployee}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-normal text-left text-black mb-1 dark:text-[#FFFFFF]">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData?.address}
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
                                    value={formData?.designation}
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
                                    value={formData?.department}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                                />
                            </div>
                            {showRoleSection && (
                                <div className="bg-[#EFF1F9] dark:bg-[#B3C2FF] dark:opacity-60 p-4 rounded-md">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="md:max-w-sm">
                                            <label
                                                htmlFor="previousDepartment"
                                                className="block text-sm font-normal text-left text-[#576cbc] mb-1 dark:text-[#FFFFFF]"
                                            >
                                                New Designation
                                            </label>

                                            <select
                                                name="NewDepartment"
                                                value={rolePayload?.roleName || ""}
                                                onChange={(e) =>
                                                    setRolePayload({
                                                        roleName: e.target.value,
                                                        isRoleActive: true,
                                                    })
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
                            )}

                            <div className="space-y-2 ">
                                <h3 className="text-sm text-start text-[#576cbc] dark:text-white">
                                    Previous Designation
                                </h3>

                                {previousRoles.map((role, index) => (
                                    <div
                                        key={role.id}
                                        className="flex flex-1 items-center justify-between border border-[#576cbc] rounded-lg px-4 py-1.5 dark:border-[#5C5C5C]"
                                    >
                                        {/* Role Name */}
                                        <div className="flex flex-row">
                                            <span className="text-xs font-medium dark:text-white">
                                                {role.name}
                                            </span>
                                        </div>

                                        {/* Active / Inactive Toggle */}
                                        <div
                                            className="flex flex-row items-center gap-2 cursor-pointer"
                                            onClick={() => {
                                                const newStatus = !role.isActive;

                                                // Update UI
                                                setPreviousRoles((prev) =>
                                                    prev.map((r) =>
                                                        r.id === role.id
                                                            ? { ...r, isActive: newStatus }
                                                            : r
                                                    )
                                                );

                                                // Store payload for API
                                                setRolePayload({
                                                    roleName: role.name,
                                                    isRoleActive: newStatus,
                                                });
                                            }}
                                        >

                                            <span
                                                className={`text-xs ${role.isActive ? "text-green-600" : "text-red-500"
                                                    }`}
                                            >
                                                {role.isActive ? "Active" : "Inactive"}
                                            </span>

                                            {role.isActive ? (
                                                <IoToggle size={22} className="text-green-600" />
                                            ) : (
                                                <IoToggleOutline size={22} className="text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>



                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="px-6 py-2 text-sm bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9] disabled:opacity-50"

                            >
                                Save
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewDesignation;