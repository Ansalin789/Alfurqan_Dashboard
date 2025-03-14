'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Award, Briefcase, BarChart2, MessageSquare, Settings, Grid, FileText, Clock, CheckSquare, DollarSign, Database, HelpCircle, Video } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';

function App() {
  const [selectedRole, setSelectedRole] = useState('academic');
  
  // Role options
  const roles = [
    { id: 'academic', name: 'Academic Coach' },
    { id: 'admin', name: 'Admin' },
    { id: 'teacher', name: 'Teacher' },
    { id: 'student', name: 'Student' },
    { id: 'supervisor', name: 'Supervisor' }
  ];
  
  // Module options based on role
  const moduleOptions = {
    academic: [
      { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
      { id: 'trail', label: 'Trail Mgmt', icon: <FileText size={18} /> },
      { id: 'manage_std', label: 'Manage Std', icon: <Users size={18} /> },
      { id: 'manage_teacher', label: 'Manage Teacher', icon: <Briefcase size={18} /> },
      { id: 'schedule', label: 'Schedule', icon: <Clock size={18} /> },
      { id: 'message', label: 'Message', icon: <MessageSquare size={18} /> },
      { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> }
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
      { id: 'evaluation', label: 'Evaluation', icon: <Award size={18} /> },
      { id: 'students', label: 'Students', icon: <Users size={18} /> },
      { id: 'employees', label: 'Employees', icon: <Briefcase size={18} /> },
      { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
      { id: 'classes', label: 'Classes', icon: <BookOpen size={18} /> },
      { id: 'invoice', label: 'Invoice', icon: <FileText size={18} /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
      { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
    ],
    teacher: [
      { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
      { id: 'live_classes', label: 'Live Classes', icon: <Video size={18} /> },
      { id: 'schedule', label: 'Schedule', icon: <Clock size={18} /> },
      { id: 'assignments', label: 'Assignments', icon: <CheckSquare size={18} /> },
      { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
      { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> }
    ],
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
      { id: 'classes', label: 'Classes', icon: <BookOpen size={18} /> },
      { id: 'assignment', label: 'Assignment', icon: <CheckSquare size={18} /> },
      { id: 'payments', label: 'Payments', icon: <DollarSign size={18} /> },
      { id: 'knowledge_base', label: 'Knowledge Base', icon: <Database size={18} /> },
      { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> }
    ],
    supervisor: [
        { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
        { id: 'recruitment', label: 'Recruitment', icon: <BookOpen size={18} /> },
        { id: 'meeting & training', label: 'Meeting & Training', icon: <CheckSquare size={18} /> },
        { id: 'teachers', label: 'Teachers', icon: <DollarSign size={18} /> },
        { id: 'message', label: 'Message', icon: <Database size={18} /> },
        { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> }
      ]
  };

  // Get current modules based on selected role
  const currentModules = moduleOptions[selectedRole as keyof typeof moduleOptions] || [];
  
  // State for selected modules
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  
  // Handle module selection
  const handleModuleChange = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };
  
  // Handle role change
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    setSelectedModules([]); // Reset selected modules when role changes
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Role:', selectedRole);
    console.log('Selected Modules:', selectedModules);
    // Here you would typically send this data to your backend
  };

  return (
    <BaseLayout4>
    <div className="flex flex-col md:flex-row min-h-screen ml-10 text-white">
      {/* Main Content */}
      <div className="flex-1  min-h-screen">
        <div className="p-4 md:p-8 h-full">
          <div className=" text-gray-800 rounded-lg  p-2 max-w-5xl mx-auto">
            <h2 className="text-xl text-[#333333]  font-semibold mb-6">Role Name</h2>
            
            {/* Role Selector */}
            <div className="mb-6">
              <select 
                className="w-full md:w-64 p-4 border border-gray-700 rounded-xl text-[14px] text-[#666C79] focus:outline-none focus:ring-2 focus:ring-blue-700"
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {roles.map(role => (
                  <option  key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            {/* Role Description */}
            <div className="mb-6">
              <h2 className="text-xl text-[#333333] font-semibold mb-2">Role Name</h2>
              <textarea 
                className="w-full p-3 border border-gray-700 rounded-xl text-[15px] text-[#666C79] focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Type Role Description"
                rows={4}
              ></textarea>
            </div>
            
            {/* Module Selection */}
            <div className="mb-6">
              <h2 className="text-xl text-[#333333] font-semibold mb-2">Module</h2>
              <select 
                className="w-full md:w-64 p-4 border border-gray-700 rounded-xl focus:outline-none text-[14px] text-[#666C79] focus:ring-2 focus:ring-blue-700 mb-4"
              >
                <option value="">{roles.find(r => r.id === selectedRole)?.name ?? 'Select Module'}</option>
              </select>
              
              {/* Module Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentModules.map(module => (
                  <div key={module.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onChange={() => handleModuleChange(module.id)}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`module-${module.id}`} className="ml-2 flex text-[15px] items-center">
                      <span className="mr-2">{module.icon}</span>
                      {module.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout4>
  );
}

export default App;