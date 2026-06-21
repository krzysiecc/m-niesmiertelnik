
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const OnboardingLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      {/* Fixed language + theme switchers in the top-right corner */}
      <motion.div
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <LanguageSwitcher />
        <ThemeSwitcher />
      </motion.div>

      {/* Outlet will render the MedicalInfoForm component */}
      <Outlet />
    </div>
  );
};