import { Toaster } from 'sonner';
import { useTheme } from '../context/ThemeProvider';

/** Sonner toaster wired to the app's current light/dark theme. */
export const ThemedToaster = () => {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-center" richColors closeButton />;
};
