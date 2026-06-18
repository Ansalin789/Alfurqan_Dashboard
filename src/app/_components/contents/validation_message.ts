// app-validation-messages.ts

export const AppValidationMessages = Object.freeze({
  AUTH: {
    TOKEN_REQUIRED: "Please login again",
    STUDENT_REQUIRED: "Student information not found",
      COURSE_REQUIRED: "Course information not found",

  },

  FILTER: {
    INVALID_ASSIGNED_DATE:"Assigned From Date cannot be greater than Assigned To Date",
    INVALID_DUE_DATE: "Due From Date cannot be greater than Due To Date",
    INVALID_DATE_RANGE: "From Date cannot be greater than To Date",
  },

  MEETING: {
    NO_MEETING_FOUND: "No upcoming meetings available",
    INVALID_MEETING_ID: "Meeting information is unavailable",
  },

  RESCHEDULE: {
    REASON_REQUIRED: "Reason for reschedule is required",
    DATE_REQUIRED: "Reschedule date is required",
    TIME_REQUIRED: "Reschedule time is required",
  },

  CLASS: {
    NO_UPCOMING_CLASS: "No upcoming classes available",
    CLASS_LINK_REQUIRED: "Class link is unavailable",
    NO_CLASS_HOURS_FOUND: "No class hours data available",

  },

  PAYMENT: {
    NO_PAYMENT_FOUND: "No payment records found",
  },

  COURSE: {
    NO_COURSE_OVERVIEW_DATA:"No course overview data available",
},

GROWTH: {
  NO_PROGRESS_DATA: "No learning progress data available",
},
});
