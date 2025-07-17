"use client";

import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import BaseLayout2 from "@/components/BaseLayout2";
import {
  ImageQuestionCard,
  MatchWordCard,
  QuizAnswerCard,
  QuizTrueOrFalseAnswerCard,
  ReadingAnswerCard,
  WritingAnswerCard,
} from "../../components/viewAssignment";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export interface Assignment {
  _id?: string;
  studentId: string;
  studentName: string;
  sessionClassType?: string;
  assignmentName: string;
  questionName: string;
  questionType: string;
  typeofQuestion: string;
  title: string;
  assignedTeacher?: string;
  assignedTeacherId?: string;
  assignmentId?: string;

  assignmentType: {
    type:
      | "quiz"
      | "writing"
      | "reading"
      | "image identification"
      | "word-match";
    name?: string;
  };

  chooseType?: boolean;
  trueorfalseType?: boolean;
  question: string;
  hasOptions?: boolean;
  options?: {
    optionOne?: string;
    optionTwo?: string;
    optionThree?: string;
    optionFour?: string;
  };

  audioFile?: string;
  uploadFile?: string;
  status: string;

  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;

  level?: string;
  courses?: string;

  assignedDate: string;
  dueDate: string;

  answer?: string;
  answerValidation: string;
  assignmentStatus: string;

  commends?: string;
  score?: number;
  rating?: string;
}

export default function Page() {
  const [assignments, setAssignments] = useState<Assignment>();
  const search = useSearchParams();
  const assignmentId = search.get('assignmentId');

useEffect(() => {
  const fetchAssignment = async () => {
    const assignmentId = search.get('id'); 
    if (!assignmentId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;

    if (!token) {
      console.error("Missing auth token");
      return;
    }

    try {
      const res = await axios.get<Assignment>(
        `https://api.blackstoneinfomaticstech.com/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          params: {
            assignmentId: assignmentId // optional: if your backend expects it here too
          }
        }
      );
      setAssignments(res.data);
    } catch (error) {
      console.log("Failed to fetch assignment", error);
    }
  };

  fetchAssignment();
}, []);



  const optionArray = assignments?.options
    ? Object.values(assignments.options).filter(
        (val) => typeof val === "string" && val.trim() !== ""
      )
    : [];

  return (
    <div>
      <BaseLayout2>
        <StudentHeader currentSection="Assignments" showBackButton={true} showBackPath={`/student/ui/assignmentlist?assignmentId=${assignmentId}`} />
        {assignments?.assignmentType?.type === "quiz" &&
          (assignments.trueorfalseType ? (
            <QuizTrueOrFalseAnswerCard
              question={assignments.question}
              correctAnswer={assignments.answerValidation ?? ""}
              studentAnswer={assignments.answer ?? ""}
              rating={assignments.rating}
              assignmentStatus={assignments.assignmentStatus}
            />
          ) : (
            <QuizAnswerCard
              question={assignments.question}
              options={optionArray}
              correctAnswer={assignments.answerValidation ?? ""}
              studentAnswer={assignments.answer ?? ""}
              rating={assignments.rating}
              assignmentStatus={assignments.assignmentStatus}
            />
          ))}
        {assignments?.assignmentType?.type === "reading" && (
          <ReadingAnswerCard
            questionText={assignments?.question ?? ""}
            correctAnswer={assignments?.answerValidation ?? ""}
            studentAnswer={assignments?.answer ?? ""}
            rating={assignments?.rating}
            assignmentStatus={assignments?.assignmentStatus}
          />
        )}
        {assignments?.assignmentType?.type === "writing" && (
          <WritingAnswerCard
            question="Listen to the audio and write what you hear"
            audioFile={assignments?.audioFile ?? ""}
            studentAnswer={assignments?.answer ?? ""}
            correctAnswer={assignments?.answerValidation ?? ""}
            rating={assignments?.rating}
            assignmentStatus={assignments?.assignmentStatus}
          />
        )}
        {assignments?.assignmentType?.type === "image identification" && (
          <ImageQuestionCard
            question={assignments?.question ?? ""}
            imageUrl={assignments?.uploadFile ?? ""}
            options={optionArray}
            selectedAnswer={assignments?.answerValidation ?? ""}
            correctAnswer={assignments?.answer ?? ""}
            rating={assignments?.rating}
            assignmentStatus={assignments?.assignmentStatus}
          />
        )}
        {assignments?.assignmentType?.type === "word-match" && (
          <MatchWordCard
            questionText={assignments?.question ?? ""}
            audioFile={assignments?.audioFile ?? ""}
            options={optionArray}
            selectedOption={assignments?.answerValidation ?? ""}
            correctAnswer={assignments?.answer ?? ""}
            rating={assignments?.rating}
            assignmentStatus={assignments?.assignmentStatus}
          />
        )}
      </BaseLayout2>
    </div>
  );
}
