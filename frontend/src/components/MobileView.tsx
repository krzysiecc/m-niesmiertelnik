import React, {useState} from 'react'

// Ikona strzałki (Chevron) dla rozwijanych sekcji
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
      isOpen ? 'rotate-180' : ''
    }`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

// Props dla komponentu rozwijanej sekcji
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

// Komponent dla rozwijanej sekcji (Akordeon)
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-gray-300">{children}</div>
        </div>
      )}
    </div>
  );
};


// Główny komponent widoku
const MobileView = () => {
  // Przykładowe dane
  const person = {
    name: "Jan Kowalski",
    age: 21,
    gender: "M",
    chronicDiseases: ["Astma", "Cukrzyca typu 1", "Nadciśnienie tętnicze"],
    permanentMedications: ["Insulina", "Salbutamol", "Metformina"],
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4">
      <div className="max-w-md mx-auto">
        {/* === Status Bar (imitacja) === */}
       

        {/* === Główne Przyciski === */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-red-600/90 hover:bg-red-700 p-4 rounded-xl text-center font-bold">
            POWIADOM NAJBLIŻSZE OSOBY
          </button>
          <button className="bg-blue-600/90 hover:bg-blue-700 p-4 rounded-xl text-center font-bold">
            POWIADOM 112
            <span className="block text-xs font-normal text-blue-200">(w tle)</span>
          </button>
        </div>

        {/* === Informacje o Osobie === */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">INFORMACJE O OSOBIE</h2>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 text-sm font-bold p-2 rounded-lg">{person.age} lat</div>
            <div className="bg-indigo-500 text-sm font-bold p-2 rounded-lg">{person.gender}</div>
            <div className="flex-1 text-lg font-medium text-gray-200 border-b border-gray-600 pb-1">{person.name}</div>
          </div>
        </div>
        
        {/* === Sekcje Rozwijane === */}
        <div className="space-y-4">
            <CollapsibleSection title="CHOROBY PRZEWLEKŁE">
                <ul className="list-disc list-inside space-y-2">
                    {person.chronicDiseases.map((disease) => <li key={disease}>{disease}</li>)}
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="LEKI NA STAŁE">
                <ul className="list-disc list-inside space-y-2">
                    {person.permanentMedications.map((med) => <li key={med}>{med}</li>)}
                </ul>
            </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default MobileView;

