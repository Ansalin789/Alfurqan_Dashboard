"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaRegMinusSquare } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PermissionType = "read" | "write" | "delete";

type Permission = {
    read: boolean;
    write: boolean;
    delete: boolean;
};

type ModuleAccess = {
    [key: string]: Permission;
};


interface AcademicCoachAccessFormProps {
    employeeId: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const AcademicCoachAccessForm: React.FC<AcademicCoachAccessFormProps> = ({ employeeId, onCancel, onSuccess }) => {
    const router = useRouter();

    const [permissions, setPermissions] = useState<Record<string, ModuleAccess>>({
        academiccoachmodules: {},
    });

    const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});

    const modules = [
        "Dashboard",
        "Trial Management",
        "Manage Students",
        "Manage Teachers",
        "Schedule",
        "Messages",
        "Support",
    ];

    const getModuleKey = (moduleName: string) =>
        moduleName.toLowerCase().replace(/ & /g, "").replace(/\s+/g, "");

    useEffect(() => {
        if (!employeeId) {
            toast.error("Employee ID not provided!");
            return;
        }

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("AdminAuthToken")
                : null;

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
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();
            const access = json?.data?.roleAccess;

            const academiccoachModules = access?.academiccoachmodules ?? {};

            const selected: Record<string, boolean> = {};
            const modulePermissions: ModuleAccess = {};

            modules.forEach((module) => {
                const key = getModuleKey(module);
                const perms = academiccoachModules[key] ?? { read: false, write: false, delete: false };
                selected[key] = perms.read || perms.write || perms.delete;
                modulePermissions[key] = perms;
            });

            setSelectedModules(selected);
            setPermissions({ academiccoachmodules: modulePermissions })
        } catch (error) {
            console.error("Failed to fetch employee data:", error);
            toast.error("Error loading employee access data");
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
                academiccoachmodules: {
                    ...prev.academiccoachmodules,
                    [module]: {
                        read: !prev.academiccoachmodules[module]?.read,
                        write: !prev.academiccoachmodules[module]?.write,
                        delete: !prev.academiccoachmodules[module]?.delete,
                    },
                },
            }));
        } else {
            setPermissions((prev) => ({
                ...prev,
                academiccoachmodules: {
                    ...prev.academiccoachmodules,
                    [module]: {
                        ...prev.academiccoachmodules[module],
                        [permission]: !prev.academiccoachmodules[module]?.[permission],
                    },
                },
            }));
        }
    };

    const handleUpdateAccess = async () => {
        const roleAccess = {
            academiccoach: true,
            academiccoachmodules: permissions.academiccoachmodules,
        };
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("AdminAuthToken")
                : null;

        if (!token) {
            toast.error("AdminAuthToken not found");
            return;
        }
        try {

            await axios.put(
                `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
                { roleAccess },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Access updated successfully!");

            if (onSuccess) {
                onSuccess();
            } else {
                // Default behavior if not handled by parent
                setTimeout(() => {
                    router.push("/admin-main/ui/settings");
                }, 1200);
            }
        } catch (error) {
            console.error("Failed to update access:", error);
            toast.error("Failed to update access");
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
                academiccoachmodules: clearedPermissions,
            });
        }
    };

    return (
        <div className="mt-3">
            <div className="w-full bg-[#FAFAFB] dark:bg-[#343434]">
                <table className="w-full table-auto">
                    <thead className="text-[12px] bg-[#4C6993] text-white">
                        <tr>
                            <th className="p-3 text-[13px] text-left flex ml-1 flex-row gap-3 ">
                                <FaRegMinusSquare className="rounded mt-1 text-[13px]" />
                                Modules
                            </th>
                            <th className="p-3 text-center w-[20%]"></th>
                            <th className="p-3 text-center w-[20%]"></th>
                            <th className="p-3 text-center w-[20%]"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {modules.map((module) => {
                            const moduleKey = getModuleKey(module);
                            return (
                                <tr key={module} className="odd:bg-white even:bg-[#F8F8F8] dark:odd:bg-[#2C2C2C] dark:even:bg-[#303030]">
                                    <td className="p-4 flex items-center w-[74%] space-x-3">
                                        <label className="flex items-center cursor-pointer">
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
                                        <span className="text-[12px] text-[#344054] dark:text-white">
                                            {module}
                                        </span>
                                    </td>

                                    {['read', 'write', 'delete'].map((perm) => (
                                        <td key={perm} className="p-2 text-center w-[20%]">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        permissions.academiccoachmodules[moduleKey]?.[
                                                        perm as PermissionType
                                                        ] || false
                                                    }
                                                    onChange={() => toggleModule(moduleKey, perm as PermissionType)}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={`
                                                            h-4 w-4
                                                            rounded-[5px]
                                                            border-2
                                                            flex items-center justify-center
                                                            transition-all
                                                            ${permissions.academiccoachmodules[moduleKey]?.[
                                                            perm as PermissionType
                                                        ]
                                                            ? "bg-[#576CBC] border-[#576CBC]"
                                                            : "border-[#576CBC]"
                                                        }`}
                                                >
                                                    {permissions.academiccoachmodules[moduleKey]?.[
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

export default AcademicCoachAccessForm;
