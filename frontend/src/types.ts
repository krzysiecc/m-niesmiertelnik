// Shared domain types used across the app.

export type Gender = "M" | "F" | "O";

export type TrustedContact = {
  fullName: string;
  phone: string;
};

/** The medical profile a user fills in and that responders see when scanning. */
export type UserProfileData = {
  userId: string;
  bloodType: string;
  birthdate: string; // DD.MM.YYYY
  name: string;
  gender: Gender;
  chronicDiseases: string[];
  allergies: string[];
  permanentMedications: string[];
  trustedContacts: TrustedContact[];
  is_blocked: boolean;
};

/** Shape returned by the backend /decryptToken endpoint. */
export type DecryptResponse = {
  data: UserProfileData;
  status: string;
};
