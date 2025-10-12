import React from "react";

const MobileNavbar: React.FC = () => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-3 h-16 pointer-events-none z-50 md:hidden"
    >
      {/* red flat line */}
      <div className="absolute left-5 right-5 bottom-4 h-1.5 rounded-md bg-gradient-to-r from-red-500 to-red-400 shadow-md pointer-events-auto" />

      {/* centered circular logo overlapping the line */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-auto">
        <button
          aria-label="Home"
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/";
          }}
          className="-mt-6 w-18 h-18 flex items-center justify-center bg-red-500 pt-3 rounded-full shadow-lg border-4 border-red-500 p-1 focus:outline-none"
        >
          <img src="/logo.png" alt="Logo" className="w-13 h-13 object-contain" draggable={false} />
        </button>
      </div>
    </nav>
  );
};

export default MobileNavbar;
