// src/components/dashboard/UserDataPanel.tsx
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt } from 'react-icons/fa';
import type { UserProfileData } from '../../types';

interface UserDataPanelProps {
  profile: Pick<UserProfileData, 'name' | 'birthdate' | 'bloodType' | 'trustedContacts'>;
  userId: string | null;
}

export const UserDataPanel = ({ profile, userId }: UserDataPanelProps) => {
  const { t } = useTranslation();

  // Format the stored date and treat the legacy "1900" placeholder as empty.
  const formatBirthdate = (value: string): string => {
    if (!value || value.startsWith('1900')) return t('common.notProvided');
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return value;
    const [, yyyy, mm, dd] = m;
    return `${dd}.${mm}.${yyyy}`;
  };

  return (
    <div className="flex-1 bg-background-secondary p-6 rounded-xl border border-border-primary">
      <h1 className="text-4xl font-bold text-text-primary">{profile.name || t('dashboard.noName')}</h1>
      <p className="font-mono text-xs text-text-secondary mt-1">{t('dashboard.userId', { id: userId })}</p>

      <div className="mt-6 border-t border-border-primary pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div>
          <p className="text-sm text-text-secondary">{t('dashboard.birthDate')}</p>
          <p className="font-semibold text-text-primary text-lg">{formatBirthdate(profile.birthdate)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">{t('dashboard.bloodType')}</p>
          <p className="font-semibold text-text-primary text-lg">{profile.bloodType || t('common.notProvided')}</p>
        </div>
      </div>

      {/* Dedicated section for ICE (In Case of Emergency) contacts */}
      <div className="mt-6 border-t border-border-primary pt-6">
        <h2 className="text-lg font-bold text-text-secondary mb-4">{t('dashboard.iceTitle')}</h2>
        <div className="space-y-4">
          {profile.trustedContacts?.length > 0 ? (
            profile.trustedContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-background-tertiary rounded-lg">
                <div className="flex-shrink-0 bg-highlight/20 text-highlight p-3 rounded-full">
                  <FaPhoneAlt size={20}/>
                </div>
                <div>
                  <p className="font-bold text-text-primary text-xl">{contact.fullName}</p>
                  <p className="font-mono text-text-secondary text-base">{contact.phone}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary">{t('dashboard.noIce')}</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-border-primary pt-6">
          <button className="px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg shadow-[0_5px_20px_var(--shadow-color)] transition-transform hover:scale-105 cursor-pointer">
            {t('dashboard.regenerateQr')}
          </button>
          <p className="text-xs text-text-secondary mt-2">{t('dashboard.regenerateHint')}</p>
      </div>
    </div>
  );
};
