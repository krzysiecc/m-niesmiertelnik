
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LogoutSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Logo" className="mx-auto h-16 mb-6" />
        <div className="bg-background-secondary p-8 rounded-xl border border-border-primary shadow-lg">
          <h1 className="text-3xl font-bold text-text-primary">
            Wylogowano pomyślnie
          </h1>
          <p className="text-text-secondary mt-4 mb-8">
            Twoja sesja została bezpiecznie zakończona. Zapraszamy ponownie!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-semibold rounded-lg transition"
            >
              Wróć na stronę główną
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-background-tertiary hover:bg-border-primary text-text-primary font-semibold rounded-lg transition"
            >
              Zaloguj się ponownie
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}