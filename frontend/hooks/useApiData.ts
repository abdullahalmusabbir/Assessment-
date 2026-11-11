"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ApiListResponse<T> {
    items?: T[];
    data?: T[];
    results?: T[];
}

function normalizeList<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
        return response as T[];
    }

    if (response && typeof response === "object") {
        const result = response as ApiListResponse<T>;

        if (Array.isArray(result.items)) return result.items;
        if (Array.isArray(result.data)) return result.data;
        if (Array.isArray(result.results)) return result.results;

        // Supports a single object response, such as report summary.
        return [response as T];
    }

    return [];
}

export function useApiData<T>(endpoint: string, skipAuth = false) {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.get<unknown>(endpoint, { skipAuth });
            setData(normalizeList<T>(response));
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load data. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, skipAuth]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        data,
        setData,
        isLoading,
        error,
        refetch: fetchData,
    };
}