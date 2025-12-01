import { MIN_PASSWORD_LENGTH, ADDRESS_PARTS_COUNT } from "@/lib/constants";

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
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

export const validateRequired = (value: unknown): string | null => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return "This field is required";
  }
  return null;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validatePhone = (value: string): string | null => {
  if (!value) {
    return "Phone number is required";
  }
  if (!isValidPhone(value)) {
    return "Please enter a valid phone number";
  }
  return null;
};

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateURL = (value: string): string | null => {
  if (!value) {
    return "URL is required";
  }
  if (!isValidURL(value)) {
    return "Please enter a valid URL (e.g., https://example.com)";
  }
  return null;
};

export const validateFileSize = (maxSizeMB: number) => {
  return (file: File | undefined): string | null => {
    if (!file) {
      return "File is required";
    }
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  };
};

export const validateNumber = (value: string): string | null => {
  if (!value || !value.trim()) {
    return "This field is required";
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    return "Please enter a valid number";
  }
  if (num < 0) {
    return "Number must be positive";
  }
  return null;
};

export const validateDropdownIndex = (
  value: number | undefined,
): string | null => {
  if (value === undefined || value === null) {
    return "Please select an option";
  }
  return null;
};
