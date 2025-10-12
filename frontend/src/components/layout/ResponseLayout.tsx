// src/components/layout/ResponsiveLayout.tsx
import { useDetectMobileOS } from '../../hooks/useDetectMobileOS'; // <-- Import the new hook
import { BasicLayout } from './BasicLayout';
import { MobileLayout } from './MobileLayout';

export const ResponsiveLayout = () => {
  // Use our new hook to check the operating system
  const isMobileOS = useDetectMobileOS();

  // The rendering logic remains the same, but the condition has changed
  return isMobileOS ? <MobileLayout /> : <BasicLayout />;
};