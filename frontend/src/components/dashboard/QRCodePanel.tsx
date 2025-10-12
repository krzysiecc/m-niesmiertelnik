// src/components/dashboard/QRCodePanel.tsx
import { useState, useRef, useLayoutEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
// === 1. Import the library we just installed ===
import { saveSvgAsPng } from 'save-svg-as-png';

interface QRCodePanelProps {
  qrValue: string;
}

export const QRCodePanel = ({ qrValue }: QRCodePanelProps) => {
  const [qrSize, setQrSize] = useState(200);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  // === 2. Create a new ref to specifically target the SVG element ===
  const qrSvgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    // ... (This resizing logic remains unchanged) ...
    if (!qrContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const size = entry.contentRect.width;
        if (size > 0) setQrSize(size);
      }
    });
    observer.observe(qrContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // === 3. Create the download handler function ===
  const handleDownload = () => {
    if (qrSvgRef.current) {
      // Use the library to save the SVG element as a PNG
      saveSvgAsPng(qrSvgRef.current, "mniesmiertelnik-qr-code.png", {
        scale: 5, // Export at 5x the screen resolution for high quality
        backgroundColor: '#FFFFFF', // Ensure background is solid white
      });
    } else {
      console.error("QR Code SVG element not found.");
    }
  };

  return (
    <div className="bg-background-secondary p-6 rounded-xl border border-border-primary flex flex-col items-center gap-4 w-full max-w-xs self-start">
      <h2 className="text-lg font-semibold text-text-primary">Twój identyfikator QR</h2>
      <div ref={qrContainerRef} className="w-full bg-white rounded-lg p-4 aspect-square">
        <QRCodeSVG
          // === 4. Attach the new ref to the SVG component ===
          ref={qrSvgRef} 
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
      
      {/* === 5. Attach the handler to the button's onClick event === */}
      <button 
        onClick={handleDownload}
        className="w-full mt-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-semibold rounded-lg transition-transform hover:scale-105 cursor-pointer"
      >
        Pobierz PNG
      </button>
    </div>
  );
};