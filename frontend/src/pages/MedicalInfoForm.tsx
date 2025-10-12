// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/forms/Input';

type FormData = {
  bloodType: string;
  birthdate: string; // w stanie zawsze DD.MM.RRRR
  name: string;
  gender: 'M' | 'F' | 'O';
  chronicDiseases: string[];
  allergies: string[];
  permanentMedications: string[];
};

// helpery konwersji: DD.MM.RRRR <-> YYYY-MM-DD
const toIsoFromPl = (pl: string): string => {
  // oczekuje "DD.MM.RRRR"
  const m = pl.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return '';
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
};

const toPlFromIso = (iso: string): string => {
  // oczekuje "YYYY-MM-DD"
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const [, yyyy, mm, dd] = m;
  return `${dd}.${mm}.${yyyy}`;
};

// dzisiejsza data jako ISO do atrybutu max
const todayIso = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    bloodType: '',
    birthdate: '22.01.2004',   // stan w PL formacie
    name: '',
    gender: 'M',
    chronicDiseases: ['', '', ''],
    allergies: ['', '', ''],
    permanentMedications: ['', '', ''],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Pick<FormData, 'chronicDiseases' | 'allergies' | 'permanentMedications'>,
    index: number
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = e.target.value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (
    field: keyof Pick<FormData, 'chronicDiseases' | 'allergies' | 'permanentMedications'>
  ) => setFormData((p) => ({ ...p, [field]: [...p[field], ''] }));

  const removeArrayItem = (
    field: keyof Pick<FormData, 'chronicDiseases' | 'allergies' | 'permanentMedications'>,
    index: number
  ) =>
    setFormData((p) => {
      const arr = p[field].length > 1 ? p[field].filter((_, i) => i !== index) : p[field];
      return { ...p, [field]: arr };
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // birthdate pozostaje w formacie DD.MM.RRRR
    console.log('Simulating submission. Data:', JSON.stringify(formData, null, 2));
    navigate('/dashboard');
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
          <h1 className="text-3xl font-bold text-text-primary">Dane użytkownika</h1>
          <p className="text-text-secondary mt-2">Uzupełnij swoje dane medyczne</p>
        </div>

        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Imię i nazwisko"
              type="text"
              name="name"
              placeholder="Jan Kowalski"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Date picker z zachowaniem stylu i konwersją formatu */}
            <div>
              <label className="block mb-2 text-sm font-medium text-text-secondary">
                Data urodzenia
              </label>
              <input
                type="date"
                // pokazujemy wartość w ISO, stan trzymamy w PL
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
                Zapis: {formData.birthdate} (DD.MM.RRRR)
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text-secondary">Płeć</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-border-primary rounded-lg bg-background-tertiary text-text-primary"
              >
                <option value="M">Mężczyzna</option>
                <option value="F">Kobieta</option>
                <option value="O">Inna / Nie chcę podawać</option>
              </select>
            </div>

            <Input
              label="Grupa krwi"
              type="text"
              name="bloodType"
              placeholder="np. 0 Rh+"
              value={formData.bloodType}
              onChange={handleChange}
            />

            {/* Choroby przewlekłe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">Choroby przewlekłe</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('chronicDiseases')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  Dodaj wiersz
                </button>
              </div>
              <div className="space-y-3">
                {formData.chronicDiseases.map((disease, i) => (
                  <div key={`disease-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={`Choroba ${i + 1}`}
                        type="text"
                        name={`chronicDiseases-${i}`}
                        placeholder="np. Cukrzyca typu 1"
                        value={disease}
                        onChange={(e) => handleArrayChange(e, 'chronicDiseases', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('chronicDiseases', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={`Usuń chorobę ${i + 1}`}
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Alergie */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">Alergie</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('allergies')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  Dodaj wiersz
                </button>
              </div>
              <div className="space-y-3">
                {formData.allergies.map((allergy, i) => (
                  <div key={`allergy-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={`Alergia ${i + 1}`}
                        type="text"
                        name={`allergies-${i}`}
                        placeholder="np. Pyłki traw"
                        value={allergy}
                        onChange={(e) => handleArrayChange(e, 'allergies', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('allergies', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={`Usuń alergię ${i + 1}`}
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Leki stałe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-secondary">Leki przyjmowane na stałe</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('permanentMedications')}
                  className="px-3 py-1 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                >
                  Dodaj wiersz
                </button>
              </div>
              <div className="space-y-3">
                {formData.permanentMedications.map((med, i) => (
                  <div key={`med-${i}`} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label={`Lek ${i + 1}`}
                        type="text"
                        name={`permanentMedications-${i}`}
                        placeholder="np. Metformina"
                        value={med}
                        onChange={(e) => handleArrayChange(e, 'permanentMedications', i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('permanentMedications', i)}
                      className="self-end h-11 px-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary rounded-lg transition"
                      aria-label={`Usuń lek ${i + 1}`}
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Zapisz dane
            </button>
          </form>
        </div>
      </motion.div>
  );
}
