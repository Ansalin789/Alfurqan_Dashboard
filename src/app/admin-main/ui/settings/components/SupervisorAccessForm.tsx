"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaRegMinusSquare } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PermissionType = 'read' | 'write' | 'delete';

interface Permission {
    read: boolean;
    write: boolean;
    delete: boolean;
}

type ModuleAccess = {
    [key: string]: Permission;
};

interface SupervisorAccessFormProps {
    employeeId: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const SupervisorAccessForm: React.FC<SupervisorAccessFormProps> = ({ employeeId, onCancel, onSuccess }) => {
    const router = useRouter();

    const [permissions, setPermissions] = useState<Record<string, ModuleAccess>>({
        supervisormodules: {},
    });

    const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});

    const modules = [
        'Dashboard',
        'Recruitment',
        'Meeting&Training',
        'Teachers',
        'Messages',
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
            typeof window !== 'undefined' ? localStorage.getItem('AdminAuthToken') : null;

        if (!token) {
            console.error("❌ AdminAuthToken not found");
            return;
        }

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
            const supervisorModules = access?.supervisormodules ?? {};

            const selected: Record<string, boolean> = {};
            const modulePermissions: ModuleAccess = {};

            modules.forEach((module) => {
                const key = getModuleKey(module);
                const perms = supervisorModules[key] ?? { read: false, write: false, delete: false };

                selected[key] = perms.read || perms.write || perms.delete;
                modulePermissions[key] = perms;
            });

            setSelectedModules(selected);
            setPermissions({ supervisormodules: modulePermissions });
        } catch (error) {
            toast.error('Error loading employee access data');
        }
    };

    const toggleModule = (module: string, permission?: PermissionType) => {
        if (!permission) {
            setSelectedModules((prev) => ({
                ...prev,
                [module]: !prev[module],
            }));

            setPermissions((prev) => ({
                ...prev,
                supervisormodules: {
                    ...prev.supervisormodules,
                    [module]: {
                        read: !prev.supervisormodules[module]?.read,
                        write: !prev.supervisormodules[module]?.write,
                        delete: !prev.supervisormodules[module]?.delete,
                    },
                },
            }));
        } else {
            setPermissions((prev) => ({
                ...prev,
                supervisormodules: {
                    ...prev.supervisormodules,
                    [module]: {
                        ...prev.supervisormodules[module],
                        [permission]: !prev.supervisormodules[module]?.[permission],
                    },
                },
            }));
        }
    };

    const handleUpdateAccess = async () => {
        const roleAccess = {
            supervisor: true,
            supervisormodules: permissions.supervisormodules,
        };

        const token =
            typeof window !== 'undefined' ? localStorage.getItem('AdminAuthToken') : null;

        if (!token) return;

        try {
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

            toast.success('Access updated successfully!');

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
            const clearedSelectedModules: Record<string, boolean> = {};
            const clearedPermissions: ModuleAccess = {};

            modules.forEach((module) => {
                const key = getModuleKey(module);
                clearedSelectedModules[key] = false;
                clearedPermissions[key] = {
                    read: false,
                    write: false,
                    delete: false,
                };
            });

            setSelectedModules(clearedSelectedModules);

            setPermissions({
                supervisormodules: clearedPermissions,
            });
        }
    };

    return (
        <div className="mt-3">
            <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-t-[20px]">
                <table className="w-full table-auto rounded-t-[20px]">
                    <thead className="text-[12px] bg-[#4C6993] text-white rounded-t-[20px]">
                        <tr className="rounded-t-[20px]">
                            <th className="p-3 text-[13px] text-left flex ml-1 gap-3">
                                <FaRegMinusSquare className="rounded mt-1 text-[13px]" />
                                Modules
                            </th>
                            <th className="p-3 text-left">Read</th>
                            <th className="p-3 text-left">Write</th>
                            <th className="p-3 text-left">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {modules.map((module) => {
                            const moduleKey = getModuleKey(module);

                            return (
                                <tr key={module} className="odd:bg-white even:bg-[#F8F8F8] dark:odd:bg-[#2C2C2C] dark:even:bg-[#303030]">
                                    <td className="p-4 flex items-center w-[74%] space-x-3">
                                        <label className="flex items-center cursor-pointer space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedModules[moduleKey] ?? false}
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

                                        <span className="text-[12px] text-[#344054] dark:text-white">
                                            {module}
                                        </span>
                                    </td>


                                    {['read', 'write', 'delete'].map((perm) => (
                                        <td key={perm} className="p-2 text-center w-[20%]">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        permissions.supervisormodules[moduleKey]?.[
                                                        perm as PermissionType
                                                        ] ?? false
                                                    }
                                                    onChange={() =>
                                                        toggleModule(moduleKey, perm as PermissionType)
                                                    }
                                                    className="sr-only"
                                                />

                                                <div
                                                    className={`
                                                            h-4 w-4
                                                            rounded-[5px]
                                                            border-2
                                                            flex items-center justify-center
                                                            transition-all
                                                            ${permissions.supervisormodules[moduleKey]?.[
                                                            perm as PermissionType
                                                        ]
                                                            ? "bg-[#576CBC] border-[#576CBC]"
                                                            : "border-[#576CBC]"
                                                        }`}
                                                >
                                                    {permissions.supervisormodules[moduleKey]?.[
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
                                                <span className="ml-2 text-[12px] text-[#344054] dark:text-[#fff]">
                                                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                                                </span>
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

export default SupervisorAccessForm;
