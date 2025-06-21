'use client';

import { useState, useRef, useEffect } from 'react';

export default function ColdEmailingAgentPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your Cold Emailing Agent. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle dark mode on/off
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response from server.');

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ There was a problem contacting the assistant.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
      } relative overflow-hidden`}
    >
      {/* Animated background */}
      <AnimatedBackground darkMode={darkMode} />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        title="Toggle Dark Mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485l-.707.707M4.222 4.222l-.707.707m15.556 0l-.707-.707M4.222 19.778l-.707-.707M21 12h-1M4 12H3m16.485 4.485l-.707-.707M4.222 4.222l.707.707" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        )}
      </button>

      <main
        className={`flex flex-col max-w-3xl w-full p-6 rounded-lg shadow-xl transition-colors duration-700
          ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}
        `}
        style={{ zIndex: 20 }}
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
          Cold Emailing Agent
        </h1>

        <div
          className={`flex-1 overflow-y-auto mb-6 space-y-5 px-6 py-4 rounded-xl shadow-inner border max-h-[65vh] scrollbar-thin
            ${darkMode
              ? 'bg-gray-900 border-gray-700 scrollbar-thumb-purple-700 scrollbar-track-gray-800'
              : 'bg-gray-100 border-gray-200 scrollbar-thumb-purple-300 scrollbar-track-purple-100'}
          `}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-6 py-3 max-w-[70%] whitespace-pre-wrap text-lg leading-relaxed shadow-md
                  ${
                    msg.sender === 'user'
                      ? darkMode
                        ? 'bg-purple-700 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-900'
                  }
                `}
                style={{ wordBreak: 'break-word' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className={`rounded-2xl px-6 py-3 max-w-[70%] italic shadow-inner animate-pulse
                  ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}
                `}
              >
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex space-x-3">
          <input
            type="text"
            className={`flex-1 border rounded-3xl px-5 py-3 text-lg focus:outline-none focus:ring-4 transition-shadow shadow-sm
              ${
                darkMode
                  ? 'border-gray-600 bg-gray-800 text-gray-200 focus:ring-purple-600'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-400'
              }
            `}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Type your message"
          />
          <button
            onClick={handleSend}
            className={`font-semibold rounded-3xl px-8 py-3 shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed
              ${
                darkMode
                  ? 'bg-purple-700 hover:bg-purple-800 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            `}
            disabled={loading}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  return (
    <svg
      className="fixed top-0 left-0 w-full h-full pointer-events-none select-none z-0"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gradLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gradDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx="25%"
        cy="30%"
        r="250"
        fill={darkMode ? "url(#gradDark)" : "url(#gradLight)"}
        className="animate-pulse-slow"
      />
      <circle
        cx="70%"
        cy="60%"
        r="300"
        fill={darkMode ? "url(#gradDark)" : "url(#gradLight)"}
        className="animate-pulse-slower"
      />
    </svg>
  );
}
