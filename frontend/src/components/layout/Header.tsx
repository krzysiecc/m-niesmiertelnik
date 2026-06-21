// src/components/layout/Header.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { pathTitles } from './Sidebar';
import { CiLogout } from "react-icons/ci";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentPath = location.pathname;

  const titleKey = pathTitles[currentPath] || 'nav.panel';

  const handleLogout = () => {
    // In a real app you would clear tokens here.
    navigate('/logout-success');
  };

  return (
    <header className="w-full bg-background-secondary border-b border-border-primary">
      <div className="px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-text-primary capitalize">
          {t(titleKey)}
        </h1>

        {/* Group for controls on the right */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />

          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-background-tertiary text-text-primary hover:bg-border-primary hover:text-accent-primary transition-colors cursor-pointer"
            aria-label={t('nav.logout')}
          >
            <CiLogout size={30} />
          </button>
        </div>
      </div>
    </header>
  );
};
