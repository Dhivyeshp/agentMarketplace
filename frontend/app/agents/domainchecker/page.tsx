'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function DomainCheckerAgentPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, text: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Convert messages for backend format
    const formattedMessages = updatedMessages.map((msg) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text,
    }))

    const res = await fetch('http://127.0.0.1:8000/api/domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: formattedMessages }),
    })

    const data = await res.json()

    const aiMessage = { role: 'ai' as const, text: data.reply }
    setMessages((prev) => [...prev, aiMessage])
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Left branding panel */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-12 bg-white dark:bg-gray-950 border-r border-gray-300 dark:border-gray-700">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">Domain Checker</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
            Find the perfect domain name for your brand in seconds with AI-powered search.
          </p>
          <span className="text-sm text-gray-400">Powered by LangChain + GoDaddy API</span>
        </div>
      </div>

      {/* Right chat panel */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8 max-w-full w-full">
        <div className="overflow-y-auto h-full mb-4 space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-md ${
                msg.role === 'user'
                  ? 'ml-auto bg-indigo-600 text-white'
                  : 'mr-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 dark:text-gray-400 italic"
            >
              Thinking...
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="relative flex items-center mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about domain names…"
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-5 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={sendMessage}
            className="absolute right-3 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
          >
            <PaperPlaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  )
}
