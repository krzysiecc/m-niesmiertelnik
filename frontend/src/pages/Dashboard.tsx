// src/pages/Dashboard.tsx
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useProfileData } from "../context/ProfileDataContext";
import { QRCodePanel } from "../components/dashboard/QRCodePanel";
import { UserDataPanel } from "../components/dashboard/UserDataPanel";
import { scanUrl } from "../lib/api";

export default function Dashboard() {
  const { userId } = useAuth();
  const { t } = useTranslation();
  // Data comes from the ProfileData context (fetched + decrypted once).
  const { profileData, token, isLoading, error } = useProfileData();

  const qrValue = token ? scanUrl(token) : "";

  if (isLoading) return <div className="text-center p-8 text-text-primary font-semibold">{t('common.loadingData')}</div>;
  if (error) return <div className="text-center p-8 text-accent-primary font-semibold">{error}</div>;
  if (!profileData) return <div className="text-center p-8 text-text-secondary">{t('common.noProfileData')}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <QRCodePanel qrValue={qrValue} />
      <UserDataPanel profile={profileData} userId={userId} />
    </div>
  );
}
