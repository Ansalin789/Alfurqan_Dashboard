"use client";
import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useRef, useState } from "react";
import TeacherHeader from "../../components/TeacherHeader";
import { FaMicrophone, FaTrash, FaUpload } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

interface AssignmentFormData {
  studentId: string;
  studentName: string;
  sessionClassType: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignments: AssignmentItem[];
}

interface AssignmentItem {
  assignmentName: string;
  assignmentType: { type: string };
  questionName: string;
  questionType: string;
  typeofQuestion: string;
  title: string;
  question: string;
  hasOptions: boolean;
  options?: {
    optionOne: string;
    optionTwo: string;
    optionThree: string;
    optionFour: string;
  };
  createdDate: string;
  dueDate: string;
  createdBy: string;
  updatedBy: string;
  level: string;
  courses: string;
  status: string;
  assignmentStatus: string;
  answer: string;
  answerValidation: string;
  audioFile?: File;
  uploadFile?: File;
  chooseType: boolean;
  trueorfalseType: boolean;
}

interface Assignment {
  name: string;
  type: string;
  question: string;
  questionType: "choose" | "truefalse";
  options?: {
    optionOne: string;
    optionTwo: string;
    optionThree: string;
    optionFour: string;
  };
  questionName?: string;
  correctAnswer: string;
  answerValidation: string;
  
  // Audio fields
  audioURL?: string;      // For preview URL
  audioName?: string;     // Original filename
  audioFile?: File;       // Actual File object
  
  // Image fields
  imageURL?: string;      // For preview URL
  imageName?: string;     // Original filename
  imageFile?: File;       // Actual File object
  
  // Generic upload field (matches your backend)
  uploadFile?: {
    name: string;         // Original filename
    type: string;         // MIME type
    url: string;          // Object URL for preview
    file?: File;          // Actual File object
  };
  
  // Additional fields from your backend
  assignmentStatus?: string;
  status?: string;
  createdDate?: string;
  dueDate?: string;
  studentId?: string;
  studentName?: string;
  sessionClassType?: string;
  assignedTeacher?: string;
  assignedTeacherId?: string;
  title?: string;
}

