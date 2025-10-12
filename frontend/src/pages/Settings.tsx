
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Settings() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userId) {
      alert("Błąd: Brak ID użytkownika.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://iteracja-hackathon-1110.onrender.com/users/${userId}/delete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć konta. Spróbuj ponownie.");
      }

      alert("Twoje konto zostało pomyślnie usunięte.");
      logout(); // Clear the user state
      navigate('/'); // Redirect to home page

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-background-secondary p-8 rounded-xl border border-border-primary">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Ustawienia Konta</h1>
        
        <div className="p-6 rounded-lg border-2 border-accent-primary bg-accent-primary/10">
          <h2 className="text-xl font-bold text-accent-primary mb-2">Strefa Niebezpieczna</h2>
          <p className="text-text-secondary mb-4">
            Usunięcie konta jest operacją nieodwracalną. Wszystkie Twoje dane, w tym informacje medyczne i wygenerowane kody QR, zostaną trwale usunięte.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg shadow-[0_5px_20px_var(--shadow-color)] transition-transform hover:scale-105"
          >
            Usuń Moje Konto
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/80 backdrop-blur-sm">
          <div className="bg-background-secondary p-8 rounded-xl border border-border-primary max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
                <FaExclamationTriangle className="text-accent-primary text-4xl flex-shrink-0" />
                <h2 className="text-2xl font-bold text-text-primary">Czy na pewno?</h2>
            </div>
            <p className="text-text-secondary mb-6">
              Ta akcja jest nieodwracalna. Czy na pewno chcesz trwale usunąć swoje konto?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-background-tertiary hover:bg-border-primary text-text-primary font-semibold rounded-lg cursor-pointer"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-6 py-2 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Usuwanie...' : 'Tak, usuń konto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}