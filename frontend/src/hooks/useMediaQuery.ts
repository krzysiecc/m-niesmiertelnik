
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for server-side rendering safety)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Update state if the media query match status changes
    const listener = () => setMatches(media.matches);

    // Set the initial state
    listener();
    
    // Add event listener for changes
    media.addEventListener('change', listener);

    // Cleanup: remove event listener on component unmount
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};