
import React from 'react';
import { MdBloodtype } from "react-icons/md";
import { CollapsibleSection } from '../components/mobile/CollapsibleSection';
import { ActionButtons } from '../components/mobile/ActionButtons';

// Helper function for Polish age grammar ("lat" vs "lata")
const formatAge = (age: number) => {
  if ([12, 13, 14].includes(age % 100)) return `${age} lat`;
  if ([2, 3, 4].includes(age % 10)) return `${age} lata`;
  return `${age} lat`;
};

export default function Mobile() {
  // Przykładowe dane
  const person = {
    name: "Jan Kowalski",
    age: 26,
    gender: "M",
    bloodType: "A Rh+",
    chronicDiseases: ["Astma", "Cukrzyca typu 1"],
    permanentMedications: ["Insulina", "Salbutamol"],
	  allergies: ["Penicylina", "Orzeszki ziemne"]
  };

  return (
    // Main container with theme colors and padding
    <div className="min-h-screen bg-background-primary text-text-primary p-4 pb-40 font-roboto"> {/* Added bottom padding to avoid overlap with fixed buttons */}
      <div className="max-w-md mx-auto">
        
        {/* === Information Header === */}
        <div className="mb-6 p-4 bg-background-secondary rounded-xl border border-border-primary">
          <h2 className="text-sm font-semibold text-text-secondary mb-3">INFORMACJE O OSOBIE</h2>
          <div className="flex items-center gap-4">
            <div className="bg-background-tertiary text-sm font-bold p-2 rounded-lg">{formatAge(person.age)}</div>
            <div className="bg-background-tertiary text-sm font-bold p-2 rounded-lg">{person.gender}</div>
            <div className="flex flex-1 items-center justify-between text-lg font-medium text-text-primary border-b border-border-primary pb-1 uppercase">
              <span className="flex-1 text-center">{person.name}</span>
              <div className="flex items-center gap-1">
                <MdBloodtype className="text-accent-primary text-3xl" />
                <span>{person.bloodType}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* === Collapsible Sections === */}
        <div className="space-y-4">
            <CollapsibleSection title="CHOROBY PRZEWLEKŁE">
                <ul className="list-disc list-inside space-y-2">
                    {person.chronicDiseases.length > 0 
                      ? person.chronicDiseases.map((disease) => <li key={disease}>{disease}</li>) 
                      : <li className="list-none text-text-secondary">Brak danych</li>
                    }
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="LEKI PRZYJMOWANE NA STAŁE">
                <ul className="list-disc list-inside space-y-2">
                    {person.permanentMedications.length > 0
                      ? person.permanentMedications.map((med) => <li key={med}>{med}</li>)
                      : <li className="list-none text-text-secondary">Brak danych</li>
                    }
                </ul>
            </CollapsibleSection>

			      <CollapsibleSection title="ALERGIE">
                <ul className="list-disc list-inside space-y-2">
                    {person.allergies.length > 0
                      ? person.allergies.map((allergy) => <li key={allergy}>{allergy}</li>)
                      : <li className="list-none text-text-secondary">Brak danych</li>
                    }
                </ul>
            </CollapsibleSection>
        </div>
      </div>
      
      {/* === Action Buttons (fixed to bottom) === */}
      <ActionButtons />
    </div>
  );
};