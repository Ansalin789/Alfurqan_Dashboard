"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaEye, FaUserCircle } from "react-icons/fa";
import { CheckCircle, MoreVertical, Search, User, XCircle } from "lucide-react";
import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import Pagination from "@/components/Pagination";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { MdTune } from "react-icons/md";
import SuccessPopup from "../../../supervisor/components/successPopup";
import FailedPopup from "../../../supervisor/components/failedPopup";
import { setTime } from "react-datepicker/dist/date_utils";
import { getSocket } from "@/app/utils/socket";
import TeacherHeader from "../../components/TeacherHeader";
import NextMeetingSchedule from "../../components/NextMeetingSchedule";

const liveMeeting = () => {
return (
  <BaseLayout>
    <TeacherHeader currentSection="Scheduled Meeting"/>
    <NextMeetingSchedule />
   
    </BaseLayout>
  );
};

export default liveMeeting;


