import BaseLayout from '@/components/BaseLayout';
import React from 'react'

export default function Messages() {

    const contacts = Array(5).fill(null); // Dummy data for contacts
  const chats = [
    { name: 'Samantha William', message: 'Lorem ipsum dolor sit amet...', time: '12:45 PM', unread: 2 },
    { name: 'Tony Soap', message: 'Lorem ipsum dolor sit amet...', time: '12:45 PM', unread: 2 },
    { name: 'Karen Hope', message: 'Lorem ipsum dolor sit amet...', time: '12:45 PM', unread: 2 },
  ];


  return (
    <BaseLayout>
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex-1 p-3">
        <header className="mb-0">
          <h1 className="text-[20px] font-semibold">Messages</h1>
        </header>

        <main className="grid grid-cols-3 gap-4">
          {/* Contacts and Chats List */}
          <section className="col-span-1 bg-white p-6 rounded-lg shadow ">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
              <h2 className="text-xl font-semibold">Nella Vita</h2>
              <p className="text-gray-500">Student</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Contacts</h3>
              <div className="flex justify-between items-center mb-2">
                <span>View All</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {contacts.map((_, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Chats</h3>
              <div className="flex space-x-4 mb-4">
                <span className="border-b-2 border-green-500 pb-1">Private</span>
                <span>Group</span>
              </div>
              <div>
                {chats.map((chat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 mb-2 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-2"></div>
                      <div>
                        <h4 className="font-semibold">{chat.name}</h4>
                        <p className="text-gray-500">{chat.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">{chat.time}</p>
                      <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{chat.unread}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Chat Window */}
          <section className="col-span-2 bg-white p-6 rounded-lg shadow flex flex-col h-[633px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-2"></div>
              <div>
                <h2 className="text-xl font-semibold">Karen Hope</h2>
                <p className="text-green-500">Online</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="mb-4">
                <p className="bg-gray-100 p-4 rounded-lg inline-block">Hello Nella!</p>
                <p className="text-gray-500 text-xs mt-1">12:45 PM</p>
              </div>
              <div className="mb-4">
                <p className="bg-gray-100 p-4 rounded-lg inline-block">Can you arrange schedule for next meeting?</p>
                <p className="text-gray-500 text-xs mt-1">12:45 PM</p>
              </div>
              <div className="mb-4 text-right">
                <p className="bg-green-500 text-white p-4 rounded-lg inline-block">Hello Karen!</p>
                <p className="text-gray-500 text-xs mt-1">12:45 PM</p>
              </div>
              <div className="text-right">
                <p className="bg-green-500 text-white p-4 rounded-lg inline-block">Okay, I will arrange it soon. I will notify you when it is done</p>
                <p className="text-gray-500 text-xs mt-1">12:45 PM</p>
              </div>
            </div>
            <div className="flex items-center">
              <input type="text" placeholder="Write your message..." className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none" />
              <button className="bg-green-500 text-white p-4 rounded-r-lg">Send</button>
            </div>
          </section>
        </main>
      </div>
    </div>
    </BaseLayout>
    
  )
}
