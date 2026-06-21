import { useTranslation } from 'react-i18next';
import { useProfileData } from '../context/ProfileDataContext';
import { HealthDataList } from '../components/dashboard/HealthDataList';

export default function ChronicDiseases() {
  const { t } = useTranslation();
  const { profileData, isLoading, error } = useProfileData();
  if (isLoading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>{t('common.noData')}</div>;

  return <HealthDataList title={t('dashboard.healthChronicTitle')} items={profileData.chronicDiseases} placeholder={t('dashboard.healthChronicPlaceholder')} />;
}
