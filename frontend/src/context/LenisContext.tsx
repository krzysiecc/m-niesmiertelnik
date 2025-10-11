// context/LenisContext.tsx

import {
  createContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
    });
    console.log("✅ Lenis instance created in Provider.");
    lenisRef.current = lenis;

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      console.log("❌ Lenis instance destroyed in Provider.");
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}