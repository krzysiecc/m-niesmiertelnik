
import { QRCodeSVG } from "qrcode.react";

export default function Dashboard() {


  const qrValue = "https://yourapi.com/user/jwt-goes-here";


  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">

      {/* QR Code Section */}
      <div className="bg-background-secondary p-6 rounded-xl border border-border-primary flex flex-col items-center gap-4 w-full max-w-xs">
        <h2 className="text-lg font-semibold text-text-primary">Twój identyfikator QR</h2>
        <div className="p-4 bg-white rounded-lg">
          <QRCodeSVG
            value={qrValue}
            size={200}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>

        <p className="text-xs text-text-secondary text-center">Zeskanuj, aby zobaczyć kartę informacyjną. <br />Ustaw jako tapetę w telefonie.</p>
        <button className="w-full mt-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-text-inverted font-semibold rounded-lg transition-transform hover:scale-110 cursor-pointer">
          Pobierz PNG
        </button>

      </div>

      {/* Basic Data Section */}
      <div className="flex-1 bg-background-secondary p-6 rounded-xl border border-border-primary">
        <h1 className="text-4xl font-bold text-text-primary">Jan Kowalski</h1>
        <p className="text-text-secondary mt-1">ID Użytkownika: usr_12345abcde</p>

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
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg cursor-pointer">
                Zablokuj i wygeneruj nowy kod QR
            </button>
            <p className="text-xs text-text-secondary mt-2">Użyj w przypadku zgubienia telefonu lub udostępnienia kodu niepowołanym osobom.</p>
        </div>
      </div>
    </div>
  );
}