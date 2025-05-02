'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function SiteWrapper({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <div className="min-h-screen flex flex-col">

      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6 font-semibold text-lg">
          <Link href="/" className="hover:underline">
            🏠 Home
          </Link>
          <Link href="/todos" className="hover:underline">
            📝 Todos
          </Link>
          <Link href="/users" className="hover:underline">
            👥 Users
          </Link>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="bg-gray-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded cursor-not-allowed"
        >
          Toggle Dark Mode
        </button>
      </nav>

      <main className="flex-1 p-6">{children}</main>

            <footer className="bg-white dark:bg-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Todo Manager
            </footer>
        </div>
    );
}