"use client";

import AdminHeader from "@/app/admin-main/components/AdminHeader";
import BaseLayout4 from "@/components/BaseLayout4";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
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
  [moduleKey: string]: Permission;
};

const roles = [
  { key: "admin", label: "Admin" },
  { key: "academiccoach", label: "Academic Coach" },
  { key: "supervisor", label: "Supervisor" },
  { key: "teacher", label: "Teacher" },
];

// Modules that exist for each role (same set used for all roles here)
const modules = [
  "Dashboard",
  "Trial Management",
  "Manage Students",
  "Manage Teachers",
  "Schedule",
  "Messages",
  "Support",
];

const defaultPermission = { read: false, write: false, delete: false };

const getModuleKey = (moduleName: string) =>
  moduleName.toLowerCase().replace(/ & /g, "").replace(/\s+/g, "");

const getRoleModuleKey = (roleKey: string) => {
  // backend expects "academicmodules" for academiccoach
  if (roleKey === "academiccoach") return "academicmodules";
  return `${roleKey}modules`;
};

const AcademiccoachModuleAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get("employeeId");

  // roleAccess: stores which roles are active for the employee (admin, academiccoach, supervisor, teacher)
  const [roleAccess, setRoleAccess] = useState<Record<string, boolean>>({
    admin: false,
    academiccoach: false,
    supervisor: false,
    teacher: false,
  });

  // roleModuleAccess: stores modules & permissions per role keyed by roleModuleKey (adminmodules, academicmodules, ...)
  const [roleModuleAccess, setRoleModuleAccess] = useState<Record<string, ModuleAccess>>(
    () =>
      roles.reduce((acc, r) => {
        acc[getRoleModuleKey(r.key)] = modules.reduce((macc, mod) => {
          macc[getModuleKey(mod)] = { ...defaultPermission };
          return macc;
        }, {} as ModuleAccess);
        return acc;
      }, {} as Record<string, ModuleAccess>)
  );

  // which tab/role is currently active in UI
  const [activeRole, setActiveRole] = useState<string>("academiccoach");

  const [isRedirecting, setIsRedirecting] = useState(false);

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

    fetchEmployeeData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // roleAccess table (which roles the employee has)
      const fetchedRoleAccess = json?.data?.roleAccess ?? {};

      // roleModuleAccess table (modules & perms per role modules key)
      const fetchedRoleModuleAccess = json?.data?.roleModuleAccess ?? {};

      // Normalize and ensure all roleModuleAccess keys exist with all modules + perms
      const normalizedRoleModuleAccess: Record<string, ModuleAccess> = {};

      roles.forEach((r) => {
        const roleModuleKey = getRoleModuleKey(r.key);
        const provided = fetchedRoleModuleAccess[roleModuleKey] ?? {};

        const modulePerms: ModuleAccess = {};

        modules.forEach((m) => {
          const mKey = getModuleKey(m);
          const providedPerm = provided[mKey] ?? defaultPermission;
          modulePerms[mKey] = {
            read: Boolean(providedPerm.read),
            write: Boolean(providedPerm.write),
            delete: Boolean(providedPerm.delete),
          };
        });

        normalizedRoleModuleAccess[roleModuleKey] = modulePerms;
      });

      // Ensure roleAccess has keys for all roles
      const normalizedRoleAccess: Record<string, boolean> = {};
      roles.forEach((r) => {
        // backend might use different key casing; you said roleAccess uses "academicCoach" previously,
        // but you provided role names in lowercase. We'll try both variants.
        const candidate1 = r.key; // e.g., academiccoach
        const candidate2 =
          r.key === "academiccoach"
            ? "academicCoach"
            : r.key; // handle camelCase academicCoach case

        const val =
          fetchedRoleAccess[candidate1] ??
          fetchedRoleAccess[candidate2] ??
          false;
        normalizedRoleAccess[r.key] = Boolean(val);
      });

      setRoleAccess(normalizedRoleAccess);
      setRoleModuleAccess(normalizedRoleModuleAccess);
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

  const toggleRoleActive = (roleKey: string) => {
    setRoleAccess((prev) => ({
      ...prev,
      [roleKey]: !prev[roleKey],
    }));
  };

  // Toggle module selection (all perms) or a specific permission for a module in the currently active role
  const toggleModule = (
    module: string,
    permission?: PermissionType,
    roleKeyParam?: string
  ) => {
    const roleKey = roleKeyParam ?? activeRole;
    const roleModuleKey = getRoleModuleKey(roleKey);
    const mKey = getModuleKey(module);

    setRoleModuleAccess((prev) => {
      const prevRoleModules = prev[roleModuleKey] ?? {};
      const prevPerm = prevRoleModules[mKey] ?? { ...defaultPermission };

      if (!permission) {
        // toggle all permissions for this module: if any is true then set all false, else set all true
        const anyTrue = prevPerm.read || prevPerm.write || prevPerm.delete;
        const newPerm = {
          read: !anyTrue,
          write: !anyTrue,
          delete: !anyTrue,
        };

        return {
          ...prev,
          [roleModuleKey]: {
            ...prevRoleModules,
            [mKey]: newPerm,
          },
        };
      } else {
        // toggle single permission
        return {
          ...prev,
          [roleModuleKey]: {
            ...prevRoleModules,
            [mKey]: {
              ...prevPerm,
              [permission]: !prevPerm[permission],
            },
          },
        };
      }
    });
  };

  const handleUpdateAccess = async () => {
    // Construct roleModuleAccess payload using the keys expected by the backend (adminmodules, academicmodules, etc.)
    const payloadRoleModuleAccess: Record<string, ModuleAccess> = {};

    // Ensure we send module permission objects keyed by module key (dashboard, schedule, etc.)
    Object.keys(roleModuleAccess).forEach((roleModuleKey) => {
      payloadRoleModuleAccess[roleModuleKey] = roleModuleAccess[roleModuleKey];
    });

    const payload = {
      roleAccess: {
        // backend may expect camelCase keys like academicCoach; we'll include both forms:
        ...Object.keys(roleAccess).reduce((acc, r) => {
          acc[r] = roleAccess[r];
          // also add camelCase variant for academiccoach -> academicCoach to be safe
          if (r === "academiccoach") {
            acc["academicCoach"] = roleAccess[r];
          }
          return acc;
        }, {} as Record<string, boolean>),
      },
      roleModuleAccess: payloadRoleModuleAccess,
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        toast.error("AdminAuthToken not found");
        return;
      }

      const response = await axios.put(
        `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Access updated successfully:", response.data);
      toast.success("Access updated successfully!");

      setTimeout(() => {
        router.push("/admin-main/ui/settings");
      }, 1200);
    } catch (error) {
      console.error("Failed to update access:", error);
      toast.error("Failed to update access");
    }
  };

  const handleCancel = () => {
    // Reset roleAccess to false for all roles and reset all permissions
    const resetRoleAccess: Record<string, boolean> = {};
    const resetRoleModuleAccess: Record<string, ModuleAccess> = {};

    roles.forEach((r) => {
      resetRoleAccess[r.key] = false;
      const roleModuleKey = getRoleModuleKey(r.key);
      const modulePerms: ModuleAccess = {};
      modules.forEach((m) => {
        modulePerms[getModuleKey(m)] = { ...defaultPermission };
      });
      resetRoleModuleAccess[roleModuleKey] = modulePerms;
    });

    setRoleAccess(resetRoleAccess);
    setRoleModuleAccess(resetRoleModuleAccess);
  };

  // Helpers to read checkbox states for rendering
  const isModuleCheckedForRole = (roleKey: string, moduleName: string) => {
    const roleModuleKey = getRoleModuleKey(roleKey);
    const mKey = getModuleKey(moduleName);
    const perms = roleModuleAccess[roleModuleKey]?.[mKey];
    if (!perms) return false;
    return perms.read || perms.write || perms.delete;
  };

  const isPermissionCheckedForRole = (
    roleKey: string,
    moduleName: string,
    permission: PermissionType
  ) => {
    const roleModuleKey = getRoleModuleKey(roleKey);
    const mKey = getModuleKey(moduleName);
    return (
      roleModuleAccess[roleModuleKey]?.[mKey]?.[permission] ??
      false
    );
  };

  return (
    <BaseLayout4>
      <AdminHeader
        currentSection="Module Access"
        showBackButton
        showBackPath="/admin-main/ui/settings"
      />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="mt-4">
        {/* Role Tabs */}
        <div className="flex gap-4 items-center">
          {roles.map((r) => {
            const active = activeRole === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setActiveRole(r.key)}
                className={`px-4 py-1 border-b border-[#4C6993] rounded-t-lg ${
                  active
                    ? " text-white"
                    : " text-[#6b7280]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{r.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Table for the active role */}
        <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] border-t border-[#e6e6e6]">
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
              {modules.map((module) => (
                <tr key={module} className="border-t">
                  <td className="p-4 flex items-center w-[74%] space-x-3">
                    <input
                      type="checkbox"
                      checked={isModuleCheckedForRole(activeRole, module)}
                      onChange={() => toggleModule(module)}
                    />
                    <span className="text-[12px] text-[#344054] dark:text-white">
                      {module}
                    </span>
                  </td>

                  {(["read", "write", "delete"] as PermissionType[]).map(
                    (perm) => (
                      <td key={perm} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={isPermissionCheckedForRole(
                            activeRole,
                            module,
                            perm
                          )}
                          onChange={() => toggleModule(module, perm)}
                          className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                        />
                        <span className="ml-2 text-[12px] text-[#344054] dark:text-white">
                          {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </span>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleCancel}
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
    </BaseLayout4>
  );
};

export default AcademiccoachModuleAccess;
