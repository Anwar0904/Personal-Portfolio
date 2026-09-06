export interface JwtPayload {
  userId: string;
  sub: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;

  password: string;
}

export interface RegisterInput {
  name: string;

  email: string;

  password: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  token: string;
}