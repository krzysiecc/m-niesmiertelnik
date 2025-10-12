import { useProfileData } from '../context/ProfileDataContext';
import { HealthDataList } from '../components/dashboard/HealthDataList';

export default function Allergies() {
  const { profileData, isLoading, error } = useProfileData();
  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Brak danych.</div>;

  return <HealthDataList title="Alergie" items={profileData.allergies} placeholder="np. Pyłki traw" />;
}