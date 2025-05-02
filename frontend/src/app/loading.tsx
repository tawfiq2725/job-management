"use client"
"use client";
import React from "react";
import { Logo } from "../components/logo";

const PremiumLogoLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950">
      <div className="relative flex items-center justify-center">
        {/* Soft Background Glow */}
        <div className="absolute w-48 h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse blur-2xl"></div>

        {/* Radial Pulse Effect */}
        <div className="absolute w-36 h-36 border border-blue-400/30 rounded-full animate-radial-pulse"></div>

        {/* Logo with Vertical Float Animation */}
        <div className="animate-float">
          <Logo className="w-24 h-24 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
        </div>

        {/* Screen Reader Text */}
        <span className="sr-only text-white">Loading…</span>
      </div>

      {/* Tailwind CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-15px);
            opacity: 0.9;
          }
        }
        @keyframes radial-pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-radial-pulse {
          animation: radial-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumLogoLoader;