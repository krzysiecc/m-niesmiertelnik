// src/contexts/ProfileDataContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the shape of our data (can be moved to a types file later)
type TrustedContact = { fullName: string; phone: string; };
type UserProfileData = {
  userId: string; bloodType: string; birthdate: string; name: string;
  gender: 'M' | 'F' | 'O'; chronicDiseases: string[]; allergies: string[];
  permanentMedications: string[]; trustedContacts: TrustedContact[]; is_blocked: boolean;
};

interface ProfileDataContextType {
  profileData: UserProfileData | null;
  token: string | null;             
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [token, setToken] = useState<string | null>(null); // ✅ 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAndDecryptData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userResponse = await fetch(`https://iteracja-hackathon-1110.onrender.com/users/${userId}`);
      if (!userResponse.ok) throw new Error("Nie udało się pobrać danych użytkownika.");
      const userData = await userResponse.json();
      if (!userData.token) throw new Error("Odpowiedź serwera nie zawiera tokenu.");
      
      setToken(userData.token);

      
      const decryptResponse = await fetch('https://iteracja-hackathon-1110.onrender.com/decryptToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted_token: userData.token }),
      });
      if (!decryptResponse.ok) throw new Error("Nie udało się odszyfrować danych.");
      const result = await decryptResponse.json();
      setProfileData(result.data);
    } catch (err: any) {
      setError(err.message || "Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsLoading(false);
    }
   }, [userId]); 

  useEffect(() => {
    fetchAndDecryptData();
  }, [fetchAndDecryptData]);

  return (
    <ProfileDataContext.Provider value={{ profileData, token, isLoading, error, refetch: fetchAndDecryptData }}>
      {children}
    </ProfileDataContext.Provider>
  );
};

export const useProfileData = (): ProfileDataContextType => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};