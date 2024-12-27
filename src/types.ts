export interface User {
    studentId: string;
    fname: string;
    lname: string;
    email: string;
    number: string;
    country: string;
    course: string;
    preferredTeacher: string;
    date: string;
    time: string;
    evaluationStatus?: string;
    city?: string;
    students?: number;
    comment?: string;
    preferredDate?: Date;
    numberofstudents: number;
    status: string;
} 