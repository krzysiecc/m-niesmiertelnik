// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/forms/Input';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('register.passwordMismatch'));
      return;
    }
    if (formData.password.length < 8) {
      toast.error(t('register.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    // The name and date of birth are collected later in the medical form, so
    // only the credentials are sent here. Optional fields are simply omitted.
    const apiData = {
      login: formData.login,
      password: formData.password,
      first_name: "",
      last_name: "",
    };

    try {
      const response = await fetch(apiUrl('/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || t('register.serverError', { status: response.status }));
      }

      const result = await response.json();

      if (result.user_id) {
        // Log the user in with the ID + JWT from the registration response.
        login(result.user_id, result.access_token);

        toast.success(t('register.success'));
        navigate('/form');
      } else {
        // Safety net in case the API does not return the ID.
        throw new Error(t('register.noUserId'));
      }

    } catch (err) {
      console.error('Error:', err);
      toast.error(err instanceof Error ? err.message : t('register.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEpuapLogin = () => {
    toast.info(t('register.epuapNotImplemented'));
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
          <h1 className="text-3xl font-bold text-text-primary">{t('register.title')}</h1>
          <p className="text-text-secondary mt-2">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-highlight hover:underline">
              {t('register.loginLink')}
            </Link>
          </p>
        </div>

        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label={t('register.email')} type="email" name="login" placeholder="you@email.com" value={formData.login} onChange={handleChange} required />
            <Input label={t('register.password')} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <Input label={t('register.confirmPassword')} type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-primary" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-background-secondary px-2 text-text-secondary">{t('common.continueWith')}</span></div>
          </div>

          <button type="button" onClick={handleEpuapLogin} className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-background-tertiary hover:bg-border-primary border border-border-primary text-text-primary font-bold rounded-lg transition">
            <img src="/epuap-logo.png" alt="ePUAP Logo" className="h-6" />
            <span>{t('common.trustedProfile')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
