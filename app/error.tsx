"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 px-6">
      {/* Illustration */}
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 blur-3xl opacity-40" />
        <div className="relative flex items-center justify-center w-full h-full">
          <AlertTriangle className="w-28 h-28 text-red-500 drop-shadow-lg" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        We encountered an unexpected error. Don’t worry—you can try again or
        head back home.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl shadow-md transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-2xl shadow-md transition"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
