const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 40;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  if (email.length > 100) {
    return "Email must be less than 100 characters";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be less than ${PASSWORD_MAX_LENGTH} characters`;
  }

  return null;
};

export const validateName = (
  name: string,
  fieldName: string
): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }

  if (name.trim().length < NAME_MIN_LENGTH) {
    return `${fieldName} must be at least ${NAME_MIN_LENGTH} characters`;
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `${fieldName} must be less than ${NAME_MAX_LENGTH} characters`;
  }

  return null;
};

export const validateVerificationCode = (code: string): string | null => {
  if (!code.trim()) {
    return "Verification code is required";
  }

  if (code.length !== 6) {
    return "Verification code must be 6 digits";
  }

  if (!/^\d{6}$/.test(code)) {
    return "Verification code must contain only numbers";
  }

  return null;
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateRegisterForm = (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const firstNameError = validateName(firstName, "First name");
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(lastName, "Last name");
  if (lastNameError) errors.lastName = lastNameError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
