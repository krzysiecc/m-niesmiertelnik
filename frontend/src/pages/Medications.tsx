import { useProfileData } from '../context/ProfileDataContext';
import { HealthDataList } from '../components/dashboard/HealthDataList';

export default function Medications() {
  const { profileData, isLoading, error } = useProfileData();
  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Brak danych.</div>;

  return <HealthDataList title="Leki Przyjmowane na Stałe" items={profileData.permanentMedications} placeholder="np. Metformina 500mg" />;
}