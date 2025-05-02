'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
      <main className="min-h-screen p-8 bg-gradient-to-br from-indigo-200 to-pink-200 dark:from-gray-900 dark:to-black">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">🎉 Welcome to Next.js + Tailwind</h1>
          <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded"
          >
            Toggle Dark Mode
          </button>
        </div>
        <p>This is your starting layout.</p>
      </main>
  );
}