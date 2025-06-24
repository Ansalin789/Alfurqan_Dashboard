import BaseLayout from "@/components/BaseLayout";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineArrowOutward } from "react-icons/md";
import SupervisorHeader from "../../../supervisor/components/supervisorHeader";
import NextMeetingSchedule from "../../components/NextMeetingSchedule";

const Meeting = () => {
  return (
    <BaseLayout>
    <SupervisorHeader currentSection="Scheduled Meeting"/>
    <NextMeetingSchedule/>
      
    </BaseLayout>
  );
};

export default Meeting;
