// src/context/ProfileDataContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiUrl, authFetch } from '../lib/api';
import i18n from '../i18n';
import type { UserProfileData } from '../types';

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
  const [token, setToken] = useState<string | null>(null);
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
      // Authenticated request: only the owner may read their own record/token.
      const userResponse = await authFetch(`/users/${userId}`);
      if (!userResponse.ok) throw new Error(i18n.t('errors.fetchUserFailed'));
      const userData = await userResponse.json();
      if (!userData.token) throw new Error(i18n.t('errors.noToken'));

      setToken(userData.token);

      // Public decrypt endpoint (the same path responders use when scanning).
      const decryptResponse = await fetch(apiUrl('/decryptToken'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted_token: userData.token }),
      });
      if (!decryptResponse.ok) throw new Error(i18n.t('errors.decryptFailed'));
      const result = await decryptResponse.json();
      setProfileData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : i18n.t('errors.unexpected'));
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

// Custom hook co-located with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useProfileData = (): ProfileDataContextType => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};
