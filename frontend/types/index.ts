
/* =========================================
   USER & AUTHENTICATION TYPES
========================================= */

export enum UserRole {
    Student = 1,
    AdmissionOffice = 2,
    Admin = 3,
}

export enum UserStatus {
    Pending = 1,
    Active = 2,
    Inactive = 3,
    Suspended = 4,
    Deleted = 5,
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: UserRole;
    status: UserStatus;
    profileImageUrl?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    lastLoginAt?: string;
    createdAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt?: string;
    user: User;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}

/* =========================================
   API TYPES
========================================= */

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

/* =========================================
   ACADEMIC YEAR
========================================= */

export interface AcademicYear {
    id: string;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    isAdmissionOpen: boolean;
    description?: string;
}

/* =========================================
   SCHOOL CLASS
========================================= */

export interface SchoolClass {
    id: string;
    name: string;
    description?: string;
    classNumber: number;
    isActive: boolean;
    displayOrder: number;
    shifts?: ClassShift[];
}

export interface ClassShift {
    id: string;
    schoolClassId: string;
    shiftName: string;
    totalSeats: number;
    minimumAge?: number;
    maximumAge?: number;
    admissionFee: number;
    isActive: boolean;
    description?: string;
}

/* =========================================
   ADMISSION CIRCULAR
========================================= */

export interface AdmissionCircular {
    id: string;
    title: string;
    description: string;
    academicYearId: string;
    academicYear?: AcademicYear;
    applicationStartDate: string;
    applicationEndDate: string;
    paymentDeadline: string;
    isPublished: boolean;
    isActive: boolean;
    attachmentUrl?: string;
    createdAt?: string;
}

/* =========================================
   STUDENT APPLICATION
========================================= */

export enum AdmissionHoldStatus {
    Held = "HELD",
    Confirmed = "CONFIRMED",
    Expired = "EXPIRED",
    Cancelled = "CANCELLED",
}

export enum PaymentStatus {
    Pending = 1,
    Processing = 2,
    Successful = 3,
    Failed = 4,
    Refunded = 5,
}

export interface StudentApplication {
    id: string;
    registrationNumber: string;
    userId: string;
    classShiftId: string;
    admissionCircularId: string;
    isPaymentCompleted: boolean;
    isLotteryEligible: boolean;
    isSelectedInLottery: boolean;
    lotteryDate?: string;
    admissionConfirmedAt?: string;
    createdAt?: string;
}

export interface AdmissionHold {
    id: string;
    studentIdId: string;
    classShiftId: string;
    admissionCircularId: string;
    status: AdmissionHoldStatus;
    heldAt: string;
    expiresAt: string;
    confirmedAt?: string;
    cancelledAt?: string;
}

/* =========================================
   PAYMENT
========================================= */

export interface Payment {
    id: string;
    studentIdId: string;
    admissionHoldId: string;
    transactionId?: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paidAt?: string;
    failureReason?: string;
    paymentUrl?: string;
}

/* =========================================
   LOTTERY
========================================= */

export interface LotteryResult {
    id: string;
    lotteryDrawId: string;
    studentIdId: string;
    registrationNumber?: string;
    isSelected: boolean;
    position?: number;
    publishedAt?: string;
}

/* =========================================
   DASHBOARD
========================================= */

export interface DashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalAdmissionOffices: number;
    totalAdmins: number;
    totalClasses: number;
    totalShifts: number;
    totalCirculars: number;
    totalApplications: number;
    activeHolds: number;
    confirmedApplications: number;
    eligibleStudents: number;
    successfulPayments: number;
}

/* =========================================
   ADMIN & STAFF
========================================= */

export interface CreateStaffRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    employeeId: string;
    department?: string;
    designation?: string;
}

export interface UpdateUserStatusRequest {
    status: UserStatus;
}

/* =========================================
   COMMON
========================================= */

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    search?: string;
}
