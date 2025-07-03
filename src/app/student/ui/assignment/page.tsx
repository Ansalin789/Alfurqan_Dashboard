"use client";

import React from "react";
import Assignmentlist from "../../components/assignment/Assignmentlist";
import Assignlist from "../../components/assignment/Assignlist";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout from "@/components/BaseLayout";

const CurrentStatus = () => {
  return (
    <BaseLayout>
      <TeacherHeader currentSection="Assignments" />
      <div className=" min-h-screen py-px-4 ">
        <div className="mb-5">
          <Assignlist />
        </div>
        <Assignmentlist />
      </div>
    </BaseLayout>
  );
};

export default CurrentStatus;
