"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PermissionType = 'read' | 'write' | 'delete';

type Permission = {
    read: boolean;
    write: boolean;
    delete: boolean;
};

type ModuleAccess = {
    [key: string]: Permission;
};

interface StudentAccessFormProps {
    employeeId: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const StudentAccessForm: React.FC<StudentAccessFormProps> = ({ employeeId, onCancel, onSuccess }) => {
    const router = useRouter();

    const [permissions, setPermissions] = useState<Record<string, ModuleAccess>>({
        studentmodules: {},
    });

    const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});

    const modules = [
        'Dashboard',
        'Classes',
        'Assignments',
        'Payments',
        'Knowledge',
        'Message',
        'Support',
    ];

    const getModuleKey = (moduleName: string) =>
        moduleName.toLowerCase().replace(/ & /g, '').replace(/\s+/g, '');

    useEffect(() => {
        if (!employeeId) {
            toast.error('Employee ID not found!');
            return;
        }

        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('AdminAuthToken')
                : null;

        if (!token) return;

        fetchEmployeeData(token);
    }, [employeeId]);

    const fetchEmployeeData = async (token: string) => {
        try {
            const res = await fetch(
                `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();
            const access = json?.data?.roleAccess;
            const studentModules = access?.studentmodules ?? {};

            const selected: Record<string, boolean> = {};
            const modulePermissions: ModuleAccess = {};

            modules.forEach((module) => {
                const key = getModuleKey(module);
                const perms =
                    studentModules[key] ?? { read: false, write: false, delete: false };

                selected[key] = perms.read || perms.write || perms.delete;
                modulePermissions[key] = perms;
            });

            setSelectedModules(selected);

            setPermissions((prev) => ({
                ...prev,
                studentmodules: modulePermissions,
            }));
        } catch (error) {
            toast.error('Error loading access data');
        }
    };

    const toggleModule = (module: string, permission?: PermissionType) => {
        if (!permission) {
            // Entire module toggle
            setSelectedModules((prev) => ({
                ...prev,
                [module]: !prev[module],
            }));

            setPermissions((prev) => {
                const newState = !selectedModules[module];

                return {
                    ...prev,
                    studentmodules: {
                        ...prev.studentmodules,
                        [module]: {
                            read: newState,
                            write: newState,
                            delete: newState,
                        },
                    },
                };
            });
        } else {
            // Individual permission toggle
            setPermissions((prev) => ({
                ...prev,
                studentmodules: {
                    ...prev.studentmodules,
                    [module]: {
                        ...prev.studentmodules[module],
                        [permission]: !prev.studentmodules[module]?.[permission],
                    },
                },
            }));
        }
    };

    const handleUpdateAccess = async () => {
        const roleAccess = {
            student: true,
            studentmodules: permissions.studentmodules,
        };

        try {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('AdminAuthToken')
                    : null;

            if (!token) return;

            await axios.put(
                `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
                { roleAccess },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Access updated!');

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => router.push('/admin-main/ui/settings'), 2000);
            }
        } catch (error) {
            toast.error('Failed to update access');
        }
    };

    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        } else {
            const clearedModules: Record<string, boolean> = {};
            const clearedPermissions: ModuleAccess = {};

            modules.forEach((module) => {
                const key = getModuleKey(module);
                clearedModules[key] = false;

                clearedPermissions[key] = {
                    read: false,
                    write: false,
                    delete: false,
                };
            });

            setSelectedModules(clearedModules);

            setPermissions({
                studentmodules: clearedPermissions,
            });
        }
    };

    return (
        <div className="mt-3">
            <div className="w-full bg-[#FAFAFB] dark:bg-[#343434]">
                <table className="w-full table-auto">
                    <thead className="text-[12px] bg-[#4C6993] text-white">
                        <tr>
                            <th className="p-3 text-left">Modules</th>
                            <th className="p-3 text-center">Read</th>
                            <th className="p-3 text-center">Write</th>
                            <th className="p-3 text-center">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {modules.map((module) => {
                            const moduleKey = getModuleKey(module);

                            return (
                                <tr key={module} className="odd:bg-white even:bg-[#F8F8F8] dark:odd:bg-[#2C2C2C] dark:even:bg-[#303030]">
                                    <td className="p-4 flex items-center space-x-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedModules[moduleKey] || false}
                                                onChange={() => toggleModule(moduleKey)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`h-4 w-4 rounded-[5px] border-2 flex items-center justify-center transition-all ${selectedModules[moduleKey]
                                                    ? "bg-[#576CBC] border-[#576CBC]"
                                                    : "border-[#576CBC]"
                                                    }`}
                                            >
                                                {selectedModules[moduleKey] && (
                                                    <svg
                                                        className="w-3.5 h-3.5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </label>
                                        <span className="text-[12px] text-[#344054] dark:text-[#fff]">{module}</span>
                                    </td>

                                    {['read', 'write', 'delete'].map((perm) => (
                                        <td key={perm} className="p-2 text-center">
                                            <label className='flex items-center justify-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        permissions.studentmodules[moduleKey]?.[
                                                        perm as PermissionType
                                                        ] || false
                                                    }
                                                    onChange={() =>
                                                        toggleModule(moduleKey, perm as PermissionType)
                                                    }
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={`
                                                            h-4 w-4
                                                            rounded-[6px]
                                                            border-2
                                                            flex items-center justify-center
                                                            transition-all
                                                            ${permissions.studentmodules[moduleKey]?.[
                                                            perm as PermissionType
                                                        ]
                                                            ? "bg-[#576CBC] border-[#576CBC]"
                                                            : "border-[#576CBC]"
                                                        }`}
                                                >
                                                    {permissions.studentmodules[moduleKey]?.[
                                                        perm as PermissionType
                                                    ] && (
                                                            <svg
                                                                className="w-3 h-3 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                </div>
                                                <span className="ml-2 text-[12px] text-[#344054] dark:text-[#fff]">{perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleCancelClick}
                    className="bg-[#e4e7f4] border border-[#576CBC] text-[#576CBC] text-[13px] px-6 py-1 rounded-lg shadow-md"
                >
                    Cancel
                </button>

                <button
                    onClick={handleUpdateAccess}
                    className="bg-[#576CBC] text-white text-[13px] px-6 py-1 rounded-lg shadow-md ml-2"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default StudentAccessForm;
