// src/pages/Dashboard.tsx
import { QRCodeSVG } from "qrcode.react";
// === 1. Import the necessary React hooks and the Auth hook ===
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  // === 2. Get the userId (client_id) from the AuthContext ===
  const { userId } = useAuth();
  
  const qrValue = `https://yourapi.com/user/${userId}`; // You can now use the real userId in the QR code

  const [qrSize, setQrSize] = useState(200);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // === 3. Use useEffect to log the client_id when the component loads ===
  useEffect(() => {
    // We check if userId exists to avoid logging null on the initial render
    if (userId) {
      console.log("Client ID from AuthContext:", userId);
    }
  }, [userId]); // The effect will re-run if the userId ever changes

  useLayoutEffect(() => {
    // ... (your existing ResizeObserver logic is unchanged) ...
    if (!qrContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const size = entry.contentRect.width;
        if (size > 0) {
          setQrSize(size);
        }
      }
    });
    observer.observe(qrContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* QR Code Section */}
      <div className="bg-background-secondary p-6 rounded-xl border border-border-primary flex flex-col items-center gap-4 w-full max-w-xs">
        <h2 className="text-lg font-semibold text-text-primary">Twój identyfikator QR</h2>
        <div 
          ref={qrContainerRef} 
          className="w-full bg-white rounded-lg p-4 aspect-square"
        >
          <QRCodeSVG
            value={qrValue}
            size={qrSize}
            style={{ width: '100%', height: '100%' }}
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
        <h1 className="text-4xl font-bold text-text-primary">Jan Kowalski</h1>
        {/* You can now display the user ID here as well */}
        <p className="text-text-secondary mt-1 font-mono text-xs">ID Użytkownika: {userId}</p>

        {/* ... (rest of the component is unchanged) ... */}
        <div className="mt-6 border-t border-border-primary pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-secondary">Data urodzenia</p>
            <p className="font-semibold text-text-primary">01.01.1980</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Grupa krwi</p>
            <p className="font-semibold text-text-primary">A Rh+</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Kontakt ICE</p>
            <p className="font-semibold text-text-primary">Anna Kowalska (żona)</p>
            <p className="font-mono text-sm text-text-secondary">+48 123 456 789</p>
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