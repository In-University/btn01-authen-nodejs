// Temporary type definitions for Redux state
export interface AuthState {
  user: {
    id: string;
    email: string;
    fullName: string;
    gender: string;
    dob?: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface RootStateType {
  auth: AuthState;
}
