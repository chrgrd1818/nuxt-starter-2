export interface AppUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AppUser;
}

export interface ApiErrorPayload {
  error: string;
}

export type SupportedLocale = "en" | "fr";
