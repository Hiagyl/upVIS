export const validateUpMail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@up\.edu\.ph$/.test(email.trim());
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateContactNumber = (phone: string): boolean => {
  return /^09\d{9}$/.test(phone.replace(/\D/g, ""));
};

export const validateMinLength = (text: string, min: number): boolean => {
  return text.trim().length >= min;
};
