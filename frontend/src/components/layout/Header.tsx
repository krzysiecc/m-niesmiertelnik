
import { useLocation } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { pathTitles } from './Sidebar'; // Import our new map

export const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Find the title from our map, or use a fallback
  const title = pathTitles[currentPath] || 'Panel';

  return (
    <header className="w-full bg-background-secondary border-b border-border-primary">
      <div className="px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-text-primary capitalize">
          {title}
        </h1>
        <ThemeSwitcher />
      </div>
    </header>
  );
};