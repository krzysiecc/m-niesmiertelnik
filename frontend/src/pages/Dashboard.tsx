// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { QRCodePanel } from "../components/dashboard/QRCodePanel";
import { UserDataPanel } from "../components/dashboard/UserDataPanel";

// Define the full shape of the data we expect from the decryption endpoint
type TrustedContact = { fullName: string; phone: string; };
type UserProfileData = {
  userId: string;
  bloodType: string;
  birthdate: string;
  name: string;
  gender: 'M' | 'F' | 'O';
  chronicDiseases: string[];
  allergies: string[];
  permanentMedications: string[];
  trustedContacts: TrustedContact[];
  is_blocked: boolean;
};

export default function Dashboard() {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a real or placeholder domain for the QR code
  const qrValue = `https://mniesmiertelnik.com/mobile/scan?user=${userId}`;

  useEffect(() => {
    const fetchAndDecryptData = async () => {
      if (!userId) {
        setError("Brak ID użytkownika. Zaloguj się ponownie.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Step 1: Get encrypted token
        const userResponse = await fetch(`https://iteracja-hackathon-1110.onrender.com/users/${userId}`);
        if (!userResponse.ok) throw new Error("Nie udało się pobrać danych użytkownika.");
        const userData = await userResponse.json();
        if (!userData.token) throw new Error("Odpowiedź serwera nie zawiera tokenu.");

        // Step 2: Decrypt the token
        const decryptResponse = await fetch('https://iteracja-hackathon-1110.onrender.com/decryptToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted_token: userData.token }),
        });
        if (!decryptResponse.ok) throw new Error("Nie udało się odszyfrować danych.");
        const result = await decryptResponse.json();

        // Step 3: Save the nested 'data' object to state
        setProfileData(result.data);

      } catch (err: any) {
        setError(err.message || "Wystąpił nieoczekiwany błąd.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndDecryptData();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center p-8 text-text-primary font-semibold">Ładowanie danych...</div>;
  }
  if (error) {
    return <div className="text-center p-8 text-accent-primary font-semibold">{error}</div>;
  }
  if (!profileData) {
    return <div className="text-center p-8 text-text-secondary">Brak danych profilowych do wyświetlenia.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <QRCodePanel qrValue={qrValue} />
      <UserDataPanel profile={profileData} userId={userId} />
    </div>
  );
}