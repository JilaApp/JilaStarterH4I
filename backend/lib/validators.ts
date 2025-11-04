const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[A-Za-z0-9]+([._-]?[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

export const validateEmail = (value: string): string | null => {
  if (!value) {
    return "Email is required";
  }
  if (!isValidEmail(value)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) {
    return "Password is required";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
};

export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return "This field is required";
  }
  return null;
};
