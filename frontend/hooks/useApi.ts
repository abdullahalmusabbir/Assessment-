
"use client";

import { useState, useCallback } from "react";
import { api, ApiException } from "@/lib/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UseApiOptions {
    method?: HttpMethod;
}

export function useApi<T>(
    endpoint: string,
    options: UseApiOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(
        async (body?: unknown): Promise<T> => {
            setLoading(true);
            setError(null);

            try {
                let result: T;

                switch (options.method ?? "GET") {
                    case "POST":
                        result = await api.post<T>(endpoint, body);
                        break;

                    case "PUT":
                        result = await api.put<T>(endpoint, body);
                        break;

                    case "PATCH":
                        result = await api.patch<T>(endpoint, body);
                        break;

                    case "DELETE":
                        result = await api.delete<T>(endpoint);
                        break;

                    default:
                        result = await api.get<T>(endpoint);
                }

                setData(result);
                return result;
            } catch (err) {
                const message =
                    err instanceof ApiException || err instanceof Error
                        ? err.message
                        : "Something went wrong";

                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [endpoint, options.method]
    );

    return {
        data,
        loading,
        error,
        execute,
        setData,
    };
}
