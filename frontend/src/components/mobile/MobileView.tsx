import React, {useEffect, useState} from 'react'
import MobileNavbar from './MobileNavbar';
import { MdBloodtype } from "react-icons/md";
import { useParams } from 'react-router';
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden ring-1 ring-blue-500 bg-clip-padding">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-500 flex justify-between items-center p-4 text-left rounded-t-xl focus:outline-none focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Animujemy tylko wysokość (grid-rows) */}
      <div
        className={`grid overflow-hidden bg-gray-800 transition-[grid-template-rows] duration-400 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* UWAGA: żadnego jasnego borderu! */}
          <div className="-mt-px bg-gray-800 p-4 rounded-b-xl /* border-t border-transparent */ font-extrabold uppercase text-blue-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};



// Główny komponent widoku
const MobileView = () => {

  useEffect(() => {
    const { token } = useParams<{ token: string }>();
    console.log("Scanned token:", token);

  },[])

  // Przykładowe dane
  const person = {
    name: "Jan Kowalski",
    age: 26,
    gender: "M",
    bloodType: "A+",
    chronicDiseases: ["Astma", "Cukrzyca typu 1"],
    permanentMedications: ["Insulina", "Salbutamol"],
	  allergies: ["Penicylina", "Orzeszki ziemne"]
  };

  return (
	<>
		<MobileNavbar />
		<div className=" min-h-screen text-gray-900 p-5 pt-10 font-family-roboto">
      	<div className="max-w-md mx-auto">

        

        {/* === Informacje o Osobie === */}
        <div className="mb-6 p-4 bg-blue-500 rounded-xl border border-gray-500">
          <h2 className="text-m font-semibold text-white-500 mb-3">INFORMACJE O OSOBIE</h2>
          <div className="flex items-center gap-4">
            <div className="bg-red-500 text-sm font-bold p-2 rounded-lg">
  {`${person.age} ${[2, 3, 4].includes(person.age % 10) && ![12, 13, 14].includes(person.age % 100) ? 'lata' : 'lat'}`}
</div>
            <div className="bg-red-500 text-sm font-bold p-2 rounded-lg">{person.gender}</div>
            <div className="flex flex-1 items-center justify-between text-lg font-medium text-white border-b border-gray-500 pb-1 uppercase">
              <span className="flex-1 text-center">{person.name}</span>
              <MdBloodtype className="text-red-500 text-3xl " />
              <span>{person.bloodType}</span>
            </div>
          </div>
        </div>
        
        {/* === Sekcje Rozwijane === */}
        <div className="rounded-xl scrollbar-hide scroll-fade p-4 overflow-y-auto max-h-[55vh] space-y-4">
            <CollapsibleSection title="CHOROBY PRZEWLEKŁE">
                <ul className="list-disc list-inside space-y-2">
                    {(person.chronicDiseases.length !== 0)? person.chronicDiseases.map((disease) => <li key={disease}>{disease}</li>) : <li>Brak danych</li>}
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="LEKI NA STAŁE">
                <ul className="list-disc list-inside space-y-2">
                    {(person.permanentMedications.length !== 0)? person.permanentMedications.map((med) => <li key={med}>{med}</li>) : <li>Brak danych</li>}
                </ul>
            </CollapsibleSection>

			<CollapsibleSection title="ALERGIE">
                <ul className="list-disc list-inside space-y-2">
                    {person.allergies.map((allergies) => <li key={allergies}>{allergies}</li>)}
                </ul>
            </CollapsibleSection>
        </div>

		{/* === Główne Przyciski === */}
		<div className="p-5 fixed inset-x-0 bottom-0 flex justify-center ">

        <div className="grid grid-cols-2 gap-4 pb-20">
          <button className="bg-green-700 active:bg-green-600 active:transition-colors p-5 border-green-800 border-1 rounded-xl text-center font-extrabold text-[18px]">
            POWIADOM NAJBLIŻSZE OSOBY
          </button>
          <button className="bg-red-500 active:bg-light-red-500 active:transition-colors p-5 border-light-red-400 border-1 rounded-xl text-center font-semibold text-[30px]">
		    <span className="material-symbols-outlined !text-[38px] mr-2">
			phone_in_talk
			</span>
			112
          </button>
        </div>
		</div>
      </div>
    </div>
	</>
    
  );
};

export default MobileView;

