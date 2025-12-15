"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BaseLayout4 from '@/components/BaseLayout4';
import AdminHeader from '@/app/admin-main/components/AdminHeader';
import AcademicCoachAccessForm from '../components/AcademicCoachAccessForm';
import StudentAccessForm from '../components/StudentAccessForm';
import TeacherAccessForm from '../components/TeacherAccessForm';
import SupervisorAccessForm from '../components/SupervisorAccessForm';
import AdminAccessForm from '../components/AdminAccessForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Simple Tab component with premium styling
const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-1 text-[14px] transition-all duration-200 font-medium 
      ${active ? 'border-b-[#576CBC] text-[#576CBC]' : 'dark:text-gray-200'}
      border-b-2 ${active ? 'border-[#576CBC]' : 'border-transparent'}`}
    >
        {label} Module
    </button>
);

const MultiRoleSettings: React.FC = () => {
    const searchParams = useSearchParams();
    const employeeId = searchParams.get('employeeId') ?? '';
    const rolesParam = searchParams.get('roles') ?? '';
    const roles = rolesParam.split(',').filter(Boolean);

    const [activeTab, setActiveTab] = useState<string>(roles[0] ?? '');

    useEffect(() => {
        if (roles.length > 0 && !roles.includes(activeTab)) {
            setActiveTab(roles[0]);
        }
    }, [rolesParam, roles, activeTab]);

    const renderContent = () => {
        if (!employeeId) return <div className="p-4 text-red-500">Employee ID not found.</div>;

        switch (activeTab) {
            case 'ACADEMICCOACH':
                return <AcademicCoachAccessForm employeeId={employeeId} />;
            case 'STUDENT':
                return <StudentAccessForm employeeId={employeeId} />;
            case 'TEACHER':
                return <TeacherAccessForm employeeId={employeeId} />;
            case 'SUPERVISOR':
                return <SupervisorAccessForm employeeId={employeeId} />;
            case 'ADMIN':
                return <AdminAccessForm employeeId={employeeId} />;
            default:
                return (
                    <div className="p-6 text-gray-500">
                        Select a role tab above to configure access.
                    </div>
                );
        }
    };

    return (
        <BaseLayout4>
            <AdminHeader currentSection="Module Access" showBackButton showBackPath="/admin-main/ui/settings" />
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
            <div className="min-h-screen">
                <div className="flex gap-2">
                    {roles.map((role) => (
                        <Tab
                            key={role}
                            label={role.charAt(0).toUpperCase() + role.slice(1).toLowerCase().replace(/_/g, ' ')}
                            active={activeTab === role}
                            onClick={() => setActiveTab(role)}
                        />
                    ))}
                </div>

                <div>
                    {renderContent()}
                </div>
            </div>
        </BaseLayout4>
    );
};

export default MultiRoleSettings;
