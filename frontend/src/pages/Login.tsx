// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/forms/input';
import { useAuth } from '../context/AuthContext'; // Corrected path to plural contexts

export default function Login() {
  const navigate = useNavigate(); 
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  // State for user feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A checkbox state to allow you to easily test the "first login" flow
  const [simulateFirstLogin, setSimulateFirstLogin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://iteracja-hackathon-1110.onrender.com/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Błąd logowania. Sprawdź login i hasło.');
      }

      // --- ONBOARDING LOGIC ---
      // The API should return a flag like `is_profile_complete`. We simulate it for testing.
      // The `?? true` part means if the API doesn't send the flag, we assume the profile is complete.
      const isProfileComplete = simulateFirstLogin ? false : (result.is_profile_complete ?? true);

      if (result.user_id) {
        login(result.user_id); // Store the user ID in our context
        
        console.log('Login Success:', { ...result, is_profile_complete: isProfileComplete });

        // Conditional redirect based on profile status
        if (isProfileComplete) {
          navigate('/dashboard'); // Go to dashboard for existing users
        } else {
          navigate('/form'); // Go to medical form for new users
        }
      } else {
        throw new Error("Odpowiedź serwera nie zawiera ID użytkownika.");
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEpuapLogin = () => {
    alert("Logowanie przez ePUAP nie jest jeszcze zaimplementowane.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <Link to="/"><img src="/logo.png" alt="Logo" className="mx-auto h-16 mb-4" /></Link>
          <h1 className="text-3xl font-bold text-text-primary">Zaloguj się</h1>
          <p className="text-text-secondary mt-2">
            Nie masz konta?{' '}
            <Link to="/register" className="font-semibold text-highlight hover:underline">Zarejestruj się</Link>
          </p>
        </div>
        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Adres e-mail" type="email" name="login" placeholder="twoj@email.com" value={formData.login} onChange={handleChange} required />
            <Input label="Hasło" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="first-login-sim" className="h-4 w-4 rounded border-gray-300 text-highlight focus:ring-highlight" checked={simulateFirstLogin} onChange={(e) => setSimulateFirstLogin(e.target.checked)} />
              <label htmlFor="first-login-sim" className="text-sm text-text-secondary">Symuluj pierwszy login</label>
            </div>

            {error && <p className="text-sm text-accent-primary text-center font-semibold">{error}</p>}
            
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-primary" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-background-secondary px-2 text-text-secondary">Lub kontynuuj z</span></div>
          </div>
          <button type="button" onClick={handleEpuapLogin} className="cursor-help w-full flex justify-center items-center gap-3 px-4 py-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary font-bold rounded-lg transition">
            <img src="/epuap-logo.jpg" alt="ePUAP Logo" className="h-6" />
            <span>Profil Zaufany</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}