// src/components/layout/Header.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { pathTitles } from './Sidebar';
import { CiLogout } from "react-icons/ci";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function
  const currentPath = location.pathname;

  const title = pathTitles[currentPath] || 'Panel';
  
  const handleLogout = () => {
    console.log("User logging out...");
    // In a real app, you would clear tokens here
    navigate('/logout-success');
  };

  return (
    <header className="w-full bg-background-secondary border-b border-border-primary">
      <div className="px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-text-primary capitalize">
          {title}
        </h1>
        
        {/* Group for controls on the right */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-background-tertiary text-text-primary hover:bg-border-primary hover:text-accent-primary transition-colors cursor-pointer"
            aria-label="Wyloguj się"
          >
            <CiLogout size={30} />
          </button>
        </div>
      </div>
    </header>
  );
};