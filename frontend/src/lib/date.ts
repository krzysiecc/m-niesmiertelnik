// Date helpers shared across the app.

/** Parse a DD.MM.YYYY date string and return the age in years, or null. */
export const calculateAge = (birthDateString: string): number | null => {
  const parts = birthDateString.split(".");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  const birthDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
