// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/forms/input';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Hasła nie są zgodne!");
      return;
    }

    // We don't send confirmPassword to the API
    const { confirmPassword, ...apiData } = formData;
    console.log("Submitting to /api/register with JSON:", JSON.stringify(apiData, null, 2));
    
    // --- UNCOMMENT TO SEND TO API ---
    // try {
    //   const response = await fetch('/api/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(apiData),
    //   });
    //   const result = await response.json();
    //   // Handle success (e.g., redirect to login)
    //   console.log('Success:', result);
    // } catch (error) {
    //   // Handle error (e.g., show error message)
    //   console.error('Error:', error);
    // }
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Adres e-mail" type="email" name="email" placeholder="twoj@email.com" value={formData.email} onChange={handleChange} required />
            <Input label="Hasło" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <Input label="Potwierdź hasło" type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            
            <button type="submit" className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-text-inverted font-bold rounded-lg transition-transform hover:scale-105">
              Zarejestruj się
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