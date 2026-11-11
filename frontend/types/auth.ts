
export type UserRole = 1 | 2 | 3;

export type UserStatus =
    | "Pending"
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Deleted";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    role: UserRole;
    status: UserStatus;
    profileImageUrl?: string | null;
    emailVerified?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    user: AuthUser;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<AuthUser>;

    loginWithGoogle: (
        idToken: string
    ) => Promise<AuthUser>;

    logout: () => Promise<void>;

    forgotPassword: (
        email: string
    ) => Promise<void>;

    resetPassword: (
        data: ResetPasswordRequest
    ) => Promise<void>;

    refreshSession: () => Promise<boolean>;
}
