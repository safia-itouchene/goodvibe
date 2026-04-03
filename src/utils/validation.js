export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePhone = (phone) => {
  return /^(05|06|07)[0-9]{8}$/.test(phone.trim());
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateCheckoutForm = (data) => {
  const errors = {};
  if (!validateRequired(data.fullName)) errors.fullName = 'Le nom complet est requis';
  if (!validatePhone(data.phone)) errors.phone = 'Numéro de téléphone invalide (ex: 0612345678)';
  if (!validateRequired(data.wilaya)) errors.wilaya = 'La wilaya est requise';
  if (!validateRequired(data.address)) errors.address = "L'adresse est requise";
  return errors;
};

export const validateContactForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Le nom est requis';
  if (!validateEmail(data.email)) errors.email = 'Email invalide';
  if (!validateRequired(data.message)) errors.message = 'Le message est requis';
  return errors;
};
