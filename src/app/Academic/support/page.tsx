import React from 'react'
import Image from 'next/image'
import BaseLayout1 from '@/components/BaseLayout1'

export default function Support() {
  return (
    <BaseLayout1>
    <div className="flex h-screen">

      {/* Main Content */}
      <main className="w-5/6 p-4">
        {/* Support Header */}
        <h1 className="text-2xl font-bold mb-2">Support</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Blog Section */}
          <section className="col-span-2 space-y-8">
            {/* Blog Entries */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white shadow-md p-6 rounded-lg">
                <Image src="/public/assets/images/alf.png" alt="" width={40} height={40}/>
                <h2 className="text-xl font-bold mb-2">
                  Here 10 Tips to become better in UI/UX Design.
                </h2>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm text-gray-400 mt-4">Admin - 2 January 2022</p>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Showing 1-5 from 100 data</p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-300 rounded-md">1</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">2</button>
                <button className="px-4 py-2 bg-gray-300 rounded-md">3</button>
              </div>
            </div>
          </section>

          {/* Contact and FAQ Section */}
          <aside className="space-y-8">
            {/* Contact Info */}
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="space-y-1">
                <p>📞 +1234567890</p>
                <p>📧 lovia@support.com</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">FAQs</h3>
              <div className="space-y-4">
                <details className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-medium">Is there a free trial?</summary>
                  <p className="text-gray-500 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </details>
                <details className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-medium">How do I get payment?</summary>
                  <p className="text-gray-500 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </details>
                <details className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-medium">Can I rewatch the live courses?</summary>
                  <p className="text-gray-500 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </details>
                <details className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-medium">What’s different between Free and Premium accounts?</summary>
                  <p className="text-gray-500 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </details>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
    </BaseLayout1>
  )
}
