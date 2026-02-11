"use client";

import React, { useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout from "@/components/BaseLayout";

const MOCK: any[] = [
  {
    _id: "a1",
    assessmentId: "#0938867",
    assessmentDate: "2020-01-20T00:00:00Z",
    studentName: "Robert James",
    course: "Arabic",
    level: 1,
    lesson: "Surah Al-Fatihah",
    reviewDate: "2020-01-25T00:00:00Z",
    status: "Pending",
    attendance: 85,
    assignments: [
      {
        title: "Homework 1",
        due: "Jan 10, 2020",
        score: "18/20",
        remarks: "Good",
      },
      {
        title: "Listening",
        due: "Jan 15, 2020",
        score: "16/20",
        remarks: "Needs practice",
      },
    ],
    assessmentOverview: [
      {
        criteria: "Pronunciation Accuracy",
        max: 20,
        obtained: 18,
        remarks: "Good",
      },
      {
        criteria: "Recitation",
        max: 20,
        obtained: 16,
        remarks: "Improve fluency",
      },
    ],
    teacherFeedback: "Shows steady progress. Work on tajweed.",
    suggestions: "Practice daily 15 minutes.",
    parentFeedback: "Very helpful.",
  },
];

export default function AssessmentDetail() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const id = params?.id || "";
  const mode = search?.get("mode") || "view";

  const item = useMemo(() => MOCK.find((m) => m._id === id) || MOCK[0], [id]);
  const [editState, setEditState] = useState({ ...item });
  const assignments = [
    {
      title: "Memorize Surah Al-Fatiha",
      date: "January 25, 2025",
      score: "09 / 10",
      remarks: "Excellent memorization",
    },
    {
      title: "Tajweed Worksheet",
      date: "January 25, 2025",
      score: "08 / 10",
      remarks: "Needs clearer rule examples",
    },
    {
      title: "Surah Al-Ikhlas recitation",
      date: "January 25, 2025",
      score: "09 / 10",
      remarks: "Slight hesitation, good effort",
    },
    {
      title: "Memorize Surah Al-Fatiha",
      date: "January 25, 2025",
      score: "09 / 10",
      remarks: "Excellent memorization",
    },
  ];
  return (
    <BaseLayout>
      <div className="mx-auto max-w-screen-2xl sm:px-4 lg:px-6">
        <TeacherHeader
          currentSection="Assessments"
          showBackButton
          showBackPath="/teacher/ui/assessment"
        />

        <div className="dark:bg-[#232323] rounded-lg  mt-4">
            {/* Left column: Student Details */}
            <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_2fr] gap-4">
              {/* LEFT : Student Details */}
              <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700 h-[337px] flex flex-col">
                <h3 className="text-[20px] font-semibold mb-3">
                  Student Details
                </h3>

                <div className="gap-3 overflow-y-auto pr-1 custom-scrollbar ">
                  {[
                    ["Assessment ID", item.assessmentId],
                    [
                      "Assessment Date",
                      new Date(item.assessmentDate).toLocaleDateString(),
                    ],
                    ["Student ID", item.studentId],
                    ["Student Name", item.studentName],
                    ["Course", item.course],
                    ["Surah / Lesson", item.lesson],
                    ["Teacher Name", item.teacherName],
                    [
                      "Next Review Date",
                      new Date(item.reviewDate).toLocaleDateString(),
                    ],
                  ].map(([label, value], i) => (
                    <div key={i}>
                      <label className="text-[14px] text-gray-500 block mb-1">
                        {label}
                      </label>
                      <div className="bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-[14px]">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT : Attendance + Behaviour */}
              <div className="flex flex-col gap-4">
                {/* Attendance */}
                <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700 h-40">
                  <h3 className="text-[20px] font-semibold mb-3">Attendance</h3>

                  <div className="flex items-center justify-between">
                    <div className="mt-10">
                      <p className="text-lg font-semibold">16/18</p>
                      <p className="text-xs text-gray-500">Sessions</p>
                    </div>

                    <div className="relative w-32 h-32 -mt-11">
                      <svg
                        className="w-full h-full rotate-[-90deg]"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="46"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="46"
                          stroke="#576CBC"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 46}
                          strokeDashoffset={(1 - 0.85) * 2 * Math.PI * 46}
                          strokeLinecap="round"
                        />
                      </svg>

                      <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                        85%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class Behaviour */}
             <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700 h-40">
  <h3 className="text-[20px] font-semibold mb-3">
    Class Behaviour
  </h3>

  <div className="grid grid-cols-2 gap-6 text-[13px] pl-2 ml-2 ">
    {[
      "Respectful & Attentive",
      "Satisfactory",
      "Needs Improvement",
      "Unsatisfactory",
    ].map((label) => (
      <label
        key={label}
        className="flex items-center gap-2 whitespace-nowrap mb-2"
      >
        <input
          type="checkbox"
          className="rounded border-gray-300"
        />
        <span className="text-[13px] whitespace-nowrap ">
          {label}
        </span>
      </label>
    ))}
  </div>
</div>

              </div>
            </div>
          <div className="mt-6 grid grid-cols-1 gap-4">
            {/* Assignment Overview */}
            <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700">
              <h3 className="text-[18px] font-semibold mb-3">
                Assignment Overview
              </h3>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-4 bg-[#4C6993] text-white px-4 py-2 rounded-t-md text-sm">
                    <div>Assignment</div>
                    <div>Due Date</div>
                    <div>Score</div>
                    <div>Remarks</div>
                  </div>

                  {assignments.map((a, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 items-center px-4 py-3 border-b last:border-b-0 bg-white dark:bg-[#161616]"
                    >
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        {a.title}
                      </div>
                      <div className="text-sm text-gray-500">{a.date}</div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                        {a.score}
                      </div>
                      <div className="text-sm text-gray-500">{a.remarks}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assessment Overview */}
            <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700">
              <h3 className="text-[18px] font-semibold mb-3">
                Assessment Overview
              </h3>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-4 bg-[#4C6993] text-white px-4 py-2 rounded-t-md text-sm">
                    <div>Criteria</div>
                    <div className="text-center">Maximum Marks</div>
                    <div className="text-center">Score</div>
                    <div>Remarks</div>
                  </div>

                  {(item.assessmentOverview || []).map(
                    (row: any, idx: number) => (
                      <div
                        key={idx}
                        className="grid grid-cols-4 items-center px-4 py-3 border-b last:border-b-0 bg-white dark:bg-[#161616]"
                      >
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {row.criteria}
                        </div>
                        <div className="text-sm text-center text-gray-600">
                          {row.max}
                        </div>
                        <div className="text-sm text-center font-semibold text-gray-700 dark:text-gray-100">
                          {row.obtained}
                        </div>
                        <div className="text-sm text-gray-500">
                          {row.remarks}
                        </div>
                      </div>
                    )
                  )}

                  {/* Totals */}
                  <div className="grid grid-cols-4 items-center px-4 py-3 font-semibold bg-gray-50 dark:bg-[#121212]">
                    <div>Total</div>
                    <div className="text-center">
                      {(item.assessmentOverview || []).reduce(
                        (s: number, r: any) => s + (r.max || 0),
                        0
                      )}
                    </div>
                    <div className="text-center">
                      {(item.assessmentOverview || []).reduce(
                        (s: number, r: any) => s + (r.obtained || 0),
                        0
                      )}
                    </div>
                    <div />
                    <div className="mt-3 font-semibold dark:text-gray-400 border-t pt-2 col-span-4 flex justify-end">
                      <span>Grade :</span>{" "}
                      {(() => {
                        const total = (item.assessmentOverview || []).reduce(
                          (s: any, r: { max: any }) => s + (r.max || 0),
                          0
                        );
                        const obtained = (item.assessmentOverview || []).reduce(
                          (s: any, r: { obtained: any }) =>
                            s + (r.obtained || 0),
                          0
                        );

                        return (
                          <span className=" text-center ml-1 ">
                            {total
                              ? `${Math.round((obtained / total) * 100)}%`
                              : "-"}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section (placed below tables) */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700 ">
                <h4 className="text-[16px] font-semibold mb-2">
                  Teacher Feedback
                </h4>
                <textarea
                  value={editState.teacherFeedback || ""}
                  onChange={(e) =>
                    setEditState({
                      ...editState,
                      teacherFeedback: e.target.value,
                    })
                  }
                  placeholder="Write your feedback here..."
                  className="w-full h-28 p-3 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-[#0F0F0F] text-gray-700 dark:text-gray-200"
                />
              </div>

              <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700">
                <h4 className="text-[16px] font-semibold mb-2">
                  Suggestions for Improvement
                </h4>
                <textarea
                  value={editState.suggestions || ""}
                  onChange={(e) =>
                    setEditState({ ...editState, suggestions: e.target.value })
                  }
                  placeholder="Write your suggestions here..."
                  className="w-full h-28 p-3 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-[#0F0F0F] text-gray-700 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-center w-full">
              <input
                id="audioUpload"
                type="file"
                accept="audio/*"
                className="hidden"
              />
              <label
                htmlFor="audioUpload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 w-full bg-[#4C6993] hover:bg-[#40567a] text-white rounded-md py-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 00-1 1v6a1 1 0 102 0V3a1 1 0 00-1-1z" />
                  <path d="M5 8a5 5 0 0010 0V7a1 1 0 10-2 0v1a3 3 0 11-6 0V7a1 1 0 10-2 0v1z" />
                  <path d="M3 12a1 1 0 000 2h14a1 1 0 100-2H3z" />
                </svg>
                <span className="font-medium">Upload Audio Attachment</span>
              </label>
            </div>

            <div className="bg-white dark:bg-[#1F1F1F] rounded-lg p-4 border dark:border-gray-700">
              <h4 className="text-[16px] font-semibold mb-2">
                Parents Feedback
              </h4>
              <textarea
                value={editState.parentFeedback || ""}
                onChange={(e) =>
                  setEditState({ ...editState, parentFeedback: e.target.value })
                }
                placeholder="Write your feedback here..."
                className="w-full h-32 p-3 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-[#0F0F0F] text-gray-700 dark:text-gray-200"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => console.log("submit", editState)}
                className="px-4 py-2 rounded bg-[#4C6993] text-white text-sm hover:bg-[#40567a]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
