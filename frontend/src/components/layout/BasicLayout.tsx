
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const BasicLayout = () => {
  // State to control the sidebar's expanded/collapsed status
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Pass the state and the toggle function down to the Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
      
      {/* The main content area now has a dynamic margin that animates */}
      <main className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-72' : 'ml-20'}`}>
        <Header />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};