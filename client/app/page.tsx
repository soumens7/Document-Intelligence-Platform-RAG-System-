"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">
        Document Intelligence Platform
      </h1>

      {!token ? (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            Signup
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}