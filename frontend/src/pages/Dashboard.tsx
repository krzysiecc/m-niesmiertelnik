// src/pages/Dashboard.tsx
import { useAuth } from "../context/AuthContext";
import { useProfileData } from "../context/ProfileDataContext"; // Import the new hook
import { QRCodePanel } from "../components/dashboard/QRCodePanel";
import { UserDataPanel } from "../components/dashboard/UserDataPanel";

export default function Dashboard() {
  const { userId } = useAuth();
  // Data now comes from our context! No more fetching here.
  const { profileData, isLoading, error } = useProfileData(); 

  const qrValue = `https://mniesmiertelnik.com/mobile/scan?user=${userId}`;

  if (isLoading) return <div className="text-center p-8 text-text-primary font-semibold">Ładowanie danych...</div>;
  if (error) return <div className="text-center p-8 text-accent-primary font-semibold">{error}</div>;
  if (!profileData) return <div className="text-center p-8 text-text-secondary">Brak danych profilowych.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <QRCodePanel qrValue={qrValue} />
      <UserDataPanel profile={profileData} userId={userId} />
    </div>
  );
}