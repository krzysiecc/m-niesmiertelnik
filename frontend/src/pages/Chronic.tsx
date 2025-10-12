import { useProfileData } from '../context/ProfileDataContext';
import { HealthDataList } from '../components/dashboard/HealthDataList';

export default function ChronicDiseases() {
  const { profileData, isLoading, error } = useProfileData();
  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Brak danych.</div>;

  return <HealthDataList title="Choroby Przewlekłe" items={profileData.chronicDiseases} placeholder="np. Astma" />;
}