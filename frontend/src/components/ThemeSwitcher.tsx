
import { useTheme } from '../context/ThemeProvider';
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-background-tertiary text-text-primary hover:bg-border-primary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <MdOutlineLightMode size={20} /> : <MdOutlineDarkMode size={20} />}
    </button>
  );
};