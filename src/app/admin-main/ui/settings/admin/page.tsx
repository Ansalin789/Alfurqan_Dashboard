"use client";

import AdminHeader from "@/app/admin-main/components/AdminHeader";
import BaseLayout4 from "@/components/BaseLayout4";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { FaRegMinusSquare } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

type PermissionType = "read" | "write" | "delete";
interface EmployeeAccessData {
  _id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  designation: string[];
  dateOfJoining: string;
  roleAccess: {
    admin: boolean;
    adminmodules: {
      dashboard: boolean;
      evaluation: boolean;
      student: boolean;
      employees: boolean;
      courses: boolean;
      meetings: boolean;
      classes: boolean;
      invoice: boolean;
      analytics: boolean;
      messages: boolean;
      settings: boolean;
    };
    academicCoach: boolean;
    academicmodules: {
      dashboard: boolean;
      trailmanagement: boolean;
      schedule: boolean;
      managestudents: boolean;
      manageteachers: boolean;
      messages: boolean;
      support: boolean;
    };
    supervisor: boolean;
    supervisormodules: {
      dashboard: boolean;
      recuirement: boolean;
      meeting: boolean;
      teachers: boolean;
      messages: boolean;
      support: boolean;
    };
    student: boolean;
    studentmodules: {
      dashboard: boolean;
      classes: boolean;
      assignments: boolean;
      payments: boolean;
      knowledgebase: boolean;
      support: boolean;
      messages: boolean;
    };
    teacher: boolean;
    teachermodules: {
      dashboard: boolean;
      liveclasses: boolean;
      scheduledclasses: boolean;
      assignments: boolean;
      messages: boolean;
      analytics: boolean;
      support: boolean;
    };
  };
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  __v: number;
}

type Permission = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

type ModuleAccess = {
  [key: string]: Permission;
};

type RoleAccess = {
  admin: boolean;
  adminmodules: ModuleAccess;
  academicCoach: boolean;
  academicmodules: ModuleAccess;
  supervisor: boolean;
  supervisormodules: ModuleAccess;
  student: boolean;
  studentmodules: ModuleAccess;
  teacher: boolean;
  teachermodules: ModuleAccess;
};

const AdminModuleAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get("employeeId");
  const [permissions, setPermissions] = useState<Record<string, ModuleAccess>>({
    adminmodules: {},
  });
  const [selectedModules, setSelectedModules] = useState<
    Record<string, boolean>
  >({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  const modules = [
    "Dashboard",
    "Evaluation",
    "Students",
    "Employees",
    "Meetings",
    "Courses",
    "Classes",
    "Finance",
    "Analytics",
    "Messages",
  ];

  const getModuleKey = (moduleName: string) =>
    moduleName.toLowerCase().replace(/ & /g, "").replace(/\s+/g, "");

  useEffect(() => {
    if (!employeeId) {
      toast.error("Employee ID not found in the URL!");
      setIsRedirecting(true);
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
    if (token) {
      fetchEmployeeData(token); // call your function with token
    } else {
      console.log("No auth token found.");
    }
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
      console.log("Fetched data:", json);

      const access = json?.data?.roleAccess;
      const adminModules = access?.adminmodules ?? {};

      // Updated: permissions object
      const selected: Record<string, boolean> = {};
      const modulePermissions: ModuleAccess = {};

      modules.forEach((module) => {
        const key = getModuleKey(module);
        const perms = adminModules[key] ?? {
          read: false,
          write: false,
          delete: false,
        };

        // Determine if module is selected (if any permission is true)
        selected[key] = perms.read ?? perms.write ?? perms.delete;

        // Always store full permissions
        modulePermissions[key] = perms;
      });

      setSelectedModules(selected);
      setPermissions((prev) => ({
        ...prev,
        adminmodules: modulePermissions,
      }));
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
      toast.error("Error loading employee access data");
    }
  };

  useEffect(() => {
    if (isRedirecting) {
      router.push("/admin-main/ui/settings");
    }
  }, [isRedirecting, router]);

  const toggleModule = (module: string, permission?: PermissionType) => {
    if (!permission) {
      // Toggle selection for the entire module
      setSelectedModules((prev: { [x: string]: any; }) => {
        const newSelectedModules = { ...prev };
        newSelectedModules[module] = !prev[module];
        return newSelectedModules;
      });

      setPermissions((prev) => ({
        ...prev,
        adminmodules: {
          ...prev.adminmodules,
          [module]: {
            read: !prev[module]?.read,
            write: !prev[module]?.write,
            delete: !prev[module]?.delete,
          },
        },
      }));
    } else {
      // Toggle a specific permission
      setPermissions((prev) => ({
        ...prev,
        adminmodules: {
          ...prev.adminmodules,
          [module]: {
            ...prev.adminmodules[module],
            [permission]: !prev.adminmodules[module]?.[permission],
          },
        },
      }));
    }
  };

  const handleUpdateAccess = async () => {
    const roleAccess = {
      admin: true,
      adminmodules: permissions.adminmodules,
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await axios.put(
        `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
        { roleAccess },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Access updated successfully:", response.data);
      toast.success("Access updated successfully!"); // ✅ Show success toast
      setTimeout(() => {
        router.push("/admin-main/ui/settings");
      }, 2000);
    } catch (error) {
      console.error("Failed to update access:", error);
      toast.error("Failed to update access"); // ✅ Show error toast
    }
  };

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Admin Module Access" />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
      />

      <div className="mt-4">
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
                const moduleKey = module.toLowerCase();

                return (
                  <tr
                    key={module}
                    className="border-t"
                  >
                    <td className="p-4 flex items-center w-[74%] space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedModules[moduleKey] || false}
                        onChange={() => toggleModule(moduleKey)}
                        className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A] ]"
                      />
                      <span className="text-[12px] text-[#344054] dark:text-[#fff]">
                        {module}
                      </span>
                    </td>
                    {["read", "write", "delete"].map((perm) => (
                      <td key={perm} className="p-2 text-center w-[20%]">
                                                <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            permissions.adminmodules[moduleKey]?.[
                              perm as PermissionType
                            ] || false
                          }
                          onChange={() =>
                            toggleModule(moduleKey, perm as PermissionType)
                          }
                          className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                        />
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
            onClick={() => setSelectedModules({})} // Resetting selected modules
            className="bg-[#e4e7f4] border border-[#576CBC] text-[#576CBC] text-[13px] px-6 py-1 rounded-lg shadow-md transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateAccess}
            className="bg-[#576CBC] text-white text-[13px] px-6 py-1 rounded-lg shadow-md transition ml-2"
          >
            Submit
          </button>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default AdminModuleAccess;
