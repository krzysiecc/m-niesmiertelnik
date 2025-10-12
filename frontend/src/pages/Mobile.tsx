// src/pages/Mobile.tsx
import React, { useState, useEffect } from 'react';
import { MdBloodtype } from "react-icons/md";
import { CollapsibleSection } from '../components/mobile/CollapsibleSection';
import { ActionButtons } from '../components/mobile/ActionButtons';

// Helper function for Polish age grammar, now co-located in this file
const formatAge = (age: number) => {
  if ([12, 13, 14].includes(age % 100)) return `${age} lat`;
  if ([2, 3, 4].includes(age % 10)) return `${age} lata`;
  return `${age} lat`;
};

// A simple spinner for the loading state
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-background-primary">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-highlight"></div>
  </div>
);

export default function Mobile() {
  // === 1. DATA FETCHING LOGIC ===
  // State to hold the user data and loading status
  const [userData, setUserData] = useState<any>(null); // Use a proper type/interface in a real app
  const [isLoading, setIsLoading] = useState(true);

  // useEffect simulates fetching data once when the component mounts
  useEffect(() => {
    // In a real app, you would fetch data from your API here
    // const userId = /* get user ID from URL params */;
    // fetch(`/api/user/${userId}`).then(...)
    
    // Simulating a network request with a timeout
    const timer = setTimeout(() => {
      setUserData({
        name: "Jan Kowalski",
        age: 26,
        gender: "M",
        bloodType: "A Rh+",
        chronicDiseases: ["Astma", "Cukrzyca typu 1", "Nadciśnienie", "Choroba serca", "Wada wzroku"],
        permanentMedications: ["Insulina", "Salbutamol", "Metformina", "Aspiryna"],
        allergies: ["Penicylina", "Orzeszki ziemne", "Pyłki traw", "Sierść kota", "Lateks"]
      });
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer); // Cleanup
  }, []); // Empty dependency array ensures this runs only once

  // Show a loading spinner while fetching data
  if (isLoading || !userData) {
    return <LoadingSpinner />;
  }
  
  // The rest of the component renders only after data is available
  return (
    <div className="h-screen bg-background-primary text-text-primary font-roboto flex flex-col">
      
      {/* === 2. THE INFO BAR IS NOW DIRECTLY IN THIS FILE === */}
      {/* This header is sticky, has a solid background, and a z-index to stay on top */}
      <header className="sticky top-0 z-10 bg-background-primary p-4">
        <div className="max-w-md mx-auto p-4 bg-background-secondary rounded-xl border border-border-primary">
          <h2 className="text-sm font-semibold text-text-secondary mb-3">INFORMACJE O OSOBIE</h2>
          <div className="flex items-center gap-4">
            <div className="bg-background-tertiary text-sm font-bold p-2 rounded-lg">{formatAge(userData.age)}</div>
            <div className="bg-background-tertiary text-sm font-bold p-2 rounded-lg">{userData.gender}</div>
            <div className="flex flex-1 items-center justify-between text-lg font-medium text-text-primary border-b border-border-primary pb-1 uppercase">
              <span className="flex-1 text-center">{userData.name}</span>
              <div className="flex items-center gap-1">
                <MdBloodtype className="text-accent-primary text-3xl" />
                <span>{userData.bloodType}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* === 3. THE SCROLLABLE CONTENT AREA (UNCHANGED) === */}
      <main className="flex-1 overflow-y-auto scroll-fade [scrollbar-gutter:stable]">
        <div className="max-w-md mx-auto space-y-4 p-4 pb-30">
          <CollapsibleSection title="CHOROBY PRZEWLEKŁE">
            <ul className="list-disc list-inside space-y-2">
                {userData.chronicDiseases.length > 0 
                  ? userData.chronicDiseases.map((disease: string) => <li key={disease}>{disease}</li>) 
                  : <li className="list-none text-text-secondary">Brak danych</li>
                }
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="LEKI PRZYJMOWANE NA STAŁE">
            <ul className="list-disc list-inside space-y-2">
                {userData.permanentMedications.length > 0
                  ? userData.permanentMedications.map((med: string) => <li key={med} >{med}</li>)
                  : <li className="list-none text-text-secondary">Brak danych</li>
                }
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="ALERGIE">
            <ul className="list-disc list-inside space-y-2">
                {userData.allergies.length > 0
                  ? userData.allergies.map((allergy: string) => <li key={allergy}>{allergy}</li>)
                  : <li className="list-none text-text-secondary">Brak danych</li>
                }
            </ul>
          </CollapsibleSection>
        </div>
      </main>
      
      <ActionButtons />
    </div>
  );
};