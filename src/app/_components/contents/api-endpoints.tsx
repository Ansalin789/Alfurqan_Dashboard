import { environment } from "@/config/environment";

export const AppApiEndpoints = {
  API_END_POINT: environment.baseURL,

  AUHT: {
    LOGIN: "/signin",
  },
  LEAVE_REQUEST: {
    CREATE: "/leaverequest",
  },
  USER: {
    GET: "/users",
  },
  NOTIFICATION: {
    GET_LIST: "/notification/getlist",
    CREATE: "/notification",
    UPDATE: "/notification",
  },
  EVALUATION: {
    GET_LIST: "/evaluationlist",
    CREATE: "/evaluation",
    UPDATE: "/evaluation",
  },
  STUDENT: {
    GET_LIST: "/studentlist",
    CREATE: "/student",
  },
  MEETING: {
    GET_LIST: "/meetinglist",
    CREATE: "/addMeeting",
  },
  INVOICE: {
    GET_LIST: "/invoice",
  },
  CALENDAR: {
    GET: "/meetingSchedulelist",
  },
  GROUPCLASS: {
    CREATE: "/groupclassschedule/bulkcreate",
  },
  ALSTUDENTS: {
    GET: "/alstudents",
    GET_STUDENTS_COUNTRY_COUNT: "/alstudents/studentscountrycount",
  },
  LEAVE: {
    CREATE: "/leaverequest",
  },
  DASHBOARD: {
    GET_UPCOMING_CLASSES: "/dashboard/ac/upcomingclass",
    GET_TEACHERS_ATTENDANCE: "dashboard/ac/teachersattendance",
    GET_WIDGETS: "/dashboard/widgets",
    GET_AC_UPCOMING_CLASSES: "/dashboard/ac/upcomingclass",
  },
  CLASSSHEDULE: {
    GET: "/classShedule",
    GET_CLASSSHEDULE_STUDENTS: "/classShedule/students",
    UPDATE_SLECTED_CLASS: "/classShedule",
    TEACHER_STUDENT_COUNT: "/teacher-student-count",
    STUDENT_ATTENDANCE_PERFORMANCE: "/studentattendanceperformance",
  },
  AVAILABLE_TIME_SLOT: {
    GET: "/teacher/availabletime",
  },
  PAYMENT: {
    CREATE_PAYMENT_INTENT: "/create-payment-intent",
  },
  APPLICANTS:{
    GET_LIST: "/applicants",
  },
  MEETING_MINUTES: {
    UPDATE_MINUTES: "/meetingminutes",
}





};
