// Utility functions for validation
export const validateLowercase = (password: string) => /[a-z]/.test(password);
export const validateUppercase = (password: string) => /[A-Z]/.test(password);
export const validateAlphanumeric = (password: string) =>
  /[a-zA-Z0-9]/.test(password) && !/[^a-zA-Z0-9]/.test(password);
export const validateNumber = (password: string) => /\d/.test(password);
export const validateLength = (password: string) => password.length >= 8;

// Check if all validations are met
export const isPasswordValid = (password: string) =>
  validateLowercase(password) &&
  validateUppercase(password) &&
  validateAlphanumeric(password) &&
  validateNumber(password) &&
  validateLength(password);
