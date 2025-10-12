// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/forms/input';

export default function Register() {
  const navigate = useNavigate();
  // === 1. State Simplified: We only store what the user types. ===
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są zgodne!");
      return;
    }
    if (formData.password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    setIsLoading(true);

    // === 2. API Payload Construction: Add empty/placeholder fields here. ===
    const apiData = {
      login: formData.login,
      password: formData.password,
      first_name: "", // Sent as an empty string as requested
      last_name: "",  // Sent as an empty string as requested
      // The API expects a valid date format. Sending an empty string might cause an error.
      // A placeholder date like '1900-01-01' is a safer default.
      date_of_birth: "1900-01-01", 
    };
    
    console.log("Submitting to /register with JSON:", JSON.stringify(apiData, null, 2));

    try {
      const response = await fetch('https://iteracja-hackathon-1110.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Błąd serwera: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success:', result);
      
      alert('Rejestracja zakończona sukcesem! Zaloguj się, aby uzupełnić swoje dane medyczne.');
      navigate('/login');

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEpuapLogin = () => {
    alert("Rejestracja przez ePUAP nie jest jeszcze zaimplementowana.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="mx-auto h-16 mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Stwórz nowe konto</h1>
          <p className="text-text-secondary mt-2">
            Masz już konto?{' '}
            <Link to="/login" className="font-semibold text-highlight hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>

        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          {/* === 3. Form Simplified: Removed extra fields from the UI. === */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Adres e-mail (login)" type="email" name="login" placeholder="twoj@email.com" value={formData.login} onChange={handleChange} required />
            <Input label="Hasło (min. 8 znaków)" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <Input label="Potwierdź hasło" type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            
            {error && (
              <div className="text-center p-3 bg-accent-primary/20 rounded-lg">
                <p className="text-sm text-accent-primary font-semibold">{error}</p>
                <Link to="/" className="text-xs text-text-secondary hover:underline mt-2 inline-block">
                  Wróć na stronę główną
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
            </button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-primary" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-background-secondary px-2 text-text-secondary">Lub kontynuuj z</span></div>
          </div>

          <button type="button" onClick={handleEpuapLogin} className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary font-bold rounded-lg transition">
            <img src="/epuap-logo.jpg" alt="ePUAP Logo" className="h-6" />
            <span>Profil Zaufany</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}