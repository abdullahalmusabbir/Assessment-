
"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type {
    AuthContextType,
    AuthResponse,
    AuthUser,
    ResetPasswordRequest,
} from "@/types/auth";

import {
    api,
    authApi,
    clearTokens,
    saveTokens,
} from "@/lib/api";

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = Boolean(user);

    const storeAuth = useCallback(
        (data: AuthResponse) => {
            saveTokens(
                data.accessToken,
                data.refreshToken
            );

            setUser(data.user);
        },
        []
    );

    const refreshSession = useCallback(async () => {
        try {
            const response = await api.post<AuthResponse>(
                "/api/auth/refresh-token",
                {
                    refreshToken:
                        typeof window !== "undefined"
                            ? localStorage.getItem("school_refresh_token")
                            : null,
                },
                {
                    skipAuth: true,
                    retry: false,
                }
            );

            storeAuth(response);
            return true;
        } catch {
            clearTokens();
            setUser(null);
            return false;
        }
    }, [storeAuth]);

    const loadCurrentUser = useCallback(async () => {
        try {
            const response = await api.get<AuthUser>(
                "/api/auth/me",
                { retry: false }
            );

            setUser(response);
            return true;
        } catch {
            return false;
        }
    }, []);

    useEffect(() => {
        let active = true;

        async function initializeAuth() {
            try {
                const accessToken =
                    localStorage.getItem("school_access_token");

                const refreshToken =
                    localStorage.getItem("school_refresh_token");

                if (!accessToken && !refreshToken) {
                    if (active) setUser(null);
                    return;
                }

                const loaded = await loadCurrentUser();

                if (!loaded && refreshToken) {
                    const refreshed = await refreshSession();

                    if (refreshed) {
                        await loadCurrentUser();
                    }
                } else if (!loaded) {
                    clearTokens();
                    setUser(null);
                }
            } finally {
                if (active) setIsLoading(false);
            }
        }

        initializeAuth();

        return () => {
            active = false;
        };
    }, [loadCurrentUser, refreshSession]);

    const login = async (
        email: string,
        password: string
    ) => {
        const response = await authApi.login(
            email,
            password
        );

        storeAuth(response);

        return response.user;
    };

    const loginWithGoogle = async (
        idToken: string
    ) => {
        const response = await authApi.googleLogin(idToken);

        storeAuth(response);

        return response.user;
    };

    const logout = async () => {
        const refreshToken =
            typeof window !== "undefined"
                ? localStorage.getItem("school_refresh_token")
                : undefined;

        try {
            await authApi.logout(refreshToken ?? undefined);
        } finally {
            clearTokens();
            setUser(null);
        }
    };

    const forgotPassword = async (email: string) => {
        await authApi.forgotPassword(email);
    };

    const resetPassword = async (
        data: ResetPasswordRequest
    ) => {
        await authApi.resetPassword(data);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        forgotPassword,
        resetPassword,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
