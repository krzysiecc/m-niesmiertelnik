
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
      className="p-3 rounded-full bg-background-tertiary text-text-primary hover:bg-border-primary transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <MdOutlineLightMode size={30} /> : <MdOutlineDarkMode size={30} />}
    </button>
  );
};