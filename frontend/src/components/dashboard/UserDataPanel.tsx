// src/components/dashboard/UserDataPanel.tsx
import { FaPhoneAlt } from 'react-icons/fa';

// Define the shape of the data this component expects
type TrustedContact = { fullName: string; phone: string; };
type UserProfileData = {
  name: string;
  birthdate: string;
  bloodType: string;
  trustedContacts: TrustedContact[];
};

interface UserDataPanelProps {
  profile: UserProfileData;
  userId: string | null;
}

// Helper to format date and handle placeholder dates
const toPlFromIso = (iso: string): string => {
  if (!iso || iso.startsWith('1900')) return 'Nie uzupełniono';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const [, yyyy, mm, dd] = m;
  return `${dd}.${mm}.${yyyy}`;
};

export const UserDataPanel = ({ profile, userId }: UserDataPanelProps) => {
  return (
    <div className="flex-1 bg-background-secondary p-6 rounded-xl border border-border-primary">
      <h1 className="text-4xl font-bold text-text-primary">{profile.name || 'Brak Imienia i Nazwiska'}</h1>
      <p className="font-mono text-xs text-text-secondary mt-1">ID Użytkownika: {userId}</p>
      
      <div className="mt-6 border-t border-border-primary pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div>
          <p className="text-sm text-text-secondary">Data urodzenia</p>
          <p className="font-semibold text-text-primary text-lg">{toPlFromIso(profile.birthdate)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Grupa krwi</p>
          <p className="font-semibold text-text-primary text-lg">{profile.bloodType || 'Nie uzupełniono'}</p>
        </div>
      </div>

      {/* === BIGGER, DEDICATED SECTION FOR ICE CONTACTS === */}
      <div className="mt-6 border-t border-border-primary pt-6">
        <h2 className="text-lg font-bold text-text-secondary mb-4">Kontakt w Nagłym Wypadku (ICE)</h2>
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
            <p className="text-text-secondary">Nie dodano żadnych kontaktów ICE.</p>
          )}
        </div>
      </div>
      
      <div className="mt-8 border-t border-border-primary pt-6">
          <button className="px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg shadow-[0_5px_20px_var(--shadow-color)] transition-transform hover:scale-105 cursor-pointer">
            Zablokuj i wygeneruj nowy kod QR
          </button>
          <p className="text-xs text-text-secondary mt-2">Użyj w przypadku zgubienia telefonu lub udostępnienia kodu niepowołanym osobom.</p>
      </div>
    </div>
  );
};