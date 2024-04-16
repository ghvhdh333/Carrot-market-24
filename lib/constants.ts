// 유효성 검사 상수들
export const USERNAME_INVALID_TYPE_ERROR = "Invalid Username";
export const USERNAME_REQUIRED_ERROR = "Username is required";
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MIN_LENGTH_ERROR = `Must be at least ${USERNAME_MIN_LENGTH} characters`;
export const USERNAME_MAX_LENGTH = 8;
export const USERNAME_MAX_LENGTH_ERROR = `Must be ${USERNAME_MAX_LENGTH} characters or less.`;

export const EMAIL_INVALID_TYPE_ERROR = "Invalid Email";
export const EMAIL_REQUIRED_ERROR = "Email is required";

export const PASSWORD_INVALID_TYPE_ERROR = "Invalid Password";
export const PASSWORD_REQUIRED_ERROR = "Password is required";
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_ERROR = `Must be at least ${PASSWORD_MIN_LENGTH} characters`;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-";

export const CONFIRM_PASSWORD_INVALID_TYPE_ERROR = "Invalid Confirm_Password";
export const CONFIRM_PASSWORD_REQUIRED_ERROR = "Confirm_Password is required";