const NewAssignment = () => {
  // ✅ Meta states
  const [title, setMetaTitle] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [sessionClassType, setSessionClassType] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const title = searchParams?.get("title") || "";
    const assignedDate = searchParams?.get("assignedDate") || "";
    const dueDate = searchParams?.get("dueDate") || "";
    const comment = searchParams?.get("comment") || "";
    const studentId = searchParams?.get("studentId") || "";
    const studentName = searchParams?.get("studentName") || "";
    const sessionClassType = searchParams?.get("sessionClassType") || "";
    const assignedTeacher = searchParams?.get("assignedTeacher") || "";
    const assignedTeacherId = searchParams?.get("assignedTeacherId") || "";

    console.log("🔍 Query Params:");
    console.log("title:", title);
    console.log("assignedDate:", assignedDate);
    console.log("dueDate:", dueDate);
    console.log("comment:", comment);
    console.log("studentId:", studentId);
    console.log("studentName:", studentName);
    console.log("sessionClassType:", sessionClassType);
    console.log("assignedTeacher:", assignedTeacher);
    console.log("assignedTeacherId:", assignedTeacherId);

    setMetaTitle(title);
    setAssignedDate(assignedDate);
    setDueDate(dueDate);
    setComment(comment);
    setStudentId(studentId);
    setStudentName(studentName);
    setSessionClassType(sessionClassType);
    setAssignedTeacher(assignedTeacher);
    setAssignedTeacherId(assignedTeacherId);
  }, [searchParams]);
  const [hasOptions, setHasOptions] = useState<boolean>(true); // default true

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [chooseType, setChooseType] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileURL, setUploadedFileURL] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
  type OptionKey = "a" | "b" | "c" | "d";

  interface Option {
    text: string;
    isCorrect: boolean;
  }

  const [options, setOptions] = useState<Record<OptionKey, Option>>({
    a: { text: "", isCorrect: false },
    b: { text: "", isCorrect: false },
    c: { text: "", isCorrect: false },
    d: { text: "", isCorrect: false },
  });

  // For true/false type
  const [questionName, setQuestionName] = useState("");

  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [typedQuestion, setTypedQuestion] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] = useState("quiz");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [questionType, setQuestionType] = useState<"choose" | "truefalse">(
    "choose"
  ); // or "truefalse"
  const [noOptions, setNoOptions] = useState(false);
  const [answerText, setAnswerText] = useState("");

  // Update the handleAddAssignment function
  const handleAddAssignment = () => {
    if (!assignmentName.trim() || !typedQuestion.trim()) {
      alert("⚠️ Please fill in both Assignment Name and Question.");
      return;
    }
    // Special validation for reading/writing
  if ((assignmentType === "reading" || assignmentType === "writing") && !answerText.trim()) {
    alert(`⚠️ Please provide ${assignmentType === "reading" ? "reading content" : "writing prompt"}.`);
    return;
  }
     // Special validation for image identification
  if (assignmentType === "image identification") {
    if (!uploadedFileURL || !uploadedFileType?.startsWith("image/")) {
      alert("⚠️ Please upload an image for image identification.");
      return;
    }
     const hasOptionsFilled = Object.values(options).some(opt => opt.text.trim() !== "");
    if (!hasOptionsFilled) {
      alert("Please provide at least one option for the image");
      return;
    }
    if (!selectedAnswer) {
      alert("⚠️ Please select the correct answer for this image.");
      return;
    }
  }
  // Skip options validation for reading/writing types
    if (!['reading', 'writing'].includes(assignmentType)) {
    // For choose type with options
    if (questionType === "choose" && hasOptions && !noOptions) {
      const missingOptions = Object.entries(options)
        .filter(([_, val]) => val.text.trim() === "")
        .map(([key]) => key.toUpperCase());

      if (missingOptions.length > 0) {
        alert(`⚠️ Please fill all options. Missing: ${missingOptions.join(", ")}`);
        return;
      }

      if (!selectedAnswer) {
        alert("⚠️ Please select the correct answer for this 'choose' question.");
        return;
      }
    }
    // Validate true/false answer is selected
    if (questionType === "truefalse" && trueFalseAnswer === null) {
      alert("⚠️ Please select True or False for this question.");
      return;
    }
  }
    // For types without options (image identification, reading, writing)
    if (['reading', 'writing'].includes(assignmentType)) {
      if (!typedQuestion.trim()) {
        alert("⚠️ Please provide the question text.");
        return;
      }
      // No options validation needed for these types
    }
    
    const newAssignment: Assignment = {
      
      questionName: questionName.trim(),
      name: assignmentName.trim(),
      type: assignmentType,
      question: typedQuestion.trim(),
      questionType: questionType,
      // Include options for image identification or choose type
    options: (assignmentType === "image identification" || 
             (questionType === "choose" && hasOptions && !noOptions)) ? {
      optionOne: options.a.text,
      optionTwo: options.b.text,
      optionThree: options.c.text,
      optionFour: options.d.text,
    } : undefined,
      correctAnswer: "",
  answerValidation: ['reading', 'writing'].includes(assignmentType) 
  ? typedQuestion // For reading/writing
  : selectedAnswer, // For all other types (choose, truefalse, image identification)
         uploadFile: uploadedFileURL ? {
      name: uploadedFileName || "uploaded_file",
      type: uploadedFileType || "application/octet-stream",
      url: uploadedFileURL
    } : undefined,
    };

    setAssignments((prev) => [...prev, newAssignment]);
    alert("✅ Assignment added successfully!");

    // Reset form
    setAssignmentName("");
    setTypedQuestion("");
    setQuestionName("");
    setOptions({
      a: { text: "", isCorrect: false },
      b: { text: "", isCorrect: false },
      c: { text: "", isCorrect: false },
      d: { text: "", isCorrect: false },
    });
    setSelectedAnswer("");
    setTrueFalseAnswer(null);
    setUploadedFileURL(null);
  
    setUploadedFileName(null);
    setUploadedFileType(null);
    setAnswerText("");
  };
  useEffect(() => {
  // Reset answer text when assignment type changes
  setAnswerText("");
  setSelectedAnswer("");
}, [assignmentType]);
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);

      setAudioURL(url);
      setUploadedFileURL(url);
      setUploadedFileName("Recorded Audio.webm");
      setUploadedFileType("audio/webm");
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

