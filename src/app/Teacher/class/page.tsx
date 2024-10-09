import React from 'react'
import { FaMicrophone, FaImage, FaVideo, FaPowerOff, FaPaperPlane } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import BaseLayout from '@/components/BaseLayout';

export default function Class() {
  return (
    <>
    <BaseLayout>
        <div className="flex">
        <div className="flex-1 p-6">
        <header className="mb-8">
            <h1 className="text-3xl font-semibold">Live Classes</h1>
        </header>

        <main className="grid grid-cols-3 gap-8">
            {/* Main Video Section */}
            <section className="col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <div>
                <h2 className="text-xl font-semibold">Full-Stack Web Developer</h2>
                <p>Angelina Crispy | 10k Students</p>
                </div>
                <FiMoreVertical className="text-gray-400" />
            </div>
            <div className="bg-gray-200 h-96 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded">Live</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">Students</span>
                </div>
                <div className="flex space-x-2">
                <FaMicrophone className="text-gray-400" />
                <FaImage className="text-gray-400" />
                <FaVideo className="text-gray-400" />
                <FaPowerOff className="text-red-500" />
                </div>
            </div>
            </section>

            {/* Right Sidebar */}
            <aside className="col-span-1 space-y-8">
            {/* Course Content */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Courses Content</h3>
                <div className="space-y-2">
                <div>
                    <h4 className="font-medium">Chapter 1: Intro</h4>
                    <div className="ml-4">
                    <p className="flex justify-between">
                        <span>Introduction</span>
                        <span>1:00</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tools & Plugins</span>
                        <span>1:00</span>
                    </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium">Chapter 2: Basic HTML</h4>
                    <div className="ml-4">
                    <p className="flex justify-between">
                        <span>HTML Tags</span>
                        <span>1:00</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Attributes</span>
                        <span>1:00</span>
                    </p>
                    </div>
                </div>
                </div>
            </section>

            {/* Live Chat */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Live Chat</h3>
                <div className="space-y-4">
                <div>
                    <p className="font-medium">Samantha</p>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet ut labore et</p>
                    <p className="text-gray-400 text-sm">12:45 PM</p>
                </div>
                <div>
                    <p className="font-medium">You</p>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet ut labore et</p>
                    <p className="text-gray-400 text-sm">12:45 PM</p>
                </div>
                </div>
                <div className="flex items-center mt-4">
                <input
                    type="text"
                    placeholder="Type here..."
                    className="flex-1 border border-gray-300 rounded p-2"
                />
                <button className="ml-2 p-2 bg-green-500 text-white rounded">
                    <FaPaperPlane />
                </button>
                </div>
            </section>
            </aside>
        </main>
        </div>
        </div>
    </BaseLayout>
    </>
  )
}
