import React from "react";
import { NavLink } from "react-router-dom";
// import { UsersIcon, CalendarDaysIcon, ArrowLeftOnRectangleIcon, Squares2X2Icon, ClipboardDocumentListIcon, ClockIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Example icons

// SVG Logo resembling the image
const Logo = () => (
  <div className="flex items-center space-x-2 mb-10 px-4 pt-2">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 8H12V24H8V8Z" fill="#7C3AED" /> {/* Purple part */}
      <path d="M14 8H18V24H14V8Z" fill="#A78BFA" /> {/* Lighter purple part */}
      <path d="M20 14H24V24H20V14Z" fill="#7C3AED" /> {/* Purple part */}
    </svg>
    <span className="text-2xl font-bold text-gray-800">ToDoi</span>
  </div>
);

// Icons using Heroicons (example, install @heroicons/react if not already)
// For now, using simple SVG placeholders to avoid dependency, can be replaced
const MeetingsIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
    />
  </svg>
);
const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
    />
  </svg>
);

const Sidebar = ({ onLogout }) => {
  const navLinkClasses =
    "flex items-center space-x-3 px-4 py-2.5 my-1 rounded-md text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 ease-in-out";
  // Active link style from image: light purple background, darker purple text, purple left border
  const activeNavLinkClasses =
    "bg-violet-100 text-violet-700 font-semibold border-l-4 border-violet-600";

  return (
    <div className="w-60 h-screen bg-white text-gray-700 flex flex-col border-r border-gray-200">
      {" "}
      {/* Adjusted width and added border */}
      <div className="px-4 py-5">
        {" "}
        {/* Adjusted padding for logo area */}
        <Logo />
      </div>
      <nav className="flex-grow px-3">
        {" "}
        {/* Adjusted padding for nav items */}
        {/* As per instructions, only Meetings is active, others are not needed or non-functional */}
        {/* Example of how other items might look if they were included (based on image, but crossed out) */}
        {/* 
        <NavLink to="/workspace" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} text-gray-400 line-through cursor-not-allowed`}>
          <PlaceholderIcon /> <span>Workspace</span>
        </NavLink>
        <NavLink to="/boards" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} text-gray-400 line-through cursor-not-allowed`}>
          <PlaceholderIcon /> <span>Boards</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} text-gray-400 line-through cursor-not-allowed`}>
          <PlaceholderIcon /> <span>Tasks</span>
        </NavLink>
        */}
        <NavLink
          to="/meetings"
          className={({ isActive }) =>
            `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
          }
        >
          <MeetingsIcon />
          <span>Meetings</span>
        </NavLink>
        {/* 
        <NavLink to="/timesheets" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} text-gray-400 line-through cursor-not-allowed`}>
          <PlaceholderIcon /> <span>Timesheets</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} text-gray-400 line-through cursor-not-allowed`}>
          <PlaceholderIcon /> <span>Chat</span>
        </NavLink>
        */}
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <LogoutIcon />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
