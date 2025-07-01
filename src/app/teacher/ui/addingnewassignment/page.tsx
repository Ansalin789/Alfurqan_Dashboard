"use client";
import BaseLayout from "@/components/BaseLayout";
import React, { useRef, useState } from "react";
import TeacherHeader from "../../components/TeacherHeader";
import { FaMicrophone, FaTrash, FaUpload } from "react-icons/fa";

interface Assignment {
  name: string;
  type: string;
  question: string;
  imageURL?: string;
  imageName?: string;
  audioURL?: string;
  audioName?: string;
}

const NewAssignment = () => {
  const [noOptions, setNoOptions] = useState(false);
  const [answerType, setAnswerType] = useState<"choose" | "truefalse" | null>(
    null
  );

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileURL, setUploadedFileURL] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);

  const [typedQuestion, setTypedQuestion] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] = useState("Quiz");
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleAddAssignment = () => {
    if (!assignmentName.trim() || !typedQuestion.trim()) return;

    let newAssignment: Assignment = {
      name: assignmentName.trim(),
      type: assignmentType,
      question: typedQuestion.trim(),
    };

    // Add image data if applicable
    if (
      assignmentType === "Image Identification" &&
      uploadedFileURL &&
      uploadedFileType?.startsWith("image/")
    ) {
      newAssignment = {
        ...newAssignment,
        imageURL: uploadedFileURL,
        imageName: uploadedFileName || "Uploaded Image",
      };
    }

    // Add audio data if uploaded
    if (uploadedFileURL && uploadedFileType?.startsWith("audio/")) {
      newAssignment = {
        ...newAssignment,
        audioURL: uploadedFileURL,
        audioName: uploadedFileName || "Recorded Audio",
      };
    }

    setAssignments((prev) => [...prev, newAssignment]);
    // Reset states (including file upload)
    setAssignmentName("");
    setAssignmentType("Quiz");
    setTypedQuestion("");
    setAnswerType(null);
    setUploadedFileURL(null);
    setUploadedFileName(null);
    setUploadedFileType(null);
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFileName(file.name);
      setUploadedFileType(file.type);
      const url = URL.createObjectURL(file);
      setUploadedFileURL(url);

      if (file.type.startsWith("audio/")) {
        setAudioURL(url);
      } else {
        setAudioURL(null);
      }

      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleDeleteFile = () => {
    setAudioURL(null);
    setUploadedFileName(null);
    setUploadedFileURL(null);
    setUploadedFileType(null);
  };

  return (
    <BaseLayout>
      <div>
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
                  <option>Quiz</option>
                  <option>Reading</option>
                  <option>Writing</option>
                  <option>Image Identification</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#010E30] mb-2 dark:text-[#fff]">
                Answer Type
              </label>
              <div className="flex items-center gap-6 text-sm text-[#010E30]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answerType === "choose"}
                    onChange={() =>
                      setAnswerType(answerType === "choose" ? null : "choose")
                    }
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
                    checked={answerType === "truefalse"}
                    onChange={() =>
                      setAnswerType(
                        answerType === "truefalse" ? null : "truefalse"
                      )
                    }
                  />
                  <span className="block text-[13px] font-light text-[#010E30] dark:text-[#fff] ">
                    True or False
                  </span>
                </label>
              </div>
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
                  <label
                    className="p-2 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer dark:border-[#343434] dark:text-[#fff]"
                    title="Upload File"
                  >
                    <input
                      type="file"
                      accept="audio/*,image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden dark:bg-[#343434]"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <FaUpload className="text-xl text-gray-700" />
                  </label>
                </div>
              )}

              {isRecording && (
                <span className="text-sm text-red-600 absolute bottom-2 left-2 animate-pulse">
                  ● Recording...
                </span>
              )}

              {isUploading && uploadedFileName && (
                <div className="text-sm text-blue-600 mb-1 flex items-center gap-2 dark:text-[#fff]">
                  <span className="font-medium dark:text-[#fff]">
                    Uploading:
                  </span>
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

              {uploadedFileURL &&
                uploadedFileType &&
                !uploadedFileType.startsWith("audio/") &&
                !isUploading && (
                  <div className="flex items-center gap-3 mt-1 dark:bg-[#3B3B3B] rounded-lg px-4 py-2 dark:text-[#fff]">
                    <a
                      href={uploadedFileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline break-all dark:text-[#fff]"
                    >
                      {uploadedFileName}
                    </a>
                    <button
                      type="button"
                      className="p-2 rounded-full border border-gray-300 dark:border-[#343434] dark:text-[#fff]"
                      title="Delete File"
                      onClick={handleDeleteFile}
                    >
                      <FaTrash className="text-lg text-red-300" />
                    </button>
                  </div>
                )}
            </div>

            {answerType === "choose" && (
              <div className="mb-2">
                <label className="flex items-center gap-2 mb-2 text-sm text-[#010E30] dark:text-[#fff] dark:border-[#343434]">
                  <input
                    type="checkbox"
                    checked={noOptions}
                    onChange={() => setNoOptions(!noOptions)}
                    className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                  />
                  <span>No Options</span>
                </label>
                {!noOptions &&
                  [...Array(4)].map((_, idx) => (
                    <label key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                      />
                      <input
                        type="text"
                        placeholder={`a) Answer ${idx + 1}`}
                        className="w-full p-2 text-sm  rounded-md dark:text-[#fff] dark:border-[#343434] dark:bg-[#343434]"
                      />
                    </label>
                  ))}
              </div>
            )}

            {answerType === "truefalse" && (
              <div className="mb-4">
                <label className="flex items-center gap-2 mb-2 dark:text-[#fff]">
                  <input
                    type="radio"
                    name="truefalse"
                    className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 mb-2 dark:text-[#fff]">
                  <input
                    type="radio"
                    name="truefalse"
                    className="appearance-none w-4 h-4 rounded-sm border-2 dark:border-white border-[#343434] checked:bg-[#576CBC] checked:border-[#576CBC] focus:outline-none transition-all duration-150"
                  />
                  <span>False</span>
                </label>
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
              <button className="bg-[#576CBC] text-white text-[12px] px-4 py-[6px] rounded-xl hover:bg-[#43599e]">
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default NewAssignment;
