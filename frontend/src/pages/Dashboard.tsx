
import { QRCodeSVG } from "qrcode.react";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const qrValue = "https://yourapi.com/user/jwt-goes-here";
    const { userId } = useAuth();
   const [userData, setUserData] = useState();

    useEffect(() => {
    // We check if userId exists to avoid logging null on the initial render
    if (userId) {
      console.log("Client ID from AuthContext:", userId);
    }
  }, [userId]); 
  // === 2. Set up state for the size and a ref for the container ===
  const [qrSize, setQrSize] = useState(200); // Default size
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // === 3. Use an effect with a ResizeObserver to measure the container ===
  useLayoutEffect(() => {
    if (!qrContainerRef.current) return;

    // The ResizeObserver is more efficient than listening to window resize
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        // Use the container's width as the size for our square QR code
        const size = entry.contentRect.width;
        if (size > 0) {
          setQrSize(size);
        }
      }
    });

    observer.observe(qrContainerRef.current);

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* QR Code Section */}
      <div className="bg-background-secondary p-6 rounded-xl border border-border-primary flex flex-col items-center gap-4 w-full max-w-xs">
        <h2 className="text-lg font-semibold text-text-primary">Twój identyfikator QR</h2>
        
        {/* === 4. JSX Modifications === */}
        {/* This div will be measured. It's a square and fills the available width. */}
        <div 
          ref={qrContainerRef} 
          className="w-full bg-white rounded-lg p-4 aspect-square" // aspect-square makes it a perfect square
        >
          <QRCodeSVG
            value={qrValue}
            size={qrSize} // Use the dynamic size from state
            style={{ width: '100%', height: '100%' }} // Ensure SVG fills the container
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>

        <p className="text-xs text-text-secondary text-center">Zeskanuj, aby zobaczyć kartę informacyjną. <br />Ustaw jako tapetę w telefonie.</p>
        <button className="w-full mt-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-semibold rounded-lg transition-transform hover:scale-105 cursor-pointer">
          Pobierz PNG
        </button>
      </div>

      {/* Basic Data Section */}
      <div className="flex-1 bg-background-secondary p-6 rounded-xl border border-border-primary">
        {/* ... (rest of the component is unchanged) ... */}
        <h1 className="text-4xl font-bold text-text-primary"></h1>
        <p className="text-text-secondary mt-1">ID Użytkownika: usr_12345abcde</p>
        <div className="mt-6 border-t border-border-primary pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-secondary">Data urodzenia</p>
            <p className="font-semibold text-text-primary"></p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Grupa krwi</p>
            <p className="font-semibold text-text-primary"></p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Kontakt ICE</p>
            <p className="font-semibold text-text-primary"></p>
            <p className="font-mono text-sm text-text-secondary"></p>
          </div>
        </div>
        <div className="mt-8">
            <button className="px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg shadow-[0_5px_20px_var(--shadow-color)] transition-transform hover:scale-105 cursor-pointer">
                Zablokuj i wygeneruj nowy kod QR
            </button>
            <p className="text-xs text-text-secondary mt-2">Użyj w przypadku zgubienia telefonu lub udostępnienia kodu niepowołanym osobom.</p>
        </div>
      </div>
    </div>
  );
}