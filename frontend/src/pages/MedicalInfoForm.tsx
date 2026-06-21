import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/forms/Input';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../lib/api';
import type { TrustedContact, UserProfileData } from '../types';

type MedicalForm = UserProfileData;

const toIsoFromPl = (pl: string): string => {
  const m = pl.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return '';
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
};

const toPlFromIso = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const [, yyyy, mm, dd] = m;
  return `${dd}.${mm}.${yyyy}`;
};

const todayIso = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export default function MedicalInfoForm() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<MedicalForm>({
    userId: userId || '',
    bloodType: '',
    birthdate: '22.01.2004',
    name: '',
    gender: 'M',
    chronicDiseases: [''],
    allergies: [''],
    permanentMedications: [''],
    trustedContacts: [{ fullName: '', phone: '' }], // start with one row
    is_blocked: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as MedicalForm));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Pick<MedicalForm, 'chronicDiseases' | 'allergies' | 'permanentMedications'>,
    index: number
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = e.target.value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (
    field: keyof Pick<MedicalForm, 'chronicDiseases' | 'allergies' | 'permanentMedications'>
  ) => setFormData((p) => ({ ...p, [field]: [...p[field], ''] }));

  const removeArrayItem = (
    field: keyof Pick<MedicalForm, 'chronicDiseases' | 'allergies' | 'permanentMedications'>,
    index: number
  ) =>
    setFormData((p) => {
      const arr = p[field].length > 1 ? p[field].filter((_, i) => i !== index) : p[field];
      return { ...p, [field]: arr };
    });

  // --- Trusted contacts ---
  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: keyof TrustedContact
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const contacts = [...prev.trustedContacts];
      contacts[index] = { ...contacts[index], [key]: value };
      return { ...prev, trustedContacts: contacts };
    });
  };

  const addContact = () =>
    setFormData((p) => ({ ...p, trustedContacts: [...p.trustedContacts, { fullName: '', phone: '' }] }));

  const removeContact = (index: number) =>
    setFormData((p) => {
      const contacts =
        p.trustedContacts.length > 1 ? p.trustedContacts.filter((_, i) => i !== index) : p.trustedContacts;
      return { ...p, trustedContacts: contacts };
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await authFetch('/generateToken', {
        method: 'POST',
        body: JSON.stringify({ ...formData, userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t('form.saveError'));
      }

      toast.success(t('form.saveSuccess'));
      navigate('/login');

    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(err instanceof Error ? err.message : t('form.saveError'));
    }
  };

  return (
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="mx-auto h-16 mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">{t('form.title')}</h1>
          <p className="text-text-secondary mt-2">{t('form.subtitle')}</p>
        </div>

        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('form.name')}
              type="text"
              name="name"
              placeholder={t('form.namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Date picker */}
            <div>
              <label className="block mb-2 text-sm font-medium text-text-secondary">
                {t('form.birthDate')}
              </label>
              <input
                type="date"
                value={toIsoFromPl(formData.birthdate)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthdate: toPlFromIso(e.target.value),
                  }))
                }
                max={todayIso()}
                min="1900-01-01"
                className="w-full p-3 border border-border-primary rounded-lg bg-background-tertiary text-text-primary"
              />
              <p className="mt-1 text-xs text-text-secondary">
                {t('form.birthDateSaved', { date: formData.birthdate })}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text-secondary">{t('form.gender')}</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-background-tertiary text-text-primary"
              >
                <option value="M">{t('form.genderMale')}</option>
                <option value="F">{t('form.genderFemale')}</option>
                <option value="O">{t('form.genderOther')}</option>
              </select>
            </div>

            <Input
              label={t('form.bloodType')}
              type="text"
              name="bloodType"
              placeholder={t('form.bloodTypePlaceholder')}
              value={formData.bloodType}
              onChange={handleChange}
            />

            {/* Chronic diseases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">{t('form.chronicDiseases')}</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('chronicDiseases')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  {t('common.addRow')}
                </button>
              </div>
              <div className="space-y-3">
                {formData.chronicDiseases.map((disease, i) => (
                  <div key={`disease-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={t('form.diseaseLabel', { index: i + 1 })}
                        type="text"
                        name={`chronicDiseases-${i}`}
                        placeholder={t('form.diseasePlaceholder')}
                        value={disease}
                        onChange={(e) => handleArrayChange(e, 'chronicDiseases', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('chronicDiseases', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={t('form.removeDisease', { index: i + 1 })}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">{t('form.allergies')}</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('allergies')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  {t('common.addRow')}
                </button>
              </div>
              <div className="space-y-3">
                {formData.allergies.map((allergy, i) => (
                  <div key={`allergy-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={t('form.allergyLabel', { index: i + 1 })}
                        type="text"
                        name={`allergies-${i}`}
                        placeholder={t('form.allergyPlaceholder')}
                        value={allergy}
                        onChange={(e) => handleArrayChange(e, 'allergies', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('allergies', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={t('form.removeAllergy', { index: i + 1 })}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term medications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">{t('form.medications')}</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('permanentMedications')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  {t('common.addRow')}
                </button>
              </div>
              <div className="space-y-3">
                {formData.permanentMedications.map((med, i) => (
                  <div key={`med-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={t('form.medicationLabel', { index: i + 1 })}
                        type="text"
                        name={`permanentMedications-${i}`}
                        placeholder={t('form.medicationPlaceholder')}
                        value={med}
                        onChange={(e) => handleArrayChange(e, 'permanentMedications', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('permanentMedications', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={t('form.removeMedication', { index: i + 1 })}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trusted contacts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">{t('form.trustedContacts')}</label>
                <button
                  type="button"
                  onClick={addContact}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  {t('common.addRow')}
                </button>
              </div>
              <div className="space-y-3">
                {formData.trustedContacts.map((c, i) => (
                  <div key={`contact-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label={t('form.contactNameLabel', { index: i + 1 })}
                      type="text"
                      name={`trustedContacts-fullName-${i}`}
                      placeholder={t('form.contactNamePlaceholder')}
                      value={c.fullName}
                      onChange={(e) => handleContactChange(e, i, 'fullName')}
                      required
                    />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          label={t('form.phone')}
                          type="tel"
                          name={`trustedContacts-phone-${i}`}
                          placeholder={t('form.phonePlaceholder')}
                          value={c.phone}
                          onChange={(e) => handleContactChange(e, i, 'phone')}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContact(i)}
                        className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                        aria-label={t('form.removeContact', { index: i + 1 })}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer"
            >
              {t('form.save')}
            </button>
          </form>
        </div>
      </motion.div>
  );
}
