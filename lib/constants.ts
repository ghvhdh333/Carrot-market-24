// 유효성 검사 상수들
// /(auth)/create-account/actions.ts
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
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "Passwords must contain at least one English, Number and special characters #?!@$%^&*-";

export const CONFIRM_PASSWORD_INVALID_TYPE_ERROR = "Invalid Confirm_Password";
export const CONFIRM_PASSWORD_REQUIRED_ERROR = "Confirm_Password is required";

// /products/add/page.tsx
export const IMAGE_MAX_SIZE = 1024 * 1024 * 3; // (= 3MB)

// /products/add/actions.ts
export const PHOTO_INVALID_TYPE_ERROR = "Invalid Photo";
export const PHOTO_REQUIRED_ERROR = "Photo is required";

export const TITLE_INVALID_TYPE_ERROR = "Invalid Title";
export const TITLE_REQUIRED_ERROR = "Title is required";
export const TITLE_MIN_LENGTH = 3;
export const TITLE_MIN_LENGTH_ERROR = `Must be at least ${TITLE_MIN_LENGTH} characters`;
export const TITLE_MAX_LENGTH = 20;
export const TITLE_MAX_LENGTH_ERROR = `Must be ${TITLE_MAX_LENGTH} characters or less.`;

export const DESCRIPTION_INVALID_TYPE_ERROR = "Invalid Description";
export const DESCRIPTION_REQUIRED_ERROR = "Description is required";
export const DESCRIPTION_MIN_LENGTH = 5;
export const DESCRIPTION_MIN_LENGTH_ERROR = `Must be at least ${DESCRIPTION_MIN_LENGTH} characters`;
export const DESCRIPTION_MAX_LENGTH = 50;
export const DESCRIPTION_MAX_LENGTH_ERROR = `Must be ${DESCRIPTION_MAX_LENGTH} characters or less.`;

export const PRICE_INVALID_TYPE_ERROR = "Invalid Price";
export const PRICE_REQUIRED_ERROR = "Price is required";
export const PRICE_MIN = 10;
export const PRICE_MIN_ERROR = `Must be more than ${PRICE_MIN}.`;
export const PRICE_MAX = 9999999999;
export const PRICE_MAX_ERROR = `Must be less than ${PRICE_MAX}.`;
