"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { api } from "@/lib/api";

import type {
    AcademicYear,
    SchoolClass,
    AdmissionCircular,
    DashboardStats,
} from "@/types";

interface DataContextType {
    academicYears: AcademicYear[];
    classes: SchoolClass[];
    circulars: AdmissionCircular[];
    dashboardStats: DashboardStats | null;

    isLoading: boolean;
    error: string | null;

    fetchAcademicYears: () => Promise<void>;
    fetchClasses: () => Promise<void>;
    fetchCirculars: () => Promise<void>;
    fetchDashboardStats: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

export const DataContext = createContext<
    DataContextType | undefined
>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [circulars, setCirculars] = useState<AdmissionCircular[]>([]);
    const [dashboardStats, setDashboardStats] =
        useState<DashboardStats | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* =========================================
       FETCH ACADEMIC YEARS
    ========================================= */

    const fetchAcademicYears = useCallback(async () => {
        try {
            const data = await api.get<AcademicYear[]>(
                "/api/academic-years",
                { skipAuth: true }
            );
            setAcademicYears(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load academic years."
            );
        }
    }, []);

    /* =========================================
       FETCH CLASSES
    ========================================= */

    const fetchClasses = useCallback(async () => {
        try {
            const data = await api.get<SchoolClass[]>(
                "/api/classes",
                { skipAuth: true }
            );
            setClasses(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load classes."
            );
        }
    }, []);

    /* =========================================
       FETCH ADMISSION CIRCULARS
    ========================================= */

    const fetchCirculars = useCallback(async () => {
        try {
            const data = await api.get<AdmissionCircular[]>(
                "/api/admission-circulars",
                { skipAuth: true }
            );
            setCirculars(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load admission circulars."
            );
        }
    }, []);

    /* =========================================
       FETCH DASHBOARD
    ========================================= */

    const fetchDashboardStats = useCallback(async () => {
        try {
            const data = await api.get<DashboardStats>(
                "/api/dashboard/stats"
            );
            setDashboardStats(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load dashboard stats."
            );
        }
    }, []);

    /* =========================================
       REFRESH ALL PUBLIC DATA
    ========================================= */

    const refreshAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchAcademicYears(),
                fetchClasses(),
                fetchCirculars(),
            ]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load application data"
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        fetchAcademicYears,
        fetchClasses,
        fetchCirculars,
    ]);

    /* =========================================
       INITIAL DATA LOAD
    ========================================= */

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return (
        <DataContext.Provider
            value={{
                academicYears,
                classes,
                circulars,
                dashboardStats,
                isLoading,
                error,
                fetchAcademicYears,
                fetchClasses,
                fetchCirculars,
                fetchDashboardStats,
                refreshAll,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}