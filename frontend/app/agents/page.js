'use client'

import Link from 'next/link';

export default function AgentsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-500">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 text-center tracking-tight">
          AI-Powered Agents
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Cold Emailing Agent */}
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cold Emailing Agent</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Automate and personalize your outbound emails with our intelligent cold emailing agent.
            </p>
            <div className="mt-6">
              <Link
                href="/agents/coldemailing"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow transition duration-300"
              >
                Hire Me
              </Link>
            </div>
          </div>

          {/* Business Domain Checker Agent */}
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Business Domain Checker Agent</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Instantly check domain availability for your brand or business idea using our smart domain checker.
            </p>
            <div className="mt-6">
              <Link
                href="/agents/domainchecker"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-full shadow transition duration-300"
              >
                Find Domains
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
