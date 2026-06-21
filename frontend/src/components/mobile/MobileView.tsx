// src/components/mobile/MobileView.tsx
// Mobile dashboard view: shows the logged-in user's own emergency profile.
import { MdBloodtype } from "react-icons/md";
import { useTranslation } from "react-i18next";
import MobileNavbar from './MobileNavbar';
import { CollapsibleSection } from './CollapsibleSection';
import { ActionButtons } from './ActionButtons';
import { useProfileData } from '../../context/ProfileDataContext';
import { calculateAge } from '../../lib/date';

const MobileView = () => {
  const { t } = useTranslation();
  const { profileData, isLoading, error } = useProfileData();

  if (isLoading) {
    return <p className="p-6 text-center text-text-secondary">{t('common.loadingData')}</p>;
  }
  if (error) {
    return <p className="p-6 text-center text-accent-primary">{error}</p>;
  }
  if (!profileData) {
    return <p className="p-6 text-center text-text-secondary">{t('common.noProfileData')}</p>;
  }

  const age = calculateAge(profileData.birthdate);
  const ageLabel = age === null ? t('common.noDataShort') : t('mobile.age', { count: age });

  return (
    <>
      <MobileNavbar />
      <div className="min-h-screen text-text-primary p-5 pt-10 font-roboto">
        <div className="max-w-md mx-auto">

          {/* === Person information === */}
          <div className="mb-6 p-4 bg-accent-primary rounded-xl border border-border-primary">
            <h2 className="text-sm font-semibold text-text-inverted mb-3">{t('mobile.personInfo')}</h2>
            <div className="flex items-center gap-4">
              <div className="bg-accent-primary-hover text-text-inverted text-sm font-bold p-2 rounded-lg">{ageLabel}</div>
              <div className="bg-accent-primary-hover text-text-inverted text-sm font-bold p-2 rounded-lg">{profileData.gender}</div>
              <div className="flex flex-1 items-center justify-between text-lg font-medium text-text-inverted border-b border-border-primary pb-1 uppercase">
                <span className="flex-1 text-center">{profileData.name}</span>
                <MdBloodtype className="text-accent-primary-hover text-3xl" />
                <span>{profileData.bloodType}</span>
              </div>
            </div>
          </div>

          {/* === Collapsible sections === */}
          <div className="rounded-xl scrollbar-hide scroll-fade p-4 overflow-y-auto max-h-[55vh] space-y-4">
            <CollapsibleSection title={t('mobile.chronicDiseases')}>
              <ul className="list-disc list-inside space-y-2">
                {profileData.chronicDiseases.length > 0
                  ? profileData.chronicDiseases.map((disease) => <li key={disease}>{disease}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title={t('mobile.medications')}>
              <ul className="list-disc list-inside space-y-2">
                {profileData.permanentMedications.length > 0
                  ? profileData.permanentMedications.map((med) => <li key={med}>{med}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title={t('mobile.allergies')}>
              <ul className="list-disc list-inside space-y-2">
                {profileData.allergies.length > 0
                  ? profileData.allergies.map((allergy) => <li key={allergy}>{allergy}</li>)
                  : <li className="list-none text-text-secondary">{t('common.noDataShort')}</li>}
              </ul>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      <ActionButtons />
    </>
  );
};

export default MobileView;