// In the component, update the handleFileUpload to handle images separately:
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type based on assignment type
  if (assignmentType === "image identification" && !file.type.startsWith("image/")) {
    alert('Please upload an image file for image identification');
    return;
  }

  setIsUploading(true);
  
  try {
    // Clean up previous URLs
    if (uploadedFileURL) URL.revokeObjectURL(uploadedFileURL);
    if (audioURL) URL.revokeObjectURL(audioURL);

    const url = URL.createObjectURL(file);
    setUploadedFileName(file.name);
    setUploadedFileType(file.type);
    setUploadedFileURL(url);

    // Set audio URL only for audio files
    if (file.type.startsWith("audio/")) {
      setAudioURL(url);
    } else {
      setAudioURL(null);
    }

    e.target.value = '';
  } catch (error) {
    console.error("File upload error:", error);
    alert("Error processing file upload");
  } finally {
    setIsUploading(false);
  }
};


  const handleDeleteFile = () => {
    setAudioURL(null);
    setUploadedFileName(null);
    setUploadedFileURL(null);
    setUploadedFileType(null);
  };

// Update the submitAssignment function
const submitAssignment = async () => {
  const formData = new FormData();

  formData.append("studentId", studentId);
  formData.append("studentName", studentName);
  formData.append("sessionClassType", sessionClassType);
  formData.append("assignedTeacher", assignedTeacher);
  formData.append("assignedTeacherId", assignedTeacherId);

  for (let index = 0; index < assignments.length; index++) {
    const item = assignments[index];

    formData.append(`assignments[${index}][assignmentName]`, item.name);
    formData.append(
      `assignments[${index}][assignmentType]`,
      JSON.stringify({ type: item.type })
    );
    formData.append(
      `assignments[${index}][questionName]`,
      item.questionName || `Q-${index + 1}`
    );
    formData.append(`assignments[${index}][questionType]`, item.questionType);
    formData.append(`assignments[${index}][typeofQuestion]`, item.questionType);
    formData.append(`assignments[${index}][title]`, title);
    formData.append(`assignments[${index}][question]`, item.question);
    formData.append(`assignments[${index}][hasOptions]`, hasOptions.toString());
    if (item.imageURL && item.imageName) {
      const imageBlob = await fetch(item.imageURL).then((res) => res.blob());
      formData.append(
        `assignments[${index}][imageFile]`,
        imageBlob,
        item.imageName
      );
    }

    // Handle options for image identification
    if (item.type === "image identification" && item.options) {
      formData.append(
        `assignments[${index}][options]`,
        JSON.stringify(item.options)
      );
    }
    // Set chooseType and trueorfalseType based on questionType
    formData.append(
      `assignments[${index}][chooseType]`,
      (item.questionType === "choose").toString()
    );
    formData.append(
      `assignments[${index}][trueorfalseType]`,
      (item.questionType === "truefalse").toString()
    );

    // Handle options
    if (
      item.type === "quiz" &&
      item.questionType === "choose" &&
      hasOptions &&
      !noOptions
    ) {
      const optionsPayload = item.options || {
        optionOne: "",
        optionTwo: "",
        optionThree: "",
        optionFour: "",
      };
      formData.append(
        `assignments[${index}][options]`,
        JSON.stringify(optionsPayload)
      );
    }

    // ✅ Proper answerValidation handling
    let answerValidationValue = "";

    if (["image identification", "reading", "writing"].includes(item.type)) {
      answerValidationValue = item.question;
    } else if (item.questionType === "truefalse") {
      answerValidationValue = String(item.answerValidation);
    } else if (Array.isArray(item.answerValidation)) {
      answerValidationValue = item.answerValidation.join(","); // or JSON.stringify(...) if your backend expects array
    } else {
      answerValidationValue = item.answerValidation || "";
    }

    formData.append(
      `assignments[${index}][answerValidation]`,
      answerValidationValue
    );

    formData.append(`assignments[${index}][answer]`, "");
    formData.append(`assignments[${index}][createdDate]`, assignedDate);
    formData.append(`assignments[${index}][dueDate]`, dueDate);
    formData.append(`assignments[${index}][createdBy]`, assignedTeacher);
    formData.append(`assignments[${index}][updatedBy]`, assignedTeacher);
    formData.append(`assignments[${index}][status]`, "Active");
    formData.append(
      `assignments[${index}][assignmentStatus]`,
      "Not Assigned"
    );

    // File uploads
    if (item.audioURL && item.audioName) {
      const audioBlob = await fetch(item.audioURL).then((res) => res.blob());
      formData.append(
        `assignments[${index}][audioFile]`,
        audioBlob,
        item.audioName
      );
    }

    if (item.imageURL && item.imageName) {
      const imageBlob = await fetch(item.imageURL).then((res) => res.blob());
      formData.append(
        `assignments[${index}][uploadFile]`,
        imageBlob,
        item.imageName
      );
    }
  }

  try {
    const res = await fetch("http://localhost:5001/assignments", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to create assignments");
    const data = await res.json();
    console.log("✅ Assignments submitted:", data);

    setAssignments((prev) =>
      prev.map((item) => ({
        ...item,
        assignmentStatus: "Assigned",
      }))
    );
    alert("Assignment submitted successfully!");
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("Error submitting assignment");
  }
};




  useEffect(() => {
    const chooseTypeRaw = localStorage.getItem("chooseType");
    setChooseType(chooseTypeRaw === "true");
  }, []);

  // When assignmentType changes, reset chooseType if not quiz
  useEffect(() => {
    if (assignmentType !== "quiz") {
      setChooseType(false);
    } else {
      // Keep chooseType in sync with questionType
      setChooseType(questionType === "choose");
    }
  }, [assignmentType, questionType]);

  const handleOptionChange = (optionId: OptionKey, newText: string) => {
    setOptions((prev) => {
      const updated = {
        ...prev,
        [optionId]: {
          ...prev[optionId],
          text: newText,
        },
      };

      alert(`📝 Option ${optionId.toUpperCase()} updated to: ${newText}`);
      console.log("📦 Updated options object:", updated); // log to console
      return updated;
    });
  };

  const handleAnswerChange = (selectedId: OptionKey) => {
    setOptions((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as OptionKey[]).forEach((key) => {
        updated[key].isCorrect = key === selectedId;
      });
      const selectedText = updated[selectedId]?.text || "";
      setSelectedAnswer(selectedText);
      return updated;
    });
  };

  return (
    <BaseLayout>
      <TeacherHeader currentSection="New Assignment" />
      <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md flex flex-col gap-5 dark:bg-[#3B3B3B] dark:border dark:border-[#484f5b]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#010E30] dark:text-[#fff]">
              Add Assignments
            </h2>
            <button
              className="bg-[#C9D5F3] text-[#546297] px-[15px] py-1 font-semibold rounded-md hover:bg-[#c9D5F3] text-[13px]"
              onClick={handleAddAssignment}
            >
              Add
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff] ">
                Assignment Name
              </label>
              <input
                type="text"
                placeholder="Name of assignment"
                className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-xl dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff] ">
                Assignment Type
              </label>
              <select
                className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-xl dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
                onChange={(e) => setAssignmentType(e.target.value)}
                value={assignmentType}
              >
                <option value="quiz">quiz</option>
                <option value="reading">reading</option>
                <option value="writing">writing</option>
                <option value="image identification">
                  image identification
                </option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#010E30] mb-2 dark:text-[#fff]">
              Answer Type
            </label>
            {/* Only show answer type options for quiz */}
            {!(assignmentType === "writing" || assignmentType === "reading") && (
              <div className="flex items-center gap-6 text-sm text-[#010E30]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={questionType === "choose"}
                    onChange={() => {
                      setQuestionType("choose");
                      if (assignmentType === "quiz") setChooseType(true);
                    }}
                    className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                  />
                  <span className="block text-[13px] font-light text-[#010E30] dark:text-[#fff]">
                    Choose
                  </span>
                </label>

                <label className="flex items-center gap-2 dark:text-[#fff]">
                  <input
                    className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                    type="checkbox"
                    checked={questionType === "truefalse"}
                    onChange={() => {
                      setQuestionType("truefalse");
                      if (assignmentType === "quiz") setChooseType(false);
                    }}
                  />
                  <span className="block text-[13px] font-light text-[#010E30] dark:text-[#fff] ">
                    True or False
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff] ">
              Question Name
            </label>
            <input
              type="text"
              placeholder="Enter question name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-xl dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
            />
          </div>

          <div className="relative mb-4">
            <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff] ">
              Type the Question
            </label>
            <textarea
              placeholder="Type the question"
              rows={3}
              value={typedQuestion}
              onChange={(e) => setTypedQuestion(e.target.value)}
              className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-md pr-20 dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff] "
              defaultValue="Which of the following letters is considered a Qalqalah letter?"
            />
            {!audioURL && !uploadedFileURL && (
              <div className="absolute bottom-2 right-2 flex gap-2 dark:text-[#fff]">
                <button
                  type="button"
                  className={`p-2 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center dark:border-[#343434] dark:text-[#fff] ${
                    isRecording ? "bg-red-200" : ""
                  }`}
                  title={isRecording ? "Stop Recording" : "Record"}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <FaMicrophone
                    className={`text-xl ${
                      isRecording ? "text-red-600" : "text-gray-700"
                    }`}
                  />
                </button>
                 {/* File upload button - shown when no file is uploaded */}
  {!uploadedFileURL && (
    <label className="p-2 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
      <input
        type="file"
        accept={assignmentType === "image identification" ? "image/*" : "audio/*,image/*"}
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <FaUpload className="text-xl text-gray-700" />
    </label>
  )}
              </div>
            )}

            {isRecording && (
              <span className="text-sm text-red-600 absolute bottom-2 left-2 animate-pulse">
                ● Recording...
              </span>
            )}

            {isUploading && uploadedFileName && (
              <div className="text-sm text-blue-600 mb-1 flex items-center gap-2 dark:text-[#fff]">
                <span className="font-medium dark:text-[#fff]">Uploading:</span>
                {uploadedFileName}
                <span className="animate-spin dark:text-[#fff] ">⏳</span>
              </div>
            )}

            {audioURL &&
              uploadedFileType?.startsWith("audio/") &&
              !isUploading && (
                <div className="flex items-center gap-3 mt-1 bg-gray-100 dark:bg-[#343434] rounded-lg px-4 py-2 shadow dark:text-[#fff]">
                  <audio
                    controls
                    src={audioURL}
                    className="flex-1 min-w-0 dark:text-[#fff]"
                  />
                  <span className="text-sm text-gray-600 dark:text-[#fff]">
                    {uploadedFileName}
                  </span>
                  <button
                    type="button"
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full border border-gray-300 dark:border-[#343434] dark:text-[#fff] dark:bg-[#343434]"
                    title="Delete File"
                    onClick={handleDeleteFile}
                  >
                    <FaTrash className="text-lg text-red-600 dark:text-[#fff]" />
                  </button>
                </div>
              )}

            {uploadedFileURL && uploadedFileType?.startsWith("image/") && (
    <div className="mt-4 flex items-center gap-3 bg-gray-100 rounded-lg p-3">
      <img
        src={uploadedFileURL}
        alt="Uploaded preview"
        className="max-h-40 max-w-full object-contain"
      />
      <div>
        <span className="text-sm break-all">{uploadedFileName}</span>
        <button
          type="button"
          className="mt-2 p-1 bg-red-100 hover:bg-red-200 rounded-full"
          onClick={handleDeleteFile}
        >
          <FaTrash className="text-red-600" />
        </button>
      </div>
    </div>
  )}
          </div>

          {/* Only show choose/truefalse options if not writing/reading/image identification */}
          {questionType === "choose" && (assignmentType === "writing" || assignmentType === "reading" || assignmentType === "image identification") && (
            <div className="mb-4">
              <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff] ">
                Type the Answer
              </label>
              <textarea
                placeholder="Type the answer"
                rows={3}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff] "
              />
            </div>
          )}
        {(assignmentType === "image identification" || 
    (questionType === "choose" && assignmentType === "quiz")) && (
    <div className="mb-4">
      <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
        Options (Select the correct answer)
      </label>
      <div className="space-y-2">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="radio"
              name="correctOption"
              checked={value.isCorrect}
              onChange={() => {
                handleAnswerChange(key as OptionKey);
                setSelectedAnswer(value.text);
              }}
              className="w-4 h-4 text-[#576CBC] focus:ring-[#576CBC]"
            />
            <input
              type="text"
              value={value.text}
              placeholder={`Option ${key.toUpperCase()}`}
              onChange={(e) => {
                handleOptionChange(key as OptionKey, e.target.value);
                if (options[key as OptionKey].isCorrect) {
                  setSelectedAnswer(e.target.value);
                }
              }}
              className="flex-1 p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
            />
          </div>
        ))}
      </div>
    </div>
  )}

          {questionType === "truefalse" && !(assignmentType === "writing" || assignmentType === "reading" || assignmentType === "image identification") && (
            <div className="mb-4">
              <p className="text-sm font-medium text-[#010E30] mb-2 dark:text-[#fff]">
                Select the correct answer
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm dark:text-[#fff] cursor-pointer">
                  <input
                    type="radio"
                    name="truefalse"
                    checked={trueFalseAnswer === true}
                    onChange={() => {
                      setTrueFalseAnswer(true);
                      setSelectedAnswer("true"); // Set answer validation
                    }}
                    className="w-4 h-4 text-[#576CBC] focus:ring-[#576CBC]"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 text-sm dark:text-[#fff] cursor-pointer">
                  <input
                    type="radio"
                    name="truefalse"
                    checked={trueFalseAnswer === false}
                    onChange={() => {
                      setTrueFalseAnswer(false);
                      setSelectedAnswer("false"); // Set answer validation
                    }}
                    className="w-4 h-4 text-[#576CBC] focus:ring-[#576CBC]"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {/* Answer Validation Section */}
{(assignmentType === "reading" || assignmentType === "writing") && (
  <div className="mb-4">
    <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
      {assignmentType === "reading" ? "Reading Content" : "Writing Prompt"}
    </label>
    <textarea
      placeholder={
        assignmentType === "reading" 
          ? "Enter the reading passage" 
          : "Enter the writing prompt"
      }
      rows={4}
      value={answerText}
      onChange={(e) => {
        setAnswerText(e.target.value);
        setSelectedAnswer(e.target.value); // This will be used as answerValidation
      }}
      className="w-full p-3 px-5 text-[11px] border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
    />
  </div>
)}
        </div>
        {/* Right Panel */}
          <div className="flex flex-col justify-between w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md dark:bg-[#3B3B3B] dark:border dark:border-[#484f5b]">
            <div>
              <h2 className="text-lg font-medium text-[#010E30] mb-6 dark:text-[#fff]">
                List of Assignment
              </h2>
              {assignments.map((item, idx) => (
                <div
                  key={idx}
                  className="mb-6 p-4 border rounded-lg dark:border-[#484f5b]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
                    {/* Question Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="w-6 text-sm text-[#010E30] dark:text-[#fff]">
                          {idx + 1}.
                        </span>
                        <label className="block text-[13px] font-light text-[#010E30] dark:text-[#fff]">
                          Question
                        </label>
                      </div>
                      <textarea
                        value={item.question}
                        disabled
                        rows={2}
                        className="w-full p-3 text-[11px] border border-gray-300 rounded-xl dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
                      />
                    </div>

                    {/* Assignment Type */}
                    <div>
                      <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
                        Type
                      </label>
                      <input
                        type="text"
                        value={item.type}
                        disabled
                        className="w-full p-3 text-[11px] border border-gray-300 rounded-xl dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
                      />
                    </div>
                  </div>

                  {/* Image Display */}
                  {item.type === "Image Identification" && item.imageURL && (
                    <div className="mt-4">
                      <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
                        Uploaded Image
                      </label>
                      <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#343434] p-3 rounded-lg">
                        <img
                          src={item.imageURL}
                          alt={item.imageName || "Question image"}
                          className="max-h-32 object-contain "
                        />
                        <span className="text-xs break-all dark:text-[#fff] dark:bg-[#343434]">
                          {item.imageName}
                        </span>
                      </div>
                    </div>
                  )}
    {(item.type === "reading" || item.type === "writing") && (
      <div className="mt-4">
        <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
          {item.type === "reading" ? "Reading Content" : "Writing Prompt"}
        </label>
        <div className="p-3 bg-gray-100 dark:bg-[#343434] rounded-lg">
          <p className="whitespace-pre-wrap dark:text-[#fff]">{item.answerValidation}</p>
        </div>
      </div>
    )}
                  {/* Audio Display */}
                  {item.audioURL && (
                    <div className="mt-4">
                      <label className="block text-[13px] font-light text-[#010E30] mb-2 dark:text-[#fff]">
                        Uploaded Audio
                      </label>
                      <div className="flex items-center gap-3 mt-1 bg-gray-100 dark:bg-[#343434] rounded-lg px-4 py-2 shadow dark:text-[#fff]">
                        <audio
                          controls
                          src={item.audioURL}
                          className="flex-1 min-w-0"
                        />
                        <span className="text-xs break-all dark:text-[#fff]">
                          {item.audioName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button className="border border-gray-300 text-[12px] px-4 py-[6px] rounded-xl text-gray-700 hover:bg-gray-100 dark:border-[#343434] dark:text-[#fff] dark:bg-[#343434]">
                Cancel
              </button>
              <button
                className="bg-[#576CBC] text-white text-[12px] px-4 py-[6px] rounded-xl hover:bg-[#43599e]"
                onClick={submitAssignment}
              >
                Assign
              </button>
            </div>
          </div>
      </div>
    </BaseLayout>
  );
};

export default NewAssignment;
