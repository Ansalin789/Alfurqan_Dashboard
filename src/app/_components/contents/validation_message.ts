// app-validation-messages.ts

export const AppValidationMessages = Object.freeze({
  AUTH: {
    TOKEN_REQUIRED: "Please login again",
    STUDENT_REQUIRED: "Student information not found",
    COURSE_REQUIRED: "Course information not found",
    TEACHER_REQUIRED: "Teacher information not found",
    PERMISSION_REQUIRED: "Role permission information not found",
  },

  FILTER: {
    INVALID_ASSIGNED_DATE:"Assigned From Date cannot be greater than Assigned To Date",
    INVALID_DUE_DATE: "Due From Date cannot be greater than Due To Date",
    INVALID_DATE_RANGE: "From Date cannot be greater than To Date",
  },

  MEETING: {
    NO_MEETING_FOUND: "No upcoming meetings available",
    INVALID_MEETING_ID: "Meeting information is unavailable",
    
    TITLE_REQUIRED: "Meeting name is required",
    TITLE_MIN: "Meeting name must be at least 3 characters long",

    PARTICIPANT_REQUIRED: "Please select at least one participant",

    DATE_REQUIRED: "Meeting date is required",
    FUTURE_DATE_REQUIRED: "Please select a future date",

    START_TIME_REQUIRED: "Start time is required",
    END_TIME_REQUIRED: "End time is required",

    INVALID_TIME: "End time must be greater than start time",

    DESCRIPTION_REQUIRED: "Description is required",
    DESCRIPTION_MIN: "Description must be at least 10 characters long",
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

ASSIGNMENT: {
  TEACHER_REQUIRED: "Teacher information not found",
  NO_ASSIGNMENT_DATA: "No assignment data available",
  ASSIGNMENT_NAME_REQUIRED: "Assignment name is required",
  ASSIGNMENT_TYPE_REQUIRED: "Assignment type is required",
  QUESTION_REQUIRED: "Question is required",
  ASSIGNED_DATE_REQUIRED: "Assigned date is required",
  DUE_DATE_REQUIRED: "Due date is required",
  CORRECT_ANSWER_REQUIRED: "Please select a correct answer",
}
  
});
