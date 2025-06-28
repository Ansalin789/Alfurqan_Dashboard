"use client";
import BaseLayout from "@/components/BaseLayout";
import React, { useRef, useState } from "react";
import TeacherHeader from "../../components/TeacherHeader";
import { FaMicrophone, FaTrash, FaUpload } from "react-icons/fa";

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
        <TeacherHeader currentSection="Assignments" />
        <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen">
          {/* Left Panel */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md flex flex-col gap-5 dark:bg-[#3B3B3B]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#010E30] dark:text-[#fff]">
                Add Assignments
              </h2>
              <button className="bg-[#576CBC] text-white px-4 py-2 rounded-md hover:bg-[#43599e]">
                Add
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-[#010E30] mb-1 dark:text-[#fff] ">
                  Assignment Name
                </label>
                <input
                  type="text"
                  placeholder="Name of assignment"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-[#010E30] mb-1 dark:text-[#fff]">
                  Assignment Type
                </label>
                <select className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]">
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
                <label className="flex items-center gap-2 dark:text-[#fff]">
                  <input
                  className="dark:bg-[#343434] dark:text-[#fff]"
                    type="checkbox"
                    checked={answerType === "choose"}
                    onChange={() =>
                      setAnswerType(answerType === "choose" ? null : "choose")
                    }
                  />
                  <span>Choose</span>
                </label>
                <label className="flex items-center gap-2 dark:text-[#fff]">
                  <input
                                    className="dark:bg-[#343434] dark:text-[#fff]"

                    type="checkbox"
                    checked={answerType === "truefalse"}
                    onChange={() =>
                      setAnswerType(
                        answerType === "truefalse" ? null : "truefalse"
                      )
                    }
                  />
                  <span>
                    <strong>True</strong> or <strong>False</strong>
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#010E30] mb-1 dark:text-[#fff]">
                Question Name
              </label>
              <input

                type="text"
                placeholder="Enter question name"
                className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
              />
            </div>

            <div className="relative mb-4">
              <label className="block text-sm font-medium text-[#010E30] mb-1 dark:text-[#fff]">
                Type the Question
              </label>
              <textarea

                placeholder="Type the question"
                rows={3}
                className="w-full p-2 text-sm border border-gray-300 rounded-md pr-20 dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
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
                  <span className="font-medium dark:text-[#fff]">Uploading:</span>
                  {uploadedFileName}
                  <span className="animate-spin dark:text-[#fff]">⏳</span>
                </div>
              )}

              {audioURL &&
                uploadedFileType?.startsWith("audio/") &&
                !isUploading && (
                  <div className="flex items-center gap-3 mt-1 bg-gray-100 rounded-lg px-4 py-2 shadow dark:text-[#fff]">
                    <audio controls src={audioURL} className="flex-1 min-w-0 dark:text-[#fff]" />
                    <span className="text-sm text-gray-600 dark:text-[#fff]">
                      {uploadedFileName}
                    </span>
                    <button
                      type="button"
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-full border border-gray-300 dark:border-[#343434] dark:text-[#fff]"
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
                  <div className="flex items-center gap-3 mt-1 bg-gray-100 rounded-lg px-4 py-2 shadow dark:text-[#fff]">
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
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-full border border-gray-300 dark:border-[#343434] dark:text-[#fff]"
                      title="Delete File"
                      onClick={handleDeleteFile}
                    >
                      <FaTrash className="text-lg text-red-600" />
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
                  />
                  <span>No Options</span>
                </label>
                {!noOptions &&
                  [...Array(4)].map((_, idx) => (
                    <label key={idx} className="flex items-center gap-2 mb-2">
                      <input type="checkbox" />
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
                  <input type="radio" name="truefalse" className="dark:text-[#fff]" />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 mb-2 dark:text-[#fff]">
                  <input type="radio" name="truefalse" className="dark:text-[#fff]" />
                  <span>False</span>
                </label>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md dark:bg-[#3B3B3B]">
            <h2 className="text-xl font-semibold mb-4 text-[#010E30] dark:text-[#fff]">
              List of Assignment
            </h2>
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex gap-4 mb-4 items-center justify-between px-2 py-2 rounded-md dark:text-[#fff]"
              >
                <span className="w-6 text-sm text-[#010E30] dark:text-[#fff]">{idx + 1}.</span>
                <input
                                 

                  type="text"
                  placeholder="Name of Question"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:border-[#343434] dark:text-[#fff]"
                />
                <input className="w-[160px] p-2 text-sm border border-gray-300 rounded-md dark:bg-[#343434] dark:text-[#fff] dark:border-[#343434]" />
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-6">
              <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:border-[#343434] dark:text-[#fff]">
                Cancel
              </button>
              <button className="bg-[#576CBC] text-white px-4 py-2 rounded-md hover:bg-[#43599e]">
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
