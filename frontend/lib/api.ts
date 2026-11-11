import type { AuthResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_KEY = "school_access_token";
const REFRESH_TOKEN_KEY = "school_refresh_token";

type RequestOptions = RequestInit & {
    skipAuth?: boolean;
    retry?: boolean;
};

function getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(
    accessToken: string,
    refreshToken?: string
) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

export function clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken || !API_URL) {
        clearTokens();
        return false;
    }
    try {
        const response = await fetch(
            `${API_URL}/api/auth/refresh-token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken,
                }),
            }
        );
        if (!response.ok) {
            clearTokens();
            return false;
        }
        const result: AuthResponse = await response.json();
        saveTokens(result.accessToken, result.refreshToken);
        return true;
    } catch {
        clearTokens();
        return false;
    }
}

function extractErrorString(val: unknown): string | null {
    if (val === null || val === undefined) return null;
    if (typeof val === "string") return val;
    return JSON.stringify(val);
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const {
        skipAuth = false,
        retry = true,
        ...fetchOptions
    } = options;

    const headers = new Headers(fetchOptions.headers);

    if (
        fetchOptions.body &&
        !(fetchOptions.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (!skipAuth) {
        const token = getAccessToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    let response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (response.status === 401 && !skipAuth && retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            const newToken = getAccessToken();
            if (newToken) {
                headers.set("Authorization", `Bearer ${newToken}`);
            }
            response = await fetch(`${API_URL}${endpoint}`, {
                ...fetchOptions,
                headers,
            });
        }
    }

    if (!response.ok) {
        let message = "Something went wrong.";
        try {
            const data = await response.json();
            message =
                extractErrorString(data.message) ||
                extractErrorString(data.title) ||
                extractErrorString(data.detail) ||
                extractErrorString(data.error) ||
                message;
        } catch {
            message = response.statusText || message;
        }
        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const api = {
    get<T>(endpoint: string, options?: RequestOptions) {
        return request<T>(endpoint, { ...options, method: "GET" });
    },
    post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
        return request<T>(endpoint, {
            ...options,
            method: "POST",
            body:
                body instanceof FormData
                    ? body
                    : body === undefined
                        ? undefined
                        : JSON.stringify(body),
        });
    },
    put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
        return request<T>(endpoint, {
            ...options,
            method: "PUT",
            body:
                body instanceof FormData
                    ? body
                    : body === undefined
                        ? undefined
                        : JSON.stringify(body),
        });
    },
    patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
        return request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body:
                body instanceof FormData
                    ? body
                    : body === undefined
                        ? undefined
                        : JSON.stringify(body),
        });
    },
    delete<T>(endpoint: string, options?: RequestOptions) {
        return request<T>(endpoint, { ...options, method: "DELETE" });
    },
};

export const authApi = {
    login(email: string, password: string) {
        return api.post<AuthResponse>(
            "/api/auth/login",
            { email, password },
            { skipAuth: true, retry: false }
        );
    },
    googleLogin(idToken: string) {
        return api.post<AuthResponse>(
            "/api/auth/google-login",
            { idToken },
            { skipAuth: true, retry: false }
        );
    },
    forgotPassword(email: string) {
        return api.post<void>(
            "/api/auth/forgot-password",
            { email },
            { skipAuth: true, retry: false }
        );
    },
    resetPassword(data: {
        token: string;
        email: string;
        newPassword: string;
        confirmPassword: string;
    }) {
        return api.post<void>(
            "/api/auth/reset-password",
            data,
            { skipAuth: true, retry: false }
        );
    },
    logout(refreshToken?: string) {
        return api.post<void>(
            "/api/auth/logout",
            { refreshToken },
            { retry: false }
        );
    },
};