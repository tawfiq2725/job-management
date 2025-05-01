"use client";

export default function SimpleSpinnerLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
      <span className="sr-only text-black">Loading…</span>
    </div>
  );
}
