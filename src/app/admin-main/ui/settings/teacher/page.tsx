"use client";

import AdminHeader from "@/app/admin-main/components/AdminHeader";
import BaseLayout4 from "@/components/BaseLayout4";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
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

// type RoleAccess = {
//   teacher: boolean;
//   teachermodules: ModuleAccess;
// };

const TeacherModuleAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get("employeeId");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      toast.error("Employee ID not found in the URL!");
      setIsRedirecting(true);
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
      // const access = json?.data?.roleAccess;
      const teacherModules = json?.data?.roleAccess?.teachermodules ?? {};

      const selected: Record<string, boolean> = {};
      const modulePermissions: ModuleAccess = {};

      modules.forEach((module) => {
        const key = getModuleKey(module);

        const perms = teacherModules[key] ?? {
          read: false,
          write: false,
          delete: false,
        };

        selected[key] = perms.read || perms.write || perms.delete;
        modulePermissions[key] = perms;
      });

      setSelectedModules(selected);
      setPermissions((prev) => ({
        ...prev,
        teachermodules: modulePermissions,
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
    const key = getModuleKey(module);

    if (!permission) {
      setSelectedModules((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));

      setPermissions((prev) => ({
        ...prev,
        teachermodules: {
          ...prev.teachermodules,
          [key]: {
            read: !prev.teachermodules[key]?.read,
            write: !prev.teachermodules[key]?.write,
            delete: !prev.teachermodules[key]?.delete,
          },
        },
      }));
    } else {
      setPermissions((prev) => ({
        ...prev,
        teachermodules: {
          ...prev.teachermodules,
          [key]: {
            ...prev.teachermodules[key],
            [permission]: !prev.teachermodules[key]?.[permission],
          },
        },
      }));
    }
  };

  const handleUpdateAccess = async () => {
    const roleAccess = {
      teacher: true,
      teachermodules: permissions.teachermodules,
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

      toast.success("Access updated successfully!");
      console.log("Access updated successfully:", response.data);

      setTimeout(() => {
        router.push("/admin-main/ui/settings");
      }, 2000);
    } catch (error) {
      console.error("Failed to update access:", error);
      toast.error("Failed to update access");
    }
  };

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Teacher Module Access" showBackButton showBackPath="/admin-main/ui/settings" />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

      <div className="mt-4">
        <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] ">
          <table className="w-full table-auto ">
            <thead className="text-[12px] bg-[#4C6993] text-white ">
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
                  <tr key={module} className="border-t">
                    <td className="p-4 flex items-center w-[74%] space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedModules[moduleKey] || false}
                        onChange={() => toggleModule(moduleKey)}
                        className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                      />
                      <span className="text-[12px] text-[#344054] dark:text-[#fff]">
                        {module}
                      </span>
                    </td>

                    {["read", "write", "delete"].map((perm) => (
                      <td key={perm} className="p-2 text-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              permissions.teachermodules[moduleKey]?.[
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
          {/* ✅ Updated Cancel Button */}
          <button
            onClick={() => {
              const clearedSelected: Record<string, boolean> = {};
              const clearedPermissions: ModuleAccess = {};

              modules.forEach((module) => {
                const key = getModuleKey(module);

                clearedSelected[key] = false;
                clearedPermissions[key] = {
                  read: false,
                  write: false,
                  delete: false,
                };
              });

              setSelectedModules(clearedSelected);
              setPermissions({ teachermodules: clearedPermissions });
            }}
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

export default TeacherModuleAccess;
