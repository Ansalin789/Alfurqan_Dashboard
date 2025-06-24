import BaseLayout from "@/components/BaseLayout";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineArrowOutward } from "react-icons/md";
import SupervisorHeader from "../../../supervisor/components/supervisorHeader";
import NextMeetingSchedule from "../../components/NextMeetingSchedule";
import TeacherHeader from "../../components/TeacherHeader";

const Meeting = () => {
  return (
    <BaseLayout>
    <TeacherHeader currentSection="Scheduled Meeting" />
    <NextMeetingSchedule/>
      
    </BaseLayout>
  );
};

export default Meeting;
