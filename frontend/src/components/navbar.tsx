import React, { useState, useRef, useEffect } from "react";
import JobOpeningForm from "./form";

export const Logo = () => (
  <svg
    width="40"
    height="46"
    viewBox="0 0 40 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24.33 5.41968L24.8852 23.3961L39.6353 13.9324L24.33 5.41968Z"
      fill="#333333"
    />
    <path
      d="M39.5308 32.7551V13.8619L18.395 27.4678V45.3387H19.1064"
      fill="#494949"
    />
    <path
      d="M1.18878 32.0419L14.7153 23.3629L15.2245 39.8485L1.18878 32.0419Z"
      fill="url(#paint0_linear_2_114)"
    />
    <path
      d="M1.18878 32.0419L14.7153 23.3629L15.2245 39.8485L1.18878 32.0419Z"
      fill="url(#paint1_linear_2_114)"
    />
    <path
      d="M1.18878 32.0419L14.7153 23.3629L15.2245 39.8485L1.18878 32.0419Z"
      stroke="url(#paint2_linear_2_114)"
      strokeWidth="0.846154"
    />
    <path
      d="M1.18878 32.0419L14.7153 23.3629L15.2245 39.8485L1.18878 32.0419Z"
      stroke="url(#paint3_linear_2_114)"
      strokeWidth="0.846154"
    />
    <path
      d="M0.469055 13.2451V32.1381L21.6051 18.5501V0.661621H20.8936"
      fill="url(#paint4_linear_2_114)"
    />
    <path
      d="M0.469055 13.2451V32.1381L21.6051 18.5501V0.661621H20.8936"
      fill="url(#paint5_linear_2_114)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2_114"
        x1="0.36496"
        y1="31.5921"
        x2="15.6704"
        y2="31.5921"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00AAFF" />
        <stop offset="1" stopColor="#8636F8" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2_114"
        x1="8.01768"
        y1="40.5806"
        x2="8.01768"
        y2="22.6037"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="0.1085" stopColor="white" stopOpacity="0.455" />
        <stop offset="0.4332" stopColor="white" stopOpacity="0.216" />
        <stop offset="0.6639" stopColor="white" stopOpacity="0.06" />
        <stop offset="0.775" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2_114"
        x1="0.36496"
        y1="31.5921"
        x2="15.6704"
        y2="31.5921"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00AAFF" />
        <stop offset="1" stopColor="#8636F8" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2_114"
        x1="8.01768"
        y1="40.5806"
        x2="8.01768"
        y2="22.6037"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="0.1085" stopColor="white" stopOpacity="0.455" />
        <stop offset="0.4332" stopColor="white" stopOpacity="0.216" />
        <stop offset="0.6639" stopColor="white" stopOpacity="0.06" />
        <stop offset="0.775" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_2_114"
        x1="-0.407398"
        y1="20.0785"
        x2="22.8932"
        y2="18.3851"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0226" stopColor="#8636F8" />
        <stop offset="0.3484" stopColor="#F020B3" />
        <stop offset="0.6742" stopColor="#F8475E" />
        <stop offset="1" stopColor="#FF9421" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_2_114"
        x1="11.0371"
        y1="32.1381"
        x2="11.0371"
        y2="0.661621"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="0.0842" stopColor="white" stopOpacity="0.455" />
        <stop offset="0.367" stopColor="white" stopOpacity="0.216" />
        <stop offset="0.568" stopColor="white" stopOpacity="0.06" />
        <stop offset="0.6648" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const NavbarDemo = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Open form modal
  const openForm = () => {
    setIsFormOpen(true);
  };

  // Close form modal
  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Handle clicks outside the form to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if form is open and the click is outside the form
      if (
        isFormOpen &&
        formContainerRef.current &&
        !formContainerRef.current.contains(event.target as Node)
      ) {
        closeForm();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormOpen]);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Find Jobs", href: "#" },
    { name: "Find Talents", href: "#" },
    { name: "About us", href: "#" },
    { name: "Testimonials", href: "#" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <nav className="w-full bg-white shadow-lg rounded-xl py-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Create Jobs Button */}
          <div className="hidden md:block">
            <button
              onClick={openForm}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              Create Jobs
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 max-w-5xl mx-auto">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-purple-600 font-medium px-4 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 px-4">
                <button
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openForm();
                  }}
                >
                  Create Jobs
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Form Modal Overlay - Now fully transparent */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="absolute inset-0" onClick={closeForm}></div>
          <div ref={formContainerRef} className="relative z-10">
            <JobOpeningForm closeForm={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarDemo;
