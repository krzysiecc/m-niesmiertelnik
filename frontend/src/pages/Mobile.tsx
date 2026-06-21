// src/pages/Mobile.tsx
import { useState, useEffect } from 'react';
import { MdBloodtype } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CollapsibleSection } from '../components/mobile/CollapsibleSection';
import { ActionButtons } from '../components/mobile/ActionButtons';
import { apiUrl } from '../lib/api';
import { calculateAge } from '../lib/date';
import type { DecryptResponse } from '../types';

// A simple spinner for the loading state
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-background-primary">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-highlight"></div>
  </div>
);

export default function Mobile() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [userData, setUserData] = useState<DecryptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decryptResponse = await fetch(apiUrl('/decryptToken'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted_token: token }),
        });
        if (!decryptResponse.ok) throw new Error(t('errors.decryptFailed'));
        const decryptedData: DecryptResponse = await decryptResponse.json();
        setUserData(decryptedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, t]);

  if (isLoading || !userData) {
    return <LoadingSpinner />;
  }

  const profile = userData.data;
  const age = calculateAge(profile.birthdate);
  const ageLabel = age === null ? t('common.noDataShort') : t('mobile.age', { count: age });

  return (
    <div className="h-screen bg-background-primary text-text-primary font-roboto flex flex-col">

      {/* Sticky person-info header */}
      <header className="sticky top-0 z-10 bg-background-primary p-4">
        <div className="max-w-md mx-auto p-4 bg-blue-300 rounded-xl border border-border-primary">
          <h2 className="text-sm font-semibold text-text-inverted mb-3">{t('mobile.personInfo')}</h2>
          <div className="flex items-center gap-4">
            <div className="bg-accent-primary-hover text-text-inverted text-sm font-bold p-2 rounded-lg">{ageLabel}</div>
            <div className="bg-accent-primary-hover text-text-inverted text-sm font-bold p-2 rounded-lg">{profile.gender}</div>
            <div className="flex flex-1 items-center justify-between text-lg font-medium text-text-primary border-b border-border-primary pb-1 uppercase">
              <span className="flex-1 text-center text-text-inverted">{profile.name}</span>
              <div className="flex items-center gap-1">
                <MdBloodtype className="text-accent-primary-hover text-3xl" />
                <span className='text-text-inverted'>{profile.bloodType}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto scroll-fade [scrollbar-gutter:stable]">
        <div className="max-w-md mx-auto space-y-4 p-4 pb-30">
          <CollapsibleSection title={t('mobile.chronicDiseases')}>
            <ul className="list-disc list-inside space-y-2">
                {(Array.isArray(profile.chronicDiseases) && profile.chronicDiseases.length > 0)
                  ? profile.chronicDiseases.map((disease: string) => <li key={disease}>{disease}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>
                }
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title={t('mobile.medications')}>
            <ul className="list-disc list-inside space-y-2">
                {(Array.isArray(profile.permanentMedications) && profile.permanentMedications.length > 0)
                  ? profile.permanentMedications.map((med: string) => <li key={med}>{med}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>
                }
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title={t('mobile.allergies')}>
            <ul className="list-disc list-inside space-y-2">
                {(Array.isArray(profile.allergies) && profile.allergies.length > 0)
                  ? profile.allergies.map((allergy: string) => <li key={allergy}>{allergy}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>
                }
            </ul>
          </CollapsibleSection>
        </div>
      </main>

      <ActionButtons />
    </div>
  );
}
