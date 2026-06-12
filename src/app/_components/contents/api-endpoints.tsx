import { environment } from "@/config/environment";

export const AppApiEndpoints = {
  API_END_POINT: environment.baseURL,

 
  LEAVE_REQUEST: {
    CREATE: "/leaverequest",
  },
USER:{
  GET:"/users"
},
  NOTIFICATION: {
    GET_LIST: "/notification/getlist",
  },

  EVALUATION: {
    GET_LIST: "/evaluationlist",
    CREATE: "/evaluation",
    UPDATE: "/evaluation",
  },
  STUDENT: {
    GET_LIST: "/studentlist",
  },
  MEETING: {
    GET_LIST: "/meetinglist",
    CREATE :"/addMeeting"
  },
  INVOICE: {
    GET_LIST: "/invoice",
  },
  CALENDAR:{
    GET :"/meetingSchedulelist"
  },

  NOTIFICATION :{
    CREATE :"/notification",
    UPDATE :"/notification"
  },
  GROUPCLASS :{
    CREATE :"/groupclassschedule/bulkcreate"
  },
  ALSTUDENTS :{
    GET :"/alstudents",
   GET_STUDENTS_COUNTRY_COUNT :"/alstudents/studentscountrycount",

  },
};