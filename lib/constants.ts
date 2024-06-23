// /(auth)/create-account/actions.ts
export const USERNAME_INVALID_TYPE_ERROR = "사용자 이름이 유효하지 않습니다.";
export const USERNAME_REQUIRED_ERROR = "사용자 이름을 입력해주세요.";
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MIN_LENGTH_ERROR = `${USERNAME_MIN_LENGTH}자 이상이어야 합니다.`;
export const USERNAME_MAX_LENGTH = 8;
export const USERNAME_MAX_LENGTH_ERROR = `${USERNAME_MAX_LENGTH}자 이하여야 합니다.`;
export const USERNAME_ALREADY_EXISTS_ERROR =
  "해당 사용자 이름으로 가입된 계정이 있습니다.";

export const EMAIL_INVALID_TYPE_ERROR = "이메일이 유효하지 않습니다.";
export const EMAIL_REQUIRED_ERROR = "이메일을 입력해주세요.";
export const EMAIL_NOT_EXIST_ERROR = "해당 이메일 계정이 존재하지 않습니다.";
export const EMAIL_ALREADY_EXISTS_ERROR =
  "해당 이메일로 가입된 계정이 있습니다.";

export const PASSWORD_INVALID_TYPE_ERROR = "비밀번호가 유효하지 않습니다.";
export const PASSWORD_REQUIRED_ERROR = "비밀번호를 입력해주세요.";
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_ERROR = `${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 영어, 숫자 그리고 특수 문자를 하나 이상을 포함해야 합니다 #?@$%^&*-";

export const CONFIRM_PASSWORD_INVALID_TYPE_ERROR =
  "비밀번호 확인이 유효하지 않습니다.";
export const CONFIRM_PASSWORD_REQUIRED_ERROR = "비밀번호 확인을 입력해주세요.";

export const TWO_PASSWORDS_NOT_EQUAL_ERROR =
  "비밀번호와 비밀번호 확인이 일치하지 않습니다.";

// /products/add/page.tsx
export const IMAGE_MAX_SIZE = 1024 * 1024 * 3; // (= 3MB)

// /products/add/actions.ts
export const PHOTO_INVALID_TYPE_ERROR = "사진이 유효하지 않습니다.";
export const PHOTO_REQUIRED_ERROR = "사진을 선택해주세요.";

export const TITLE_INVALID_TYPE_ERROR = "유효하지 않은 제목입니다.";
export const TITLE_REQUIRED_ERROR = "제목을 입력해주세요.";
export const TITLE_MIN_LENGTH = 3;
export const TITLE_MIN_LENGTH_ERROR = `${TITLE_MIN_LENGTH}자 이상이어야 합니다.`;
export const TITLE_MAX_LENGTH = 20;
export const TITLE_MAX_LENGTH_ERROR = `${TITLE_MAX_LENGTH}자 이하여야 합니다.`;

export const DESCRIPTION_INVALID_TYPE_ERROR = "설명이 유효하지 않습니다.";
export const DESCRIPTION_REQUIRED_ERROR = "설명을 입력해주세요.";
export const DESCRIPTION_MIN_LENGTH = 5;
export const DESCRIPTION_MIN_LENGTH_ERROR = `${DESCRIPTION_MIN_LENGTH}자 이상이어야 합니다.`;
export const DESCRIPTION_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH_ERROR = `${DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`;

export const PRICE_INVALID_TYPE_ERROR = "가격이 유효하지 않습니다.";
export const PRICE_REQUIRED_ERROR = "가격을 입력해주세요.";
export const PRICE_MIN = 10;
export const PRICE_MIN_ERROR = `${PRICE_MIN}원 이상이어야 합니다.`;
export const PRICE_MAX = 999999999; // < 10억
export const PRICE_MAX_ERROR = `${PRICE_MAX}원 이하여야 합니다.`;
