'use client'

import Link from 'next/link';

export default function AgentsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-500">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
          Cold Emailing Agent
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-xl mx-auto text-center">
          Automate and personalize your outbound emails with our intelligent cold emailing agent.
        </p>

        <div className="flex justify-center mt-10">
          <Link
            href="/agents/coldemailing"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transition duration-300 text-xl"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </main>
  );
}
