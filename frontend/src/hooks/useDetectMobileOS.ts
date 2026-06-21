// src/hooks/useDetectMobileOS.ts
import { useState, useEffect } from 'react';

const getIsMobileOS = (): boolean => {
  // This function can only run on the client side where `navigator` is available.
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    '';

  // A comprehensive regex to detect most mobile and tablet operating systems
  const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
  const tabletRegex = /android|ipad|playbook|silk/i;

  return mobileRegex.test(userAgent) || tabletRegex.test(userAgent.substr(0, 4));
};

export const useDetectMobileOS = (): boolean => {
  // We use state to ensure this check is only performed once on the client side.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(getIsMobileOS());
  }, []);

  return isMobile;
};