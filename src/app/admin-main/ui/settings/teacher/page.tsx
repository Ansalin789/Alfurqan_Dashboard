"use client";

import AdminHeader from "@/app/admin-main/components/AdminHeader";
import BaseLayout4 from "@/components/BaseLayout4";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherAccessForm from "../components/TeacherAccessForm";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (isRedirecting) {
      router.push("/admin-main/ui/settings");
    }
  }, [isRedirecting, router]);

  if (!employeeId) return null;

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Teacher Module Access" showBackButton showBackPath="/admin-main/ui/settings" />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <TeacherAccessForm employeeId={employeeId} />
    </BaseLayout4>
  );
};

export default TeacherModuleAccess;
