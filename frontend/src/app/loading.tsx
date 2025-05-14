"use client";
import React from "react";

const SimpleLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        {/* Spinning Circle */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        {/* Loading Text */}
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
        {/* Screen Reader Text */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default SimpleLoader;
